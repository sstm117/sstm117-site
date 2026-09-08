import { isValidIsoDate } from './provenance-integrity';

/**
 * The minimum credible writing surface: a title, a date and a readable body.
 *
 * No CMS, no tags, no categories, no archive machinery, no feed and no search.
 * A note is paragraphs of prose and nothing else.
 */

export interface Note {
    readonly slug: string;
    readonly title: string;
    readonly date: string;
    readonly standfirst: string;
    readonly body: readonly string[];
}

export const notes = [
    {
        slug: 'how-does-this-system-actually-behave',
        title: 'How does this system actually behave?',
        date: '2026-09-08',
        standfirst:
            'The question that came out of physical operations, and what happens when you put it to software and to AI.',
        body: [
            'In physical operations the question arrives without warning. A line is late. The schedule said it would not be. Somebody adds capacity to the machine that looks busiest, and the delay does not go away — it reappears somewhere else the following week. The plan was not wrong about the machine. It was wrong about the system.',
            'What is left afterwards is a question that has followed me into every other kind of work: how does this system actually behave? Not how it was specified. Not how it is described in a meeting. Not how it behaved the last time anyone looked closely. How it behaves now, under the load it is actually carrying.',
            'Operations teaches this the hard way, because the feedback is physical and it does not negotiate. Improving a station that is not the constraint does not increase throughput. Lift the constraint and it moves somewhere else. Running near full utilisation buys output and pays for it in fragility. Work in progress does not solve problems, it gives them somewhere to wait. None of that is an opinion. It is what the system does, whether or not the model says so.',
            'I now put the same question to software and to AI, and I have found that it does not get harder — it gets easier to avoid. A repository exists, so the thing must exist. A specification is written, so the behaviour must be guaranteed. A roadmap names a capability, so the capability must be coming. A model produced a confident paragraph, so the paragraph must be grounded. Each of those is the same move: evidence quietly replaced by the appearance of evidence.',
            'So I try to keep some distinctions alive that are easy to let collapse. Something can be implemented, or demonstrated, or specified, or investigated, or merely declared, or genuinely unknown. Those are six different states and they are not interchangeable. A normative document is real evidence — of a contract. It is not evidence that the contracted behaviour exists. A merged change proves integration. It does not prove runtime behaviour.',
            'The state people find hardest is unknown. Most of the failures I have watched did not begin with someone being wrong. They began with someone having to put a value in a field that had no honest answer available, because "unknown" was not one of the options. A system that cannot represent its own ignorance will be filled with something worse than ignorance: a confident placeholder that nobody remembers inserting.',
            'The corollary is that automation does not create authority. A build can hash a document and tell me, exactly and reliably, that it changed. It cannot tell me the change was correct. A pipeline can compute a similarity score between two projects. It cannot decide that the two are related in any sense I would be willing to defend. A model can generate a plausible account of a system it has never observed. None of these events promote anything to true. Somebody still has to look, and be accountable for having looked.',
            'And constraints are not the opposite of correctness, they are part of it. A companion program that must never open a network connection. A simulation that has to run offline, from a single file, with nothing leaving the machine. A site that ships no client-side JavaScript. These are not results reported after the fact to make a design sound disciplined. They are requirements chosen before the design, and they are the reason the design can be checked at all. A constraint you adopt afterwards is a description. A constraint you adopt beforehand is a test.',
            'The honest answer to "how does this system actually behave" is usually partial. Some of it is measured, some of it is contracted, some of it is assumed, and a fair amount is simply not known yet. The discipline is not to have the whole answer. It is to know precisely which part you have, what it rests on, and where you are still guessing — and to keep those three visible to anyone who has to rely on the result.',
        ],
    },
] as const satisfies readonly Note[];

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/;
const seenSlugs = new Set<string>();

/**
 * Widened deliberately: the literal types of the corpus above would make these
 * guards statically redundant, and they exist to catch a future edit.
 */
const noteRecords: readonly Note[] = notes;

for (const note of noteRecords) {
    if (!SLUG_PATTERN.test(note.slug)) {
        throw new Error(`[notes] Invalid note slug: ${note.slug}`);
    }

    if (seenSlugs.has(note.slug)) {
        throw new Error(`[notes] Duplicate note slug: ${note.slug}`);
    }
    seenSlugs.add(note.slug);

    if (!isValidIsoDate(note.date)) {
        throw new Error(`[notes] Invalid note date: ${note.slug}`);
    }

    if (note.body.length === 0) {
        throw new Error(`[notes] Note has no body: ${note.slug}`);
    }
}
