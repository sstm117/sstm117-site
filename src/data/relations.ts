import type { RelationRecord } from './types';

/**
 * PRIMARY: removing the concern would materially change
 * what the system fundamentally is.
 *
 * PRESENT: a durable concern, responsibility, or system
 * dimension that does not define the system by itself.
 *
 * Absence of an edge is intentional and must never be
 * interpreted as an inferred relation.
 */
export const relations = [
    { system: 'obs', concern: 'kno', strength: 'PRIMARY' },
    { system: 'obs', concern: 'int', strength: 'PRIMARY' },
    { system: 'obs', concern: 'phy', strength: 'PRESENT' },
    { system: 'obs', concern: 'hum', strength: 'PRESENT' },

    { system: 'food', concern: 'hum', strength: 'PRIMARY' },
    { system: 'food', concern: 'kno', strength: 'PRESENT' },
    { system: 'food', concern: 'ops', strength: 'PRESENT' },
    { system: 'food', concern: 'dec', strength: 'PRESENT' },
    { system: 'food', concern: 'phy', strength: 'PRESENT' },

    { system: 'moka', concern: 'hum', strength: 'PRIMARY' },

    { system: 'fnode', concern: 'phy', strength: 'PRIMARY' },
    { system: 'fnode', concern: 'ops', strength: 'PRESENT' },
] as const satisfies readonly RelationRecord[];
