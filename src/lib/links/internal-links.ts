import {
  INVALID_INTERNAL_PREFIXES,
  LEGACY_INTERNAL_ROUTES,
} from "@/lib/routes/site-routes";

export type InternalLinkIssueKind = "RELATIVE" | "LEGACY" | "INVALID_NAMESPACE";
export type InternalLinkIssue = {
  href: string;
  kind: InternalLinkIssueKind;
  message: string;
  suggestedHref?: string;
};

const HREF_PATTERN = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
const EXTERNAL_OR_SPECIAL = /^(?:https?:|mailto:|tel:|#|data:|javascript:)/i;

export function inspectInternalHref(rawHref: string): InternalLinkIssue | null {
  const href = rawHref.trim();
  if (!href || EXTERNAL_OR_SPECIAL.test(href)) return null;
  if (!href.startsWith("/")) {
    const rooted = `/${href.replace(/^\.\//, "")}`;
    const canonical = LEGACY_INTERNAL_ROUTES[rooted] ?? rooted;
    return {
      href,
      kind: "RELATIVE",
      message: "Internal links must be site-root-relative.",
      suggestedHref: canonical,
    };
  }
  const path = href.split(/[?#]/, 1)[0];
  const legacy = LEGACY_INTERNAL_ROUTES[path];
  if (legacy)
    return {
      href,
      kind: "LEGACY",
      message: "Internal link uses a legacy redirect route.",
      suggestedHref: legacy,
    };
  const invalidPrefix = INVALID_INTERNAL_PREFIXES.find((prefix) =>
    path.startsWith(prefix)
  );
  if (invalidPrefix) {
    const slug = path.slice(invalidPrefix.length);
    const targetRoot = invalidPrefix.includes("news") ? "/news" : "/guides";
    return {
      href,
      kind: "INVALID_NAMESPACE",
      message:
        "Articles do not live below market-specific guide/news namespaces.",
      suggestedHref: `${targetRoot}/${slug}`,
    };
  }
  return null;
}

export function findInternalLinkIssues(html: string): InternalLinkIssue[] {
  const issues: InternalLinkIssue[] = [];
  for (const match of html.matchAll(HREF_PATTERN)) {
    const issue = inspectInternalHref(match[1]);
    if (issue) issues.push(issue);
  }
  return issues;
}
