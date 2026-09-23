"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics/events";

function providerFromPath(pathname: string) {
  const crypto = pathname.match(/^\/crypto\/exchanges\/([^/]+)$/);
  if (crypto)
    return { provider_slug: crypto[1], provider_type: "crypto_exchange" };
  const trading = pathname.match(/^\/share-trading\/([^/]+)$/);
  if (trading)
    return { provider_slug: trading[1], provider_type: "trading_platform" };
  return null;
}

function toolFromPath(pathname: string) {
  const match = pathname.match(/^\/tools\/([^/]+)$/);
  return match?.[1];
}

export function AnalyticsInteractions() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const usedTool = useRef<string | null>(null);

  useEffect(() => {
    const provider = providerFromPath(pathname);
    if (provider) trackEvent("provider_view", provider);

    if (searchParams.get("signup") === "success") {
      trackEvent("sign_up", { method: "credentials" });
      const url = new URL(window.location.href);
      url.searchParams.delete("signup");
      window.history.replaceState(
        {},
        "",
        `${url.pathname}${url.search}${url.hash}`
      );
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.origin);
      const match = url.pathname.match(/^\/go\/([^/]+)$/);
      if (!match) return;
      trackEvent("affiliate_click", {
        provider_slug: match[1],
        placement: url.searchParams.get("placement") ?? "unspecified",
        source_path: window.location.pathname,
      });
    };

    const onInteraction = (event: Event) => {
      const tool = toolFromPath(window.location.pathname);
      if (!tool || usedTool.current === tool) return;
      const target = event.target as Element | null;
      if (!target?.closest("main")) return;
      usedTool.current = tool;
      trackEvent("tool_used", { tool_name: tool });
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("change", onInteraction, true);
    document.addEventListener("input", onInteraction, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("change", onInteraction, true);
      document.removeEventListener("input", onInteraction, true);
    };
  }, []);

  useEffect(() => {
    usedTool.current = null;
  }, [pathname]);

  return null;
}
