import type { RelationRecord } from './types';

/**
 * Relations are declared semantic edges of the current FIELD composition.
 *
 * PRIMARY: removing the concern would materially change
 * what the system fundamentally is.
 *
 * PRESENT: a durable concern, responsibility, or system
 * dimension that does not define the system by itself.
 *
 * Absence of an edge is intentional and must never be
 * interpreted as an inferred relation.
 *
 * Systems outside FIELD.plotted carry no relation rows here.
 * Leaving FIELD does not erase their identity or provenance.
 */
export const relations = [
    { system: 'obs', concern: 'kno', strength: 'PRIMARY' },
    { system: 'obs', concern: 'int', strength: 'PRIMARY' },

    { system: 'moka', concern: 'hum', strength: 'PRIMARY' },

    { system: 'herve', concern: 'ops', strength: 'PRIMARY' },
    { system: 'herve', concern: 'dec', strength: 'PRIMARY' },
    { system: 'herve', concern: 'hum', strength: 'PRESENT' },
    { system: 'herve', concern: 'phy', strength: 'PRESENT' },

    { system: 'exomind', concern: 'phy', strength: 'PRIMARY' },
    { system: 'exomind', concern: 'int', strength: 'PRIMARY' },
    { system: 'exomind', concern: 'dec', strength: 'PRESENT' },
] as const satisfies readonly RelationRecord[];
