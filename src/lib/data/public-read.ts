import "server-only";
import { safeDatabaseQuery, type DataResult } from "./safe-database-query";

/** Named wrapper for public read paths. It keeps call sites concise while
 * preserving the 8.5 invariant: an outage is never represented as empty data. */
export function publicDatabaseRead<T>(
  operation: string,
  query: () => Promise<T>
): Promise<DataResult<T>> {
  return safeDatabaseQuery(operation, query);
}
