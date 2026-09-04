import type { ProvenanceRecord, SystemRecord } from "./types";

/**
 * Build-time trust boundary:
 *
 * This validator checks repository-owned static data during the site build.
 * It assumes an uncompromised JavaScript/Node realm. Code that executes
 * before this module and replaces platform intrinsics is outside this data
 * integrity contract because such code already controls the build process.
 */

type NodeProcess = {
    getBuiltinModule?: (name: string) => unknown;
};

type NodeUtilModule = {
    types?: {
        isProxy?: (value: object) => boolean;
    };
};

const nodeProcess = (
    globalThis as typeof globalThis & {
        process?: NodeProcess;
    }
).process;

const nodeUtil = nodeProcess?.getBuiltinModule?.(
    "node:util",
) as NodeUtilModule | undefined;

const nodeProxyDetector = nodeUtil?.types?.isProxy;

const SOURCE_AVAILABILITIES = [
    "PUBLIC",
    "RESTRICTED",
    "NONE",
] as const;

const SYSTEM_IDS = [
    "obs",
    "food",
    "moka",
    "fnode",
] as const;

const SYSTEM_EVIDENCE = [
    "SOURCE-VERIFIED",
    "OWNER-DECLARED",
    "NO SOURCE",
] as const;

const SYSTEM_REQUIRED_KEYS = [
    "id",
    "evidence",
] as const;

const SOURCE_KINDS = [
    "REPOSITORY",
    "SPECIFICATION",
    "ARTIFACT",
    "DECLARATION",
] as const;

const SOURCE_AUTHORITIES = [
    "CANONICAL",
    "PROVISIONAL",
    "LEGACY",
] as const;

const SOURCE_ROLES = [
    "DECLARATIVE",
    "DESCRIPTIVE",
    "NORMATIVE",
    "EXPERIMENTAL",
] as const;

const SOURCE_COVERAGE_AREAS = [
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
] as const;

const SOURCE_SUPPORTS = [
    "ASSERTS",
    "SPECIFIES",
    "DEMONSTRATES",
] as const;

const PROVENANCE_ALLOWED_KEYS = [
    "entity",
    "availability",
    "kind",
    "label",
    "locator",
    "status",
    "checkedAt",
    "coverage",
] as const;

const PROVENANCE_REQUIRED_KEYS = [
    "entity",
    "availability",
    "checkedAt",
    "coverage",
] as const;

const PUBLIC_ALLOWED_KEYS = [
    "entity",
    "availability",
    "kind",
    "label",
    "locator",
    "status",
    "checkedAt",
    "coverage",
] as const;

const PUBLIC_REQUIRED_KEYS = [
    "entity",
    "availability",
    "kind",
    "locator",
    "status",
    "checkedAt",
    "coverage",
] as const;

const RESTRICTED_ALLOWED_KEYS = [
    "entity",
    "availability",
    "kind",
    "status",
    "checkedAt",
    "coverage",
] as const;

const RESTRICTED_REQUIRED_KEYS = [
    "entity",
    "availability",
    "kind",
    "status",
    "checkedAt",
    "coverage",
] as const;

const SOURCE_STATUS_ALLOWED_KEYS = [
    "authority",
    "roles",
] as const;

const SOURCE_STATUS_REQUIRED_KEYS = [
    "authority",
    "roles",
] as const;

const SOURCE_COVERAGE_ALLOWED_KEYS = [
    "area",
    "support",
] as const;

const SOURCE_COVERAGE_REQUIRED_KEYS = [
    "area",
    "support",
] as const;

const NONE_ALLOWED_KEYS = [
    "entity",
    "availability",
    "checkedAt",
    "coverage",
] as const;

const NONE_REQUIRED_KEYS = [
    "entity",
    "availability",
    "checkedAt",
    "coverage",
] as const;

const OBJECT_PROTOTYPE_ALLOWED_KEYS = [
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
] as const;

const ARRAY_PROTOTYPE_ALLOWED_KEYS = [
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
] as const;


type UnknownRecord = Record<PropertyKey, unknown>;

function fail(message: string): never {
    throw new Error("[provenance-integrity] " + message);
}

function isProxyValue(value: object): boolean {
    if (typeof nodeProxyDetector !== "function") {
        fail("Node proxy detection unavailable");
    }

    return nodeProxyDetector(value);
}


function containsStrict(
    values: readonly unknown[],
    candidate: unknown,
): boolean {
    for (let index = 0; index < values.length; index += 1) {
        if (values[index] === candidate) {
            return true;
        }
    }

    return false;
}

function assertCleanArrayPrototype(
    context: string,
    entity: string,
): void {
    const keys = Reflect.ownKeys(Array.prototype);

    for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];

        if (!containsStrict(ARRAY_PROTOTYPE_ALLOWED_KEYS, key)) {
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
    const keys = Reflect.ownKeys(Object.prototype);

    for (let index = 0; index < keys.length; index += 1) {
        const key = keys[index];

        if (!containsStrict(OBJECT_PROTOTYPE_ALLOWED_KEYS, key)) {
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
    if (isProxyValue(value)) {
        fail(context + " cannot be a Proxy for " + entity);
    }

    const prototype = Object.getPrototypeOf(value);

    if (prototype === null) {
        return;
    }

    if (prototype !== Object.prototype) {
        fail(context + " has unsupported prototype for " + entity);
    }

    assertCleanObjectPrototype(context, entity);
}

function getDataPropertyDescriptor(
    value: object,
    key: PropertyKey,
    context: string,
    entity: string,
): PropertyDescriptor & { value: unknown } {
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

    return descriptor as PropertyDescriptor & { value: unknown };
}

function isArrayIndex(key: string, length: number): boolean {
    if (key.length === 0) {
        return false;
    }

    if (key.length > 1 && key[0] === "0") {
        return false;
    }

    let index = 0;

    for (let position = 0; position < key.length; position += 1) {
        const digit = decimalDigit(key, position);

        if (digit < 0) {
            return false;
        }

        index = index * 10 + digit;

        if (index >= length) {
            return false;
        }
    }

    return true;
}

function snapshotPlainArray(
    value: unknown,
    context: string,
    entity: string,
): unknown[] {
    if (!Array.isArray(value)) {
        fail(context + " is not an array for " + entity);
    }

    if (isProxyValue(value)) {
        fail(context + " cannot be a Proxy for " + entity);
    }

    if (Object.getPrototypeOf(value) !== Array.prototype) {
        fail(context + " has unsupported prototype for " + entity);
    }

    assertCleanObjectPrototype(context, entity);
    assertCleanArrayPrototype(context, entity);

    const lengthDescriptor = getDataPropertyDescriptor(
        value,
        "length",
        context,
        entity,
    );

    const length = lengthDescriptor.value;

    if (
        typeof length !== "number" ||
        !Number.isInteger(length) ||
        length < 0
    ) {
        fail(context + " has invalid length for " + entity);
    }

    const ownKeys = Reflect.ownKeys(value);

    for (
        let keyIndex = 0;
        keyIndex < ownKeys.length;
        keyIndex += 1
    ) {
        const key = ownKeys[keyIndex];

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

        getDataPropertyDescriptor(
            value,
            key,
            context,
            entity,
        );
    }

    const snapshot: unknown[] = [];

    for (let index = 0; index < length; index += 1) {
        const key = String(index);
        const descriptor = Object.getOwnPropertyDescriptor(
            value,
            key,
        );

        if (!descriptor) {
            fail(
                context +
                " has sparse index " +
                key +
                " for " +
                entity,
            );
        }

        if (!("value" in descriptor)) {
            fail(
                context +
                " uses accessor key " +
                key +
                " for " +
                entity,
            );
        }

        snapshot[index] = descriptor.value;
    }

    return snapshot;
}

function snapshotExactShape(
    value: unknown,
    allowedKeys: readonly string[],
    requiredKeys: readonly string[],
    context: string,
    entity: string,
): UnknownRecord {
    if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
    ) {
        fail(context + " is not an object for " + entity);
    }

    assertPlainDataPrototype(value, context, entity);

    const snapshot = Object.create(null) as UnknownRecord;
    const ownKeys = Reflect.ownKeys(value);

    for (
        let keyIndex = 0;
        keyIndex < ownKeys.length;
        keyIndex += 1
    ) {
        const key = ownKeys[keyIndex];

        if (typeof key !== "string" || !containsStrict(allowedKeys, key)) {
            fail(
                context +
                " exposes forbidden key " +
                String(key) +
                " for " +
                entity,
            );
        }

        snapshot[key] = getDataPropertyDescriptor(
            value,
            key,
            context,
            entity,
        ).value;
    }

    for (
        let keyIndex = 0;
        keyIndex < requiredKeys.length;
        keyIndex += 1
    ) {
        const key = requiredKeys[keyIndex];

        if (
            Object.getOwnPropertyDescriptor(snapshot, key) ===
            undefined
        ) {
            fail(
                context +
                " lacks required key " +
                key +
                " for " +
                entity,
            );
        }
    }

    return snapshot;
}

function snapshotRequiredDataProperties(
    value: unknown,
    requiredKeys: readonly string[],
    context: string,
    entity: string,
): UnknownRecord {
    if (
        typeof value !== "object" ||
        value === null ||
        Array.isArray(value)
    ) {
        fail(context + " is not an object for " + entity);
    }

    assertPlainDataPrototype(value, context, entity);

    const snapshot = Object.create(null) as UnknownRecord;

    for (
        let keyIndex = 0;
        keyIndex < requiredKeys.length;
        keyIndex += 1
    ) {
        const key = requiredKeys[keyIndex];

        snapshot[key] = getDataPropertyDescriptor(
            value,
            key,
            context,
            entity,
        ).value;
    }

    return snapshot;
}

function assertEnumValue(
    value: unknown,
    allowedValues: readonly string[],
    context: string,
    entity: string,
): asserts value is string {
    if (
        typeof value !== "string" ||
        !containsStrict(allowedValues, value)
    ) {
        fail("invalid " + context + " for " + entity);
    }
}

function decimalDigit(value: string, index: number): number {
    switch (value[index]) {
        case "0": return 0;
        case "1": return 1;
        case "2": return 2;
        case "3": return 3;
        case "4": return 4;
        case "5": return 5;
        case "6": return 6;
        case "7": return 7;
        case "8": return 8;
        case "9": return 9;
        default: return -1;
    }
}

function parseDecimal(
    value: string,
    start: number,
    end: number,
): number {
    let result = 0;

    for (let index = start; index < end; index += 1) {
        const digit = decimalDigit(value, index);

        if (digit < 0) {
            return -1;
        }

        result = result * 10 + digit;
    }

    return result;
}

function daysInMonth(year: number, month: number): number {
    if (month === 2) {
        const leap =
            year % 4 === 0 &&
            (year % 100 !== 0 || year % 400 === 0);

        return leap ? 29 : 28;
    }

    if (
        month === 4 ||
        month === 6 ||
        month === 9 ||
        month === 11
    ) {
        return 30;
    }

    return 31;
}

export function isValidIsoDate(value: unknown): boolean {
    if (
        typeof value !== "string" ||
        value.length !== 10 ||
        value[4] !== "-" ||
        value[7] !== "-"
    ) {
        return false;
    }

    const year = parseDecimal(value, 0, 4);
    const month = parseDecimal(value, 5, 7);
    const day = parseDecimal(value, 8, 10);

    if (
        year < 100 ||
        month < 1 ||
        month > 12 ||
        day < 1
    ) {
        return false;
    }

    return day <= daysInMonth(year, month);
}

function isTrimWhitespace(value: string): boolean {
    switch (value) {
        case "\u0009":
        case "\u000A":
        case "\u000B":
        case "\u000C":
        case "\u000D":
        case "\u0020":
        case "\u00A0":
        case "\u1680":
        case "\u2000":
        case "\u2001":
        case "\u2002":
        case "\u2003":
        case "\u2004":
        case "\u2005":
        case "\u2006":
        case "\u2007":
        case "\u2008":
        case "\u2009":
        case "\u200A":
        case "\u2028":
        case "\u2029":
        case "\u202F":
        case "\u205F":
        case "\u3000":
        case "\uFEFF":
            return true;
        default:
            return false;
    }
}

function isNonBlankString(value: unknown): value is string {
    if (typeof value !== "string") {
        return false;
    }

    for (let index = 0; index < value.length; index += 1) {
        if (!isTrimWhitespace(value[index])) {
            return true;
        }
    }

    return false;
}

function assertSourceStatus(
    value: unknown,
    availability: "PUBLIC" | "RESTRICTED",
    entity: string,
): string {
    const status = snapshotExactShape(
        value,
        SOURCE_STATUS_ALLOWED_KEYS,
        SOURCE_STATUS_REQUIRED_KEYS,
        availability + " status",
        entity,
    );

    const authority = status.authority;

    assertEnumValue(
        authority,
        SOURCE_AUTHORITIES,
        "source authority",
        entity,
    );

    const roles = snapshotPlainArray(
        status.roles,
        "source roles",
        entity,
    );

    for (let index = 0; index < roles.length; index += 1) {
        assertEnumValue(
            roles[index],
            SOURCE_ROLES,
            "source role",
            entity,
        );
    }

    return authority;
}

function assertSourceCoverage(
    value: unknown,
    availability: "PUBLIC" | "RESTRICTED",
    entity: string,
): number {
    const qualifications = snapshotPlainArray(
        value,
        availability + " coverage",
        entity,
    );

    for (
        let index = 0;
        index < qualifications.length;
        index += 1
    ) {
        const qualification = snapshotExactShape(
            qualifications[index],
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

    return qualifications.length;
}

export function assertProvenanceIntegrity(
    systems: readonly SystemRecord[],
    provenance: readonly ProvenanceRecord[],
): void {
    const systemValues = snapshotPlainArray(
        systems,
        "systems corpus",
        "integrity input",
    );

    const provenanceValues = snapshotPlainArray(
        provenance,
        "provenance corpus",
        "integrity input",
    );

    const systemSnapshots: Array<{
        id: string;
        evidence: string;
    }> = [];

    for (
        let systemIndex = 0;
        systemIndex < systemValues.length;
        systemIndex += 1
    ) {
        const system = snapshotRequiredDataProperties(
            systemValues[systemIndex],
            SYSTEM_REQUIRED_KEYS,
            "system record",
            "integrity input",
        );

        const id = system.id;

        assertEnumValue(
            id,
            SYSTEM_IDS,
            "system identity",
            "integrity input",
        );

        const evidence = system.evidence;

        assertEnumValue(
            evidence,
            SYSTEM_EVIDENCE,
            "system evidence",
            id,
        );

        for (
            let priorIndex = 0;
            priorIndex < systemSnapshots.length;
            priorIndex += 1
        ) {
            if (systemSnapshots[priorIndex].id === id) {
                fail("duplicate system identity");
            }
        }

        systemSnapshots[systemIndex] = {
            id,
            evidence,
        };
    }

    const validatedRecords: Array<{
        entity: string;
        availability: string;
        coverageLength: number;
        authority: string | null;
    }> = [];

    for (
        let recordIndex = 0;
        recordIndex < provenanceValues.length;
        recordIndex += 1
    ) {
        const candidate = snapshotExactShape(
            provenanceValues[recordIndex],
            PROVENANCE_ALLOWED_KEYS,
            PROVENANCE_REQUIRED_KEYS,
            "provenance record",
            "unresolved entity",
        );

        const entityValue = candidate.entity;

        if (typeof entityValue !== "string") {
            fail("invalid provenance entity");
        }

        const entity = entityValue;
        let knownSystem = false;

        for (
            let systemIndex = 0;
            systemIndex < systemSnapshots.length;
            systemIndex += 1
        ) {
            if (systemSnapshots[systemIndex].id === entity) {
                knownSystem = true;
                break;
            }
        }

        if (!knownSystem) {
            fail("orphan provenance entity: " + entity);
        }

        if (!isValidIsoDate(candidate.checkedAt)) {
            fail("invalid checkedAt for " + entity);
        }

        const availability = candidate.availability;

        assertEnumValue(
            availability,
            SOURCE_AVAILABILITIES,
            "source availability",
            entity,
        );

        if (availability === "PUBLIC") {
            const source = snapshotExactShape(
                candidate,
                PUBLIC_ALLOWED_KEYS,
                PUBLIC_REQUIRED_KEYS,
                "PUBLIC source",
                entity,
            );

            assertEnumValue(
                source.kind,
                SOURCE_KINDS,
                "source kind",
                entity,
            );

            const labelDescriptor =
                Object.getOwnPropertyDescriptor(
                    source,
                    "label",
                );

            if (
                labelDescriptor &&
                typeof labelDescriptor.value !== "string"
            ) {
                fail("invalid PUBLIC label for " + entity);
            }

            const locator = source.locator;

            if (!isNonBlankString(locator)) {
                fail("PUBLIC source lacks locator for " + entity);
            }

            const authority = assertSourceStatus(
                source.status,
                "PUBLIC",
                entity,
            );

            const coverageLength = assertSourceCoverage(
                source.coverage,
                "PUBLIC",
                entity,
            );

            validatedRecords[recordIndex] = {
                entity,
                availability,
                coverageLength,
                authority,
            };

            continue;
        }

        if (availability === "RESTRICTED") {
            const source = snapshotExactShape(
                candidate,
                RESTRICTED_ALLOWED_KEYS,
                RESTRICTED_REQUIRED_KEYS,
                "RESTRICTED source",
                entity,
            );

            assertEnumValue(
                source.kind,
                SOURCE_KINDS,
                "source kind",
                entity,
            );

            const authority = assertSourceStatus(
                source.status,
                "RESTRICTED",
                entity,
            );

            const coverageLength = assertSourceCoverage(
                source.coverage,
                "RESTRICTED",
                entity,
            );

            validatedRecords[recordIndex] = {
                entity,
                availability,
                coverageLength,
                authority,
            };

            continue;
        }

        const source = snapshotExactShape(
            candidate,
            NONE_ALLOWED_KEYS,
            NONE_REQUIRED_KEYS,
            "NONE source",
            entity,
        );

        const coverage = snapshotPlainArray(
            source.coverage,
            "NONE coverage",
            entity,
        );

        if (coverage.length !== 0) {
            fail("NONE source has coverage for " + entity);
        }

        validatedRecords[recordIndex] = {
            entity,
            availability,
            coverageLength: 0,
            authority: null,
        };
    }

    for (
        let systemIndex = 0;
        systemIndex < systemSnapshots.length;
        systemIndex += 1
    ) {
        const system = systemSnapshots[systemIndex];
        let recordCount = 0;
        let noneCount = 0;
        let hasQualifiedSource = false;
        let hasCurrentAuthority = false;

        for (
            let recordIndex = 0;
            recordIndex < validatedRecords.length;
            recordIndex += 1
        ) {
            const record = validatedRecords[recordIndex];

            if (record.entity !== system.id) {
                continue;
            }

            recordCount += 1;

            if (record.availability === "NONE") {
                noneCount += 1;
                continue;
            }

            if (record.coverageLength > 0) {
                hasQualifiedSource = true;

                if (
                    record.authority === "CANONICAL" ||
                    record.authority === "PROVISIONAL"
                ) {
                    hasCurrentAuthority = true;
                }
            }
        }

        if (noneCount > 0 && recordCount !== 1) {
            fail(
                "NONE source is not exclusive for " +
                system.id,
            );
        }

        if (system.evidence === "NO SOURCE") {
            if (recordCount !== 1 || noneCount !== 1) {
                fail(
                    "NO SOURCE contract violated for " +
                    system.id,
                );
            }

            continue;
        }

        if (system.evidence === "OWNER-DECLARED") {
            continue;
        }

        if (system.evidence !== "SOURCE-VERIFIED") {
            fail("invalid system evidence for " + system.id);
        }

        if (!hasQualifiedSource) {
            fail(
                "SOURCE-VERIFIED lacks qualified source for " +
                system.id,
            );
        }

        if (!hasCurrentAuthority) {
            fail(
                "SOURCE-VERIFIED lacks current authority for " +
                system.id,
            );
        }
    }
}
