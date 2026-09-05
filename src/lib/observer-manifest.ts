import { concerns } from '../data/concerns';
import { FIELD } from '../data/field-composition';
import { INDEX_CONTENT } from '../data/index-content';
import { READOUT_SUBJECT } from '../data/field-selection';
import {
    observerResources,
    type ObserverResourceId,
} from '../data/observer-resources';
import { provenance } from '../data/provenance';
import { isValidIsoDate } from '../data/provenance-integrity';
import {
    assertObserverTemporalHash,
} from '../data/observer-temporal';
import { relations } from '../data/relations';
import { systems } from '../data/systems';
import type {
    ConcernId,
    ProvenanceRecord,
    SystemId,
    SystemRecord,
} from '../data/types';

type CanonicalValue = string | null | readonly CanonicalValue[];
type RegistryResource = (typeof observerResources)[number];

export interface ObserverManifestResource {
    readonly id: ObserverResourceId;
    readonly contentHash: string;
    readonly lastContentChange: string;
    readonly provenanceVerifiedThrough: string | null;
}

export interface ObserverManifest {
    readonly schemaVersion: 2;
    readonly resources: readonly ObserverManifestResource[];
}

const RESOURCE_ID_PATTERN = /^(site|system):[a-z0-9]+(-[a-z0-9]+)*$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const textEncoder = new TextEncoder();

function fail(message: string): never {
    throw new Error(`[observer-manifest] ${message}`);
}

function isWellFormedString(value: string): boolean {
    for (let index = 0; index < value.length; index += 1) {
        const code = value.charCodeAt(index);

        if (code >= 0xd800 && code <= 0xdbff) {
            if (index + 1 >= value.length) return false;

            const next = value.charCodeAt(index + 1);
            if (next < 0xdc00 || next > 0xdfff) return false;
            index += 1;
        } else if (code >= 0xdc00 && code <= 0xdfff) {
            return false;
        }
    }

    return true;
}

function assertCanonicalString(value: string, context: string): void {
    if (!isWellFormedString(value)) {
        fail(`${context} contains an ill-formed Unicode string.`);
    }
    if (value !== value.normalize('NFC')) {
        fail(`${context} is not NFC-normalized.`);
    }
    if (value.includes('\r')) {
        fail(`${context} contains a carriage return.`);
    }
}

function encodeCanonicalValue(value: unknown, context = 'payload'): string {
    if (value === null) return 'N';

    if (typeof value === 'string') {
        assertCanonicalString(value, context);
        return `S${textEncoder.encode(value).byteLength}:${value}`;
    }

    if (Array.isArray(value)) {
        let encoded = `L${value.length}:`;
        for (let index = 0; index < value.length; index += 1) {
            encoded += encodeCanonicalValue(
                value[index],
                `${context}[${index}]`,
            );
        }
        return encoded;
    }

    fail(`${context} contains a value outside the v1 canonical domain.`);
}

function assertObserverResourceId(id: string): void {
    if (id.length > 64 || !RESOURCE_ID_PATTERN.test(id)) {
        fail(`Invalid Observer resource id: ${id}`);
    }
}

function compareCodeUnits(left: string, right: string): number {
    if (left < right) return -1;
    if (left > right) return 1;
    return 0;
}

function findSystem(systemId: SystemId): SystemRecord {
    const system: SystemRecord | undefined = systems.find(
        (candidate) => candidate.id === systemId,
    );
    if (!system) fail(`Unknown system resource: ${systemId}`);
    return system;
}

function findConcernLabel(concernId: ConcernId): string {
    const concern = concerns.find((candidate) => candidate.id === concernId);
    if (!concern) fail(`Unknown field concern: ${concernId}`);
    return concern.label;
}

function buildCoveragePayload(
    source: ProvenanceRecord,
): readonly CanonicalValue[] {
    return source.coverage.map(({ area, support }) => [area, support]);
}

function buildProvenancePayload(source: ProvenanceRecord): CanonicalValue {
    const coverage = buildCoveragePayload(source);

    if (source.availability === 'NONE') {
        return [
            source.availability,
            coverage,
        ];
    }

    if (source.availability === 'RESTRICTED') {
        return [
            source.availability,
            source.kind,
            source.status.authority,
            [...source.status.roles],
            coverage,
        ];
    }

    let label: string | null = null;
    if (Object.prototype.hasOwnProperty.call(source, 'label')) {
        if (typeof source.label !== 'string') {
            fail('PUBLIC provenance label must be a string when present.');
        }
        label = source.label;
    }

    return [
        source.availability,
        source.kind,
        label,
        source.locator,
        source.status.authority,
        [...source.status.roles],
        coverage,
    ];
}
function buildSystemPayload(systemId: SystemId): CanonicalValue {
    const system = findSystem(systemId);
    const fieldConcernIds = new Set<ConcernId>(FIELD.concerns);
    const systemRelations = relations
        .filter(
            ({ system: relationSystem, concern }) =>
                relationSystem === systemId && fieldConcernIds.has(concern),
        )
        .map(({ concern, strength }) => [concern, strength] as const);
    const sourceRecords = provenance
        .filter(({ entity }) => entity === systemId)
        .map((source) => buildProvenancePayload(source));
    const phase: CanonicalValue =
        system.phase === null
            ? null
            : [system.phase.label, system.phase.compact];

    return [
        'system-content/3',
        system.id,
        system.index,
        system.name,
        system.body,
        system.evidence,
        phase,
        system.now,
        systemRelations,
        sourceRecords,
    ];
}
function buildFieldPayload(): CanonicalValue {
    const concernVocabulary = FIELD.concerns.map((id) => [
        id,
        findConcernLabel(id),
    ] as const);

    return [
        [...FIELD.plotted],
        [...FIELD.concerns],
        concernVocabulary,
        READOUT_SUBJECT,
        FIELD.ariaLabel,
    ];
}

function buildIndexPayload(): CanonicalValue {
    return [
        [
            INDEX_CONTENT.identity.name,
            INDEX_CONTENT.identity.lead,
            INDEX_CONTENT.identity.tail,
        ],
        [
            INDEX_CONTENT.relationIndex.subtitle,
            INDEX_CONTENT.relationIndex.note,
        ],
        INDEX_CONTENT.now.note,
        [...INDEX_CONTENT.invariants],
        [
            INDEX_CONTENT.closing.mark,
            INDEX_CONTENT.closing.locator,
        ],
    ];
}

function assertResourceRegistryIntegrity(): void {
    const ids = new Set<string>();
    const systemIds = new Set<SystemId>();
    const plotted: readonly SystemId[] = FIELD.plotted;
    let fieldResourceCount = 0;
    let indexResourceCount = 0;

    for (const resource of observerResources) {
        assertObserverResourceId(resource.id);
        if (ids.has(resource.id)) {
            fail(`Duplicate Observer resource id: ${resource.id}`);
        }
        ids.add(resource.id);

        if (resource.kind === 'field') {
            fieldResourceCount += 1;
            if (resource.id !== 'site:field') {
                fail('Unexpected field resource descriptor.');
            }
            continue;
        }

        if (resource.kind === 'index') {
            indexResourceCount += 1;
            if (resource.id !== 'site:index') {
                fail('Unexpected index resource descriptor.');
            }
            continue;
        }

        if (resource.id !== `system:${resource.systemId}`) {
            fail(`System resource id does not match systemId: ${resource.id}`);
        }
        if (systemIds.has(resource.systemId)) {
            fail(`Duplicate system resource: ${resource.systemId}`);
        }

        systemIds.add(resource.systemId);
        findSystem(resource.systemId);

        if (!plotted.includes(resource.systemId)) {
            fail(
                `System resource is not present in FIELD.plotted: ${resource.systemId}`,
            );
        }
    }

    if (fieldResourceCount !== 1) {
        fail(`Expected exactly one field resource, found ${fieldResourceCount}.`);
    }

    if (indexResourceCount !== 1) {
        fail(`Expected exactly one index resource, found ${indexResourceCount}.`);
    }

    for (const systemId of FIELD.plotted) {
        if (!systemIds.has(systemId)) {
            fail(`FIELD.plotted lacks a matching system resource: ${systemId}`);
        }
    }
}

function buildResourcePayload(resource: RegistryResource): CanonicalValue {
    if (resource.kind === 'field') return buildFieldPayload();
    if (resource.kind === 'index') return buildIndexPayload();
    return buildSystemPayload(resource.systemId);
}

function deriveProvenanceVerifiedThrough(
    resource: RegistryResource,
): string | null {
    if (resource.kind !== 'system') return null;

    let floor: string | null = null;

    for (const source of provenance) {
        if (source.entity !== resource.systemId) continue;

        if (
            floor === null ||
            compareCodeUnits(source.checkedAt, floor) < 0
        ) {
            floor = source.checkedAt;
        }
    }

    return floor;
}

async function hashResource(
    id: ObserverResourceId,
    payload: CanonicalValue,
): Promise<string> {
    const encoded = encodeCanonicalValue(
        ['observer-payload/1', id, payload],
        id,
    );
    if (encoded.length === 0) {
        fail(`Empty canonical serialization for ${id}.`);
    }

    const digest = await globalThis.crypto.subtle.digest(
        'SHA-256',
        textEncoder.encode(encoded),
    );

    const contentHash = Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');

    if (!SHA256_PATTERN.test(contentHash)) {
        fail(`Invalid SHA-256 output for ${id}.`);
    }
    return contentHash;
}

function assertExactKeys(
    value: object,
    expected: readonly string[],
    context: string,
): void {
    const keys = Reflect.ownKeys(value);
    const valid =
        keys.length === expected.length &&
        keys.every(
            (key, index) =>
                typeof key === 'string' && key === expected[index],
        );

    if (!valid) fail(`${context} exposes an unexpected schema shape.`);
}

export function assertObserverManifestIntegrity(
    manifest: unknown,
): asserts manifest is ObserverManifest {
    if (
        typeof manifest !== 'object' ||
        manifest === null ||
        Array.isArray(manifest)
    ) {
        fail('Manifest root must be an object.');
    }

    assertExactKeys(
        manifest,
        ['schemaVersion', 'resources'],
        'Manifest root',
    );

    const candidate = manifest as {
        schemaVersion?: unknown;
        resources?: unknown;
    };

    if (candidate.schemaVersion !== 2) {
        fail('Manifest schemaVersion must equal 2.');
    }
    if (
        !Array.isArray(candidate.resources) ||
        candidate.resources.length === 0
    ) {
        fail('Manifest resources must be a non-empty array.');
    }

    const expectedIds = observerResources
        .map(({ id }) => id)
        .sort(compareCodeUnits);

    if (candidate.resources.length !== expectedIds.length) {
        fail('Manifest resource cardinality does not match registry.');
    }

    let previousId: string | null = null;

    for (
        let index = 0;
        index < candidate.resources.length;
        index += 1
    ) {
        const resource: unknown = candidate.resources[index];

        if (
            typeof resource !== 'object' ||
            resource === null ||
            Array.isArray(resource)
        ) {
            fail(`Manifest resource ${index} must be an object.`);
        }

        assertExactKeys(
            resource,
            [
                'id',
                'contentHash',
                'lastContentChange',
                'provenanceVerifiedThrough',
            ],
            `Manifest resource ${index}`,
        );

        const record = resource as {
            id?: unknown;
            contentHash?: unknown;
            lastContentChange?: unknown;
            provenanceVerifiedThrough?: unknown;
        };

        if (typeof record.id !== 'string') {
            fail(`Manifest resource ${index} has a non-string id.`);
        }
        assertObserverResourceId(record.id);

        if (record.id !== expectedIds[index]) {
            fail(`Manifest resource order/identity mismatch at index ${index}.`);
        }
        if (
            previousId !== null &&
            compareCodeUnits(previousId, record.id) >= 0
        ) {
            fail('Manifest resources are not strictly ascending.');
        }
        previousId = record.id;

        if (
            typeof record.contentHash !== 'string' ||
            !SHA256_PATTERN.test(record.contentHash)
        ) {
            fail(
                `Manifest resource ${record.id} has an invalid contentHash.`,
            );
        }

        if (
            typeof record.lastContentChange !== 'string' ||
            !isValidIsoDate(record.lastContentChange)
        ) {
            fail(
                `Manifest resource ${record.id} has an invalid lastContentChange.`,
            );
        }

        if (
            record.provenanceVerifiedThrough !== null &&
            (
                typeof record.provenanceVerifiedThrough !== 'string' ||
                !isValidIsoDate(record.provenanceVerifiedThrough)
            )
        ) {
            fail(
                `Manifest resource ${record.id} has an invalid provenanceVerifiedThrough.`,
            );
        }

        const resourceId = record.id as ObserverResourceId;
        const anchor = assertObserverTemporalHash(
            resourceId,
            record.contentHash,
        );

        if (record.lastContentChange !== anchor.lastContentChange) {
            fail(
                `Manifest resource ${record.id} has a stale lastContentChange.`,
            );
        }

        const descriptor = observerResources.find(
            (candidateResource) => candidateResource.id === resourceId,
        );
        if (!descriptor) {
            fail(`Missing Observer resource descriptor: ${resourceId}`);
        }

        const expectedVerification =
            deriveProvenanceVerifiedThrough(descriptor);

        if (
            record.provenanceVerifiedThrough !== expectedVerification
        ) {
            fail(
                `Manifest resource ${record.id} has a non-derived provenanceVerifiedThrough.`,
            );
        }
    }
}

export async function buildObserverManifest(): Promise<ObserverManifest> {
    assertResourceRegistryIntegrity();

    const resources = await Promise.all(
        observerResources.map(async (resource) => {
            const contentHash = await hashResource(
                resource.id,
                buildResourcePayload(resource),
            );
            const anchor = assertObserverTemporalHash(
                resource.id,
                contentHash,
            );

            return {
                id: resource.id,
                contentHash,
                lastContentChange: anchor.lastContentChange,
                provenanceVerifiedThrough:
                    deriveProvenanceVerifiedThrough(resource),
            };
        }),
    );

    resources.sort((left, right) => compareCodeUnits(left.id, right.id));

    const manifest: ObserverManifest = {
        schemaVersion: 2,
        resources,
    };

    assertObserverManifestIntegrity(manifest);
    return manifest;
}
