import { FIELD } from '../data/field-composition';
import { relations } from '../data/relations';
import type {
    ConcernId,
    RelationRecord,
    SystemId,
} from '../data/types';

type ReadonlyRelationRecord = Readonly<RelationRecord>;

const plottedSystemIds = new Set<SystemId>(FIELD.plotted);
const fieldConcernIds = new Set<ConcernId>(FIELD.concerns);

export function fieldRelations(): readonly ReadonlyRelationRecord[] {
    return relations.filter(
        ({ system, concern }) =>
            plottedSystemIds.has(system) &&
            fieldConcernIds.has(concern),
    );
}

export function fieldRelationsFor(
    systemId: SystemId,
): readonly ReadonlyRelationRecord[] {
    return fieldRelations().filter(
        ({ system }) => system === systemId,
    );
}
