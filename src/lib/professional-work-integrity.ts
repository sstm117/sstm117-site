/**
 * Cross-corpus integrity boundary for professional capability evidence.
 *
 * The professional dossier and WORK corpus remain separate data owners. The
 * canonical WORK owner validates anchor syntax and uniqueness; this validator
 * owns only cross-corpus resolution and is invoked by the /work composition
 * root so `work:<anchor>` claims cannot survive a build when their canonical
 * WORK record is absent.
 */

export interface ProfessionalWorkCapabilityRecord {
    readonly id: string;
    readonly evidenceRefs: readonly string[];
}

export interface ProfessionalWorkEntryRecord {
    readonly anchor: string;
}

const WORK_REFERENCE_PREFIX = 'work:';

function fail(message: string): never {
    throw new Error(`[professional-work-integrity] ${message}`);
}

export function assertProfessionalWorkEvidenceIntegrity(
    capabilities: readonly ProfessionalWorkCapabilityRecord[],
    workEntries: readonly ProfessionalWorkEntryRecord[],
): void {
    const workAnchors = new Set(
        workEntries.map(({ anchor }) => anchor),
    );

    for (const capability of capabilities) {
        for (const reference of capability.evidenceRefs) {
            if (!reference.startsWith(WORK_REFERENCE_PREFIX)) {
                continue;
            }

            const target = reference.slice(WORK_REFERENCE_PREFIX.length);

            if (!workAnchors.has(target)) {
                fail(
                    `capability ${capability.id} references unknown WORK anchor: ${target}`,
                );
            }
        }
    }
}
