"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type {
  SearchDocument,
  SearchDocumentType,
  SearchResponse,
} from "@/lib/search/types";

const TYPE_LABEL: Record<SearchDocumentType, string> = {
  GUIDE: "Guides",
  ARTICLE: "Articles",
  NEWS: "News",
  TOOL: "Tools",
};

const TYPE_ICON: Record<SearchDocumentType, string> = {
  GUIDE: "▤",
  ARTICLE: "▧",
  NEWS: "◫",
  TOOL: "⌗",
};

export function ResearchNavigatorSearch() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const resultsId = `research-search-${useId().replace(/:/g, "")}`;
  const requestRef = useRef<AbortController | null>(null);

  const searching = query.trim().length >= 2;

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      // Nothing to fetch for a short/empty query. `response`/`loading` are
      // rendered gated by `searching`, so they don't need to be reset here —
      // just cancel any in-flight request for the previous (longer) query.
      requestRef.current?.abort();
      return;
    }
    const timer = window.setTimeout(async () => {
      requestRef.current?.abort();
      const controller = new AbortController();
      requestRef.current = controller;
      setLoading(true);
      try {
        const result = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal, cache: "no-store" }
        );
        if (!result.ok) throw new Error("SEARCH_REQUEST_FAILED");
        setResponse((await result.json()) as SearchResponse);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setResponse(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  // Derived, not stored: even if `loading`/`response` are stale from a
  // request that got aborted mid-flight, rendering ignores them once the
  // query is no longer long enough to search.
  const effectiveLoading = searching && loading;
  const effectiveResponse = searching ? response : null;

  const groups =
    effectiveResponse?.results.reduce<Record<string, SearchDocument[]>>(
      (acc, result) => {
        (acc[result.type] ??= []).push(result);
        return acc;
      },
      {}
    ) ?? {};

  return (
    <section aria-label="Search Trading Guide" className="mb-6 lg:mb-7">
      <label htmlFor={`${resultsId}-input`} className="sr-only">
        Search Trading Guide
      </label>
      <div className="border-border bg-panel focus-within:ring-gold flex min-h-14 items-center gap-3 rounded-2xl border px-4 shadow-sm transition-shadow focus-within:ring-2">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="text-muted h-5 w-5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <input
          id={`${resultsId}-input`}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search guides, articles and tools..."
          autoComplete="off"
          aria-controls={resultsId}
          aria-describedby={`${resultsId}-hint`}
          className="text-navy placeholder:text-muted min-w-0 flex-1 bg-transparent py-3 text-base outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-muted hover:text-navy rounded-lg px-2 py-1 text-sm font-semibold"
          >
            Clear
          </button>
        )}
      </div>
      <p id={`${resultsId}-hint`} className="text-muted mt-2 px-1 text-xs">
        Searches published guides, articles, news and Trading Guide tools.
      </p>

      <div id={resultsId} aria-live="polite" aria-busy={effectiveLoading}>
        {searching && (
          <div className="border-border bg-panel mt-4 rounded-2xl border p-3 shadow-sm sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-navy text-sm font-bold">
                {effectiveLoading
                  ? "Searching…"
                  : `${effectiveResponse?.results.length ?? 0} result${effectiveResponse?.results.length === 1 ? "" : "s"} for “${query.trim()}”`}
              </p>
              {!effectiveLoading && effectiveResponse?.partial && (
                <span className="text-muted text-xs font-semibold">
                  Partial results
                </span>
              )}
            </div>
            {!effectiveLoading && effectiveResponse?.partial && (
              <div
                role="status"
                className="border-gold/30 bg-gold/5 text-muted mb-4 rounded-xl border px-3 py-2 text-sm"
              >
                Some database articles are temporarily unavailable. Static
                guides and tools are still searchable.
              </div>
            )}
            {!effectiveLoading &&
              effectiveResponse &&
              effectiveResponse.results.length === 0 && (
                <p className="text-muted px-2 py-4 text-sm">
                  No matching published content found. Try a shorter or broader
                  search.
                </p>
              )}
            {!effectiveLoading &&
              effectiveResponse &&
              effectiveResponse.results.length > 0 && (
                <div className="grid gap-5 lg:grid-cols-2">
                  {(
                    ["GUIDE", "ARTICLE", "TOOL", "NEWS"] as SearchDocumentType[]
                  ).map((type) =>
                    groups[type]?.length ? (
                      <section
                        key={type}
                        aria-labelledby={`${resultsId}-${type}`}
                      >
                        <h2
                          id={`${resultsId}-${type}`}
                          className="text-gold mb-1 px-2 text-[10px] font-extrabold tracking-[0.12em] uppercase"
                        >
                          {TYPE_LABEL[type]}
                        </h2>
                        <div className="space-y-1">
                          {groups[type].map((result) => (
                            <Link
                              key={result.id}
                              href={result.href}
                              className="group hover:bg-panel-secondary focus-visible:bg-panel-secondary flex gap-3 rounded-xl px-2.5 py-2.5 transition-colors"
                            >
                              <span
                                aria-hidden="true"
                                className="bg-gold/10 text-gold flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base"
                              >
                                {TYPE_ICON[type]}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="text-navy block text-sm leading-snug font-bold">
                                  {result.title}
                                </span>
                                <span className="text-muted mt-0.5 line-clamp-2 block text-xs leading-relaxed">
                                  {result.description}
                                </span>
                              </span>
                              <span
                                aria-hidden="true"
                                className="text-muted/70 mt-2 shrink-0"
                              >
                                →
                              </span>
                            </Link>
                          ))}
                        </div>
                      </section>
                    ) : null
                  )}
                </div>
              )}
          </div>
        )}
      </div>
    </section>
  );
}
