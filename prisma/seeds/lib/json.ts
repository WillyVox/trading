/**
 * JSON seed files store dates as ISO strings. Seed writers and Prisma expect
 * Date instances, so revive date-only / ISO date-time values at the loader
 * boundary while leaving every other JSON value untouched.
 *
 * The return type is intentionally dynamic: individual JSON files are the
 * source of truth for seed data and Prisma validates the resulting writes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reviveSeedJson(value: unknown): any {
  if (Array.isArray(value)) return value.map(reviveSeedJson);

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, reviveSeedJson(child)])
    );
  }

  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z)?$/.test(value)
  ) {
    return new Date(value);
  }

  return value;
}
