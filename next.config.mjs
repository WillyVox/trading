const isProduction = process.env.NODE_ENV === "production";

// Report-Only: violations are logged (see src/app/api/csp-report/route.ts)
// but nothing is blocked, so this can be watched for real traffic before it
// is switched to an enforcing Content-Security-Policy.
//
// Derived from what the app actually loads:
//  - script/style 'unsafe-inline': Next.js emits inline bootstrap scripts and
//    styles, and there is no nonce pipeline. Nonces require every page to
//    render dynamically (no static/ISR caching), which isn't worth it here
//    while article HTML passes through a single sanitizer.
//  - img-src https:: sanitized article bodies may embed remote images. If
//    that is ever restricted to uploaded media, narrow this to 'self'.
//  - frame-src: only the two video providers ArticleVideo can render.
//  - fonts are self-hosted by next/font, so font-src is 'self'.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.youtube-nocookie.com https://player.vimeo.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "report-uri /api/csp-report",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Enforced clickjacking protection. (frame-ancestors would be the CSP
  // equivalent, but browsers ignore it in a Report-Only policy.)
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  ...(isProduction
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
        {
          key: "Content-Security-Policy-Report-Only",
          value: contentSecurityPolicy,
        },
      ]
    : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/share-trading/compare",
        destination: "/compare/trading-platforms",
        permanent: true,
      },
      {
        source: "/share-trading/compare/:slug",
        destination: "/compare/trading-platforms/:slug",
        permanent: true,
      },
      {
        source: "/crypto/exchanges/compare",
        destination: "/compare/crypto-exchanges",
        permanent: true,
      },
      {
        source: "/crypto/exchanges/compare/:slug",
        destination: "/compare/crypto-exchanges/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
