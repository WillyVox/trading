import { DataUnavailable } from "./DataUnavailable";
export function DataUnavailableBanner() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <DataUnavailable
        title="Some live research data is temporarily unavailable"
        message="Provider pricing and comparison data couldn't be loaded. Educational content and navigation remain available."
        retryHref="/"
      />
    </div>
  );
}
