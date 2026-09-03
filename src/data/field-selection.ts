import { FIELD } from './field-composition';
import type { SystemId } from './types';

/**
 * I1-E.5 adjudication — OWNER DECLARATION.
 *
 * Not derived from FIELD.plotted order, from system.index, or from the
 * I1-E.3 scaffold subject. READOUT_SUBJECT is the SystemId whose readout
 * the static Field renders. No selection state exists today.
 *
 * When and if interaction is authorised (I1-E.8 runtime necessity,
 * I1-E.9 interaction), the initial selection SHALL equal READOUT_SUBJECT.
 * This declaration asserts no runtime and no interaction.
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
 * field-geometry.ts:151-159). Importing it here would be circular.
 */
const eligible: readonly SystemId[] = FIELD.plotted;

if (!eligible.includes(READOUT_SUBJECT)) {
    throw new Error(
        `I1-E.5 READOUT_SUBJECT is not eligible in FIELD.plotted: ${READOUT_SUBJECT}`,
    );
}
