import { SITE_REPOSITORY_LOCATOR, SITE_REPOSITORY_URL } from '../lib/public-links';
import { systems } from './systems';
import type { SystemId } from './types';

/**
 * WORK is the public corpus: what Simon chooses to represent publicly.
 *
 * THE FIELD is an editorial subset of it, selected to express the
 * "portfolio of relations" thesis. The dependency runs one way only:
 *
 *     WORK  --optional reference-->  FIELD
 *
 * A standalone entry requires no SystemId, no FIELD placement, no concern
 * relation, no Observer resource, no temporal anchor and no provenance
 * record. Adding one is a single record in this file.
 *
 * A field entry carries no name, description, index, phase or evidence of
 * its own: those are read from systems.ts at render time so that exactly one
 * truth exists per system.
 */

export interface PublicWorkSource {
    readonly public: true;
    readonly label: string;
    readonly href: string;
}

export interface PrivateWorkSource {
    readonly public: false;
    readonly note: string;
}

export type WorkSource = PublicWorkSource | PrivateWorkSource;

/**
 * What a technology list actually rests on.
 *
 * A bare list of technologies reads as a report on an implementation, and for
 * most of this corpus that would be false: the technologies are named in a
 * contract that has no code behind it, or they are the substrate a research
 * document studied. The site's own implementation/specification distinction
 * has to hold in this row too, so the basis is declared and the label is
 * derived from it.
 *
 *     BUILT      the implementation exists and runs on these.
 *     SPECIFIED  a normative contract selects these; nothing is implemented.
 *     RESEARCHED studied, reconstructed or targeted; neither selected as a
 *                commitment nor built.
 *
 * There is no fourth state, because nothing in the corpus needs one.
 */
export type TechBasis = 'BUILT' | 'SPECIFIED' | 'RESEARCHED';

interface DeclaredTech {
    /**
     * High-level technology identification only: language, major framework or
     * runtime, database, client type, third-party hardware platform. Never
     * internal topology, infrastructure, endpoints, configuration or detailed
     * architecture.
     */
    readonly tech: readonly [string, ...string[]];
    readonly techBasis: TechBasis;
}

interface NoTech {
    /** Empty where nothing has been selected, studied or built. */
    readonly tech: readonly [];
    readonly techBasis?: never;
}

/**
 * Paired at the type level: technology cannot be listed without declaring what
 * the list rests on, and a basis cannot be declared without a list.
 */
type TechDeclaration = DeclaredTech | NoTech;

interface WorkEntryFields {
    /** Stable public fragment: /work#<anchor>. */
    readonly anchor: string;
    /** The problem or question that motivates the work. */
    readonly question: string;
    /** What Simon has actually done. */
    readonly contribution: string;
    /** What exists today. */
    readonly today: readonly string[];
    /** What does not exist yet. Never left empty. */
    readonly notYet: readonly string[];
    /** The constraint or tension that shapes the work. */
    readonly constraint: string;
    /** What remains genuinely unknown. */
    readonly unknowns: readonly string[];
}

export type FieldWorkEntry = WorkEntryFields &
    TechDeclaration & {
        readonly kind: 'field';
        readonly system: SystemId;
    };

export type StandaloneWorkEntry = WorkEntryFields &
    TechDeclaration & {
        readonly kind: 'standalone';
        readonly name: string;
        readonly lede: string;
        readonly source: WorkSource;
    };

export type WorkEntry = FieldWorkEntry | StandaloneWorkEntry;

export const work = [
    {
        kind: 'field',
        anchor: 'obs',
        system: 'obs',
        question:
            'How do you say what was true about artificial intelligence at a given moment — and show what that claim rests on?',
        contribution:
            'Simon settled the epistemic, temporal and governance models before anything else: what may be asserted, how time is represented, what counts as evidence, and who is allowed to promote something to canonical.',
        today: [
            'A written constitution and an explicit scope boundary.',
            'Normative epistemic and provenance models, with conformance cases to test them against.',
            'A standing rule that generated output is never itself authoritative evidence.',
        ],
        notYet: [
            'No application stack, database, framework or ingestion pipeline is canonical.',
            'No graph, no timeline, no analysis and no reader-facing projection exists.',
        ],
        constraint:
            'Canon, knowledge graph, analysis, scenario and experience stay rigorously separated. A simulated or counterfactual state must never become readable as a claim about what actually happened.',
        unknowns: [
            'Which sources can sustain a time-aware, auditable record at any real scale.',
            'What the first application layer should be, and when it earns the right to exist.',
        ],
        tech: [],
    },
    {
        kind: 'field',
        anchor: 'food',
        system: 'food',
        question:
            'Which food problem actually deserves to be solved — before anyone decides how to solve it?',
        contribution:
            'Simon restarted the project as a discovery exercise and made the repository a record of reasoning: problems observed, hypotheses tested, evidence gathered, decisions made and assumptions rejected.',
        today: [
            'A written set of principles and a discovery increment in progress.',
            'An explicit rule that the existence of the repository does not authorise implementation.',
        ],
        notYet: [
            'First problem, first wedge and first product are all held at unknown.',
            'Stack, architecture and data model are unselected. Implementation is not authorised.',
            'AI is not a validated requirement for anything here.',
        ],
        constraint:
            'A systemic ambition is never sufficient justification for a feature, a data collection or an architecture. Impact does not imply ownership.',
        unknowns: [
            'Which recurring problem shows up in observable behaviour rather than in stated enthusiasm.',
        ],
        tech: [],
    },
    {
        kind: 'field',
        anchor: 'moka',
        system: 'moka',
        question:
            'How small can a desktop presence be and still be worth having — with no cloud, no model and no network?',
        contribution:
            'Simon wrote the contracts before the code: the sprite asset and its provenance, the runtime design, a privacy boundary written to be mechanically checkable, and a resource budget with hard gates and a measurement protocol.',
        today: [
            'Normative contracts for the asset, the architecture, privacy, provenance and the resource budget.',
            'The sprite asset itself, with its origin and integrity recorded.',
        ],
        notYet: [
            'Implementation has not begun. There is no source, no build and no running program.',
            'Distribution rights for the asset are unresolved.',
        ],
        constraint:
            'The v0.1 contract forbids cloud service, model inference and runtime networking, and forbids observing what you type in other applications. When there is nothing to do, the program does no work: no render loop, no polling, no repeating timer.',
        unknowns: [
            'Whether the resource budget survives contact with a real implementation.',
        ],
        tech: ['Rust', 'Win32', 'Windows 11 x64'],
        techBasis: 'SPECIFIED',
    },
    {
        kind: 'field',
        anchor: 'fnode',
        system: 'fnode',
        question:
            'What can heterogeneous, constrained and reused hardware actually do inside a distributed software system?',
        contribution:
            'Simon declared the research direction and its boundary: constrained nodes imply lifecycle and availability concerns without turning this into an operations project.',
        today: [
            'A declared research direction. The repository is a single paragraph, and that is the honest extent of it.',
        ],
        notYet: [
            'No node is characterised, no capability is demonstrated and no lifecycle state is declared.',
        ],
        constraint:
            'Capability has to be verified before a role is chosen. The first useful step is small, reversible and discriminating rather than ambitious.',
        unknowns: [
            'Networking, storage, headless operation and useful workload are all open questions.',
        ],
        tech: [],
    },
    {
        kind: 'standalone',
        anchor: 'world-press-lens',
        name: 'World Press Lens',
        lede: 'An observatory of global media framing: which topics dominate the world press, how the same story is framed across countries and languages, and which important stories a national press is barely covering.',
        question:
            'Can you make media framing visible — and stay honest about how weak the evidence behind such a comparison really is?',
        contribution:
            'Simon built the pipeline end to end and documented its limits as carefully as its features: fictional seed data labelled fictional, heuristics labelled heuristics, editorial labels labelled unverified, and legal review named as a precondition for production rather than a formality.',
        today: [
            'A working pipeline: ingest, deduplicate, cluster into topics, score, compute blind spots, serve read APIs.',
            'A mobile client with signals, topic detail, search, blind spots, statistics and settings.',
            'A backend test suite covering deduplication, clustering, scoring, blind spots, search, statistics and seeding.',
        ],
        notYet: [
            'It runs on fictional seed data. A live provider exists but is experimental, and both its field semantics and its terms of use are unverified.',
            'No licence decision, no continuous integration, no authentication, no rate limiting.',
            'Not legally cleared: press and database rights, attribution and takedown processes are unreviewed.',
        ],
        constraint:
            'The clustering is lexical and the scores are heuristics. This must not be described as authoritative, globally representative or production-ready — and its own documentation says so before anyone else can.',
        unknowns: [
            'Whether lexical clustering survives real multilingual volume.',
            'What licensing actually permits at the metadata level, jurisdiction by jurisdiction.',
        ],
        tech: [
            'Python',
            'FastAPI',
            'PostgreSQL',
            'React Native / Expo client',
            'pytest',
        ],
        techBasis: 'BUILT',
        source: {
            public: false,
            note: 'Source not public.',
        },
    },
    {
        kind: 'standalone',
        anchor: 'factory-pulse',
        name: 'FactoryPulse',
        lede: 'A playable simulation of a small factory, built to teach how an industrial system actually behaves under decisions. Drawn from CPIM, Lean and the Theory of Constraints.',
        question:
            'Why does improving one part of a production system so reliably make the whole system worse?',
        contribution:
            'Simon built the simulation, the decision set and the explanation layer. Every action states what it improves, what it degrades, which concept it illustrates and what to watch afterwards.',
        today: [
            'A running hourly simulation of material, cutting, assembly, quality control, finished stock and customer, with buffers, work in progress, wear, breakdowns, defects and variable demand.',
            'Around twenty decisions with real effects, and a bottleneck that moves when you lift it.',
            'Operational indicators — service level, throughput, work in progress, lead time, equipment effectiveness, defect rate — plus hidden system variables surfaced through a diagnostic.',
            'Five scenarios and a structured debrief. No installation, no dependencies, no server, and nothing leaves the machine.',
        ],
        notYet: [
            'The economic model is simplified and balanced by hand, not calibrated against a real plant.',
            'Flow is modelled in quantities rather than individually traced units.',
            'No advanced planning, no multi-product routing, no explicit changeovers.',
        ],
        constraint:
            'It has to stay simple to understand and hard to master. Every decision improves one indicator and usually degrades another — that tension is the teaching, not a defect to be balanced away.',
        unknowns: [
            'Whether the balance holds up against people who play it seriously rather than politely.',
        ],
        tech: ['HTML', 'CSS', 'JavaScript', 'Runs offline in a browser'],
        techBasis: 'BUILT',
        source: {
            public: false,
            note: 'Source not public.',
        },
    },
    {
        kind: 'standalone',
        anchor: 'exomind',
        name: 'EXOMIND',
        lede: 'A research program for embodied AI: a cognition and planning layer above a robot’s real-time control boundary, using one thoroughly documented body to learn the whole discipline — source, model, build, control, measurement, learning, deployment and recovery.',
        question:
            'What does it actually take to put a reasoning system into a body — and how much of that can be established before touching the hardware?',
        contribution:
            'Simon produced the founding technical atlas: a reconstruction of the platform pinned to specific published revisions, an architecture decision, a staged gate structure, a structured experiment program, a skills-depth map, an evidence register and a register of open questions.',
        today: [
            'A thirteen-document founding corpus, with every moving source pinned to a revision and a consultation date.',
            'An architecture decision: the real-time control layer remains the only writer to the motors, and EXOMIND sits above it as cognition, planning and skill arbitration.',
            'A structural prohibition — no generative model output, no remote agent and no experiment script may drive the motors directly.',
            'Twenty recorded facts, twenty recorded unknowns and twenty designed experiments, each labelled by how strongly it is actually supported.',
        ],
        notYet: [
            'Nothing has been operated, trained, measured or replicated. The atlas states plainly that a manufacturer’s measurement is not a replication.',
            'No original robot, no custom electronics and no modification to the first body.',
        ],
        constraint:
            'The first body is treated as an instrument, not a project: freeze the baseline before changing anything, build observability before autonomy, and no drilling, no parallel power supply and no actuator replacement until that baseline is complete.',
        unknowns: [
            'The gap between simulation and reality, which is precisely what the experiment program exists to measure.',
            'Which capabilities transfer from a documented body to an original one.',
        ],
        tech: [
            'MicroDuck (Pollen Robotics) — third-party robot platform',
            'MuJoCo simulation',
            'Reinforcement learning, ONNX policy export',
            'Python',
        ],
        techBasis: 'RESEARCHED',
        source: {
            public: false,
            note: 'Not published.',
        },
    },
    {
        kind: 'standalone',
        anchor: 'project-trail',
        name: 'ProjectTrail',
        lede: 'A local-first, content-blind temporal memory for people working across several projects at once. The time is already there; you decide what it meant.',
        question:
            'Can a tool remember when you worked without ever inspecting what you were working on?',
        contribution:
            'Simon wrote the product constitution first, including an explicit anti-product document: the scope exclusions and anti-drift rules that stop it becoming a productivity judge, a task manager or a monitoring system.',
        today: [
            'A frozen product constitution with normative invariants and change-control boundaries.',
            'A product thesis with a stated falsification target, a privacy model and an explicit anti-product scope.',
        ],
        notYet: [
            'No product runtime exists. Nothing captures, stores or displays anything yet.',
        ],
        constraint:
            'Zero passive capture of work content. Automation is not truth, observation is not interpretation, and the user keeps real deletion authority over their own record.',
        unknowns: [
            'Whether retrospective attribution stays cheap enough that a person actually does it.',
        ],
        tech: ['Windows first', 'Local-first — no account, no backend'],
        techBasis: 'SPECIFIED',
        source: {
            public: false,
            note: 'Source not public.',
        },
    },
    {
        kind: 'standalone',
        anchor: 'site',
        name: 'Personal Site',
        lede: 'This site. A static instrument for representing a practice, built so that a stranger can inspect the engineering instead of taking the claims on trust.',
        question:
            'Can a personal site be held to the same evidence standard as the systems it describes?',
        contribution:
            'Simon built the site and its integrity machinery, and drew the line where that machinery stops: each system plotted in the field carries a source record and is checked at build time, while the standalone entries, the fragments and the notes carry no such record and are held to the same standard editorially.',
        today: [
            'A static site that ships zero client-side JavaScript.',
            'Build-time validators: a system marked source-verified with no qualified source behind it fails the build, and relations, placements and identifiers are all checked before anything renders.',
            'A content-hash manifest over the resources registered with the Observer — the field, the front index and each plotted system — which detects when one of them changes. It is not a hash of every published page.',
        ],
        notYet: [
            'Not deployed. There is no production origin, no social metadata, no sitemap and no hosting configuration.',
        ],
        constraint:
            'No client-side JavaScript. Interaction has to be expressible in links and CSS, or it does not ship.',
        unknowns: [
            'Whether a site this restrained reads as rigorous or as reticent. That is a question about readers, and it has not been tested.',
        ],
        tech: ['Astro', 'TypeScript'],
        techBasis: 'BUILT',
        source: {
            public: true,
            label: SITE_REPOSITORY_LOCATOR,
            href: SITE_REPOSITORY_URL,
        },
    },
] as const satisfies readonly WorkEntry[];

const ANCHOR_PATTERN = /^[a-z][a-z0-9-]*$/;
const TECH_BASES: readonly TechBasis[] = ['BUILT', 'SPECIFIED', 'RESEARCHED'];

function fail(message: string): never {
    throw new Error(`[work] ${message}`);
}

const seenAnchors = new Set<string>();
const systemIds = new Set<string>(systems.map(({ id }) => id));
const referencedSystems = new Set<string>();

/**
 * Widened deliberately: the literal types of the corpus above would make these
 * guards statically redundant, and they exist to catch a future edit.
 */
const entries: readonly WorkEntry[] = work;

for (const entry of entries) {
    if (!ANCHOR_PATTERN.test(entry.anchor)) {
        fail(`Invalid work anchor: ${entry.anchor}`);
    }

    if (seenAnchors.has(entry.anchor)) {
        fail(`Duplicate work anchor: ${entry.anchor}`);
    }
    seenAnchors.add(entry.anchor);

    if (entry.notYet.length === 0) {
        fail(`Work entry declares nothing absent: ${entry.anchor}`);
    }

    if (entry.today.length === 0) {
        fail(`Work entry declares nothing present: ${entry.anchor}`);
    }

    // A technology list must never be rendered without the basis that decides
    // how it is labelled. The type already pairs them; this catches a widened
    // or generated entry that slips past it.
    if (entry.tech.length === 0) {
        if (entry.techBasis !== undefined) {
            fail(
                `Work entry declares a technology basis with no technology: ${entry.anchor}`,
            );
        }
    } else if (
        entry.techBasis === undefined ||
        !TECH_BASES.includes(entry.techBasis)
    ) {
        fail(
            `Work entry lists technology without a declared basis: ${entry.anchor}`,
        );
    }

    if (entry.kind === 'field') {
        if (!systemIds.has(entry.system)) {
            fail(`Unknown work system: ${entry.system}`);
        }

        // The anchor is the canonical system id so that no second public
        // name for a plotted system can come into existence.
        if (entry.anchor !== entry.system) {
            fail(
                `Field work anchor must equal its system id: ${entry.anchor} != ${entry.system}`,
            );
        }

        if (referencedSystems.has(entry.system)) {
            fail(`Duplicate work entry for system: ${entry.system}`);
        }
        referencedSystems.add(entry.system);

        continue;
    }

    if (entry.source.public && !entry.source.href.startsWith('https://')) {
        fail(`Public work source must be an absolute https URL: ${entry.anchor}`);
    }
}
