import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { NotFoundBackButton } from "@/components/layout/NotFoundBackButton";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested Trading Guide page could not be found.",
  robots: { index: false, follow: true },
};

const recoveryCards = [
  {
    eyebrow: "GUIDES",
    title: "Understand the essentials",
    description:
      "Learn about trading concepts, fees, ownership structures and crypto exchanges in plain English.",
    href: "/guides",
    cta: "Explore guides",
  },
  {
    eyebrow: "COMPARE",
    title: "Research platforms side by side",
    description:
      "Compare trading platforms and crypto exchanges using structured, source-linked facts.",
    href: "/compare",
    cta: "Start comparing",
  },
  {
    eyebrow: "TOOLS",
    title: "Work through the numbers",
    description:
      "Explore calculators and interactive explainers for brokerage, FX, crypto fees and trading costs.",
    href: "/tools",
    cta: "Explore tools",
  },
] as const;

const popularTopics = [
  { label: "Brokerage fees", href: "/guides/brokerage-fees-australia" },
  { label: "CHESS vs custody", href: "/guides/chess-vs-custody" },
  { label: "What is a HIN?", href: "/guides/what-is-a-hin" },
  { label: "Trading costs explained", href: "/guides/trading-costs-explained" },
  {
    label: "Crypto exchange fees",
    href: "/guides/crypto-exchange-fees-australia",
  },
  {
    label: "Funding & withdrawals",
    href: "/guides/crypto-exchange-funding-australia",
  },
] as const;

export default function NotFound() {
  return (
    <div className="bg-background">
      <section className="border-border border-b">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-gold font-mono text-xs font-semibold tracking-[0.18em] uppercase">
            Page not found
          </p>
          <div className="mt-4 max-w-3xl">
            <p className="font-display text-gold text-5xl font-bold sm:text-6xl">
              404
            </p>
            <h1 className="font-display text-navy mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              We couldn&apos;t find this page.
            </h1>
            <p className="text-muted mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              It may have moved, the address may be incorrect, or the content
              may no longer be available. You can continue exploring Trading
              Guide below.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button href="/" variant="primary">
                Return to homepage
              </Button>
              <NotFoundBackButton />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div>
          <p className="text-gold font-mono text-xs font-semibold tracking-[0.16em] uppercase">
            Continue your research
          </p>
          <h2 className="font-display text-navy mt-2 text-2xl font-bold sm:text-3xl">
            Find a useful place to continue
          </h2>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {recoveryCards.map((item) => (
            <Card key={item.href} className="flex h-full flex-col">
              <p className="text-gold font-mono text-xs font-semibold tracking-[0.14em]">
                {item.eyebrow}
              </p>
              <h3 className="font-display text-navy mt-3 text-xl font-bold">
                {item.title}
              </h3>
              <p className="text-muted mt-3 flex-1 text-sm leading-6">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="text-navy focus-visible:outline-navy mt-6 inline-flex min-h-11 items-center font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
              >
                {item.cta}{" "}
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
            </Card>
          ))}
        </div>

        <div className="border-border mt-12 border-t pt-9">
          <h2 className="font-display text-navy text-xl font-bold">
            Popular topics
          </h2>
          <div className="mt-5 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {popularTopics.map((topic) => (
              <Link
                key={topic.href}
                href={topic.href}
                className="border-border text-navy hover:text-gold focus-visible:outline-navy flex min-h-12 items-center justify-between border-b py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <span>{topic.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
