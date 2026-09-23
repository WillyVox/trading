"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { analyticsConfig, isAnalyticsConfigured } from "@/lib/analytics/config";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loaded, setLoaded] = useState(false);
  const configured = isAnalyticsConfigured();
  const id = analyticsConfig.measurementId;

  const initialise = () => {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
    window.gtag("js", new Date());
    window.gtag("config", id, { send_page_view: false });
    setLoaded(true);
  };

  useEffect(() => {
    if (!configured || !loaded || typeof window.gtag !== "function") return;

    const query = searchParams.toString();
    const pagePath = `${pathname}${query ? `?${query}` : ""}`;
    window.gtag("event", "page_view", {
      page_location: `${window.location.origin}${pagePath}`,
      page_path: pagePath,
      page_title: document.title,
    });
  }, [configured, loaded, pathname, searchParams]);

  if (!configured) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
      strategy="afterInteractive"
      onLoad={initialise}
    />
  );
}
