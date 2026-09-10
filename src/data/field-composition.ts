import type { ConcernId, SystemId } from './types';

const FIELD_PLOTTED = [
    'obs',
    'moka',
    'herve',
    'exomind',
] as const satisfies readonly SystemId[];

export type FieldSystemId =
    (typeof FIELD_PLOTTED)[number];
export type FieldNodeId =
    FieldSystemId | ConcernId;
export type LabelAnchor = 'l' | 'c' | 'r';

export interface NodePlacement {
    x: number;
    y: number;
}

export interface LabelPlacement {
    x: number;
    y: number;
    anchor: LabelAnchor;
}

export const FIELD = {
    viewBox: {
        width: 1000,
        height: 620,
    },

    plotted: FIELD_PLOTTED,

    concerns: [
        'kno',
        'int',
        'hum',
        'dec',
        'phy',
        'ops',
    ] as const satisfies readonly ConcernId[],

    nodes: {
        kno: { x: 604, y: 96 },
        int: { x: 906, y: 168 },
        hum: { x: 872, y: 452 },
        dec: { x: 520, y: 566 },
        phy: { x: 168, y: 520 },
        ops: { x: 120, y: 336 },

        obs: { x: 700, y: 236 },
        moka: { x: 790, y: 340 },
        herve: { x: 250, y: 486 },
        exomind: { x: 440, y: 400 },
    } satisfies Readonly<Record<FieldNodeId, NodePlacement>>,

    labels: {
        kno: { x: 604, y: 62, anchor: 'c' },
        int: { x: 890, y: 140, anchor: 'r' },
        hum: { x: 856, y: 480, anchor: 'r' },
        dec: { x: 520, y: 596, anchor: 'c' },
        phy: { x: 186, y: 520, anchor: 'l' },
        ops: { x: 138, y: 336, anchor: 'l' },

        obs: { x: 722, y: 236, anchor: 'l' },
        moka: { x: 812, y: 340, anchor: 'l' },
        herve: { x: 228, y: 486, anchor: 'r' },
        exomind: { x: 418, y: 400, anchor: 'r' },
    } satisfies Readonly<Record<FieldNodeId, LabelPlacement>>,

    ariaLabel:
        'Topology of four systems wired to six recurring concerns. An equivalent text index follows.',
} as const;
