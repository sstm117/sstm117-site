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

type UnknownRecord = Record<PropertyKey, unknown>;

function fail(message: string): never {
    throw new Error("[provenance-integrity] " + message);
}

function hasOwn(record: object, key: PropertyKey): boolean {
    return Object.prototype.hasOwnProperty.call(record, key);
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

    if (!Array.isArray(value.roles)) {
        fail("invalid source roles for " + entity);
    }

    for (const role of value.roles) {
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
    if (!Array.isArray(value)) {
        fail(availability + " coverage is not an array for " + entity);
    }

    for (const qualification of value) {
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
    const systemIds = new Set(systems.map(({ id }) => id));

    if (systemIds.size !== systems.length) {
        fail("duplicate system identity");
    }

    for (const record of provenance) {
        if (
            typeof record !== "object" ||
            record === null ||
            Array.isArray(record)
        ) {
            fail("provenance record is not an object");
        }

        const candidate = record as unknown as UnknownRecord;
        const entity = String(candidate.entity);

        if (!systemIds.has(record.entity)) {
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

        if (!Array.isArray(candidate.coverage)) {
            fail("NONE coverage is not an array for " + entity);
        }

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
