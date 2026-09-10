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
 * A system-backed entry carries no name, description, index, phase or evidence
 * of its own: those are read from systems.ts at render time so that exactly
 * one identity truth exists per system, independently of FIELD membership.
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

export type SystemWorkEntry = WorkEntryFields &
    TechDeclaration & {
        readonly kind: 'system';
        readonly system: SystemId;
    };

export type StandaloneWorkEntry = WorkEntryFields &
    TechDeclaration & {
        readonly kind: 'standalone';
        readonly name: string;
        readonly lede: string;
        readonly source: WorkSource;
    };

export type WorkEntry = SystemWorkEntry | StandaloneWorkEntry;

export const work = [
    {
        kind: 'system',
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
        kind: 'system',
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
        kind: 'system',
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
        kind: 'system',
        anchor: 'herve',
        system: 'herve',

        question:
            'Can a lightweight operational system become the missing layer between enterprise software and physical reality — without forcing operators to work for the software?',

        contribution:
            'Simon designed and built HERVÉ as an offline-first operational platform for the point where central information systems stop and physical work begins. It captures field reality, embeds operational rules into workflows and turns everyday activity into traceable data for operators and managers. The architecture is designed to complement an ERP, WMS or CMMS where one already exists, while remaining capable of operating tactically on its own within the domains it covers.',

        today: [
            'A working offline-first operational platform with implemented workflows spanning stock, cycle counting, replenishment, preparations and operational control.',
            'A local synchronization model with queued actions, replay, server-side idempotence and explicit handling of degraded network conditions.',
            'Operational and managerial surfaces built from the same underlying activity, including read-only multi-site views.',
            'Business rules, lifecycle guards, auditability and executable contracts around selected critical workflows, with CI used to protect selected semantics from regression.',
            'Bounded statistical forecasting paths exist inside the operational-intelligence layer; validated predictive performance is not claimed.',
        ],

        notYet: [
            'No claim of enterprise-wide deployment, cross-industry replication or measured business impact.',
            'Validated predictive performance, broad prescriptive automation and an operational digital twin are not claimed.',
            'The platform is not presented as a generic drop-in replacement for an ERP, WMS or CMMS.',
        ],

        constraint:
            'Complexity belongs in the system, not with the operator. Offline operation, explicit state transitions, traceability and the distinction between system truth and field truth are treated as correctness constraints rather than optional features.',

        unknowns: [
            'How far the architecture transfers beyond its originating operational context without losing the simplicity that makes it useful.',
            'Which combination of modules forms the smallest credible standalone operational system.',
        ],

        tech: [
            'PHP',
            'SQLite',
            'Vanilla JavaScript',
            'PWA / Service Worker',
        ],

        techBasis: 'BUILT',
    },
    {
        kind: 'system',
        anchor: 'exomind',
        system: 'exomind',

        question:
            'What does it actually take to put a reasoning system into a body — and how much of that can be established before touching the hardware?',

        contribution:
            'Simon produced a versioned founding technical atlas: a reconstruction of the platform and its sources, an embodied-AI architecture, staged experiment gates, a structured research programme, a skills-depth map, an evidence register and a register of open questions.',

        today: [
            'A versioned founding technical corpus with a checksum manifest, pinned code revisions where reproducible and dated consultation of mutable sources.',
            'An architecture decision: the real-time control layer remains the only writer to the motors, and EXOMIND sits above it as cognition, planning and skill arbitration.',
            'A structural prohibition — no generative model output, no remote agent and no experiment script may drive the motors directly.',
            'A structured programme of thirty planned physical experiments, alongside explicit evidence and unknown registers. Designed experiments are not reported as results.',
        ],

        notYet: [
            'Nothing has been operated, trained, measured or replicated. A manufacturer or maintainer measurement is not treated as an EXOMIND replication.',
            'No original robot, no custom electronics and no modification to the first body.',
        ],

        constraint:
            'The first body is treated as an instrument, not a project: freeze the baseline before changing anything, build observability before autonomy, and no drilling, no parallel power supply and no actuator replacement until that baseline is complete.',

        unknowns: [
            'The gap between simulation and reality, which is precisely what the experiment programme exists to measure.',
            'Which capabilities transfer from a documented body to an original one.',
        ],

        tech: [
            'MicroDuck (Pollen Robotics) — third-party robot platform',
            'MuJoCo simulation',
            'Reinforcement learning, ONNX policy export',
            'Python',
        ],

        techBasis: 'RESEARCHED',
    },    {
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
            'Simon built the site and its integrity machinery around a deliberate separation of identity, evidence and presentation. Provenance records attach to system identities independently of where those systems are shown; every plotted FIELD system must have one, while displaying an entry in WORK or LAB does not itself create that requirement. Build checks enforce the declared structure without pretending to verify every sentence on the site.',
        today: [
            'A static site that ships zero client-side JavaScript.',
            'Build-time validators: a system marked source-verified with no qualified source behind it fails the build, and relations, placements and identifiers are all checked before anything renders.',
            'A content-hash manifest over the resources registered with the Observer — the field, the front index and each plotted system — which detects when one of them changes. It is not a hash of every published page.',
            'A live production deployment at sstm117.com, with its canonical origin, social metadata, a sitemap and Cloudflare Workers Static Assets hosting.',
        ],
        notYet: [
            'No measurement of post-launch maintenance effort is documented in this repository.',
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

    if (entry.kind === 'system') {
        if (!systemIds.has(entry.system)) {
            fail(`Unknown work system: ${entry.system}`);
        }

        // The anchor is the canonical system id so that no second public
        // name for a plotted system can come into existence.
        if (entry.anchor !== entry.system) {
            fail(
                `System work anchor must equal its system id: ${entry.anchor} != ${entry.system}`,
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
