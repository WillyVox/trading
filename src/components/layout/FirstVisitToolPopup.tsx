"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics/events";

const STORAGE_KEY = "trading-guide:first-visit-tool-popup:v1";
const SHOW_DELAY_MS = 2000;

function isExcludedPath(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/tools")
  );
}

export function FirstVisitToolPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const rememberDismissal = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "dismissed");
    } catch {
      // A failed persistence write must never prevent dismissal/navigation.
    }
  }, []);

  const dismiss = useCallback(() => {
    rememberDismissal();
    setOpen(false);
    trackEvent("welcome_tool_popup_dismiss", {
      tool_name: "brokerage_calculator",
    });
  }, [rememberDismissal]);

  const useExample = useCallback(() => {
    rememberDismissal();
    setOpen(false);
    trackEvent("welcome_tool_popup_cta", {
      tool_name: "brokerage_calculator",
      scenario: "starter_example",
    });
  }, [rememberDismissal]);

  useEffect(() => {
    if (isExcludedPath(pathname)) {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        window.localStorage.setItem(STORAGE_KEY, "dismissed");
      }
      return;
    }

    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Storage can be unavailable in hardened/private browser contexts. The
      // popup should still be dismissible for the current page in that case.
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
      trackEvent("welcome_tool_popup_view", {
        tool_name: "brokerage_calculator",
      });
    }, SHOW_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, dismiss]);

  if (!open || isExcludedPath(pathname)) return null;

  return (
    <div
      className="bg-navy/45 fixed inset-0 z-[120] grid place-items-center p-4 backdrop-blur-[1px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) dismiss();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="first-visit-tool-title"
        aria-describedby="first-visit-tool-description"
        className="border-gold/80 bg-navy relative w-full max-w-[720px] overflow-hidden rounded-3xl border text-white shadow-2xl"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close introduction"
          className="focus-visible:outline-gold absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          ×
        </button>

        <div className="p-6 sm:p-9">
          <p className="text-gold font-mono text-[11px] font-semibold tracking-[0.15em] uppercase">
            TradingGuide.com.au · Free tool
          </p>
          <h2
            id="first-visit-tool-title"
            className="font-display mt-2 max-w-xl text-3xl leading-[1.05] font-extrabold sm:text-4xl"
          >
            Don&apos;t guess the fee.
            <br />
            Estimate it.
          </h2>
          <p
            id="first-visit-tool-description"
            className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-[15px]"
          >
            See how published brokerage rules can change the cost of a
            hypothetical Australian share trade.
          </p>

          <div className="text-navy mt-5 overflow-hidden rounded-2xl bg-white p-4 sm:p-5">
            <div className="border-border flex items-center justify-between gap-4 border-b py-2.5">
              <span className="text-muted text-sm">Example trade</span>
              <strong className="font-display text-xl">$2,000</strong>
            </div>
            <div className="border-border flex items-center justify-between gap-4 border-b py-2.5">
              <span className="text-muted text-sm">Order</span>
              <strong className="text-sm">Buy</strong>
            </div>
            <div className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-muted text-sm">What you&apos;ll see</span>
              <strong className="text-right text-sm">
                Estimated brokerage
              </strong>
            </div>
          </div>

          <Link
            href="/tools/brokerage-calculator?amount=2000&side=BUY"
            onClick={useExample}
            className="bg-gold text-navy mt-5 flex min-h-12 w-full items-center justify-center rounded-xl px-5 py-3 text-center text-sm font-extrabold transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Try this $2,000 example →
          </Link>
          <p className="mt-3 text-center text-[11px] leading-5 text-slate-300">
            The calculator opens with this example prefilled. General
            information only.
          </p>
        </div>
      </section>
    </div>
  );
}
