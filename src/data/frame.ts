import {
    SITE_REPOSITORY_LOCATOR,
    SITE_REPOSITORY_URL,
} from '../lib/public-links';
import { lab } from './lab';
import { notes } from './notes';
import { systems } from './systems';
import type { SourceSupport } from './types';
import { work } from './work';

/**
 * FRAME represents how the practice reasons when legitimate pressures conflict.
 *
 * It is deliberately independent of FIELD:
 *
 *     FIELD  = systems selected for the current editorial field
 *     FRAME  = owner-declared positions across recurring engineering tensions
 *
 * The wording of each declaration is owner-ratified.
 * Marker placement and anchor selection are design interpretations.
 *
 * Professional practice is a basis, never an evidence grade.
 * Public support is separate from related public work.
 */

export type FrameAxisId =
    | '01'
    | '02'
    | '03'
    | '04'
    | '05'
    | '06'
    | '07';

export type FrameBandId =
    | 'MATERIAL'
    | 'SYSTEM'
    | 'DECISION';

export type FrameBasis =
    | 'PROFESSIONAL PRACTICE'
    | 'ENGINEERING REASONING';

export type FrameStep = 1 | 2 | 3 | 4 | 5;

/**
 * FRAME hrefs deliberately widen to string at the type boundary because
 * canonical URLs imported from public-links.ts are runtime-composed strings.
 *
 * validHref() below remains the authority that restricts corpus hrefs to
 * root-relative paths or absolute HTTPS URLs.
 */
export type FrameHref = string;

export type FrameMarker =
    | {
          readonly kind: 'POINT';
          readonly step: FrameStep;
      }
    | {
          readonly kind: 'SPAN';
          readonly from: FrameStep;
          readonly to: FrameStep;
      };

export interface FrameDeclaration {
    readonly question: string;
    readonly poles: readonly [left: string, right: string];
    readonly wording: string;
    readonly statement: readonly [string, ...string[]];
    readonly movesWhen: string;
}

export interface FramePublicSupport {
    /**
     * Reuses the existing source-support vocabulary.
     *
     * This says what the linked public artifact actually supports.
     * It is not a maturity state and not a proficiency rating.
     */
    readonly support: SourceSupport;
    readonly href: FrameHref;
    readonly label: string;
    readonly qualifier?: string;
    readonly limit: string;
}

export interface FrameRelatedAnchor {
    /**
     * Public material related to the position but insufficient to prove it.
     */
    readonly href: FrameHref;
    readonly label: string;
    readonly limit: string;
}

export interface FrameAxis {
    readonly id: FrameAxisId;
    readonly band: FrameBandId;

    /** Owner-ratified R1 declaration. */
    readonly declaration: FrameDeclaration;

    /**
     * Designer-selected interpretation of the declaration on the five-step
     * lattice. It is never presented as an owner-measured coordinate.
     */
    readonly marker: FrameMarker;

    /**
     * What the position is reasoned from.
     * Basis is independent of public verifiability.
     */
    readonly basis: readonly [FrameBasis, ...FrameBasis[]];

    /**
     * Null means no public artifact currently supports the position strongly
     * enough to be presented as evidence.
     *
     * Null is absence of public support, not an evidence state named "NONE".
     */
    readonly publicSupport: FramePublicSupport | null;

    /**
     * Public work that helps a reader understand the position while carrying
     * an explicit limit on what it establishes.
     */
    readonly relatedAnchors: readonly FrameRelatedAnchor[];
}

export interface FrameBand {
    readonly id: FrameBandId;
    readonly description: string;
}

export const FRAME_CONTENT = {
    title: 'Frame',
    lead:
        'Seven trade-offs the work keeps returning to, and the position taken on each.',
    opening:
        'Both ends of every axis represent legitimate engineering objectives, decision pressures or evidence lenses. Neither end is inherently better. A marker is not a score: it represents an owner-ratified declaration on a designer-selected five-step lattice. Where that declaration depends on a condition, the condition is named and the marker is drawn as a span rather than a point.',
    readingContract: [
        'These are my current positions. They are not skill ratings and they are not universal rules. They describe how I presently reason when these pressures conflict. A position may move when the evidence or the constraints change.',
        'BASIS names where the reasoning comes from — professional practice, engineering reasoning, or both. These are kinds of grounding, not evidence grades, ranks or counts of strength.',
        'PUBLIC SUPPORT records whether and how a qualifying public artifact supports a narrow claim. ASSERTS, SPECIFIES and DEMONSTRATES describe the relation to that claim, not strength, maturity or proficiency. Its absence records a limit of public verifiability, not a weakness in the position, the reasoning behind it or the professional practice it may draw from.',
        'RELATED MATERIAL points to public work that helps explain a position. It does not support the position by itself. Each entry states the limit of what it establishes.',
        'Declaration wording is owner-ratified. Lattice placement and anchor selection are design interpretations, not additional owner claims.',
    ],
} as const;

export const FRAME_BANDS = [
    {
        id: 'MATERIAL',
        description:
            'Grounds the practice in physical supply conditions: what is held, and what the supply of it actually does rather than what it promises.',
    },
    {
        id: 'SYSTEM',
        description:
            'Captures behaviour, resilience, optimisation and supportability — how the whole thing performs, survives and stays maintainable over time.',
    },
    {
        id: 'DECISION',
        description:
            'Captures modelling, uncertainty, automation and authority: what a model is allowed to be, and who remains accountable for the decision it informs.',
    },
] as const satisfies readonly FrameBand[];

export const FRAME_AXES = [
    {
        id: '01',
        band: 'MATERIAL',
        declaration: {
            question: 'What deserves stock?',
            poles: ['CONSUMPTION', 'CONSEQUENCE'],
            wording: 'Toward consequence, conditionally.',
            statement: [
                'I do not decide that an item deserves stock from consumption history alone. I start with the consequence of its absence, then test that need against demand, lead time, substitutability, repairability and the credible ways of recovering availability.',
                'A rarely consumed part can therefore deserve stronger protection than a frequently consumed one.',
            ],
            movesWhen:
                'The consequence of absence changes, a substitute becomes genuinely reliable, replenishment becomes sufficiently dependable, or another recovery mechanism can provide the same protection with less committed stock.',
        },
        marker: {
            kind: 'SPAN',
            from: 4,
            to: 5,
        },
        basis: ['PROFESSIONAL PRACTICE'],
        publicSupport: null,
        relatedAnchors: [
            {
                href: '/work#herve',
                label: '005 HERVÉ',
                limit:
                    'HERVÉ implements cycle counting, stock and replenishment. It does not establish this stock policy.',
            },
        ],
    },
    {
        id: '02',
        band: 'MATERIAL',
        declaration: {
            question: 'Which lead time do you plan against?',
            poles: ['NOMINAL', 'OBSERVED'],
            wording: 'Toward observed.',
            statement: [
                'A contractual or quoted lead time is a useful commitment, but it is not enough to describe operational exposure.',
                'For planning, I trust the observed distribution of actual lead times more than a nominal number. The difference between the two is information, not noise.',
            ],
            movesWhen:
                'Observed performance becomes sufficiently stable and aligned with the contracted commitment that the nominal value becomes a credible description of the distribution rather than only a promise.',
        },
        marker: {
            kind: 'POINT',
            step: 4,
        },
        basis: ['PROFESSIONAL PRACTICE'],
        publicSupport: null,
        relatedAnchors: [],
    },
    {
        id: '03',
        band: 'SYSTEM',
        declaration: {
            question: 'What should the system be able to survive?',
            poles: ['EFFICIENCY', 'RESILIENCE'],
            wording: 'Slightly toward resilience, conditionally.',
            statement: [
                'I do not treat unused capacity, redundancy or protection as waste by default. Efficiency is valuable until the system becomes unable to absorb ordinary variability or recover from a credible disturbance.',
                'The relevant question is not whether slack exists, but whether the cost of that slack is lower than the exposure it absorbs.',
            ],
            movesWhen:
                'The cost of protection is demonstrated to exceed the expected cost and consequence of disruption, and recovery remains sufficiently fast and predictable without it.',
        },
        marker: {
            kind: 'SPAN',
            from: 3,
            to: 4,
        },
        basis: [
            'PROFESSIONAL PRACTICE',
            'ENGINEERING REASONING',
        ],
        publicSupport: null,
        relatedAnchors: [
            {
                href: '/work#factory-pulse',
                label: 'FACTORYPULSE',
                limit:
                    'The public WORK entry describes an authored teaching simulation and its resilience trade-offs. Its source is not public, the model is not calibrated against a real plant, and its behaviour is not an independent result supporting this position.',
            },
        ],
    },
    {
        id: '04',
        band: 'SYSTEM',
        declaration: {
            question: 'Where is the real constraint?',
            poles: [
                'LOCAL PERFORMANCE',
                'SYSTEM PERFORMANCE',
            ],
            wording: 'Strongly toward system performance.',
            statement: [
                'A local improvement is provisional until its effect is visible at system level.',
                'Increasing the performance of one station, team, stock point or algorithm does not establish improvement if the constraint simply moves, another part of the system absorbs the cost, or the final service does not improve.',
            ],
            movesWhen:
                'The position moves toward local performance when a local requirement is independently binding — for safety, quality, compliance or service — or when repeated evidence shows that local performance is a reliable proxy for system performance without displacing the constraint or transferring unacceptable cost or risk elsewhere.',
        },
        marker: {
            kind: 'POINT',
            step: 5,
        },
        basis: [
            'PROFESSIONAL PRACTICE',
            'ENGINEERING REASONING',
        ],
        publicSupport: null,
        relatedAnchors: [
            {
                href: '/work#factory-pulse',
                label: 'FACTORYPULSE',
                limit:
                    'The public WORK entry describes an authored teaching simulation in which a bottleneck moves when it is lifted. Its underlying source is not public; that behaviour illustrates the principle but is not an independent result or field measurement.',
            },
            {
                href: '/notes#how-does-this-system-actually-behave',
                label: 'HOW DOES THIS SYSTEM ACTUALLY BEHAVE?',
                limit:
                    'The note argues the same systems principle. It is an authored argument, not an operational measurement.',
            },
        ],
    },
    {
        id: '05',
        band: 'DECISION',
        declaration: {
            question: 'What happens when the model is wrong?',
            poles: ['PREDICTION', 'UNCERTAINTY'],
            wording: 'Toward uncertainty.',
            statement: [
                'A forecast, model or scenario is an input to a decision, not a record of the world.',
                'I would rather preserve visible uncertainty than replace it with false precision. Prediction becomes useful when its error is measured, its limits travel with the result and it performs better than a simpler baseline.',
            ],
            movesWhen:
                'Repeated backtesting establishes stable and relevant error bounds and the model demonstrably improves the decision it supports. Even then, predicted and observed states remain different things.',
        },
        marker: {
            kind: 'POINT',
            step: 4,
        },
        basis: ['ENGINEERING REASONING'],
        publicSupport: null,
        relatedAnchors: [
            {
                href: '/work#obs',
                label: '001 AI EVOLUTION OBSERVATORY',
                limit:
                    'The project defines an explicit separation between assertions, evidence and epistemic state in its normative corpus. It does not evidence deployed demand planning, backtesting or a supply-chain forecasting method.',
            },
            {
                href: '/work#world-press-lens',
                label: 'WORLD PRESS LENS',
                limit:
                    'The project keeps heuristics labelled as heuristics. It does not evidence deployed demand planning, backtesting or a supply-chain forecasting method.',
            },
        ],
    },
    {
        id: '06',
        band: 'DECISION',
        declaration: {
            question: 'When does automation exceed its authority?',
            poles: ['AUTOMATION', 'HUMAN AUTHORITY'],
            wording: 'Toward human authority.',
            statement: [
                'I want automation to detect, calculate, compare, simulate and propose as far as those functions can be made reliable.',
                'It must not silently acquire authority merely because it became technically capable of producing an answer.',
                'The more consequential or irreversible the decision, the stronger the need for explicit authority, traceability and the ability to intervene.',
            ],
            movesWhen:
                'An automated decision is bounded, attributable, auditable, reversible where necessary, and demonstrably more reliable than the process it replaces. What may move is the boundary of delegated authority; authority itself must never become implicit.',
        },
        marker: {
            kind: 'SPAN',
            from: 4,
            to: 5,
        },
        basis: ['ENGINEERING REASONING'],
        publicSupport: {
            support: 'DEMONSTRATES',
            href: SITE_REPOSITORY_URL,
            label: SITE_REPOSITORY_LOCATOR,
            qualifier: 'THIS SITE',
            limit:
                'The public repository implements machinery that can detect a registered resource change while leaving correctness and authority outside that mechanism. It does not establish the reliability of automated decisions in general.',
        },
        relatedAnchors: [
            {
                href: '/work#exomind',
                label: '006 EXOMIND',
                limit:
                    'EXOMIND specifies that generative output and remote agents may not directly drive the motors. That boundary is designed, not yet physically demonstrated.',
            },
            {
                href: '/work#project-trail',
                label: 'PROJECTTRAIL',
                limit:
                    'ProjectTrail specifies that automation is not truth and observation is not interpretation. No runtime exists.',
            },
        ],
    },
    {
        id: '07',
        band: 'SYSTEM',
        declaration: {
            question: 'What should remain repairable?',
            poles: ['STANDARDISED', 'REPAIRABLE'],
            wording:
                'Conditional, with a bias toward preserving repairability.',
            statement: [
                'Standardisation is valuable when it makes a system easier to operate, support and reproduce.',
                'I resist it when the price is dependence on a component, supplier or knowledge base that cannot be inspected, substituted, repaired or reconstructed.',
                'The goal is not to reject standards. It is to avoid confusing standardisation with irreversible dependency.',
            ],
            movesWhen:
                'The standardised solution provides durable support, documented interfaces, qualified alternatives and a credible exit or repair path.',
        },
        marker: {
            kind: 'SPAN',
            from: 3,
            to: 4,
        },
        basis: ['ENGINEERING REASONING'],
        publicSupport: null,
        relatedAnchors: [
            {
                href: '/lab#fnode',
                label: '004 FOUNDRY NODE',
                limit:
                    'Foundry Node is a declared hardware-reuse research direction, not a demonstrated repairability programme.',
            },
            {
                href: '/lab#omnion',
                label: 'OMNION',
                limit:
                    'Omnion contains a documentary base and one sourced technique sheet with a test protocol. No physical trial has been run.',
            },
        ],
    },
] as const satisfies readonly FrameAxis[];

export const FRAME_RENDERED_AXES = FRAME_BANDS.flatMap((band) =>
    FRAME_AXES.filter((axis) => axis.band === band.id),
) satisfies readonly FrameAxis[];

// -----------------------------------------------------------------------------
// Runtime integrity
// -----------------------------------------------------------------------------

const EXPECTED_BANDS: readonly FrameBandId[] = [
    'MATERIAL',
    'SYSTEM',
    'DECISION',
];

const EXPECTED_RENDERED_AXIS_ORDER: readonly FrameAxisId[] = [
    '01',
    '02',
    '03',
    '04',
    '07',
    '05',
    '06',
];

const EXPECTED_AXES = {
    '01': {
        band: 'MATERIAL',
        poles: ['CONSUMPTION', 'CONSEQUENCE'],
        marker: 'SPAN:4:5',
    },
    '02': {
        band: 'MATERIAL',
        poles: ['NOMINAL', 'OBSERVED'],
        marker: 'POINT:4',
    },
    '03': {
        band: 'SYSTEM',
        poles: ['EFFICIENCY', 'RESILIENCE'],
        marker: 'SPAN:3:4',
    },
    '04': {
        band: 'SYSTEM',
        poles: ['LOCAL PERFORMANCE', 'SYSTEM PERFORMANCE'],
        marker: 'POINT:5',
    },
    '05': {
        band: 'DECISION',
        poles: ['PREDICTION', 'UNCERTAINTY'],
        marker: 'POINT:4',
    },
    '06': {
        band: 'DECISION',
        poles: ['AUTOMATION', 'HUMAN AUTHORITY'],
        marker: 'SPAN:4:5',
    },
    '07': {
        band: 'SYSTEM',
        poles: ['STANDARDISED', 'REPAIRABLE'],
        marker: 'SPAN:3:4',
    },
} as const;

const BASIS_VALUES: readonly FrameBasis[] = [
    'PROFESSIONAL PRACTICE',
    'ENGINEERING REASONING',
];

const SOURCE_SUPPORT_VALUES: readonly SourceSupport[] = [
    'ASSERTS',
    'SPECIFIES',
    'DEMONSTRATES',
];

const RELATED_INTERNAL_TARGETS = new Set<string>([
    ...work.map(({ anchor }) => `/work#${anchor}`),
    ...lab.map(({ anchor }) => `/lab#${anchor}`),
    ...notes.map(({ slug }) => `/notes#${slug}`),
]);

function fail(message: string): never {
    throw new Error(`[frame] ${message}`);
}

function canonicalRelatedLabel(href: string): string | null {
    const separatorIndex = href.indexOf('#');

    if (separatorIndex < 0) {
        return null;
    }

    const path = href.slice(0, separatorIndex);
    const fragment = href.slice(separatorIndex + 1);

    if (path === '/work') {
        const entry = work.find(({ anchor }) => anchor === fragment);

        if (!entry) {
            return null;
        }

        if (entry.kind === 'standalone') {
            return entry.name.toUpperCase();
        }

        const system = systems.find(({ id }) => id === entry.system);

        return system
            ? `${system.index} ${system.name}`.toUpperCase()
            : null;
    }

    if (path === '/lab') {
        const fragmentRecord = lab.find(({ anchor }) => anchor === fragment);

        if (!fragmentRecord) {
            return null;
        }

        if (fragmentRecord.kind === 'standalone') {
            return fragmentRecord.name.toUpperCase();
        }

        const system = systems.find(({ id }) => id === fragmentRecord.system);

        return system
            ? `${system.index} ${system.name}`.toUpperCase()
            : null;
    }

    if (path === '/notes') {
        const note = notes.find(({ slug }) => slug === fragment);

        return note ? note.title.toUpperCase() : null;
    }

    return null;
}

function markerIdentity(marker: FrameMarker): string {
    if (marker.kind === 'POINT') {
        return `POINT:${marker.step}`;
    }

    return `SPAN:${marker.from}:${marker.to}`;
}

function validHref(href: string): boolean {
    if (
        href.length === 0 ||
        href !== href.trim() ||
        /[\u0000-\u001F\u007F\\]/u.test(href)
    ) {
        return false;
    }

    if (href.startsWith('/')) {
        // A single leading slash is same-origin root-relative.
        // Network-path references ("//host") are external and forbidden.
        return !href.startsWith('//');
    }

    try {
        const url = new URL(href);

        return (
            url.protocol === 'https:' &&
            url.hostname.length > 0
        );
    } catch {
        return false;
    }
}

function validRelatedHref(href: string): boolean {
    if (!validHref(href)) {
        return false;
    }

    if (href.startsWith('https://')) {
        return true;
    }

    return RELATED_INTERNAL_TARGETS.has(href);
}

if (FRAME_BANDS.length !== EXPECTED_BANDS.length) {
    fail(`Expected ${EXPECTED_BANDS.length} bands, found ${FRAME_BANDS.length}.`);
}

FRAME_BANDS.forEach((band, index) => {
    if (band.id !== EXPECTED_BANDS[index]) {
        fail(
            `Band ${index} must be ${EXPECTED_BANDS[index]}, found ${band.id}.`,
        );
    }

    if (band.description.trim().length === 0) {
        fail(`Band has no description: ${band.id}.`);
    }
});

if (FRAME_AXES.length !== 7) {
    fail(`Expected exactly seven axes, found ${FRAME_AXES.length}.`);
}

const seenAxisIds = new Set<FrameAxisId>();

for (const axis of FRAME_AXES) {
    if (seenAxisIds.has(axis.id)) {
        fail(`Duplicate axis id: ${axis.id}.`);
    }
    seenAxisIds.add(axis.id);

    const expected = EXPECTED_AXES[axis.id];

    if (axis.band !== expected.band) {
        fail(
            `Axis ${axis.id} must belong to ${expected.band}, found ${axis.band}.`,
        );
    }

    if (
        axis.declaration.poles[0] !== expected.poles[0] ||
        axis.declaration.poles[1] !== expected.poles[1]
    ) {
        fail(`Axis ${axis.id} canonical poles changed.`);
    }

    if (markerIdentity(axis.marker) !== expected.marker) {
        fail(`Axis ${axis.id} R1 lattice placement changed.`);
    }

    /**
     * The public type keeps statement non-empty at compile time. Widen only
     * this local defensive view so the runtime guard can still protect a
     * future widened or generated corpus without weakening FrameDeclaration.
     */
    const statementParagraphs: readonly string[] =
        axis.declaration.statement;

    if (
        axis.declaration.question.trim().length === 0 ||
        axis.declaration.wording.trim().length === 0 ||
        axis.declaration.movesWhen.trim().length === 0 ||
        statementParagraphs.length === 0
    ) {
        fail(`Axis ${axis.id} has an incomplete owner declaration.`);
    }

    if (
        statementParagraphs.some(
            (paragraph) => paragraph.trim().length === 0,
        )
    ) {
        fail(`Axis ${axis.id} contains an empty statement paragraph.`);
    }

    const uniqueBasis = new Set(axis.basis);

    if (
        uniqueBasis.size !== axis.basis.length ||
        axis.basis.some((basis) => !BASIS_VALUES.includes(basis))
    ) {
        fail(`Axis ${axis.id} has an invalid or duplicate basis.`);
    }

    if (axis.marker.kind === 'SPAN') {
        if (
            axis.marker.from < 1 ||
            axis.marker.to > 5 ||
            axis.marker.from >= axis.marker.to
        ) {
            fail(`Axis ${axis.id} has an invalid lattice span.`);
        }

        if (axis.marker.to - axis.marker.from !== 1) {
            fail(`Axis ${axis.id} span must cover adjacent lattice steps.`);
        }
    } else if (axis.marker.step < 1 || axis.marker.step > 5) {
        fail(`Axis ${axis.id} has an invalid lattice point.`);
    }

    if (axis.publicSupport !== null) {
        if (!SOURCE_SUPPORT_VALUES.includes(axis.publicSupport.support)) {
            fail(`Axis ${axis.id} has an invalid public support relation.`);
        }

        if (
            !validHref(axis.publicSupport.href) ||
            axis.publicSupport.label.trim().length === 0 ||
            axis.publicSupport.limit.trim().length === 0
        ) {
            fail(`Axis ${axis.id} has incomplete public support.`);
        }
    }

    for (const anchor of axis.relatedAnchors) {
        if (
            !validRelatedHref(anchor.href) ||
            anchor.label.trim().length === 0 ||
            anchor.limit.trim().length === 0
        ) {
            fail(`Axis ${axis.id} has an incomplete or unresolved related anchor.`);
        }

        if (!anchor.href.startsWith('https://')) {
            const canonicalLabel = canonicalRelatedLabel(anchor.href);

            if (canonicalLabel === null || anchor.label !== canonicalLabel) {
                fail(`Axis ${axis.id} related anchor label drifted: ${anchor.href}.`);
            }
        }
    }
}

for (const expectedId of Object.keys(EXPECTED_AXES) as FrameAxisId[]) {
    if (!seenAxisIds.has(expectedId)) {
        fail(`Missing canonical axis: ${expectedId}.`);
    }
}

const renderedAxisOrder = FRAME_RENDERED_AXES.map(({ id }) => id);

if (
    renderedAxisOrder.length !== EXPECTED_RENDERED_AXIS_ORDER.length ||
    renderedAxisOrder.some(
        (axisId, index) =>
            axisId !== EXPECTED_RENDERED_AXIS_ORDER[index],
    )
) {
    fail(
        `Rendered axis order changed: ${renderedAxisOrder.join(',')}.`,
    );
}

/**
 * R1 intentionally has public support for only one axis.
 *
 * FactoryPulse is represented publicly in WORK, but its underlying source is
 * private; those entries therefore remain related anchors rather than public
 * demonstrations. The absence is explicit instead of being promoted by
 * adjacency.
 */
const publiclySupportedAxes = FRAME_AXES.filter(
    ({ publicSupport }) => publicSupport !== null,
);

if (
    publiclySupportedAxes.length !== 1 ||
    publiclySupportedAxes[0]?.id !== '06' ||
    publiclySupportedAxes[0]?.publicSupport?.support !== 'DEMONSTRATES'
) {
    fail('R1 public-support boundary changed.');
}
