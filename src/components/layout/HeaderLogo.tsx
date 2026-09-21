"use client";

import Link from "next/link";
import LogoDark from "./LogoDark";

export default function HeaderLogo() {
  return (
    <Link
      href="/"
      className="font-display text-navy flex items-baseline gap-1 text-xl font-extrabold"
      onClick={(e) => {
        e.preventDefault();
        window.location.href = "/";
      }}
    >
      <LogoDark />
    </Link>
  );
}
