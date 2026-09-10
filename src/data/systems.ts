import { assertProvenanceIntegrity } from './provenance-integrity';
import { provenance } from './provenance';
import type { SystemRecord } from './types';

export const systems = [
    {
        id: 'obs',
        index: '001',
        name: 'AI Evolution Observatory',
        short: 'OBSERVATORY',
        body: 'A temporal, provenance-aware knowledge system for reconstructing and explaining the evolution of AI. At P0 — knowledge foundation only: epistemic, temporal and governance models settled before any application stack is called canonical.',
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
    {
        id: 'herve',
        index: '005',
        name: 'HERVÉ',
        short: 'HERVÉ',
        body: 'An offline-first operational platform documented and implemented around operator workflows, cycle counting, stock and replenishment, and operational dashboards. Its founding doctrine positions it as a bridge between central information systems and operational work. Deployment, scale and operational results are not claimed.',
        disclosure: 'PARTIAL',
        evidence: 'SOURCE-VERIFIED',
        phase: null,
        now: null,
    },
    {
        id: 'exomind',
        index: '006',
        name: 'EXOMIND',
        short: 'EXOMIND',
        body: "A research program for embodied AI: cognition, planning and skill arbitration above a robot's real-time control boundary. Its founding work defines the architecture, experiment gates and an evidence register before autonomy; generative output and remote agents are not permitted to drive the motors directly. Nothing has yet been operated, trained, measured or replicated.",
        disclosure: 'PARTIAL',
        evidence: 'SOURCE-VERIFIED',
        phase: null,
        now: null,
    },
] as const satisfies readonly SystemRecord[];

assertProvenanceIntegrity(systems, provenance);
