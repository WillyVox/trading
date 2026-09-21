import { NextRequest, NextResponse } from "next/server";

const MAX_BODY_BYTES = 8 * 1024;
const MAX_FIELD_LENGTH = 200;

const REPORTED_FIELDS = [
  "document-uri",
  "violated-directive",
  "effective-directive",
  "blocked-uri",
  "source-file",
  "disposition",
] as const;

/** Reduces a reported URI to origin + path (query strings can hold tokens) and caps its length. */
function cleanValue(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  let cleaned = value;
  try {
    const url = new URL(value);
    cleaned = `${url.origin}${url.pathname}`;
  } catch {
    // Not a URL (e.g. "inline", "eval") -- keep the keyword as-is.
  }
  return cleaned.slice(0, MAX_FIELD_LENGTH);
}

/**
 * Receives Content-Security-Policy-Report-Only violation reports (see
 * next.config.mjs) and writes a trimmed copy to the server log so the policy
 * can be reviewed before it is enforced. Unauthenticated by necessity --
 * browsers send these -- so the body size, the fields kept and each value's
 * length are all capped, and nothing from the request is stored.
 */
export async function POST(req: NextRequest) {
  const declaredLength = Number(req.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 });
  }

  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) {
    return new NextResponse(null, { status: 413 });
  }

  let report: unknown;
  try {
    const parsed: unknown = JSON.parse(text);
    report =
      parsed && typeof parsed === "object" && "csp-report" in parsed
        ? (parsed as Record<string, unknown>)["csp-report"]
        : undefined;
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (!report || typeof report !== "object") {
    return new NextResponse(null, { status: 400 });
  }

  const fields: Record<string, string> = {};
  for (const name of REPORTED_FIELDS) {
    const value = cleanValue((report as Record<string, unknown>)[name]);
    if (value) fields[name] = value;
  }
  console.warn("[csp-report]", JSON.stringify(fields));

  return new NextResponse(null, { status: 204 });
}
