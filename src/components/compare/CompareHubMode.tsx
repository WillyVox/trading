"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { CompareSelector } from "@/components/compare/CompareSelector";

type SelectableProvider = { id: string; slug: string; name: string };

/**
 * Progressive enhancement for the all-provider comparison hubs. The broad
 * research view remains the default; people who want a focused comparison can
 * switch to the existing canonical 2-4 provider comparison flow. This component
 * owns presentation state only -- comparison data and URLs remain server-owned.
 */
export function CompareHubMode({
  providers,
  noun,
  comparisonBasePath,
  children,
}: {
  providers: SelectableProvider[];
  noun: "platforms" | "exchanges";
  comparisonBasePath: string;
  children: ReactNode;
}) {
  const [mode, setMode] = useState<"all" | "choose">("all");

  return (
    <section aria-labelledby="comparison-view-heading">
      <div className="border-border bg-panel mb-5 rounded-2xl border p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-5">
        <div>
          <h2
            id="comparison-view-heading"
            className="font-display text-navy text-xl font-bold"
          >
            Compare {noun}
          </h2>
          <p className="text-muted mt-1 text-sm">
            Browse every {noun === "platforms" ? "platform" : "exchange"}, or
            focus on 2 to 4 side by side.
          </p>
        </div>
        <div
          className="bg-panel-secondary mt-4 inline-flex rounded-full p-1 sm:mt-0"
          role="group"
          aria-label="Comparison view"
        >
          <button
            type="button"
            onClick={() => setMode("all")}
            aria-pressed={mode === "all"}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${mode === "all" ? "bg-navy text-background" : "text-muted hover:text-navy"}`}
          >
            All {noun}
          </button>
          <button
            type="button"
            onClick={() => setMode("choose")}
            aria-pressed={mode === "choose"}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${mode === "choose" ? "bg-navy text-background" : "text-muted hover:text-navy"}`}
          >
            Choose {noun}
          </button>
        </div>
      </div>

      {mode === "all" ? (
        children
      ) : (
        <div className="-mt-8">
          <CompareSelector
            providers={providers}
            noun={noun}
            comparisonBasePath={comparisonBasePath}
          />
        </div>
      )}
    </section>
  );
}
