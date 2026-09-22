import "server-only";

import {
  databaseErrorMetadata,
  isDatabaseUnavailableError,
} from "./database-errors";

export type DatabaseUnavailableResult = {
  ok: false;
  reason: "DATABASE_UNAVAILABLE";
  retryable: true;
};

export type DataResult<T> = { ok: true; data: T } | DatabaseUnavailableResult;

/**
 * Executes a database-backed read while preserving the distinction between:
 * - a successful query (including a legitimate empty/null result),
 * - a recognized temporary database availability failure, and
 * - an unexpected/programming/configuration error, which is re-thrown.
 *
 * This helper never invents fallback data and never converts an outage to []
 * or null. UI degradation is intentionally a Phase 8.5.2 concern.
 */
export async function safeDatabaseQuery<T>(
  operation: string,
  query: () => Promise<T>
): Promise<DataResult<T>> {
  try {
    return { ok: true, data: await query() };
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;

    // Do not log error.message here: Prisma messages can contain connection
    // topology. Operation + safe name/code are sufficient for this boundary.
    console.error("DATABASE_UNAVAILABLE", {
      operation,
      retryable: true,
      ...databaseErrorMetadata(error),
    });

    return { ok: false, reason: "DATABASE_UNAVAILABLE", retryable: true };
  }
}
