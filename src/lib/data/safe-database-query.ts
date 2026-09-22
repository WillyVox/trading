import "server-only";
import { isDatabaseUnavailableError } from "./database-errors";

export type DataResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "DATABASE_UNAVAILABLE"; retryable: true };

export async function safeDatabaseQuery<T>(
  operation: string,
  query: () => Promise<T>
): Promise<DataResult<T>> {
  try {
    return { ok: true, data: await query() };
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
    console.error("DATABASE_UNAVAILABLE", { operation, retryable: true });
    return { ok: false, reason: "DATABASE_UNAVAILABLE", retryable: true };
  }
}
