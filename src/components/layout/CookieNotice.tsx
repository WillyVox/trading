"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";

/**
 * First-visit cookie notice.
 *
 * What this is (and isn't): the site currently sets only the cookies that
 * keep it working -- Auth.js sign-in cookies -- plus whatever YouTube/Vimeo
 * embeds add on their own. There is no analytics or advertising code (see
 * the note at the top of src/app/privacy/page.tsx), so this is an
 * acknowledgement notice, not a consent gate: nothing is blocked until the
 * visitor clicks OK. If analytics or ad cookies are ever added, this must
 * become a real choice (Accept / Reject non-essential / Manage) that keeps
 * those cookies switched off until accepted, and the privacy policy's
 * "Cookies" section must change in the same commit.
 *
 * Rendering: this is a client component that renders nothing on the server,
 * so it never forces the root layout (and every page under it) out of static
 * rendering -- the same rule Header.tsx and Footer.tsx follow. The
 * acknowledgement lives in `localStorage` (not a cookie) and is read through
 * useSyncExternalStore, which returns the server snapshot ("acknowledged" =
 * render nothing) during hydration and then switches to the real value. So
 * returning visitors never see a flash of the banner, and new visitors see it
 * appear just after load.
 *
 * Bump NOTICE_VERSION whenever the site's cookie use changes; everyone who
 * acknowledged an older version is shown the notice again.
 */
const NOTICE_VERSION = 1;
const STORAGE_KEY = "cookie-notice";
const CHANGE_EVENT = "cookie-notice-change";

// Covers browsers where localStorage is unavailable or throws (some private
// modes): the banner still closes for this page view instead of being stuck.
let dismissedThisSession = false;

function hasAcknowledged(): boolean {
  if (dismissedThisSession) return true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { v?: unknown } | null;
    return parsed?.v === NOTICE_VERSION;
  } catch {
    return false;
  }
}

function acknowledge() {
  dismissedThisSession = true;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ v: NOTICE_VERSION, at: new Date().toISOString() })
    );
  } catch {
    // Storage unavailable -- the in-memory flag above still hides the notice.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const getSnapshot = () => (hasAcknowledged() ? "acknowledged" : "needed");
const getServerSnapshot = () => "acknowledged";

export function CookieNotice() {
  const status = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [detailsOpen, setDetailsOpen] = useState(false);

  if (status === "acknowledged") return null;

  return (
    <section
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 sm:inset-x-auto sm:bottom-4 sm:left-4 sm:w-[26rem] print:hidden"
    >
      <div className="border-border bg-panel text-text max-h-[85vh] overflow-y-auto rounded-t-2xl border p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-lg sm:rounded-2xl sm:pb-5">
        {/* A <p>, not a heading: this box shouldn't add an h2 to every page's
            outline. */}
        <p className="font-display text-navy text-base font-bold">
          Cookies, kept minimal
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          We only use cookies that keep the site working, such as keeping you
          signed in. We don&apos;t use advertising or tracking cookies. Videos
          from YouTube or Vimeo may set their own cookies if you play them.{" "}
          <Link href="/privacy#cookies" className="text-navy underline">
            Privacy policy
          </Link>
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button onClick={acknowledge}>OK, got it</Button>
          <button
            type="button"
            aria-expanded={detailsOpen}
            aria-controls="cookie-notice-details"
            onClick={() => setDetailsOpen((open) => !open)}
            className="border-border bg-panel-secondary text-navy hover:bg-border inline-flex items-center justify-center rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            Cookie details
          </button>
        </div>

        <dl
          id="cookie-notice-details"
          hidden={!detailsOpen}
          className="border-border mt-4 space-y-3 border-t pt-4 text-sm"
        >
          <div>
            <dt className="text-navy font-semibold">Sign-in cookies</dt>
            <dd className="text-muted">
              Keep you signed in and protect the sign-in form. Used when you
              create an account or log in.
            </dd>
          </div>
          <div>
            <dt className="text-navy font-semibold">Video embeds</dt>
            <dd className="text-muted">
              YouTube or Vimeo may set their own cookies when a guide includes a
              video.
            </dd>
          </div>
          <div>
            <dt className="text-navy font-semibold">
              Advertising and analytics
            </dt>
            <dd className="text-muted">
              None. We&apos;ll ask again if this changes.
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
