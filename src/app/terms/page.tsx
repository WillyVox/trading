import Link from "next/link";
import { Notice } from "@/components/ui/Notice";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { businessIdentity } from "@/lib/config/business";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description: "The terms that apply to using the AusMarket website.",
  path: "/terms",
});

const LAST_UPDATED = "12 September 2026";

/**
 * Content status: DRAFT ONLY. Every section marked \u26A0\uFE0F below needs
 * sign-off from a lawyer before this page goes live -- see
 * docs/CONTENT-GAPS.md "Terms of Use". None of this has been reviewed.
 * Governing-law jurisdiction is a placeholder guess (NSW, based on the
 * site's Sydney context elsewhere in this project) -- confirm against the
 * actual registered business location.
 */
export default function TermsOfUsePage() {
  const trail = breadcrumbTrail([{ name: "Terms of Use", path: "/terms" }]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <h1 className="font-display text-4xl font-extrabold text-navy">Terms of use</h1>
      <p className="mt-2 text-sm text-muted">Last updated {LAST_UPDATED}</p>

      <div className="mt-6">
        <Notice>
          This page is a working draft and has not yet been reviewed by a lawyer. Do not treat it as
          final. See the inline notes for sections that need review.
        </Notice>
      </div>

      <div className="mt-8 flex flex-col gap-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">1. Acceptance of these terms</h2>
          <p>
            By accessing or using this website ({businessIdentity.legalName ?? "AusMarket Crypto"},
            &quot;AusMarket&quot;, &quot;we&quot;, &quot;us&quot;), you agree to these Terms of Use. If
            you don&apos;t agree, please don&apos;t use the site.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">2. What this site is</h2>
          <p>
            AusMarket publishes independent research, comparisons, and educational content about
            crypto exchanges available to Australians. We do not execute trades, hold customer funds,
            or act as a crypto exchange, broker, or financial product issuer.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">3. Informational content, no guarantee of accuracy</h2>
          <p>
            Content is provided for general information and educational purposes. We make reasonable
            efforts to verify provider facts (see our{" "}
            <Link href="/methodology/comparisons" className="text-blue underline">
              comparison methodology
            </Link>
            ), but we don&apos;t guarantee that any information on this site is complete, accurate, or
            current at the time you read it. Always verify important details directly with the
            provider.
          </p>
        </section>

        <section className="rounded-xl border border-gold-soft bg-panel-secondary p-4">
          <h2 className="mb-2 font-display text-lg font-bold text-navy">4. Financial information disclaimer</h2>
          <p>
            Nothing on this site is personal financial advice. Content is general in nature and
            doesn&apos;t take into account your objectives, financial situation, or needs. Consider
            seeking independent financial, legal, or tax advice before making a decision. Crypto
            assets are volatile and can lose value, including all of your investment; past performance
            doesn&apos;t predict future results.
          </p>
          {/* \u26A0\uFE0F LEGAL REVIEW REQUIRED: confirm this framing (factual/
              educational information vs. anything that could constitute
              financial product advice) against the site's actual current
              and planned features -- see CONTENT-GAPS.md. */}
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">5. Third-party providers and affiliate links</h2>
          <p>
            This site contains links to third-party provider websites, including affiliate/referral
            links (see our{" "}
            <Link href="/affiliate-disclosure" className="text-blue underline">
              affiliate disclosure
            </Link>
            ). We aren&apos;t responsible for the content, products, services, or practices of any
            third-party site. When you use a provider link, you deal directly with that provider under
            their own terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">6. Acceptable use</h2>
          <p>
            You agree not to misuse this site -- including attempting to access it by automated means
            in a way that degrades the service, attempting to circumvent security, or using it for any
            unlawful purpose.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">7. Intellectual property</h2>
          <p>
            Content on this site, including text, graphics, and layout, is owned by us or our
            licensors. You may view and share content for personal, non-commercial use. You may not
            republish, sell, or otherwise commercially exploit our content without permission.
          </p>
        </section>

        <section className="rounded-xl border border-gold-soft bg-panel-secondary p-4">
          <h2 className="mb-2 font-display text-lg font-bold text-navy">8. Limitation of liability</h2>
          <p>
            To the extent permitted by law, AusMarket isn&apos;t liable for any loss or damage arising
            from your use of this site or reliance on its content. Nothing in these terms excludes,
            restricts, or modifies any consumer guarantee, right, or remedy that can&apos;t lawfully be
            excluded under the Australian Consumer Law.
          </p>
          {/* \u26A0\uFE0F LEGAL REVIEW REQUIRED: exact liability-limitation
              wording needs a lawyer -- do not ship this section as-is. */}
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">9. Governing law</h2>
          <p>
            These terms are governed by the laws of New South Wales, Australia, and you submit to the
            non-exclusive jurisdiction of its courts.
            {/* \u26A0\uFE0F LEGAL REVIEW REQUIRED: confirm actual jurisdiction
                against the registered business location -- currently a
                placeholder guess. */}
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">10. Changes to these terms</h2>
          <p>
            We may update these terms from time to time. The &quot;last updated&quot; date at the top
            of this page reflects the most recent change. Continued use of the site after an update
            means you accept the revised terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">11. Contact</h2>
          <p>
            Questions about these terms:{" "}
            {businessIdentity.supportEmail ?? "[support email not yet configured \u2014 see CONTENT-GAPS.md]"}
          </p>
        </section>
      </div>
    </div>
  );
}