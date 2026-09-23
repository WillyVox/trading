export const analyticsConfig = {
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() ?? "",
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
} as const;

export function isAnalyticsConfigured() {
  return (
    analyticsConfig.enabled &&
    /^G-[A-Z0-9]+$/i.test(analyticsConfig.measurementId)
  );
}
