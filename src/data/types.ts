export type SystemId = 'obs' | 'food' | 'moka' | 'fnode';

export type ConcernId =
    | 'kno'
    | 'int'
    | 'hum'
    | 'dec'
    | 'phy'
    | 'ops';

export type Disclosure =
    | 'PUBLIC'
    | 'PARTIAL'
    | 'WITHHELD'
    | 'UNLISTED';

export type NowPosition =
    | 'ACTIVE'
    | 'EXPLORING'
    | 'HELD';

export type Evidence =
    | 'SOURCE-VERIFIED'
    | 'OWNER-DECLARED'
    | 'NO SOURCE';

export type SourceAvailability =
    | 'PUBLIC'
    | 'RESTRICTED'
    | 'NONE';

export type SourceKind =
    | 'REPOSITORY'
    | 'SPECIFICATION'
    | 'ARTIFACT'
    | 'DECLARATION';

export type SourceAuthority =
    | 'CANONICAL'
    | 'PROVISIONAL'
    | 'LEGACY';

export type SourceRole =
    | 'DECLARATIVE'
    | 'DESCRIPTIVE'
    | 'NORMATIVE'
    | 'EXPERIMENTAL';

export type SourceCoverageArea =
    | 'IDENTITY'
    | 'DESCRIPTION'
    | 'QUESTION'
    | 'STRUCTURE'
    | 'PHASE'
    | 'CONSTRAINTS'
    | 'IMPLEMENTATION'
    | 'CAPABILITY'
    | 'RESULT'
    | 'APPLICATION_CONTEXT';

export type SourceSupport =
    | 'ASSERTS'
    | 'SPECIFIES'
    | 'DEMONSTRATES';

export interface CoverageQualification {
    area: SourceCoverageArea;
    support: SourceSupport;
}

export interface SourceStatus {
    authority: SourceAuthority;
    roles: readonly SourceRole[];
}

export interface PublicProvenanceRecord {
    entity: SystemId;
    availability: 'PUBLIC';
    kind: SourceKind;
    label?: string;
    locator: string;
    status: SourceStatus;
    checkedAt: string;
    coverage: readonly CoverageQualification[];
}

export interface RestrictedProvenanceRecord {
    entity: SystemId;
    availability: 'RESTRICTED';
    kind: SourceKind;
    label?: never;
    locator?: never;
    status: SourceStatus;
    checkedAt: string;
    coverage: readonly CoverageQualification[];
}

export interface NoSourceProvenanceRecord {
    entity: SystemId;
    availability: 'NONE';
    kind?: never;
    label?: never;
    locator?: never;
    status?: never;
    checkedAt: string;
    coverage: readonly [];
}

export type ProvenanceRecord =
    | PublicProvenanceRecord
    | RestrictedProvenanceRecord
    | NoSourceProvenanceRecord;

export type Strength =
    | 'PRIMARY'
    | 'PRESENT';

export interface Phase {
    label: string;
    compact: string;
}

export interface SystemRecord {
    id: SystemId;
    index: string;
    name: string;
    short: string;
    body: string;
    disclosure: Disclosure;
    evidence: Evidence;
    phase: Phase | null;
    now: NowPosition | null;
}

export interface ConcernRecord {
    id: ConcernId;
    label: string;
    gloss: string;
}

export interface RelationRecord {
    system: SystemId;
    concern: ConcernId;
    strength: Strength;
}
