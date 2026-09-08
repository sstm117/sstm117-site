/**
 * LAB is deliberately lighter than WORK: fragments, probes and explorations,
 * without pretending they are products.
 *
 * A fragment carries a name, the question it probes and one honest line about
 * where it actually stands. No numbering, no phases, no maturity ontology, no
 * provenance apparatus, no Observer registration.
 */

export interface LabFragment {
    readonly anchor: string;
    readonly name: string;
    readonly probe: string;
    readonly state: string;
}

export const lab = [
    {
        anchor: 'sierra-monitor',
        name: 'Sierra Monitor',
        probe: 'A maintainer’s memory of a system decays faster than the system does. Does a pre-registered, structured review surface engineering state that an ordinary careful review does not?',
        state: 'A ratified contract and a frozen pre-registration. The experiment is designed and its criteria are fixed in advance, which is the point. No implementation.',
    },
    {
        anchor: 'epistemake',
        name: 'Epistemake',
        probe: 'If conclusions and decisions behave like build artifacts, can they be rebuilt incrementally when their inputs change — rebuilding only what a changed exported contract actually invalidates?',
        state: 'A falsifiable laboratory, not a product. The first experiment is fully specified, with its ground truth committed cryptographically before any run. Product code is deliberately absent.',
    },
    {
        anchor: 'foundry-lab',
        name: 'Foundry Lab',
        probe: 'What does one physical workspace need in order to serve electronics, embedded systems, instrumentation, mechanics and connected prototypes across several projects at once?',
        state: 'Named and scoped as a cross-cutting lab. Equipment and interfaces are being defined, and one software direction has been researched. Nothing is ratified and no source is published.',
    },
    {
        anchor: 'omnion',
        name: 'Omnion',
        probe: 'How do you preserve knowledge, and the means to rebuild a technical capability, in a form that survives the loss of the infrastructure it was written on?',
        state: 'A documentary base and one sourced technique sheet with a test protocol. No physical trial has been run. The name is provisional and does not gate the work.',
    },
    {
        anchor: 'personal-world-model',
        name: 'Personal World Model',
        probe: 'What would it take to preserve and represent a durable personal context — and is that one system or two?',
        state: 'Recorded as an incubation and deliberately deferred. No definition has been adopted. That is the honest current state, not an omission.',
    },
] as const satisfies readonly LabFragment[];

const ANCHOR_PATTERN = /^[a-z][a-z0-9-]*$/;
const seenAnchors = new Set<string>();

for (const fragment of lab) {
    if (!ANCHOR_PATTERN.test(fragment.anchor)) {
        throw new Error(`[lab] Invalid fragment anchor: ${fragment.anchor}`);
    }

    if (seenAnchors.has(fragment.anchor)) {
        throw new Error(`[lab] Duplicate fragment anchor: ${fragment.anchor}`);
    }

    seenAnchors.add(fragment.anchor);
}
