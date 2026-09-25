# Milestone 5.1 + 5.2 — GA4 foundation

Updated 23 September 2026.

## Current implementation

- Google Analytics 4 loads automatically on page visits when analytics is enabled and a valid GA4 measurement ID is configured.
- No cookie-consent popup or analytics preference gate is used by this implementation.
- Initial and client-side Next.js page views are sent explicitly, avoiding reliance on automatic SPA page-view behaviour.
- Production CSP allow-list includes the Google tag and GA collection endpoints required by this implementation.
- The privacy policy discloses use of Google Analytics, analytics cookies/similar technologies, and the categories of usage information that may be collected.
- No business/conversion events are added yet; those belong to Milestone 5.3.

## Environment configuration

```env
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Recommended defaults:

- Local: disabled
- Automated tests: disabled
- Vercel preview: disabled unless intentionally testing GA
- Production: enabled after the GA4 property is ready

## Production verification before CSP enforcement

1. Deploy with `CSP_ENFORCED_AND_VERIFIED=false` so CSP remains report-only.
2. Verify `googletagmanager.com` loads when analytics is enabled/configured.
3. Verify one `page_view` appears in GA4 DebugView/Realtime on the initial page.
4. Navigate client-side and verify one `page_view` per route change, with no duplicate initial page view.
5. Review `/api/csp-report` evidence for unexpected CSP violations.
6. Only after the report-only policy is clean should the existing CSP enforcement gate be enabled.

## Not included yet

- Affiliate-click GA events
- Comparison events
- Calculator/tool events
- Signup events
- Search events
- GA4 key-event configuration
- Google Search Console property/DNS setup

Those remain subsequent Milestone 5 work.

## Milestone 5.3 — behaviour and conversion events

The application now emits a deliberately small event set through `src/lib/analytics/events.ts`:

- `affiliate_click`: click on a first-party `/go/[offering]` affiliate redirect; parameters: `provider_slug`, `placement`, `source_path`.
- `comparison_created`: user submits the comparison selector; parameters: `comparison_type`, `provider_count`. Provider combinations are deliberately not sent to avoid high-cardinality reporting.
- `provider_view`: view of a supported provider/exchange detail route; parameters: `provider_slug`, `provider_type`.
- `tool_used`: first meaningful form interaction on a `/tools/[tool]` page per route visit; parameter: `tool_name`. Financial input values are never sent.
- `sign_up`: successful credentials registration; parameter: `method=credentials`. Email/name are never sent. The server redirects with a transient `signup=success` marker; the analytics client emits the event then removes the marker from the visible URL.

Recommended GA4 key events at launch: `affiliate_click`, `comparison_created`, and `sign_up`.
