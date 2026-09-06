import { FIELD } from '../data/field-composition';
import { relations } from '../data/relations';
import type {
    ConcernId,
    RelationRecord,
    SystemId,
} from '../data/types';

const plottedSystemIds = new Set<SystemId>(FIELD.plotted);
const fieldConcernIds = new Set<ConcernId>(FIELD.concerns);

export function fieldRelations(): readonly RelationRecord[] {
    return relations.filter(
        ({ system, concern }) =>
            plottedSystemIds.has(system) &&
            fieldConcernIds.has(concern),
    );
}

export function fieldRelationsFor(
    systemId: SystemId,
): readonly RelationRecord[] {
    return fieldRelations().filter(
        ({ system }) => system === systemId,
    );
}
