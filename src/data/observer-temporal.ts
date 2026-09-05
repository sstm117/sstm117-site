import {
    observerResources,
    type ObserverResourceId,
} from './observer-resources';
import { isValidIsoDate } from './provenance-integrity';

export interface ObserverTemporalAnchor {
    readonly id: ObserverResourceId;
    readonly contentHash: string;
    readonly lastContentChange: string;
}

/**
 * Hash-bound temporal anchors for canonical Observer resource identities.
 *
 * lastContentChange dates the identity represented by contentHash.
 * It does not date rendered output, provenance verification, build,
 * deployment, or visitor observation.
 */
export const observerTemporalAnchors = [
    {
        id: 'site:field',
        contentHash:
            '2e923906c293759a15c705dc9c1e1324188cf3677398c5b7a62dde9f1dee5929',
        lastContentChange: '2026-09-04',
    },
    {
        id: 'site:index',
        contentHash:
            '4615b7eee73b54b3e5b033ccca32f2d71829e623727145d4d46181001b413d31',
        lastContentChange: '2026-09-04',
    },
    {
        id: 'system:obs',
        contentHash:
            'c836ece436aa8ac20d3a358d4bfbf664d36b0459122b157909752770eae2123a',
        lastContentChange: '2026-09-04',
    },
    {
        id: 'system:food',
        contentHash:
            'c9d5cad313dbc9ba4ac3a479bba69e6806cecd251cc28412e29a9b0524268a30',
        lastContentChange: '2026-09-04',
    },
    {
        id: 'system:moka',
        contentHash:
            '8d856fd0fe95c1851d845e4cb64b3ec7877b5ae2832099be5ffd23263d7fd942',
        lastContentChange: '2026-09-04',
    },
    {
        id: 'system:fnode',
        contentHash:
            '2188c5d2df306e88c7e96ccc8389d0e106919077a9b8c72f65ee42ee0573b79d',
        lastContentChange: '2026-09-04',
    },
] as const satisfies readonly ObserverTemporalAnchor[];

const SHA256_PATTERN = /^[0-9a-f]{64}$/;

function fail(message: string): never {
    throw new Error(`[observer-temporal] ${message}`);
}

function assertExactAnchorKeys(anchor: object, id: string): void {
    const keys = Reflect.ownKeys(anchor);

    if (
        keys.length !== 3 ||
        keys[0] !== 'id' ||
        keys[1] !== 'contentHash' ||
        keys[2] !== 'lastContentChange'
    ) {
        fail(`Temporal anchor ${id} has an invalid shape.`);
    }
}

export function assertObserverTemporalRegistryIntegrity(): void {
    const resourceIds = new Set<ObserverResourceId>(
        observerResources.map(({ id }) => id),
    );
    const anchorIds = new Set<ObserverResourceId>();

    for (const anchor of observerTemporalAnchors) {
        assertExactAnchorKeys(anchor, anchor.id);

        if (anchorIds.has(anchor.id)) {
            fail(`Duplicate temporal anchor: ${anchor.id}`);
        }
        anchorIds.add(anchor.id);

        if (!resourceIds.has(anchor.id)) {
            fail(`Orphan temporal anchor: ${anchor.id}`);
        }

        if (!SHA256_PATTERN.test(anchor.contentHash)) {
            fail(`Temporal anchor ${anchor.id} has an invalid contentHash.`);
        }

        if (!isValidIsoDate(anchor.lastContentChange)) {
            fail(
                `Temporal anchor ${anchor.id} has an invalid lastContentChange.`,
            );
        }
    }

    if (anchorIds.size !== resourceIds.size) {
        fail(
            `Temporal anchor cardinality mismatch: expected ${resourceIds.size}, found ${anchorIds.size}.`,
        );
    }

    for (const id of resourceIds) {
        if (!anchorIds.has(id)) {
            fail(`Missing temporal anchor: ${id}`);
        }
    }
}

export function assertObserverTemporalHash(
    id: ObserverResourceId,
    contentHash: string,
): ObserverTemporalAnchor {
    if (!SHA256_PATTERN.test(contentHash)) {
        fail(`Computed resource ${id} has an invalid contentHash.`);
    }

    const anchor = observerTemporalAnchors.find(
        (candidate) => candidate.id === id,
    );

    if (!anchor) {
        fail(`Missing temporal anchor: ${id}`);
    }

    if (anchor.contentHash !== contentHash) {
        fail(
            `Temporal anchor mismatch for ${id}: expected ${anchor.contentHash}, received ${contentHash}.`,
        );
    }

    return anchor;
}

assertObserverTemporalRegistryIntegrity();
