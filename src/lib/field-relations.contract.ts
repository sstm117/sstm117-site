import type { RelationRecord } from '../data/types';

type TypeEqual<A, B> =
    (<T>() => T extends A ? 1 : 2) extends
    (<T>() => T extends B ? 1 : 2)
        ? (
            (<T>() => T extends B ? 1 : 2) extends
            (<T>() => T extends A ? 1 : 2)
                ? true
                : false
        )
        : false;

type Assert<T extends true> = T;

type FieldRelationsModule =
    typeof import('./field-relations.ts');

/**
 * I2-J / CF-I1
 *
 * Compile-time regression guard for the exported FIELD relation
 * selector return contract established by I2-I.
 *
 * Checked when the repository TypeScript/Astro checking path runs.
 * No runtime immutability, anti-cast protection, source freezing,
 * deep-readonly semantics, selector-implementation guarantee,
 * or CI enforcement is asserted.
 */
export type FieldRelationsReadonlyContract = Assert<
    TypeEqual<
        ReturnType<
            FieldRelationsModule['fieldRelations']
        >,
        readonly Readonly<RelationRecord>[]
    >
>;

export type FieldRelationsForReadonlyContract = Assert<
    TypeEqual<
        ReturnType<
            FieldRelationsModule['fieldRelationsFor']
        >,
        readonly Readonly<RelationRecord>[]
    >
>;
