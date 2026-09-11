import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const role = (req.auth?.user as any)?.role;
  if (!req.auth?.user) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
  if (role !== "ADMIN") {
    const url = new URL("/403", req.url);
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  // Article preview renders DRAFT/REVIEW/ARCHIVED content — it must never
  // be cached by a browser or CDN (Req.md §42: "no-store where
  // appropriate"). This used to only be documented in a comment on the
  // preview page itself; the header was never actually set anywhere.
  if (/^\/admin\/articles\/[^/]+\/preview(\/|$)/.test(pathname)) {
    response.headers.set("Cache-Control", "no-store");
  }
  return response;
});

export const config = {
  matcher: ["/admin/:path*"],
};