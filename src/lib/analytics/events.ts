"use client";

export type AnalyticsParams = Record<
  string,
  string | number | boolean | undefined
>;

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );
  window.gtag("event", name, clean);
}
