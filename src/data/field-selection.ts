import { FIELD } from './field-composition';
import type { SystemId } from './types';

/**
 * I1-E.5 adjudication — OWNER DECLARATION.
 *
 * Not derived from FIELD.plotted order, from system.index, or from the
 * I1-E.3 scaffold subject. READOUT_SUBJECT is the SystemId whose readout
 * the Field renders at rest. No persistent selection state exists.
 *
 * RM-1B I07 authorises transient CSS-only readout correspondence: hover
 * or focus emphasis may temporarily expose another plotted system readout.
 * READOUT_SUBJECT remains the fallback whenever no emphasis context is active.
 * No client runtime, hydration, persistent selection, or route state exists.
 */
export const READOUT_SUBJECT = 'obs' as const satisfies SystemId;

/**
 * I1-E.5 A2.4 — eligibility. Widened to readonly SystemId[] deliberately:
 * once SystemId is a proper superset of FIELD.plotted, the narrow
 * tuple-typed check at SystemReadout.astro:22 degenerates into a type
 * error rather than a legible adjudication failure. This one must not.
 *
 * Disclosure eligibility is NOT re-checked here — it is guaranteed
 * transitively by assertFieldIntegrity() (SystemReadout.astro:18 ->
 * field-geometry.ts FIELD.plotted disclosure loop). Importing it here
 * would be circular.
 */
const eligible: readonly SystemId[] = FIELD.plotted;

if (!eligible.includes(READOUT_SUBJECT)) {
    throw new Error(
        `I1-E.5 READOUT_SUBJECT is not eligible in FIELD.plotted: ${READOUT_SUBJECT}`,
    );
}
