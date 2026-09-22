import { permanentRedirect } from "next/navigation";

/**
 * Legacy comparison hub kept only for backwards compatibility.
 * The canonical Phase 8.1 URL is /compare/trading-platforms.
 *
 * Keep this route DB-free: redirects must not require PostgreSQL and should
 * remain build-safe even when the database is unavailable.
 */
export default function LegacyShareTradingComparePage() {
  permanentRedirect("/compare/trading-platforms");
}
