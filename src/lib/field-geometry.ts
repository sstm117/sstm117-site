import { concerns } from '../data/concerns.ts';
import { FIELD } from '../data/field-composition.ts';
import { relations } from '../data/relations.ts';
import { systems } from '../data/systems.ts';

import type {
    ConcernId,
    Disclosure,
    Strength,
    SystemId,
} from '../data/types';

export interface Point {
    x: number;
    y: number;
}

export interface ResolvedTrace {
    system: SystemId;
    concern: ConcernId;
    strength: Strength;
    d: string;
}

function isNonRenderableDisclosure(
    disclosure: Disclosure,
): boolean {
    return (
        disclosure === 'WITHHELD' ||
        disclosure === 'UNLISTED'
    );
}

export function trace(a: Point, b: Point): string {
    const dx = b.x - a.x;
    const dy = b.y - a.y;

    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    const m = Math.min(adx, ady);

    const sx = Math.sign(dx);
    const sy = Math.sign(dy);

    if (adx >= ady) {
        return [
            `M ${a.x} ${a.y}`,
            `L ${b.x - sx * m} ${a.y}`,
            `L ${b.x} ${b.y}`,
        ].join(' ');
    }

    return [
        `M ${a.x} ${a.y}`,
        `L ${a.x} ${b.y - sy * m}`,
        `L ${b.x} ${b.y}`,
    ].join(' ');
}

export function resolveTraces(): readonly ResolvedTrace[] {
    const plotted = new Set<SystemId>(FIELD.plotted);
    const fieldConcerns = new Set<ConcernId>(FIELD.concerns);

    return relations
        .filter(
            ({ system, concern }) =>
                plotted.has(system) &&
                fieldConcerns.has(concern),
        )
        .map(({ system, concern, strength }) => ({
            system,
            concern,
            strength,
            d: trace(
                FIELD.nodes[system],
                FIELD.nodes[concern],
            ),
        }));
}

export function fieldCounts() {
    const resolved = resolveTraces();

    return {
        plotted: FIELD.plotted.length,
        concerns: FIELD.concerns.length,
        relations: resolved.length,
        primary: resolved.filter(
            ({ strength }) => strength === 'PRIMARY',
        ).length,
        present: resolved.filter(
            ({ strength }) => strength === 'PRESENT',
        ).length,
    } as const;
}

export function assertFieldIntegrity(): void {
    const systemIds = new Set<SystemId>(
        systems.map(({ id }) => id),
    );

    const concernIds = new Set<ConcernId>(
        concerns.map(({ id }) => id),
    );

    const indexes = new Set<string>(
        systems.map(({ index }) => index),
    );

    if (systemIds.size !== systems.length) {
        throw new Error('Duplicate system id.');
    }

    if (concernIds.size !== concerns.length) {
        throw new Error('Duplicate concern id.');
    }

    if (indexes.size !== systems.length) {
        throw new Error('Duplicate system index.');
    }

    if (indexes.has('117')) {
        throw new Error('117 is permanently reserved.');
    }

    const crossNamespaceIds = [
        ...systemIds,
        ...concernIds,
    ];

    if (
        new Set(crossNamespaceIds).size !==
        crossNamespaceIds.length
    ) {
        throw new Error(
            'System and concern ids must not collide.',
        );
    }

    for (const id of FIELD.plotted) {
        const system = systems.find(
            (candidate) => candidate.id === id,
        );

        if (!system) {
            throw new Error(
                `Unknown plotted system: ${id}`,
            );
        }

        if (
            isNonRenderableDisclosure(
                system.disclosure,
            )
        ) {
            throw new Error(
                `Non-renderable disclosure plotted: ${id}`,
            );
        }

        if (!FIELD.nodes[id] || !FIELD.labels[id]) {
            throw new Error(
                `Incomplete plotted placement: ${id}`,
            );
        }
    }

    for (const id of FIELD.concerns) {
        if (!concernIds.has(id)) {
            throw new Error(
                `Unknown field concern: ${id}`,
            );
        }

        if (!FIELD.nodes[id] || !FIELD.labels[id]) {
            throw new Error(
                `Incomplete concern placement: ${id}`,
            );
        }
    }

    const relationKeys = new Set<string>();

    for (const relation of relations) {
        if (!systemIds.has(relation.system)) {
            throw new Error(
                `Unknown relation system: ${relation.system}`,
            );
        }

        if (!concernIds.has(relation.concern)) {
            throw new Error(
                `Unknown relation concern: ${relation.concern}`,
            );
        }

        const key =
            `${relation.system}:${relation.concern}`;

        if (relationKeys.has(key)) {
            throw new Error(
                `Duplicate relation: ${key}`,
            );
        }

        relationKeys.add(key);
    }
}
