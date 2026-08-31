import type { ProvenanceRecord, SystemRecord } from "./types";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

const RESTRICTED_ALLOWED_KEYS = new Set([
    "entity",
    "availability",
    "kind",
    "status",
    "checkedAt",
    "coverage",
]);

const RESTRICTED_STATUS_ALLOWED_KEYS = new Set([
    "authority",
    "roles",
]);

const RESTRICTED_COVERAGE_ALLOWED_KEYS = new Set([
    "area",
    "support",
]);

const NONE_ALLOWED_KEYS = new Set([
    "entity",
    "availability",
    "checkedAt",
    "coverage",
]);

function fail(message: string): never {
    throw new Error("[provenance-integrity] " + message);
}

function isValidIsoDate(value: string): boolean {
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

export function assertProvenanceIntegrity(
    systems: readonly SystemRecord[],
    provenance: readonly ProvenanceRecord[],
): void {
    const systemIds = new Set(systems.map(({ id }) => id));

    if (systemIds.size !== systems.length) {
        fail("duplicate system identity");
    }

    for (const record of provenance) {
        if (!systemIds.has(record.entity)) {
            fail("orphan provenance entity: " + record.entity);
        }

        if (!isValidIsoDate(record.checkedAt)) {
            fail("invalid checkedAt for " + record.entity);
        }

        if (record.availability === "PUBLIC") {
            if (!record.locator.trim()) {
                fail("PUBLIC source lacks locator for " + record.entity);
            }

            continue;
        }

        if (record.availability === "RESTRICTED") {
            for (const key of Object.keys(record)) {
                if (!RESTRICTED_ALLOWED_KEYS.has(key)) {
                    fail(
                        "RESTRICTED source exposes forbidden key " +
                        key +
                        " for " +
                        record.entity,
                    );
                }
            }

            for (const key of Object.keys(record.status)) {
                if (!RESTRICTED_STATUS_ALLOWED_KEYS.has(key)) {
                    fail(
                        "RESTRICTED status exposes forbidden key " +
                        key +
                        " for " +
                        record.entity,
                    );
                }
            }

            for (const qualification of record.coverage) {
                for (const key of Object.keys(qualification)) {
                    if (!RESTRICTED_COVERAGE_ALLOWED_KEYS.has(key)) {
                        fail(
                            "RESTRICTED coverage exposes forbidden key " +
                            key +
                            " for " +
                            record.entity,
                        );
                    }
                }
            }

            continue;
        }

        if (record.coverage.length !== 0) {
            fail("NONE source has coverage for " + record.entity);
        }

        for (const key of Object.keys(record)) {
            if (!NONE_ALLOWED_KEYS.has(key)) {
                fail(
                    "NONE source exposes forbidden key " +
                    key +
                    " for " +
                    record.entity,
                );
            }
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
                record.status.authority !== "LEGACY",
        );

        if (!hasCurrentAuthority) {
            fail(
                "SOURCE-VERIFIED relies only on LEGACY authority for " +
                system.id,
            );
        }
    }
}
