import type { ProvenanceRecord, SystemRecord } from "./types";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const SOURCE_AVAILABILITIES = new Set([
    "PUBLIC",
    "RESTRICTED",
    "NONE",
]);

const SYSTEM_EVIDENCE = new Set([
    "SOURCE-VERIFIED",
    "OWNER-DECLARED",
    "NO SOURCE",
]);

const SYSTEM_REQUIRED_KEYS = [
    "id",
    "evidence",
] as const;

const SOURCE_KINDS = new Set([
    "REPOSITORY",
    "SPECIFICATION",
    "ARTIFACT",
    "DECLARATION",
]);

const SOURCE_AUTHORITIES = new Set([
    "CANONICAL",
    "PROVISIONAL",
    "LEGACY",
]);

const SOURCE_ROLES = new Set([
    "DECLARATIVE",
    "DESCRIPTIVE",
    "NORMATIVE",
    "EXPERIMENTAL",
]);

const SOURCE_COVERAGE_AREAS = new Set([
    "IDENTITY",
    "DESCRIPTION",
    "QUESTION",
    "STRUCTURE",
    "PHASE",
    "CONSTRAINTS",
    "IMPLEMENTATION",
    "CAPABILITY",
    "RESULT",
    "APPLICATION_CONTEXT",
]);

const SOURCE_SUPPORTS = new Set([
    "ASSERTS",
    "SPECIFIES",
    "DEMONSTRATES",
]);

const PROVENANCE_ALLOWED_KEYS = new Set([
    "entity",
    "availability",
    "kind",
    "label",
    "locator",
    "status",
    "checkedAt",
    "coverage",
]);

const PROVENANCE_REQUIRED_KEYS = [
    "entity",
    "availability",
    "checkedAt",
    "coverage",
] as const;

const PUBLIC_ALLOWED_KEYS = new Set([
    "entity",
    "availability",
    "kind",
    "label",
    "locator",
    "status",
    "checkedAt",
    "coverage",
]);

const PUBLIC_REQUIRED_KEYS = [
    "entity",
    "availability",
    "kind",
    "locator",
    "status",
    "checkedAt",
    "coverage",
] as const;

const RESTRICTED_ALLOWED_KEYS = new Set([
    "entity",
    "availability",
    "kind",
    "status",
    "checkedAt",
    "coverage",
]);

const RESTRICTED_REQUIRED_KEYS = [
    "entity",
    "availability",
    "kind",
    "status",
    "checkedAt",
    "coverage",
] as const;

const SOURCE_STATUS_ALLOWED_KEYS = new Set([
    "authority",
    "roles",
]);

const SOURCE_STATUS_REQUIRED_KEYS = [
    "authority",
    "roles",
] as const;

const SOURCE_COVERAGE_ALLOWED_KEYS = new Set([
    "area",
    "support",
]);

const SOURCE_COVERAGE_REQUIRED_KEYS = [
    "area",
    "support",
] as const;

const NONE_ALLOWED_KEYS = new Set([
    "entity",
    "availability",
    "checkedAt",
    "coverage",
]);

const NONE_REQUIRED_KEYS = [
    "entity",
    "availability",
    "checkedAt",
    "coverage",
] as const;

const OBJECT_PROTOTYPE_ALLOWED_KEYS = new Set<PropertyKey>([
    "constructor",
    "__defineGetter__",
    "__defineSetter__",
    "hasOwnProperty",
    "__lookupGetter__",
    "__lookupSetter__",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toString",
    "valueOf",
    "__proto__",
    "toLocaleString",
]);

const ARRAY_PROTOTYPE_ALLOWED_KEYS = new Set<PropertyKey>([
    "length",
    "constructor",
    "at",
    "concat",
    "copyWithin",
    "fill",
    "find",
    "findIndex",
    "findLast",
    "findLastIndex",
    "lastIndexOf",
    "pop",
    "push",
    "reverse",
    "shift",
    "unshift",
    "slice",
    "sort",
    "splice",
    "includes",
    "indexOf",
    "join",
    "keys",
    "entries",
    "values",
    "forEach",
    "filter",
    "flat",
    "flatMap",
    "map",
    "every",
    "some",
    "reduce",
    "reduceRight",
    "toReversed",
    "toSorted",
    "toSpliced",
    "with",
    "toLocaleString",
    "toString",
    Symbol.iterator,
    Symbol.unscopables,
]);

const ARRAY_INDEX = /^(0|[1-9]\d*)$/;

type UnknownRecord = Record<PropertyKey, unknown>;

function fail(message: string): never {
    throw new Error("[provenance-integrity] " + message);
}


function assertCleanArrayPrototype(
    context: string,
    entity: string,
): void {
    const keys = Reflect.ownKeys(Array.prototype);

    for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];

        if (!ARRAY_PROTOTYPE_ALLOWED_KEYS.has(key)) {
            fail(
                context +
                " inherits forbidden key " +
                String(key) +
                " from Array.prototype for " +
                entity,
            );
        }
    }
}

function assertCleanObjectPrototype(
    context: string,
    entity: string,
): void {
    const keys = Reflect.ownKeys(Object.prototype);

    for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];

        if (!OBJECT_PROTOTYPE_ALLOWED_KEYS.has(key)) {
            fail(
                context +
                " inherits forbidden key " +
                String(key) +
                " from Object.prototype for " +
                entity,
            );
        }
    }
}

function assertPlainDataPrototype(
    value: object,
    context: string,
    entity: string,
): void {
    const prototype = Object.getPrototypeOf(value);

    if (prototype === null) {
        return;
    }

    if (prototype !== Object.prototype) {
        fail(context + " has unsupported prototype for " + entity);
    }

    assertCleanObjectPrototype(context, entity);
}

function getDataPropertyDescriptor(
    value: object,
    key: PropertyKey,
    context: string,
    entity: string,
): PropertyDescriptor & { value: unknown } {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);

    if (!descriptor || !("value" in descriptor)) {
        fail(
            context +
            " uses accessor key " +
            String(key) +
            " for " +
            entity,
        );
    }

    return descriptor as PropertyDescriptor & { value: unknown };
}

function isArrayIndex(key: string, length: number): boolean {
    if (!ARRAY_INDEX.test(key)) {
        return false;
    }

    const index = Number(key);

    return (
        Number.isInteger(index) &&
        index >= 0 &&
        index < length
    );
}

function snapshotPlainArray(
    value: unknown,
    context: string,
    entity: string,
): unknown[] {
    if (!Array.isArray(value)) {
        fail(context + " is not an array for " + entity);
    }

    if (Object.getPrototypeOf(value) !== Array.prototype) {
        fail(context + " has unsupported prototype for " + entity);
    }

    assertCleanObjectPrototype(context, entity);
    assertCleanArrayPrototype(context, entity);

    const lengthDescriptor = getDataPropertyDescriptor(
        value,
        "length",
        context,
        entity,
    );

    const length = lengthDescriptor.value;

    if (
        typeof length !== "number" ||
        !Number.isInteger(length) ||
        length < 0
    ) {
        fail(context + " has invalid length for " + entity);
    }

    const ownKeys = Reflect.ownKeys(value);

    for (
        let keyIndex = 0;
        keyIndex < ownKeys.length;
        keyIndex += 1
    ) {
        const key = ownKeys[keyIndex];

        if (
            key !== "length" &&
            (
                typeof key !== "string" ||
                !isArrayIndex(key, length)
            )
        ) {
            fail(
                context +
                " exposes forbidden array key " +
                String(key) +
                " for " +
                entity,
            );
        }

        getDataPropertyDescriptor(
            value,
            key,
            context,
            entity,
        );
    }

    const snapshot: unknown[] = [];

    for (let index = 0; index < length; index += 1) {
        const key = String(index);
        const descriptor = Object.getOwnPropertyDescriptor(
            value,
            key,
        );

        if (!descriptor) {
            fail(
                context +
                " has sparse index " +
                key +
                " for " +
                entity,
            );
        }

        if (!("value" in descriptor)) {
            fail(
                context +
                " uses accessor key " +
                key +
                " for " +
                entity,
            );
        }

        snapshot[index] = descriptor.value;
    }

    return snapshot;
}

function snapshotExactShape(
    value: unknown,
    allowedKeys: ReadonlySet<string>,
    requiredKeys: readonly string[],
    context: string,
    entity: string,
): UnknownRecord {
    if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
    ) {
        fail(context + " is not an object for " + entity);
    }

    assertPlainDataPrototype(value, context, entity);

    const snapshot = Object.create(null) as UnknownRecord;
    const ownKeys = Reflect.ownKeys(value);

    for (
        let keyIndex = 0;
        keyIndex < ownKeys.length;
        keyIndex += 1
    ) {
        const key = ownKeys[keyIndex];

        if (typeof key !== "string" || !allowedKeys.has(key)) {
            fail(
                context +
                " exposes forbidden key " +
                String(key) +
                " for " +
                entity,
            );
        }

        snapshot[key] = getDataPropertyDescriptor(
            value,
            key,
            context,
            entity,
        ).value;
    }

    for (
        let keyIndex = 0;
        keyIndex < requiredKeys.length;
        keyIndex += 1
    ) {
        const key = requiredKeys[keyIndex];

        if (
            Object.getOwnPropertyDescriptor(snapshot, key) ===
            undefined
        ) {
            fail(
                context +
                " lacks required key " +
                key +
                " for " +
                entity,
            );
        }
    }

    return snapshot;
}

function snapshotRequiredDataProperties(
    value: unknown,
    requiredKeys: readonly string[],
    context: string,
    entity: string,
): UnknownRecord {
    if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
    ) {
        fail(context + " is not an object for " + entity);
    }

    assertPlainDataPrototype(value, context, entity);

    const snapshot = Object.create(null) as UnknownRecord;

    for (
        let keyIndex = 0;
        keyIndex < requiredKeys.length;
        keyIndex += 1
    ) {
        const key = requiredKeys[keyIndex];

        snapshot[key] = getDataPropertyDescriptor(
            value,
            key,
            context,
            entity,
        ).value;
    }

    return snapshot;
}

function assertEnumValue(
    value: unknown,
    allowedValues: ReadonlySet<string>,
    context: string,
    entity: string,
): asserts value is string {
    if (
        typeof value !== "string" ||
        !allowedValues.has(value)
    ) {
        fail("invalid " + context + " for " + entity);
    }
}

function isValidIsoDate(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }

    const match = ISO_DATE.exec(value);

    if (!match) {
        return false;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function assertSourceStatus(
    value: unknown,
    availability: "PUBLIC" | "RESTRICTED",
    entity: string,
): string {
    const status = snapshotExactShape(
        value,
        SOURCE_STATUS_ALLOWED_KEYS,
        SOURCE_STATUS_REQUIRED_KEYS,
        availability + " status",
        entity,
    );

    const authority = status.authority;

    assertEnumValue(
        authority,
        SOURCE_AUTHORITIES,
        "source authority",
        entity,
    );

    const roles = snapshotPlainArray(
        status.roles,
        "source roles",
        entity,
    );

    for (let index = 0; index < roles.length; index += 1) {
        assertEnumValue(
            roles[index],
            SOURCE_ROLES,
            "source role",
            entity,
        );
    }

    return authority;
}

function assertSourceCoverage(
    value: unknown,
    availability: "PUBLIC" | "RESTRICTED",
    entity: string,
): number {
    const qualifications = snapshotPlainArray(
        value,
        availability + " coverage",
        entity,
    );

    for (
        let index = 0;
        index < qualifications.length;
        index += 1
    ) {
        const qualification = snapshotExactShape(
            qualifications[index],
            SOURCE_COVERAGE_ALLOWED_KEYS,
            SOURCE_COVERAGE_REQUIRED_KEYS,
            availability + " coverage",
            entity,
        );

        assertEnumValue(
            qualification.area,
            SOURCE_COVERAGE_AREAS,
            "coverage area",
            entity,
        );

        assertEnumValue(
            qualification.support,
            SOURCE_SUPPORTS,
            "coverage support",
            entity,
        );
    }

    return qualifications.length;
}

export function assertProvenanceIntegrity(
    systems: readonly SystemRecord[],
    provenance: readonly ProvenanceRecord[],
): void {
    const systemValues = snapshotPlainArray(
        systems,
        "systems corpus",
        "integrity input",
    );

    const provenanceValues = snapshotPlainArray(
        provenance,
        "provenance corpus",
        "integrity input",
    );

    const systemSnapshots: Array<{
        id: string;
        evidence: string;
    }> = [];

    for (
        let systemIndex = 0;
        systemIndex < systemValues.length;
        systemIndex += 1
    ) {
        const system = snapshotRequiredDataProperties(
            systemValues[systemIndex],
            SYSTEM_REQUIRED_KEYS,
            "system record",
            "integrity input",
        );

        const id = system.id;

        if (typeof id !== "string") {
            fail("invalid system identity");
        }

        const evidence = system.evidence;

        assertEnumValue(
            evidence,
            SYSTEM_EVIDENCE,
            "system evidence",
            id,
        );

        for (
            let priorIndex = 0;
            priorIndex < systemSnapshots.length;
            priorIndex += 1
        ) {
            if (systemSnapshots[priorIndex].id === id) {
                fail("duplicate system identity");
            }
        }

        systemSnapshots[systemIndex] = {
            id,
            evidence,
        };
    }

    const validatedRecords: Array<{
        entity: string;
        availability: string;
        coverageLength: number;
        authority: string | null;
    }> = [];

    for (
        let recordIndex = 0;
        recordIndex < provenanceValues.length;
        recordIndex += 1
    ) {
        const candidate = snapshotExactShape(
            provenanceValues[recordIndex],
            PROVENANCE_ALLOWED_KEYS,
            PROVENANCE_REQUIRED_KEYS,
            "provenance record",
            "unresolved entity",
        );

        const entityValue = candidate.entity;

        if (typeof entityValue !== "string") {
            fail("invalid provenance entity");
        }

        const entity = entityValue;
        let knownSystem = false;

        for (
            let systemIndex = 0;
            systemIndex < systemSnapshots.length;
            systemIndex += 1
        ) {
            if (systemSnapshots[systemIndex].id === entity) {
                knownSystem = true;
                break;
            }
        }

        if (!knownSystem) {
            fail("orphan provenance entity: " + entity);
        }

        if (!isValidIsoDate(candidate.checkedAt)) {
            fail("invalid checkedAt for " + entity);
        }

        const availability = candidate.availability;

        assertEnumValue(
            availability,
            SOURCE_AVAILABILITIES,
            "source availability",
            entity,
        );

        if (availability === "PUBLIC") {
            const source = snapshotExactShape(
                candidate,
                PUBLIC_ALLOWED_KEYS,
                PUBLIC_REQUIRED_KEYS,
                "PUBLIC source",
                entity,
            );

            assertEnumValue(
                source.kind,
                SOURCE_KINDS,
                "source kind",
                entity,
            );

            const labelDescriptor =
                Object.getOwnPropertyDescriptor(
                    source,
                    "label",
                );

            if (
                labelDescriptor &&
                typeof labelDescriptor.value !== "string"
            ) {
                fail("invalid PUBLIC label for " + entity);
            }

            const locator = source.locator;

            if (
                typeof locator !== "string" ||
                !locator.trim()
            ) {
                fail("PUBLIC source lacks locator for " + entity);
            }

            const authority = assertSourceStatus(
                source.status,
                "PUBLIC",
                entity,
            );

            const coverageLength = assertSourceCoverage(
                source.coverage,
                "PUBLIC",
                entity,
            );

            validatedRecords[recordIndex] = {
                entity,
                availability,
                coverageLength,
                authority,
            };

            continue;
        }

        if (availability === "RESTRICTED") {
            const source = snapshotExactShape(
                candidate,
                RESTRICTED_ALLOWED_KEYS,
                RESTRICTED_REQUIRED_KEYS,
                "RESTRICTED source",
                entity,
            );

            assertEnumValue(
                source.kind,
                SOURCE_KINDS,
                "source kind",
                entity,
            );

            const authority = assertSourceStatus(
                source.status,
                "RESTRICTED",
                entity,
            );

            const coverageLength = assertSourceCoverage(
                source.coverage,
                "RESTRICTED",
                entity,
            );

            validatedRecords[recordIndex] = {
                entity,
                availability,
                coverageLength,
                authority,
            };

            continue;
        }

        const source = snapshotExactShape(
            candidate,
            NONE_ALLOWED_KEYS,
            NONE_REQUIRED_KEYS,
            "NONE source",
            entity,
        );

        const coverage = snapshotPlainArray(
            source.coverage,
            "NONE coverage",
            entity,
        );

        if (coverage.length !== 0) {
            fail("NONE source has coverage for " + entity);
        }

        validatedRecords[recordIndex] = {
            entity,
            availability,
            coverageLength: 0,
            authority: null,
        };
    }

    for (
        let systemIndex = 0;
        systemIndex < systemSnapshots.length;
        systemIndex += 1
    ) {
        const system = systemSnapshots[systemIndex];
        let recordCount = 0;
        let noneCount = 0;
        let hasQualifiedSource = false;
        let hasCurrentAuthority = false;

        for (
            let recordIndex = 0;
            recordIndex < validatedRecords.length;
            recordIndex += 1
        ) {
            const record = validatedRecords[recordIndex];

            if (record.entity !== system.id) {
                continue;
            }

            recordCount += 1;

            if (record.availability === "NONE") {
                noneCount += 1;
                continue;
            }

            if (record.coverageLength > 0) {
                hasQualifiedSource = true;

                if (
                    record.authority === "CANONICAL" ||
                    record.authority === "PROVISIONAL"
                ) {
                    hasCurrentAuthority = true;
                }
            }
        }

        if (noneCount > 0 && recordCount !== 1) {
            fail(
                "NONE source is not exclusive for " +
                system.id,
            );
        }

        if (system.evidence === "NO SOURCE") {
            if (recordCount !== 1 || noneCount !== 1) {
                fail(
                    "NO SOURCE contract violated for " +
                    system.id,
                );
            }

            continue;
        }

        if (system.evidence === "OWNER-DECLARED") {
            continue;
        }

        if (system.evidence !== "SOURCE-VERIFIED") {
            fail("invalid system evidence for " + system.id);
        }

        if (!hasQualifiedSource) {
            fail(
                "SOURCE-VERIFIED lacks qualified source for " +
                system.id,
            );
        }

        if (!hasCurrentAuthority) {
            fail(
                "SOURCE-VERIFIED lacks current authority for " +
                system.id,
            );
        }
    }
}
