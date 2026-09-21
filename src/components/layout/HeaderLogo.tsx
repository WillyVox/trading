"use client";

import Link from "next/link";
import LogoDark from "./LogoDark";
import { useRouter } from "next/navigation";

export default function HeaderLogo() {
  const router = useRouter();
  return (
    <Link
      href="/"
      className="font-display text-navy flex items-baseline gap-1 text-xl font-extrabold"
      onClick={(e) => {
        e.preventDefault();
        // Custom logic here (e.g., logging, clearing state)
        router.push("/");
      }}
    >
      <LogoDark />
    </Link>
  );
}
