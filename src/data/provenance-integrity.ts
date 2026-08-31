import type { ProvenanceRecord, SystemRecord } from "./types";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const SOURCE_AVAILABILITIES = new Set([
    "PUBLIC",
    "RESTRICTED",
    "NONE",
]);

const SOURCE_KINDS = new Set([
    "REPOSITORY",
    "SPECIFICATION",
    "ARTIFACT",
    "DECLARATION",
]);

const SOURCE_AUTHORITIES = new Set([
    "CANONICAL",
    "PROVISIONAL",
    "LEGACY",
]);

const SOURCE_ROLES = new Set([
    "DECLARATIVE",
    "DESCRIPTIVE",
    "NORMATIVE",
    "EXPERIMENTAL",
]);

const SOURCE_COVERAGE_AREAS = new Set([
    "IDENTITY",
    "DESCRIPTION",
    "QUESTION",
    "STRUCTURE",
    "PHASE",
    "CONSTRAINTS",
    "IMPLEMENTATION",
    "CAPABILITY",
    "RESULT",
    "APPLICATION_CONTEXT",
]);

const SOURCE_SUPPORTS = new Set([
    "ASSERTS",
    "SPECIFIES",
    "DEMONSTRATES",
]);

const PROVENANCE_ALLOWED_KEYS = new Set([
    "entity",
    "availability",
    "kind",
    "label",
    "locator",
    "status",
    "checkedAt",
    "coverage",
]);

const PROVENANCE_REQUIRED_KEYS = [
    "entity",
    "availability",
    "checkedAt",
    "coverage",
] as const;

const PUBLIC_ALLOWED_KEYS = new Set([
    "entity",
    "availability",
    "kind",
    "label",
    "locator",
    "status",
    "checkedAt",
    "coverage",
]);

const PUBLIC_REQUIRED_KEYS = [
    "entity",
    "availability",
    "kind",
    "locator",
    "status",
    "checkedAt",
    "coverage",
] as const;

const RESTRICTED_ALLOWED_KEYS = new Set([
    "entity",
    "availability",
    "kind",
    "status",
    "checkedAt",
    "coverage",
]);

const RESTRICTED_REQUIRED_KEYS = [
    "entity",
    "availability",
    "kind",
    "status",
    "checkedAt",
    "coverage",
] as const;

const SOURCE_STATUS_ALLOWED_KEYS = new Set([
    "authority",
    "roles",
]);

const SOURCE_STATUS_REQUIRED_KEYS = [
    "authority",
    "roles",
] as const;

const SOURCE_COVERAGE_ALLOWED_KEYS = new Set([
    "area",
    "support",
]);

const SOURCE_COVERAGE_REQUIRED_KEYS = [
    "area",
    "support",
] as const;

const NONE_ALLOWED_KEYS = new Set([
    "entity",
    "availability",
    "checkedAt",
    "coverage",
]);

const NONE_REQUIRED_KEYS = [
    "entity",
    "availability",
    "checkedAt",
    "coverage",
] as const;

const OBJECT_PROTOTYPE_ALLOWED_KEYS = new Set<PropertyKey>([
    "constructor",
    "__defineGetter__",
    "__defineSetter__",
    "hasOwnProperty",
    "__lookupGetter__",
    "__lookupSetter__",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "toString",
    "valueOf",
    "__proto__",
    "toLocaleString",
]);

const ARRAY_PROTOTYPE_ALLOWED_KEYS = new Set<PropertyKey>([
    "length",
    "constructor",
    "at",
    "concat",
    "copyWithin",
    "fill",
    "find",
    "findIndex",
    "findLast",
    "findLastIndex",
    "lastIndexOf",
    "pop",
    "push",
    "reverse",
    "shift",
    "unshift",
    "slice",
    "sort",
    "splice",
    "includes",
    "indexOf",
    "join",
    "keys",
    "entries",
    "values",
    "forEach",
    "filter",
    "flat",
    "flatMap",
    "map",
    "every",
    "some",
    "reduce",
    "reduceRight",
    "toReversed",
    "toSorted",
    "toSpliced",
    "with",
    "toLocaleString",
    "toString",
    Symbol.iterator,
    Symbol.unscopables,
]);

const ARRAY_INDEX = /^(0|[1-9]\d*)$/;

type UnknownRecord = Record<PropertyKey, unknown>;

function fail(message: string): never {
    throw new Error("[provenance-integrity] " + message);
}

function hasOwn(record: object, key: PropertyKey): boolean {
    return Object.prototype.hasOwnProperty.call(record, key);
}

function assertCleanArrayPrototype(
    context: string,
    entity: string,
): void {
    for (const key of Reflect.ownKeys(Array.prototype)) {
        if (!ARRAY_PROTOTYPE_ALLOWED_KEYS.has(key)) {
            fail(
                context +
                " inherits forbidden key " +
                String(key) +
                " from Array.prototype for " +
                entity,
            );
        }
    }
}

function assertCleanObjectPrototype(
    context: string,
    entity: string,
): void {
    for (const key of Reflect.ownKeys(Object.prototype)) {
        if (!OBJECT_PROTOTYPE_ALLOWED_KEYS.has(key)) {
            fail(
                context +
                " inherits forbidden key " +
                String(key) +
                " from Object.prototype for " +
                entity,
            );
        }
    }
}

function assertPlainDataPrototype(
    value: object,
    context: string,
    entity: string,
): void {
    const prototype = Object.getPrototypeOf(value);

    if (prototype === null) {
        return;
    }

    if (prototype !== Object.prototype) {
        fail(context + " has unsupported prototype for " + entity);
    }

    assertCleanObjectPrototype(context, entity);
}

function assertDataProperty(
    value: object,
    key: PropertyKey,
    context: string,
    entity: string,
): void {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);

    if (!descriptor || !("value" in descriptor)) {
        fail(
            context +
            " uses accessor key " +
            String(key) +
            " for " +
            entity,
        );
    }
}

function isArrayIndex(key: string, length: number): boolean {
    if (!ARRAY_INDEX.test(key)) {
        return false;
    }

    const index = Number(key);

    return (
        Number.isInteger(index) &&
        index >= 0 &&
        index < length
    );
}

function assertPlainArray(
    value: unknown,
    context: string,
    entity: string,
): asserts value is unknown[] {
    if (!Array.isArray(value)) {
        fail(context + " is not an array for " + entity);
    }

    if (Object.getPrototypeOf(value) !== Array.prototype) {
        fail(context + " has unsupported prototype for " + entity);
    }

    assertCleanObjectPrototype(context, entity);
    assertCleanArrayPrototype(context, entity);
    assertDataProperty(value, "length", context, entity);

    const length = value.length;

    for (const key of Reflect.ownKeys(value)) {
        if (
            key !== "length" &&
            (
                typeof key !== "string" ||
                !isArrayIndex(key, length)
            )
        ) {
            fail(
                context +
                " exposes forbidden array key " +
                String(key) +
                " for " +
                entity,
            );
        }

        assertDataProperty(value, key, context, entity);
    }

    for (let index = 0; index < length; index += 1) {
        const key = String(index);

        if (!hasOwn(value, key)) {
            fail(
                context +
                " has sparse index " +
                key +
                " for " +
                entity,
            );
        }

        assertDataProperty(value, key, context, entity);
    }
}

function assertExactShape(
    value: unknown,
    allowedKeys: ReadonlySet<string>,
    requiredKeys: readonly string[],
    context: string,
    entity: string,
): asserts value is UnknownRecord {
    if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
    ) {
        fail(context + " is not an object for " + entity);
    }

    assertPlainDataPrototype(value, context, entity);

    for (const key of Reflect.ownKeys(value)) {
        if (typeof key !== "string" || !allowedKeys.has(key)) {
            fail(
                context +
                " exposes forbidden key " +
                String(key) +
                " for " +
                entity,
            );
        }

        assertDataProperty(value, key, context, entity);
    }

    for (const key of requiredKeys) {
        if (!hasOwn(value, key)) {
            fail(
                context +
                " lacks required key " +
                key +
                " for " +
                entity,
            );
        }
    }
}

function assertEnumValue(
    value: unknown,
    allowedValues: ReadonlySet<string>,
    context: string,
    entity: string,
): asserts value is string {
    if (
        typeof value !== "string" ||
        !allowedValues.has(value)
    ) {
        fail("invalid " + context + " for " + entity);
    }
}

function isValidIsoDate(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }

    const match = ISO_DATE.exec(value);

    if (!match) {
        return false;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
        date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day
    );
}

function assertSourceStatus(
    value: unknown,
    availability: "PUBLIC" | "RESTRICTED",
    entity: string,
): void {
    assertExactShape(
        value,
        SOURCE_STATUS_ALLOWED_KEYS,
        SOURCE_STATUS_REQUIRED_KEYS,
        availability + " status",
        entity,
    );

    assertEnumValue(
        value.authority,
        SOURCE_AUTHORITIES,
        "source authority",
        entity,
    );

    const roles = value.roles;

    assertPlainArray(
        roles,
        "source roles",
        entity,
    );

    for (let index = 0; index < roles.length; index += 1) {
        const role = roles[index];

        assertEnumValue(
            role,
            SOURCE_ROLES,
            "source role",
            entity,
        );
    }
}

function assertSourceCoverage(
    value: unknown,
    availability: "PUBLIC" | "RESTRICTED",
    entity: string,
): void {
    assertPlainArray(
        value,
        availability + " coverage",
        entity,
    );

    for (let index = 0; index < value.length; index += 1) {
        const qualification = value[index];

        assertExactShape(
            qualification,
            SOURCE_COVERAGE_ALLOWED_KEYS,
            SOURCE_COVERAGE_REQUIRED_KEYS,
            availability + " coverage",
            entity,
        );

        assertEnumValue(
            qualification.area,
            SOURCE_COVERAGE_AREAS,
            "coverage area",
            entity,
        );

        assertEnumValue(
            qualification.support,
            SOURCE_SUPPORTS,
            "coverage support",
            entity,
        );
    }
}

export function assertProvenanceIntegrity(
    systems: readonly SystemRecord[],
    provenance: readonly ProvenanceRecord[],
): void {
    assertPlainArray(
        systems,
        "systems corpus",
        "integrity input",
    );

    assertPlainArray(
        provenance,
        "provenance corpus",
        "integrity input",
    );

    const systemIds = new Set<string>(systems.map(({ id }) => id));

    if (systemIds.size !== systems.length) {
        fail("duplicate system identity");
    }

    for (
        let recordIndex = 0;
        recordIndex < provenance.length;
        recordIndex += 1
    ) {
        const record = provenance[recordIndex];

        assertExactShape(
            record,
            PROVENANCE_ALLOWED_KEYS,
            PROVENANCE_REQUIRED_KEYS,
            "provenance record",
            "unresolved entity",
        );

        const candidate = record as UnknownRecord;

        if (typeof candidate.entity !== "string") {
            fail("invalid provenance entity");
        }

        const entity = candidate.entity;

        if (!systemIds.has(entity)) {
            fail("orphan provenance entity: " + entity);
        }

        if (!isValidIsoDate(candidate.checkedAt)) {
            fail("invalid checkedAt for " + entity);
        }

        assertEnumValue(
            candidate.availability,
            SOURCE_AVAILABILITIES,
            "source availability",
            entity,
        );

        if (candidate.availability === "PUBLIC") {
            assertExactShape(
                candidate,
                PUBLIC_ALLOWED_KEYS,
                PUBLIC_REQUIRED_KEYS,
                "PUBLIC source",
                entity,
            );

            assertEnumValue(
                candidate.kind,
                SOURCE_KINDS,
                "source kind",
                entity,
            );

            if (
                hasOwn(candidate, "label") &&
                typeof candidate.label !== "string"
            ) {
                fail("invalid PUBLIC label for " + entity);
            }

            if (
                typeof candidate.locator !== "string" ||
                !candidate.locator.trim()
            ) {
                fail("PUBLIC source lacks locator for " + entity);
            }

            assertSourceStatus(
                candidate.status,
                "PUBLIC",
                entity,
            );

            assertSourceCoverage(
                candidate.coverage,
                "PUBLIC",
                entity,
            );

            continue;
        }

        if (candidate.availability === "RESTRICTED") {
            assertExactShape(
                candidate,
                RESTRICTED_ALLOWED_KEYS,
                RESTRICTED_REQUIRED_KEYS,
                "RESTRICTED source",
                entity,
            );

            assertEnumValue(
                candidate.kind,
                SOURCE_KINDS,
                "source kind",
                entity,
            );

            assertSourceStatus(
                candidate.status,
                "RESTRICTED",
                entity,
            );

            assertSourceCoverage(
                candidate.coverage,
                "RESTRICTED",
                entity,
            );

            continue;
        }

        assertExactShape(
            candidate,
            NONE_ALLOWED_KEYS,
            NONE_REQUIRED_KEYS,
            "NONE source",
            entity,
        );

        assertPlainArray(
            candidate.coverage,
            "NONE coverage",
            entity,
        );

        if (candidate.coverage.length !== 0) {
            fail("NONE source has coverage for " + entity);
        }
    }

    for (const system of systems) {
        const records = provenance.filter(
            ({ entity }) => entity === system.id,
        );

        const noneRecords = records.filter(
            ({ availability }) => availability === "NONE",
        );

        if (noneRecords.length > 0 && records.length !== 1) {
            fail("NONE source is not exclusive for " + system.id);
        }

        if (system.evidence === "NO SOURCE") {
            if (
                records.length !== 1 ||
                records[0]?.availability !== "NONE"
            ) {
                fail("NO SOURCE contract violated for " + system.id);
            }

            continue;
        }

        if (system.evidence !== "SOURCE-VERIFIED") {
            continue;
        }

        const hasQualifiedSource = records.some(
            (record) =>
                record.availability !== "NONE" &&
                record.coverage.length > 0,
        );

        if (!hasQualifiedSource) {
            fail(
                "SOURCE-VERIFIED lacks qualified source for " +
                system.id,
            );
        }

        const hasCurrentAuthority = records.some(
            (record) =>
                record.availability !== "NONE" &&
                record.coverage.length > 0 &&
                (
                    record.status.authority === "CANONICAL" ||
                    record.status.authority === "PROVISIONAL"
                ),
        );

        if (!hasCurrentAuthority) {
            fail(
                "SOURCE-VERIFIED lacks current authority for " +
                system.id,
            );
        }
    }
}
