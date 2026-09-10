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
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
