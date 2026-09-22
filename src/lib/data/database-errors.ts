const DATABASE_UNAVAILABLE_CODES = new Set([
  "P1001",
  "P1002",
  "P1008",
  "P1017",
]);

export function isDatabaseUnavailableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const candidate = error as Error & { code?: string };
  if (candidate.name === "PrismaClientInitializationError") return true;
  if (candidate.code && DATABASE_UNAVAILABLE_CODES.has(candidate.code))
    return true;
  const message = candidate.message.toLowerCase();
  return (
    message.includes("can't reach database server") ||
    message.includes("cannot reach database server") ||
    message.includes("connection refused") ||
    message.includes("connection terminated") ||
    message.includes("server has closed the connection")
  );
}
