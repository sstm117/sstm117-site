/**
 * Cross-corpus integrity boundary for professional capability evidence.
 *
 * The professional dossier and WORK corpus remain separate data owners. This
 * validator is invoked by the /work composition root so `work:<anchor>` claims
 * cannot survive a build when the referenced canonical WORK record is absent.
 */

export interface ProfessionalWorkCapabilityRecord {
    readonly id: string;
    readonly evidenceRefs: readonly string[];
}

export interface ProfessionalWorkEntryRecord {
    readonly anchor: string;
}

const WORK_REFERENCE_PREFIX = 'work:';
const WORK_ANCHOR_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(message: string): never {
    throw new Error(`[professional-work-integrity] ${message}`);
}

function assertWorkAnchor(
    anchor: string,
    context: string,
): void {
    if (!WORK_ANCHOR_PATTERN.test(anchor)) {
        fail(`${context} has invalid WORK anchor: ${anchor}`);
    }
}

export function assertProfessionalWorkEvidenceIntegrity(
    capabilities: readonly ProfessionalWorkCapabilityRecord[],
    workEntries: readonly ProfessionalWorkEntryRecord[],
): void {
    const workAnchors = new Set<string>();

    for (const entry of workEntries) {
        assertWorkAnchor(
            entry.anchor,
            'canonical WORK corpus',
        );

        if (workAnchors.has(entry.anchor)) {
            fail(
                `canonical WORK corpus contains duplicate anchor: ${entry.anchor}`,
            );
        }

        workAnchors.add(entry.anchor);
    }

    for (const capability of capabilities) {
        for (const reference of capability.evidenceRefs) {
            if (!reference.startsWith(WORK_REFERENCE_PREFIX)) {
                continue;
            }

            const target = reference.slice(WORK_REFERENCE_PREFIX.length);

            assertWorkAnchor(
                target,
                `capability ${capability.id} reference`,
            );

            if (!workAnchors.has(target)) {
                fail(
                    `capability ${capability.id} references unknown WORK anchor: ${target}`,
                );
            }
        }
    }
}
