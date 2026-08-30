import type { ProvenanceRecord } from './types';

/**
 * RESTRICTED provenance deliberately contains no private locator material.
 * checkedAt records when Personal Site assertions were confronted with
 * the source, not when the source itself was authored.
 */
export const provenance = [
    {
        entity: 'obs',
        availability: 'RESTRICTED',
        kind: 'REPOSITORY',
        label: 'Private project repository',
        status: {
            authority: 'CANONICAL',
            roles: ['DESCRIPTIVE', 'NORMATIVE'],
        },
        checkedAt: '2026-08-31',
        coverage: [
            { area: 'IDENTITY', support: 'ASSERTS' },
            { area: 'DESCRIPTION', support: 'ASSERTS' },
            { area: 'PHASE', support: 'ASSERTS' },
            { area: 'CONSTRAINTS', support: 'ASSERTS' },
        ],
    },
    {
        entity: 'food',
        availability: 'RESTRICTED',
        kind: 'REPOSITORY',
        label: 'Private project repository',
        status: {
            authority: 'CANONICAL',
            roles: ['DESCRIPTIVE', 'NORMATIVE'],
        },
        checkedAt: '2026-08-31',
        coverage: [
            { area: 'IDENTITY', support: 'ASSERTS' },
            { area: 'DESCRIPTION', support: 'ASSERTS' },
            { area: 'QUESTION', support: 'ASSERTS' },
            { area: 'PHASE', support: 'ASSERTS' },
            { area: 'CONSTRAINTS', support: 'SPECIFIES' },
        ],
    },
    {
        entity: 'moka',
        availability: 'RESTRICTED',
        kind: 'SPECIFICATION',
        label: 'Private provisional specification',
        status: {
            authority: 'PROVISIONAL',
            roles: ['DESCRIPTIVE', 'NORMATIVE'],
        },
        checkedAt: '2026-08-31',
        coverage: [
            { area: 'IDENTITY', support: 'ASSERTS' },
            { area: 'DESCRIPTION', support: 'ASSERTS' },
            { area: 'PHASE', support: 'ASSERTS' },
            { area: 'CONSTRAINTS', support: 'SPECIFIES' },
        ],
    },
    {
        entity: 'fnode',
        availability: 'RESTRICTED',
        kind: 'REPOSITORY',
        label: 'Private project repository',
        status: {
            authority: 'CANONICAL',
            roles: ['DESCRIPTIVE'],
        },
        checkedAt: '2026-08-31',
        coverage: [
            { area: 'IDENTITY', support: 'ASSERTS' },
            { area: 'DESCRIPTION', support: 'ASSERTS' },
        ],
    },
    {
        entity: 'fnode',
        availability: 'RESTRICTED',
        kind: 'DECLARATION',
        label: 'Owner declaration',
        status: {
            authority: 'CANONICAL',
            roles: ['DECLARATIVE'],
        },
        checkedAt: '2026-08-31',
        coverage: [
            { area: 'DESCRIPTION', support: 'ASSERTS' },
        ],
    },
] as const satisfies readonly ProvenanceRecord[];
