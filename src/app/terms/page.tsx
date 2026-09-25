import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description:
    "Terms that apply when you access or use Trading Guide, including our comparisons, provider information, third-party links, and website content.",
  path: "/terms",
});

const LAST_UPDATED = "September 2026";

const sections = [
  ["what-we-do", "1. What Trading Guide does"],
  ["information", "2. Information, not personal advice"],
  ["comparisons", "3. Comparisons and provider information"],
  ["affiliate-partnerships", "4. Links, partners and how we get paid"],
  ["third-parties", "5. Third-party services"],
  ["using-site", "6. Using our Site"],
  ["intellectual-property", "7. Our content and intellectual property"],
  ["liability", "8. Responsibility and liability"],
  ["changes", "9. Changes to the Site or these Terms"],
] as const;

const sectionHeading =
  "font-display text-navy mb-3 text-xl font-bold sm:text-2xl";

export default function TermsOfUsePage() {
  const trail = breadcrumbTrail([{ name: "Terms of Use", path: "/terms" }]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />

      <header className="bg-navy mt-7 rounded-3xl px-6 py-8 text-white sm:px-9 sm:py-10">
        <p className="text-gold font-mono text-xs font-bold tracking-[0.18em] uppercase">
          Trading Guide Terms
        </p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">
          What you need to know before using our site
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
          Trading Guide helps people research and compare trading services.
          These Terms explain the rules for using our Site and how our
          relationship with third-party providers works.
        </p>
        <p className="mt-5 text-sm text-slate-300">
          Last updated: {LAST_UPDATED}
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
        <nav
          aria-label="Terms of Use sections"
          className="border-border bg-panel h-fit rounded-2xl border p-5 lg:sticky lg:top-24"
        >
          <p className="font-display text-navy text-base font-bold">
            On this page
          </p>
          <ol className="mt-3 space-y-1">
            {sections.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-muted hover:text-blue block py-1.5 text-sm leading-snug no-underline transition"
                >
                  {label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="text-muted min-w-0 space-y-10 text-sm leading-relaxed sm:text-base">
          <aside className="border-gold/60 bg-gold/5 rounded-2xl border-l-4 p-5 sm:p-6">
            <h2 className="font-display text-navy text-lg font-bold">
              At a glance
            </h2>
            <p className="mt-2">
              We publish information for a general audience. We do not hold your
              funds or operate provider accounts. Provider terms can change, so
              verify important details directly with the provider before acting.
            </p>
          </aside>

          <section id="what-we-do" className="scroll-mt-28">
            <h2 className={sectionHeading}>1. What Trading Guide does</h2>
            <p>
              Trading Guide is an information and comparison publisher. We
              publish research, educational content, and information about share
              trading platforms, online brokers, and cryptocurrency exchanges
              available to Australians. We do not execute trades, hold customer
              money, operate trading accounts, or issue financial products.
            </p>
          </section>

          <section id="information" className="scroll-mt-28">
            <h2 className={sectionHeading}>
              2. Information, not personal advice
            </h2>
            <p>
              Our content is prepared for a general audience and does not take
              into account your personal objectives, financial situation, or
              needs. You are responsible for deciding whether a product or
              service is appropriate for you and for checking current provider
              information before acting. Consider seeking independent financial,
              legal, or tax advice where appropriate.
            </p>
            <p className="mt-3">
              Investing and trading involve risk. Investment values can rise or
              fall and you may lose some or all of the money invested. The
              nature and degree of risk varies between products, and crypto,
              leveraged, or derivative products may involve particularly
              significant risks.
            </p>
          </section>

          <section id="comparisons" className="scroll-mt-28">
            <h2 className={sectionHeading}>
              3. Comparisons and provider information
            </h2>
            <p>
              We aim to keep fees, features, and other provider information
              useful and current, but providers can change their products,
              pricing, eligibility requirements, and terms. We do not promise
              that every item on the Site will always be complete, current, or
              error-free. Check important information directly with the provider
              before opening an account or making a transaction.
            </p>
            <p className="mt-3">
              You can read more about how we research and compare providers in
              our{" "}
              <Link
                href="/methodology/comparisons"
                className="text-blue underline"
              >
                comparison methodology
              </Link>
              .
            </p>
          </section>

          <section id="affiliate-partnerships" className="scroll-mt-28">
            <h2 className={sectionHeading}>
              4. Links, partners and how we get paid
            </h2>
            <p>
              Some links on Trading Guide take you to third-party websites. Some
              are affiliate or referral links, which means we may receive
              compensation if you click through or take an eligible action.
              Commercial relationships do not change the methodology we say we
              use for our editorial content.
            </p>
            <p className="mt-3">
              See our{" "}
              <Link
                href="/affiliate-disclosure"
                className="text-blue underline"
              >
                Affiliate Disclosure
              </Link>{" "}
              and{" "}
              <Link href="/how-we-get-paid" className="text-blue underline">
                How We Get Paid
              </Link>{" "}
              for more information.
            </p>
          </section>

          <section id="third-parties" className="scroll-mt-28">
            <h2 className={sectionHeading}>5. Third-party services</h2>
            <p>
              If you leave Trading Guide and use a broker, exchange, or other
              provider, your relationship is with that provider and its own
              terms, privacy policy, fees, eligibility rules, and service
              conditions apply. Trading Guide does not control the
              provider&apos;s service, account decisions, transactions,
              availability, or customer support.
            </p>
          </section>

          <section id="using-site" className="scroll-mt-28">
            <h2 className={sectionHeading}>6. Using our Site</h2>
            <p>
              You may use the Site for lawful purposes. You must not interfere
              with its operation, attempt unauthorised access, introduce
              malicious code, bypass security controls, or use automated
              extraction in a way that materially disrupts or degrades the Site
              or its services.
            </p>
          </section>

          <section id="intellectual-property" className="scroll-mt-28">
            <h2 className={sectionHeading}>
              7. Our content and intellectual property
            </h2>
            <p>
              Trading Guide&apos;s original text, design, software, graphics,
              branding, and other original content are owned by or licensed to
              us and may be protected by intellectual property laws. You may
              view and use the Site for personal, non-commercial purposes, but
              you may not republish or commercially exploit our original content
              without permission, subject to rights available under applicable
              law.
            </p>
          </section>

          <section id="liability" className="scroll-mt-28">
            <h2 className={sectionHeading}>8. Responsibility and liability</h2>
            <p>
              Use of the Site and decisions you make using information from it
              are your responsibility. To the extent permitted by law, Trading
              Guide is not responsible for losses arising from reliance on
              inaccurate or outdated information or from products and services
              supplied by third parties. Nothing in these Terms excludes,
              restricts, or modifies rights or remedies that cannot lawfully be
              excluded, restricted, or modified.
            </p>
          </section>

          <section id="changes" className="scroll-mt-28">
            <h2 className={sectionHeading}>
              9. Changes to the Site or these Terms
            </h2>
            <p>
              We may update the Site and these Terms from time to time. The
              current version and its last-updated date will be published on
              this page. If a change matters to your use of the Site, please
              review the updated Terms before continuing to use it.
            </p>
          </section>

          <aside className="border-border bg-subtle rounded-2xl border p-5 sm:p-6">
            <h2 className="font-display text-navy text-lg font-bold">
              Related Trading Guide policies
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link href="/privacy" className="text-blue underline">
                Privacy Policy
              </Link>
              <Link
                href="/affiliate-disclosure"
                className="text-blue underline"
              >
                Affiliate Disclosure
              </Link>
              <Link href="/how-we-get-paid" className="text-blue underline">
                How We Get Paid
              </Link>
              <Link href="/methodology" className="text-blue underline">
                Methodology
              </Link>
              <Link
                href="/methodology/editorial-policy"
                className="text-blue underline"
              >
                Editorial Policy
              </Link>
            </div>
          </aside>
        </article>
      </div>
    </div>
  );
}
