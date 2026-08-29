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
