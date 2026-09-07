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
    readonly area: SourceCoverageArea;
    readonly support: SourceSupport;
}

export interface SourceStatus {
    readonly authority: SourceAuthority;
    readonly roles: readonly SourceRole[];
}

export interface PublicProvenanceRecord {
    readonly entity: SystemId;
    readonly availability: 'PUBLIC';
    readonly kind: SourceKind;
    readonly label?: string;
    readonly locator: string;
    readonly status: SourceStatus;
    readonly checkedAt: string;
    readonly coverage: readonly CoverageQualification[];
}

export interface RestrictedProvenanceRecord {
    readonly entity: SystemId;
    readonly availability: 'RESTRICTED';
    readonly kind: SourceKind;
    readonly label?: never;
    readonly locator?: never;
    readonly status: SourceStatus;
    readonly checkedAt: string;
    readonly coverage: readonly CoverageQualification[];
}

export interface NoSourceProvenanceRecord {
    readonly entity: SystemId;
    readonly availability: 'NONE';
    readonly kind?: never;
    readonly label?: never;
    readonly locator?: never;
    readonly status?: never;
    readonly checkedAt: string;
    readonly coverage: readonly [];
}

export type ProvenanceRecord =
    | PublicProvenanceRecord
    | RestrictedProvenanceRecord
    | NoSourceProvenanceRecord;

export type Strength =
    | 'PRIMARY'
    | 'PRESENT';

export interface Phase {
    readonly label: string;
    readonly compact: string;
}

export interface SystemRecord {
    readonly id: SystemId;
    readonly index: string;
    readonly name: string;
    readonly short: string;
    readonly body: string;
    readonly disclosure: Disclosure;
    readonly evidence: Evidence;
    readonly phase: Phase | null;
    readonly now: NowPosition | null;
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
