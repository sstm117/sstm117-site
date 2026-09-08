import { FIELD } from '../data/field-composition';
import { fieldRelationsFor } from './field-relations';
import type { SystemId } from '../data/types';

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
const RULES_PER_SYSTEM = 10;

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

export function fieldEmphasisCss(): string {
    const blocks: string[] = [];

    for (const system of FIELD.plotted) {
        assertIdentifier(system);

        const related = fieldRelationsFor(system).map(({ concern }) =>
            assertIdentifier(concern),
        );

        if (related.length === 0) {
            throw new Error(
                `[field-emphasis] Plotted system has no declared relation: ${system}`,
            );
        }

        const unrelatedNodes = related
            .map((concern) => `:not([data-concern="${concern}"])`)
            .join('');

        const unrelatedLabels = related
            .map((concern) => `:not([data-concern-label="${concern}"])`)
            .join('');

        blocks.push(
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

            // The declared relations rise, and keep their strength distinction.
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
    }

    const expected = FIELD.plotted.length * RULES_PER_SYSTEM;

    if (blocks.length !== expected) {
        throw new Error(
            `[field-emphasis] Expected ${expected} generated rules, produced ${blocks.length}.`,
        );
    }

    return blocks.join('\n\n');
}
