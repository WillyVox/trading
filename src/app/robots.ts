import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin — private, also auth-protected by middleware (robots.txt is
      // not the only protection, see audit §8).
      // /go/ — affiliate redirects, not content.
      // /login, /403 — utility/error pages, no search value.
      disallow: ["/admin", "/go/", "/login", "/403"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
