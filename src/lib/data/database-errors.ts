/**
 * Database availability classification.
 *
 * Keep this deliberately narrow. Configuration/authentication errors, invalid
 * queries, schema drift and application defects must continue to throw rather
 * than being presented as a temporary outage.
 */
const DATABASE_UNAVAILABLE_CODES = new Set([
  "P1001",
  "P1002",
  "P1008",
  "P1017",
]);

export type DatabaseErrorMetadata = {
  name: string;
  code?: string;
};

function errorCode(error: Error): string | undefined {
  const candidate = error as Error & { code?: unknown; errorCode?: unknown };
  if (typeof candidate.code === "string") return candidate.code;
  if (typeof candidate.errorCode === "string") return candidate.errorCode;
  return undefined;
}

export function isDatabaseUnavailableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const code = errorCode(error);
  if (code && DATABASE_UNAVAILABLE_CODES.has(code)) return true;

  // Prisma can surface a connectivity failure as an initialization error
  // without a public error code. Match only connectivity wording; do not treat
  // every initialization error as an outage (bad credentials/configuration
  // should remain visible to developers/operators).
  const message = error.message.toLowerCase();
  return (
    message.includes("can't reach database server") ||
    message.includes("cannot reach database server") ||
    message.includes("connection refused") ||
    message.includes("connection terminated") ||
    message.includes("server has closed the connection") ||
    message.includes("connection reset by peer")
  );
}

export function databaseErrorMetadata(error: unknown): DatabaseErrorMetadata {
  if (!(error instanceof Error)) return { name: "UnknownError" };
  return {
    name: error.name || "Error",
    ...(errorCode(error) ? { code: errorCode(error) } : {}),
  };
}
