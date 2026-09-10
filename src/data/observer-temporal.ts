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
            '92effd89862c68298ab096409e260ca322b6fdb5136dc612af6be22ea5cb3c2c',
        lastContentChange: '2026-09-10',
    },
    {
        id: 'site:index',
        contentHash:
            '5e1af42df9afffdfaef1d6cf43da5196592d8a66a6badbcb871c9ddc8670b3f2',
        lastContentChange: '2026-09-10',
    },
    {
        id: 'system:obs',
        contentHash:
            '74881697a675cf704ba0c5d5c78bf8fc8a453ff5da98845e259255284c21b522',
        lastContentChange: '2026-09-10',
    },
    {
        id: 'system:moka',
        contentHash:
            '112855019c9355cb5e1c52bf14a487213af0b0aa00dc43a10ea20ffc3952d96f',
        lastContentChange: '2026-09-04',
    },
    {
        id: 'system:herve',
        contentHash:
            '5de4cd3c4b204be23d119c840330db8a3faaaf58918b0e3ee58d285788522221',
        lastContentChange: '2026-09-10',
    },
    {
        id: 'system:exomind',
        contentHash:
            'aa4acab8502d7578ea49a8036ae3db66f10f1afe8afe861b78d8cf671540fac9',
        lastContentChange: '2026-09-10',
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
