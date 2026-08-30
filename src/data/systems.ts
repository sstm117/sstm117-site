import { assertProvenanceIntegrity } from './provenance-integrity';
import { provenance } from './provenance';
import type { SystemRecord } from './types';

export const systems = [
    {
        id: 'obs',
        index: '001',
        name: 'AI Evolution Observatory',
        short: 'OBSERVATORY',
        body: 'A temporal, provenance-aware knowledge system for reconstructing and explaining the evolution of AI. At P0 — knowledge foundation only: epistemic, temporal and governance models settled before any application stack is called canonical. Its vision reaches into physical AI infrastructure, which is why physical systems is a declared concern.',
        disclosure: 'PARTIAL',
        evidence: 'SOURCE-VERIFIED',
        phase: {
            label: 'P0 · KNOWLEDGE FOUNDATION',
            compact: 'P0 FOUNDATION',
        },
        now: null,
    },
    {
        id: 'food',
        index: '002',
        name: 'Food OS',
        short: 'FOOD OS',
        body: 'In its Grand Reboot, at increment R0.1 — problem and truth discovery. First problem, first wedge and first product are held UNKNOWN; stack and architecture unselected; implementation not authorised. The systemic food-chain ambition is real but does not define current scope, and AI is not a validated requirement.',
        disclosure: 'PARTIAL',
        evidence: 'SOURCE-VERIFIED',
        phase: {
            label: 'GRAND REBOOT · R0.1',
            compact: 'R0.1 DISCOVERY',
        },
        now: null,
    },
    {
        id: 'moka',
        index: '003',
        name: 'Moka Companion',
        short: 'MOKA',
        body: 'A native Windows desktop companion: presence, attention, lightweight native interaction, privacy, subtle assistance. Its normative v0.1 contract forbids cloud service, LLM, AI inference and runtime networking — requirements, not demonstrated runtime behaviour. One relation, held deliberately.',
        disclosure: 'PARTIAL',
        evidence: 'SOURCE-VERIFIED',
        phase: {
            label: 'FOUNDATION PHASE',
            compact: 'FOUNDATION',
        },
        now: null,
    },
    {
        id: 'fnode',
        index: '004',
        name: 'Foundry Node',
        short: 'FOUNDRY NODE',
        body: 'Heterogeneous physical computing nodes and their role in distributed software systems. Constrained hardware, hardware reuse, experimentation. Operations is secondary: constrained nodes imply lifecycle and availability without making this an operations project. No lifecycle state is declared.',
        disclosure: 'PARTIAL',
        evidence: 'OWNER-DECLARED',
        phase: null,
        now: null,
    },
] as const satisfies readonly SystemRecord[];

assertProvenanceIntegrity(systems, provenance);
