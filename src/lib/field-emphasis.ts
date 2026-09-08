import { FIELD } from '../data/field-composition';
import { fieldRelationsFor } from './field-relations';
import type { ConcernId, SystemId } from '../data/types';

/**
 * FIELD relation emphasis, expressed entirely in CSS.
 *
 * Hovering or focusing a system handle raises that system's declared relations
 * and lets everything else recede. PRIMARY and PRESENT stay visually distinct,
 * so what reads is the shape of the relation set rather than a highlight.
 *
 * Generated from FIELD.plotted and the canonical relations rather than written
 * by hand: a system added to the field cannot silently lose its rules.
 *
 * Handles carry data-field-emphasis="<system>": the plotted-systems roster
 * link, the relation index row, and the system node group inside the diagram.
 * Both a hover and a focus path exist for every handle that is interactive, so
 * no information here is reachable by pointer alone. Without :has() support the
 * diagram simply stays in its static state.
 *
 * Exactly one system is emphasised at a time. Pointer and keyboard can address
 * different handles at once — a pointer resting on one system while keyboard
 * focus sits on another — and if both contexts generated their rules together
 * each would dim the other's relations, leaving every trace at the inactive
 * opacity. The two are ordered rather than merged: while any handle holds
 * keyboard focus, the focus context decides and the hover context is
 * suppressed outright.
 */

const IDENTIFIER_PATTERN = /^[a-z][a-z0-9-]*$/;

/**
 * The rules a plotted system always gets: what recedes around it, its own node
 * emphasis, and the correlation with its relation-index row. None of them
 * needs an edge to exist. Where nothing is declared the concern selectors
 * carry no exclusions, so every concern node and label simply recedes.
 */
const UNCONDITIONAL_RULES_PER_SYSTEM = 8;

/**
 * The two trace-raising rules, emitted only where at least one relation is
 * declared. An absent edge is an intentional state in the canonical relation
 * semantics, not a defect: a system with none declared has no trace to raise,
 * and a rule that could never match would put an edge into the stylesheet that
 * the relation set does not declare.
 */
const RELATION_RULES_PER_SYSTEM = 2;

function assertIdentifier(value: string): string {
    if (!IDENTIFIER_PATTERN.test(value)) {
        throw new Error(
            `[field-emphasis] Unsafe identifier in generated CSS: ${value}`,
        );
    }

    return value;
}

/**
 * True of the surface whenever any emphasis handle contains keyboard focus,
 * whichever system that handle belongs to. Handles never nest, so at most one
 * can hold focus and at most one can be hovered; guarding the hover path with
 * the negation of this leaves at most one context active for any combination
 * of pointer and keyboard state.
 */
const FOCUS_HELD = ':has([data-field-emphasis]:focus-within)';

function rule(
    system: SystemId,
    target: string,
    declarations: readonly string[],
): string {
    const handle = `[data-field-emphasis="${system}"]`;

    const selector = [
        // Keyboard focus decides, unconditionally.
        `.index-surface:has(${handle}:focus-within) ${target}`,
        // Hover decides only while no handle anywhere is focused.
        `.index-surface:not(${FOCUS_HELD}):has(${handle}:hover) ${target}`,
    ].join(',\n');

    const body = declarations
        .map((declaration) => `    ${declaration}`)
        .join('\n');

    return `${selector} {\n${body}\n}`;
}

/**
 * The rules for one system, given the concerns it declares a relation to. The
 * relation set arrives as a parameter rather than a lookup, so the empty case
 * can be exercised without touching the canonical relation data.
 */
function emphasisRules(
    system: SystemId,
    related: readonly ConcernId[],
): readonly string[] {
    assertIdentifier(system);

    const concerns = related.map((concern) => assertIdentifier(concern));

    // Empty where nothing is declared, which leaves the selector unqualified:
    // every concern node and every concern label recedes.
    const unrelatedNodes = concerns
        .map((concern) => `:not([data-concern="${concern}"])`)
        .join('');

    const unrelatedLabels = concerns
        .map((concern) => `:not([data-concern-label="${concern}"])`)
        .join('');

    const blocks: string[] = [
        // Everything outside the declared relation set recedes.
        rule(system, `.field__trace:not([data-system="${system}"])`, [
            'opacity: 0.14;',
        ]),
        rule(system, `.node--system:not([data-system="${system}"])`, [
            'opacity: 0.3;',
        ]),
        rule(
            system,
            `.field__label--system:not([data-system-label="${system}"])`,
            ['opacity: 0.3;'],
        ),
        rule(system, `.node--concern${unrelatedNodes}`, ['opacity: 0.26;']),
        rule(system, `.field__label--concern${unrelatedLabels}`, [
            'opacity: 0.26;',
        ]),
    ];

    if (concerns.length > 0) {
        // The declared relations rise, and keep their strength distinction.
        blocks.push(
            rule(
                system,
                `.field__trace[data-system="${system}"][data-strength="PRIMARY"]`,
                ['stroke: var(--color-text-soft);', 'stroke-width: 1.4px;'],
            ),
            rule(
                system,
                `.field__trace[data-system="${system}"][data-strength="PRESENT"]`,
                ['stroke: var(--color-text-muted);'],
            ),
        );
    }

    blocks.push(
        rule(system, `.node--system[data-system="${system}"] .node__ring`, [
            'stroke: var(--color-signal);',
        ]),
        rule(system, `.node--system[data-system="${system}"] .node__core`, [
            'fill: var(--color-signal);',
        ]),

        // The diagram and the text index stay correlated.
        rule(
            system,
            `[data-relation-row][data-system="${system}"] .relation-index__name`,
            ['color: var(--color-text);'],
        ),
    );

    return blocks;
}

export function fieldEmphasisCss(): string {
    const blocks: string[] = [];

    for (const system of FIELD.plotted) {
        blocks.push(
            ...emphasisRules(
                system,
                fieldRelationsFor(system).map(({ concern }) => concern),
            ),
        );
    }

    // Derived from the canonical data a second time rather than counted off the
    // loop above, so a rule dropped or duplicated in generation still fails
    // here.
    const expected = FIELD.plotted.reduce(
        (total, system) =>
            total +
            UNCONDITIONAL_RULES_PER_SYSTEM +
            (fieldRelationsFor(system).length === 0
                ? 0
                : RELATION_RULES_PER_SYSTEM),
        0,
    );

    if (blocks.length !== expected) {
        throw new Error(
            `[field-emphasis] Expected ${expected} generated rules, produced ${blocks.length}.`,
        );
    }

    return blocks.join('\n\n');
}

/**
 * Bounded falsification, run once at build time.
 *
 * A plotted system with no declared relation is a valid field state: the
 * relation set treats an absent edge as an intentional absence, and the
 * textual relation surface already renders one. Every plotted system declares
 * at least one relation today, so the empty case is unreachable from canonical
 * data — generation is exercised against it directly here instead. The empty
 * relation set is supplied by the probe, nothing canonical moves, and the
 * result is discarded, so the emitted stylesheet is unaffected.
 */
const EMPTY_RELATION_PROBE = emphasisRules(FIELD.plotted[0], []);

if (EMPTY_RELATION_PROBE.length !== UNCONDITIONAL_RULES_PER_SYSTEM) {
    throw new Error(
        `[field-emphasis] Empty relation set produced ${EMPTY_RELATION_PROBE.length} rules, expected ${UNCONDITIONAL_RULES_PER_SYSTEM}.`,
    );
}

if (EMPTY_RELATION_PROBE.some((block) => block.includes('data-strength='))) {
    throw new Error(
        '[field-emphasis] Empty relation set raised a relation trace.',
    );
}

if (!EMPTY_RELATION_PROBE.some((block) => block.includes('.node--concern {'))) {
    throw new Error(
        '[field-emphasis] Empty relation set left concern nodes unqualified.',
    );
}
