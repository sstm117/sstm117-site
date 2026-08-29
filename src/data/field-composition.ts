import type { ConcernId, SystemId } from './types';

export type FieldNodeId = SystemId | ConcernId;
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

    plotted: [
        'obs',
        'food',
        'moka',
        'fnode',
    ] as const satisfies readonly SystemId[],

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
        food: { x: 440, y: 400 },
        moka: { x: 790, y: 340 },
        fnode: { x: 250, y: 486 },
    } satisfies Readonly<Record<FieldNodeId, NodePlacement>>,

    labels: {
        kno: { x: 604, y: 62, anchor: 'c' },
        int: { x: 890, y: 140, anchor: 'r' },
        hum: { x: 856, y: 480, anchor: 'r' },
        dec: { x: 520, y: 596, anchor: 'c' },
        phy: { x: 186, y: 520, anchor: 'l' },
        ops: { x: 138, y: 336, anchor: 'l' },

        obs: { x: 722, y: 236, anchor: 'l' },
        food: { x: 418, y: 400, anchor: 'r' },
        moka: { x: 812, y: 340, anchor: 'l' },
        fnode: { x: 228, y: 486, anchor: 'r' },
    } satisfies Readonly<Record<FieldNodeId, LabelPlacement>>,

    ariaLabel:
        'Topology of four systems wired to six recurring concerns. An equivalent text index follows.',
} as const;
