export const CONSENT_VERSION = 2;
export const CONSENT_STORAGE_KEY = "trading-guide-consent";
export const CONSENT_CHANGE_EVENT = "trading-guide-consent-change";

export type ConsentChoice = "accepted" | "rejected";
export type ConsentState = {
  version: number;
  analytics: ConsentChoice;
  updatedAt: string;
};

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (
      parsed.version !== CONSENT_VERSION ||
      (parsed.analytics !== "accepted" && parsed.analytics !== "rejected") ||
      typeof parsed.updatedAt !== "string"
    )
      return null;
    return parsed as ConsentState;
  } catch {
    return null;
  }
}

export function writeConsent(analytics: ConsentChoice): ConsentState {
  const state: ConsentState = {
    version: CONSENT_VERSION,
    analytics,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {}
  window.dispatchEvent(
    new CustomEvent(CONSENT_CHANGE_EVENT, { detail: state })
  );
  return state;
}

export function subscribeToConsent(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  };
}
