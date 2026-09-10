import { INDEX_CONTENT } from './index-content';

/**
 * ABOUT establishes the continuity behind the practice:
 *
 *     physical operations -> systems thinking -> software -> AI
 *
 * Professional grounding is stated as domains of experience, never as a career
 * chronology. No employer, client, role title, date, metric or operational
 * detail appears here.
 */

export interface AboutSection {
    readonly id: string;
    readonly heading: string;
    readonly paragraphs: readonly string[];
}

export interface PracticeApplication {
    readonly invariant: string;
    readonly application: string;
}

export const ABOUT_CONTENT = {
    masthead: {
        caption: `ABOUT · ${INDEX_CONTENT.closing.mark}`,
        title: 'About',
        lead: 'The work started in physical operations. The question it left behind is the one now put to software and to AI.',
    },

    sections: [
        {
            id: 'about-origin',
            heading: 'PHYSICAL ORIGIN',
            paragraphs: [
                'Simon Sainte Mareville is a supply chain engineer. The practice described on this site comes out of physical operations — supply chain, logistics and transport, industrial operations and production — and out of the engineering methods those settings use to make a system behave predictably enough to commit to.',
                'That kind of work has a particular texture. The constraints do not negotiate and they do not wait for a better model: material arrives or it does not, a machine runs or it does not, a commitment is met or it is missed, and the feedback is immediate and public. You learn early to separate the plan from the plant, and to treat the difference as information rather than as embarrassment.',
                'It also teaches where improvement actually comes from. Local optimisation is the standard trap. It is entirely possible to make every station measurably better and leave the system exactly as slow as it was, because what governs the whole is rarely what looks busiest.',
            ],
        },
        {
            id: 'about-question',
            heading: 'THE RECURRING QUESTION',
            paragraphs: [
                'The question that survives all of it is the one on the front page: how does this system actually behave? Not as specified, not as described in a meeting, not as it behaved the last time anyone looked closely. As it behaves now, under the load it is actually carrying.',
                'It is not a rhetorical question. It is answerable, partially, provided you are willing to say which part of the answer is measured, which part is only contracted, and which part you are still assuming.',
            ],
        },
        {
            id: 'about-extension',
            heading: 'EXTENSION',
            paragraphs: [
                'Software, AI, knowledge systems and physical computing are where that question is now put. This is not a change of identity but the same practice on a different substrate. A distributed system has a bottleneck. A model pipeline has a constraint that moves as soon as you relieve it. A knowledge base has a throughput and a defect rate, and both degrade quietly when nobody is measuring.',
                'What changes is the quality of the feedback. On a plant floor a bad assumption reveals itself, usually at the worst moment. In software, and far more so in AI, a bad assumption can survive indefinitely: it can be written down, cited, generated back to you in fluent prose, and never once be tested against the world. That is the reason the practice below is written down rather than assumed.',
            ],
        },
    ],

    practice: {
        id: 'about-practice',
        heading: 'PRACTICE',
        note: 'Four invariants. Each one is stated on the front page; each one is applied here, so that none of them can be read as a slogan.',
    },

    direction: {
        id: 'about-direction',
        heading: 'DIRECTION',
        paragraphs: [
            'The direction is narrow on purpose: systems whose behaviour can be stated, checked and revised. Knowledge that carries its own provenance. Decisions that can be rebuilt when their inputs change. Tools small enough to reason about completely. Computing that meets physical constraints rather than abstracting them away.',
            'Most of it is early, and it is labelled that way. Several of the projects listed under work are contracts without runtimes, and the pages say so before they say anything else. The claim being made here is about method, not about a finished portfolio.',
        ],
    },

    exit: {
        id: 'about-elsewhere',
        heading: 'ELSEWHERE',
        paragraphs: [
            'The public presence is GitHub. This site’s own repository is there — it is the one piece of engineering here that a stranger can open and check without asking anybody’s permission.',
        ],
    },
} as const;

export const PRACTICE_APPLICATIONS = [
    {
        invariant: 'EVIDENCE BEFORE ASSERTION',
        application:
            'Provenance records attach to system identities independently of where those systems are shown: what kind of source exists, how recently the relevant assertions were confronted with it, and which parts of a claim it actually covers. Every system plotted in the field must carry such a record, while WORK and LAB do not create that requirement merely by displaying an item. A system outside FIELD may therefore retain provenance. The build enforces this declared structure and the stronger source requirements of source-verified systems; it does not make every sentence on the site automatically verified.',
    },
    {
        invariant: 'UNKNOWN IS A VALID STATE',
        application:
            'No current position is inferred from repository activity. Where a position has not been explicitly declared, the site leaves it undeclared rather than treating recent work as evidence of one. Food OS is deliberately held at a stage where the first problem is still marked unknown; preserving that unknown is more useful than manufacturing a stronger claim.',
    },
    {
        invariant: 'AUTOMATION DOES NOT CREATE AUTHORITY',
        application:
            'The relations drawn in the field are declared, not computed. Nothing here infers a connection from shared vocabulary or surface similarity, and a missing edge means no declared responsibility rather than an oversight. The build hashes the resources registered with the Observer — the field, the front index and the plotted systems — and can tell you exactly that one of them changed; it cannot tell you the change was right.',
    },
    {
        invariant: 'CONSTRAINTS ARE PART OF CORRECTNESS',
        application:
            'Moka Companion’s contract forbids cloud service, model inference and runtime networking. Those are requirements, not a report on what the program currently happens to do. This site ships no client-side JavaScript — a constraint chosen before the design rather than a performance result announced after it.',
    },
] as const satisfies readonly PracticeApplication[];

const canonicalInvariants: readonly string[] = INDEX_CONTENT.invariants;

if (PRACTICE_APPLICATIONS.length !== canonicalInvariants.length) {
    throw new Error(
        '[about-content] Practice applications do not cover the canonical invariants.',
    );
}

PRACTICE_APPLICATIONS.forEach(({ invariant }, index) => {
    if (invariant !== canonicalInvariants[index]) {
        throw new Error(
            `[about-content] Practice application ${index} does not match the canonical invariant: ${invariant}`,
        );
    }
});
