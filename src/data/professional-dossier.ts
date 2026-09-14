/**
 * Professional dossier data owner.
 *
 * This module is deliberately separate from the existing WORK corpus. It owns
 * professional trajectory, professional cases, their evidence basis and
 * evidence-derived capability claims. It renders nothing by itself.
 *
 * Cross-corpus `work:<anchor>` references are namespace-recognised here.
 * Canonical WORK owns anchor syntax and uniqueness; exact resolution belongs
 * to the integration layer so this foundation does not import or mutate WORK.
 *
 * Trajectory periods intentionally use year granularity only. WORK is a
 * professional dossier, not a digital CV; month-level chronology is therefore
 * outside the R1 authoring contract.
 */

export type ProfessionalEvidenceBasis =
    | 'PUBLIC_ARTIFACT'
    | 'NON_PUBLIC_RECORD'
    | 'SELF_ATTESTED';

export interface ProfessionalTrajectoryEntry {
    readonly id: string;
    readonly period: string;
    readonly context: string;
    readonly role: string;
    readonly scope: string;
    readonly organisation?: string;
}

export interface PublicArtifactEvidence {
    readonly basis: 'PUBLIC_ARTIFACT';
    readonly label: string;
    readonly locator: string;
}

export interface NonPublicRecordEvidence {
    readonly basis: 'NON_PUBLIC_RECORD';
    readonly label: string;
    readonly locator?: never;
}

export interface SelfAttestedEvidence {
    readonly basis: 'SELF_ATTESTED';
    readonly label: string;
    readonly locator?: never;
}

export type ProfessionalEvidence =
    | PublicArtifactEvidence
    | NonPublicRecordEvidence
    | SelfAttestedEvidence;

export interface ProfessionalCase {
    readonly id: string;
    readonly trajectoryId: string;
    readonly title: string;
    readonly context: string;
    readonly problem: string;
    readonly responsibility: string;
    readonly contribution: string;
    readonly outcomes: readonly [string, ...string[]];
    readonly evidence: readonly [
        ProfessionalEvidence,
        ...ProfessionalEvidence[],
    ];
    readonly constraints: readonly string[];
    readonly limits: readonly [string, ...string[]];
}

export type CapabilityEvidenceRef =
    | `professional:${string}`
    | `work:${string}`;

export interface DemonstratedCapability {
    readonly id: string;
    readonly label: string;
    readonly definition: string;
    readonly evidenceRefs: readonly [
        CapabilityEvidenceRef,
        ...CapabilityEvidenceRef[],
    ];
}

export const professionalTrajectory = [
    {
        id: 'auto1-special-transport',
        period: '2018—2020',
        organisation: 'AUTO1 Group',
        context: 'European automotive logistics and exception transport',
        role: 'Special Transport Coordinator → Manager',
        scope:
            'Operational ownership of transport cases that fell outside standard processes, including carrier-network development, customer coordination, service design and operational tooling.',
    },
    {
        id: 'autohero-reverse-logistics',
        period: '2020—2023',
        organisation: 'AUTO1 Group / AutoHero',
        context: 'B2C automotive reverse logistics',
        role: 'Reverse Logistics Lead → Manager — work-study position',
        scope:
            'End-to-end handling of vehicles failing quality or customer acceptance, across production, carriers, external storage and customer-facing recovery.',
    },
    {
        id: 'autohero-production-lean',
        period: '2023—2024',
        organisation: 'AutoHero',
        context: 'Used-vehicle reconditioning production site',
        role: 'Project Manager — Production & Lean Management',
        scope:
            'Lean deployment and production-system improvement across workstations, inventory, factory flows, equipment, digital tools and industrial methods.',
    },
    {
        id: 'alten-maintenance-mro',
        period: '2025—PRESENT',
        organisation: 'ALTEN',
        context: 'Maintenance supply chain / industrial MRO store',
        role: 'Industrial Store / MRO Logistics Manager — client assignment',
        scope:
            'Operational responsibility for a maintenance store of about 10,000 references, a three-person team, inventory reliability, replenishment, reservations, material availability, digitalisation and continuous improvement.',
    },
] as const satisfies readonly ProfessionalTrajectoryEntry[];

export const professionalCases = [
    {
        id: 'auto1-exception-transport-network',
        trajectoryId: 'auto1-special-transport',
        title: 'BUILDING A EUROPEAN EXCEPTION-TRANSPORT NETWORK',
        context:
            'A logistics service responsible for vehicle movements that standard transport processes could not handle reliably.',
        problem:
            'How do you recover transport flows when standard logistics processes no longer fit the operational situation?',
        responsibility:
            'Owned special-transport cases requiring atypical vehicles, routes, timing or recovery conditions, with responsibility for carrier coordination and customer continuity.',
        contribution:
            'Built a European carrier and recovery network, expanded service levels, created activity-control tools, managed customer and provider interfaces, contributed to transport and storage internalisation projects, and automated recurring administrative work.',
        outcomes: [
            'Built a provider network capable of supporting exceptional vehicle movements across Europe within five working days.',
            'Automated more than half of recurring mailing and transport-order creation tasks.',
        ],
        evidence: [
            {
                basis: 'SELF_ATTESTED',
                label: 'Self-attested professional record covering reported responsibilities and outcomes for AUTO1 Group special transport.',
            },
        ],
        constraints: [
            'Cases sat outside standard transport processes and required rapid adaptation across multiple European territories.',
            'Service quality depended on external carrier availability, cost and response time.',
        ],
        limits: [
            'No client, carrier or commercially sensitive operating data is disclosed.',
        ],
    },
    {
        id: 'autohero-reverse-logistics-transformation',
        trajectoryId: 'autohero-reverse-logistics',
        title: 'REBUILDING A REVERSE-LOGISTICS FLOW',
        context:
            'A B2C vehicle-return flow spanning production, transport providers, external storage and customer-facing recovery.',
        problem:
            'How do you turn a slow, fragmented return flow into a controlled recovery system that protects cost, customer experience and asset value?',
        responsibility:
            'Owned and then managed reverse logistics for vehicles rejected on quality grounds or returned after customer cancellation.',
        contribution:
            'Restructured carrier and recovery arrangements, optimised routes and costs, adapted transport means to reduce damage exposure, handled disputes and invoicing, introduced a dedicated last-mile fleet and automated recurring administrative work.',
        outcomes: [
            'Reduced average resale lead time for cancelled vehicles from 27 days to 15 days.',
            'Reduced average recovery time for problematic vehicles from seven days to two days.',
        ],
        evidence: [
            {
                basis: 'SELF_ATTESTED',
                label: 'Self-attested professional record covering reported AutoHero reverse-logistics responsibilities and outcomes.',
            },
        ],
        constraints: [
            'The flow crossed production, external transport and storage boundaries while remaining visible to the end customer.',
            'Cost, recovery speed, damage exposure and customer experience had to be improved together.',
        ],
        limits: [
            'No transport-damage reduction percentage is claimed because the available record describes the reduction qualitatively.',
            'No confidential provider rates, customer records or internal operating data is disclosed.',
        ],
    },
    {
        id: 'autohero-production-system-engineering',
        trajectoryId: 'autohero-production-lean',
        title: 'STANDARDISING A RAPIDLY CHANGING PRODUCTION SITE',
        context:
            'A young used-vehicle reconditioning site undergoing repeated resizing and needing stronger production methods, workplace standards and operational visibility.',
        problem:
            'How do you introduce structure, visibility and scalable methods into a production site that is still changing shape?',
        responsibility:
            'Led production and Lean projects spanning 5S deployment, workstation design, inventory, equipment information, factory flows, WMS adoption and digital experimentation.',
        contribution:
            'Audited and redesigned work environments, modelled workstations and store layouts in 3D, proposed a 5S workstation configuration at 487 euros per station against an 800-euro budget, built a functional Python inventory-management tool, studied BLE/RFID vehicle identification with business-case and ROI work, documented production equipment and operating procedures, and supported WMS adoption.',
        outcomes: [
            'Removed identified superfluous production-environment items and established unit-level ownership to sustain the resulting state.',
            'Secured operator participation in technology and process-change projects through involvement in design and implementation work.',
        ],
        evidence: [
            {
                basis: 'SELF_ATTESTED',
                label: 'Self-attested professional dossier and CV records covering AutoHero production, Lean and digitalisation projects.',
            },
        ],
        constraints: [
            'The production site was still maturing and had undergone repeated resizing.',
            'Changes had to work for operators as well as satisfy cost, production and compliance constraints.',
        ],
        limits: [
            'The BLE/RFID identification work is represented as a studied and handed-over project, not as a deployed production system.',
            'No productivity or customer-satisfaction improvement is claimed without a qualified measured basis.',
        ],
    },
    {
        id: 'maintenance-material-reliability',
        trajectoryId: 'alten-maintenance-mro',
        title: 'IMPROVING MAINTENANCE MATERIAL RELIABILITY',
        context:
            'An industrial MRO store of about 10,000 references supporting maintenance activity, with a three-person operational team.',
        problem:
            'How do you make material availability reliable across inventory, reservations, replenishment, system data and physical flows?',
        responsibility:
            'Owns day-to-day store operations, team activity, inventory reliability, reservations, replenishment interfaces, material availability and coordination with maintenance, procurement and internal stakeholders.',
        contribution:
            'Structured operational routines, analysed inventory and system extracts, organised cycle-counting activity, qualified material criticality, improved physical and information traceability, created dashboards and analysis tools, and developed lightweight digital interfaces including a PHP PWA and Power Apps.',
        outcomes: [
            'Improved operational visibility across stock availability, reservations, material criticality, inventory integrity and follow-up priorities.',
            'Deployed dashboards, stock indicators, analysis files and reporting supports that turn field observations into prioritised action.',
            'Strengthened operating standards and team maturity through clearer procedures, training, workload allocation and field routines.',
        ],
        evidence: [
            {
                basis: 'SELF_ATTESTED',
                label: 'Self-attested professional dossier record covering the maintenance-store assignment, responsibilities, methods and reported outcomes.',
            },
        ],
        constraints: [
            'Material availability directly affects maintenance teams operating in a high-criticality MRO environment.',
            'Operational performance has to be balanced with cost, safety, traceability, quality and internal service requirements.',
        ],
        limits: [
            'No quantified before-and-after business-impact metric is claimed in R1.',
            'Client-specific findings, internal identifiers and non-public operational data are deliberately withheld.',
        ],
    },
] as const satisfies readonly ProfessionalCase[];

export const demonstratedCapabilities = [
    {
        id: 'designing-operational-control-systems',
        label: 'DESIGNING OPERATIONAL CONTROL SYSTEMS',
        definition:
            'Turning fragmented operational activity into observable states, routines, indicators and decision mechanisms.',
        evidenceRefs: [
            'professional:auto1-exception-transport-network',
            'professional:autohero-reverse-logistics-transformation',
            'professional:maintenance-material-reliability',
            'work:herve',
        ],
    },
    {
        id: 'recovering-flows-under-exception-conditions',
        label: 'RECOVERING FLOWS UNDER EXCEPTION CONDITIONS',
        definition:
            'Restoring logistics performance when standard processes no longer fit the real operational situation.',
        evidenceRefs: [
            'professional:auto1-exception-transport-network',
            'professional:autohero-reverse-logistics-transformation',
        ],
    },
    {
        id: 'improving-physical-systems-end-to-end',
        label: 'IMPROVING PHYSICAL SYSTEMS END TO END',
        definition:
            'Improving system behaviour across material, process, information and organisational constraints rather than optimising isolated tasks.',
        evidenceRefs: [
            'professional:autohero-production-system-engineering',
            'professional:maintenance-material-reliability',
        ],
    },
    {
        id: 'engineering-inventory-and-material-reliability',
        label: 'ENGINEERING INVENTORY AND MATERIAL RELIABILITY',
        definition:
            'Making stock and material availability more reliable through physical controls, system data, replenishment logic and operational governance.',
        evidenceRefs: [
            'professional:autohero-production-system-engineering',
            'professional:maintenance-material-reliability',
            'work:herve',
        ],
    },
    {
        id: 'building-pragmatic-operational-software',
        label: 'BUILDING PRAGMATIC OPERATIONAL SOFTWARE',
        definition:
            'Creating lightweight digital tools where enterprise systems do not adequately meet field workflows.',
        evidenceRefs: [
            'professional:autohero-production-system-engineering',
            'professional:maintenance-material-reliability',
            'work:herve',
        ],
    },
    {
        id: 'leading-operational-change',
        label: 'LEADING OPERATIONAL CHANGE',
        definition:
            'Leading operational change through participation, standards and practical ownership rather than mandate alone.',
        evidenceRefs: [
            'professional:autohero-production-system-engineering',
            'professional:maintenance-material-reliability',
        ],
    },
] as const satisfies readonly DemonstratedCapability[];

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PERIOD_PATTERN = /^(\d{4})—(\d{4}|PRESENT)$/;

function fail(message: string): never {
    throw new Error(`[professional-dossier] ${message}`);
}

function assertNonEmptyString(
    value: string,
    context: string,
): void {
    if (value.trim().length === 0) {
        fail(`${context} must not be empty.`);
    }
}

function assertValidId(
    value: string,
    context: string,
): void {
    if (!ID_PATTERN.test(value)) {
        fail(`${context} has invalid id: ${value}`);
    }
}

function assertTrajectoryPeriod(
    value: string,
    context: string,
): void {
    const match = PERIOD_PATTERN.exec(value);

    if (match === null) {
        fail(
            `${context} must use year-only YYYY—YYYY or YYYY—PRESENT granularity.`,
        );
    }

    const startYear = Number.parseInt(match[1], 10);
    const endToken = match[2];

    if (endToken !== 'PRESENT') {
        const endYear = Number.parseInt(endToken, 10);

        if (endYear < startYear) {
            fail(
                `${context} must not end before it starts.`,
            );
        }
    }
}

function assertUniqueIds(
    records: readonly { readonly id: string }[],
    context: string,
): void {
    const seen = new Set<string>();

    for (const record of records) {
        assertValidId(record.id, context);

        if (seen.has(record.id)) {
            fail(`${context} contains duplicate id: ${record.id}`);
        }

        seen.add(record.id);
    }
}

function assertStringList(
    values: readonly string[],
    context: string,
    requireNonEmpty: boolean,
): void {
    if (requireNonEmpty && values.length === 0) {
        fail(`${context} must contain at least one item.`);
    }

    for (const value of values) {
        assertNonEmptyString(value, context);
    }
}

function assertEvidence(
    evidence: ProfessionalEvidence,
    caseId: string,
    index: number,
): void {
    const context = `case ${caseId} evidence ${index}`;

    assertNonEmptyString(
        evidence.label,
        `${context} label`,
    );

    switch (evidence.basis) {
        case 'PUBLIC_ARTIFACT':
            assertNonEmptyString(
                evidence.locator,
                `${context} locator`,
            );
            return;

        case 'NON_PUBLIC_RECORD':
        case 'SELF_ATTESTED':
            if ('locator' in evidence) {
                fail(
                    `${context} must not expose a locator.`,
                );
            }
            return;

        default:
            fail(`${context} has unsupported evidence basis.`);
    }
}

export function assertProfessionalDossierIntegrity(
    trajectory: readonly ProfessionalTrajectoryEntry[],
    cases: readonly ProfessionalCase[],
    capabilities: readonly DemonstratedCapability[],
): void {
    assertUniqueIds(
        trajectory,
        'trajectory',
    );

    assertUniqueIds(
        cases,
        'professional cases',
    );

    assertUniqueIds(
        capabilities,
        'capabilities',
    );

    const trajectoryIds =
        new Set(
            trajectory.map(({ id }) => id),
        );

    const caseIds =
        new Set(
            cases.map(({ id }) => id),
        );

    for (const entry of trajectory) {
        assertTrajectoryPeriod(
            entry.period,
            `trajectory ${entry.id} period`,
        );

        assertNonEmptyString(
            entry.context,
            `trajectory ${entry.id} context`,
        );

        assertNonEmptyString(
            entry.role,
            `trajectory ${entry.id} role`,
        );

        assertNonEmptyString(
            entry.scope,
            `trajectory ${entry.id} scope`,
        );

        if (entry.organisation !== undefined) {
            assertNonEmptyString(
                entry.organisation,
                `trajectory ${entry.id} organisation`,
            );
        }
    }

    for (const professionalCase of cases) {
        if (
            !trajectoryIds.has(
                professionalCase.trajectoryId,
            )
        ) {
            fail(
                `professional case ${professionalCase.id} ` +
                    'references unknown trajectory: ' +
                    professionalCase.trajectoryId,
            );
        }

        assertNonEmptyString(
            professionalCase.title,
            `case ${professionalCase.id} title`,
        );

        assertNonEmptyString(
            professionalCase.context,
            `case ${professionalCase.id} context`,
        );

        assertNonEmptyString(
            professionalCase.problem,
            `case ${professionalCase.id} problem`,
        );

        assertNonEmptyString(
            professionalCase.responsibility,
            `case ${professionalCase.id} responsibility`,
        );

        assertNonEmptyString(
            professionalCase.contribution,
            `case ${professionalCase.id} contribution`,
        );

        assertStringList(
            professionalCase.outcomes,
            `case ${professionalCase.id} outcomes`,
            true,
        );

        assertStringList(
            professionalCase.constraints,
            `case ${professionalCase.id} constraints`,
            false,
        );

        assertStringList(
            professionalCase.limits,
            `case ${professionalCase.id} limits`,
            true,
        );

        if (professionalCase.evidence.length === 0) {
            fail(
                `case ${professionalCase.id} evidence must contain at least one item.`,
            );
        }

        professionalCase.evidence.forEach(
            (evidence, index) => {
                assertEvidence(
                    evidence,
                    professionalCase.id,
                    index,
                );
            },
        );
    }

    for (const capability of capabilities) {
        assertNonEmptyString(
            capability.label,
            `capability ${capability.id} label`,
        );

        assertNonEmptyString(
            capability.definition,
            `capability ${capability.id} definition`,
        );

        if (capability.evidenceRefs.length === 0) {
            fail(
                `capability ${capability.id} evidenceRefs must contain at least one item.`,
            );
        }

        const seenRefs =
            new Set<string>();

        for (
            const reference
            of capability.evidenceRefs
        ) {
            if (seenRefs.has(reference)) {
                fail(
                    `capability ${capability.id} contains ` +
                        'duplicate evidence reference: ' +
                        reference,
                );
            }

            seenRefs.add(reference);

            if (
                reference.startsWith(
                    'professional:',
                )
            ) {
                const target =
                    reference.slice(
                        'professional:'.length,
                    );

                assertValidId(
                    target,
                    `capability ${capability.id} ` +
                        'professional reference',
                );

                if (!caseIds.has(target)) {
                    fail(
                        `capability ${capability.id} ` +
                            'references unknown professional case: ' +
                            target,
                    );
                }

                continue;
            }

            if (
                reference.startsWith(
                    'work:',
                )
            ) {
                continue;
            }

            fail(
                `capability ${capability.id} has ` +
                    'unsupported evidence reference: ' +
                    reference,
            );
        }
    }
}

assertProfessionalDossierIntegrity(
    professionalTrajectory,
    professionalCases,
    demonstratedCapabilities,
);
