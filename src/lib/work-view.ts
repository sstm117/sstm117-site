import { FIELD } from '../data/field-composition';
import { provenance } from '../data/provenance';
import { systems } from '../data/systems';
import { work } from '../data/work';
import type { TechBasis, WorkEntry, WorkSource } from '../data/work';
import type { ProvenanceRecord, SystemId } from '../data/types';

/**
 * Resolution layer between the WORK corpus and its presentation.
 *
 * A field entry is joined here to its canonical SystemRecord and to the
 * provenance records that already exist for it, so that no canonical fact is
 * restated in work.ts. A standalone entry passes through with the source it
 * declares for itself and touches none of this.
 */

export interface WorkTechView {
    readonly label: string;
    readonly items: readonly string[];
}

export interface WorkEntryView {
    readonly anchor: string;
    readonly name: string;
    readonly lede: string;
    readonly meta: readonly string[];
    /**
     * Whether the system stands in FIELD.plotted now — not whether the
     * WORK record happens to be of field origin.
     */
    readonly inField: boolean;
    readonly question: string;
    readonly contribution: string;
    readonly today: readonly string[];
    readonly notYet: readonly string[];
    readonly constraint: string;
    readonly unknowns: readonly string[];
    /** Null where the entry lists no technology, so no row is rendered. */
    readonly tech: WorkTechView | null;
    readonly source: WorkSource;
}

function fail(message: string): never {
    throw new Error(`[work-view] ${message}`);
}

/**
 * A field entry's source line is derived from the provenance records that
 * already exist for that system. LR-1 renders no locator for them, because
 * every current record is RESTRICTED and mandate section 17 forbids widening
 * the provenance contract to make WORK fit.
 */
function deriveFieldSource(systemId: SystemId): WorkSource {
    // Widened deliberately: the literal availabilities of the current corpus
    // would make these branches statically unreachable, and they exist to catch
    // a future provenance change rather than to describe today's data.
    const records: readonly ProvenanceRecord[] = provenance.filter(
        ({ entity }) => entity === systemId,
    );

    if (records.length === 0) {
        return { public: false, note: 'No source declared.' };
    }

    if (records.some(({ availability }) => availability === 'PUBLIC')) {
        fail(
            `PUBLIC provenance exists for ${systemId} but WORK has no treatment for rendering it.`,
        );
    }

    if (records.every(({ availability }) => availability === 'NONE')) {
        return { public: false, note: 'No source exists.' };
    }

    return { public: false, note: 'Source not public.' };
}

/**
 * The label over a technology list is derived from the declared basis, never
 * fixed in the template. One implementation-claiming label over every list
 * would say that Moka Companion, EXOMIND and ProjectTrail were built on
 * technologies that are, respectively, specified in a contract with no code
 * behind it and studied in a research atlas that has operated nothing.
 */
const TECH_LABEL: Readonly<Record<TechBasis, string>> = {
    BUILT: 'BUILT WITH',
    SPECIFIED: 'SPECIFIED WITH',
    RESEARCHED: 'RESEARCHED WITH',
};

function techView(entry: WorkEntry): WorkTechView | null {
    if (entry.tech.length === 0) {
        return null;
    }

    if (entry.techBasis === undefined) {
        fail(`Work entry lists technology without a declared basis: ${entry.anchor}`);
    }

    return {
        label: TECH_LABEL[entry.techBasis],
        items: entry.tech,
    };
}

/**
 * Current FIELD membership, read from the canonical composition.
 *
 * A field entry records where a WORK record came from, not where the field
 * stands today. The dependency runs WORK --optional reference--> FIELD, so an
 * editorial removal from FIELD.plotted has to leave the WORK record standing
 * and stop it claiming a place in the field. The converse is deliberately not
 * asserted: a record of field origin is under no obligation to stay plotted.
 */
const plottedSystems = new Set<SystemId>(FIELD.plotted);

export function workViews(): readonly WorkEntryView[] {
    return work.map((entry): WorkEntryView => {
        const shared = {
            anchor: entry.anchor,
            question: entry.question,
            contribution: entry.contribution,
            today: entry.today,
            notYet: entry.notYet,
            constraint: entry.constraint,
            unknowns: entry.unknowns,
            tech: techView(entry),
        };

        if (entry.kind === 'standalone') {
            return {
                ...shared,
                name: entry.name,
                lede: entry.lede,
                meta: ['OUTSIDE THE FIELD'],
                inField: false,
                source: entry.source,
            };
        }

        const system = systems.find(({ id }) => id === entry.system);

        if (!system) {
            fail(`Unknown work system: ${entry.system}`);
        }

        const inField = plottedSystems.has(system.id);

        return {
            ...shared,
            name: system.name,
            lede: system.body,
            meta: [
                system.index,
                system.phase?.label ?? 'PHASE UNDECLARED',
                system.evidence,
                inField ? 'IN THE FIELD' : 'OUTSIDE THE FIELD',
            ],
            inField,
            source: deriveFieldSource(system.id),
        };
    });
}

const fieldAnchors = new Map<SystemId, string>(
    work.flatMap((entry) =>
        entry.kind === 'field'
            ? ([[entry.system, entry.anchor]] as const)
            : [],
    ),
);

/**
 * Every plotted FIELD system must have a WORK destination. Checked at build
 * time so that a system can never be plotted without somewhere to go.
 *
 * One way only. Nothing here requires a WORK record of field origin to still
 * be plotted, which is what lets a system be withdrawn from the field without
 * withdrawing the work.
 */
for (const id of FIELD.plotted) {
    if (!fieldAnchors.has(id)) {
        fail(`Plotted FIELD system has no WORK destination: ${id}`);
    }
}

export function workHrefFor(systemId: SystemId): string {
    const anchor = fieldAnchors.get(systemId);

    if (!anchor) {
        fail(`No WORK destination for system: ${systemId}`);
    }

    return `/work#${anchor}`;
}
