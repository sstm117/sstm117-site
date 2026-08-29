import type { ConcernRecord } from './types';

export const concerns = [
    {
        id: 'kno',
        label: 'KNOWLEDGE',
        gloss: 'What can be asserted, on what evidence, and what must stay marked unknown.',
    },
    {
        id: 'int',
        label: 'INTELLIGENCE',
        gloss: 'Where a model helps, where it is untrusted input, and who governs the difference.',
    },
    {
        id: 'hum',
        label: 'HUMAN INTERACTION',
        gloss: 'Attention, effort and trust as engineering constraints rather than afterthoughts.',
    },
    {
        id: 'dec',
        label: 'DECISION SYSTEMS',
        gloss: 'Getting from partial information to a defensible choice, repeatedly.',
    },
    {
        id: 'phy',
        label: 'PHYSICAL SYSTEMS',
        gloss: 'Matter, hardware and the plant floor, where the constraints are not negotiable.',
    },
    {
        id: 'ops',
        label: 'OPERATIONS',
        gloss: 'Flows, throughput, feedback and failure under load. The original discipline.',
    },
] as const satisfies readonly ConcernRecord[];
