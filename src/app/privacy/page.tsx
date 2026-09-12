import { Notice } from "@/components/ui/Notice";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { businessIdentity } from "@/lib/config/business";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "What personal information AusMarket collects and how it's used.",
  path: "/privacy",
});

const LAST_UPDATED = "12 September 2026";

/**
 * Content status: DRAFT ONLY -- see docs/CONTENT-GAPS.md "Privacy Policy".
 * Every data category below was checked directly against the codebase
 * (prisma/schema.prisma, src/lib/auth/*, src/lib/affiliates/service.ts) --
 * nothing here is generic boilerplate disconnected from what's actually
 * built:
 *  - Account data: User model (name, email, hashed password via scrypt --
 *    see src/lib/auth/password.ts -- role, createdAt). Registration is via
 *    /register.
 *  - Session data: Auth.js Session/Account/VerificationToken models.
 *  - Affiliate click data: AffiliateClick model captures sourcePage,
 *    placement, campaign, createdAt, and the linkId clicked -- no IP
 *    address or device fingerprint field exists in the schema today.
 *  - No analytics, ad-tech, or tracking-pixel code exists anywhere in the
 *    codebase as of this audit (verified by search) -- do not claim
 *    Google Analytics or similar until/unless one is actually added.
 *  - No newsletter/marketing-email feature exists in the codebase.
 * APP-entity status genuinely cannot be determined from the codebase alone
 * (depends on turnover/entity type) -- flagged below rather than guessed.
 */
export default function PrivacyPolicyPage() {
  const trail = breadcrumbTrail([{ name: "Privacy Policy", path: "/privacy" }]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <h1 className="font-display text-4xl font-extrabold text-navy">Privacy policy</h1>
      <p className="mt-2 text-sm text-muted">Last updated {LAST_UPDATED}</p>

      <div className="mt-6">
        <Notice>
          This page is a working draft and has not yet been reviewed by a lawyer. Whether we&apos;re
          formally an APP entity under the Privacy Act hasn&apos;t been determined — see the note
          in section 7.
        </Notice>
      </div>

      <div className="mt-8 flex flex-col gap-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">1. Who operates this site</h2>
          <p>
            This policy covers {businessIdentity.legalName ?? "AusMarket Crypto"}
            {businessIdentity.abn ? ` (ABN ${businessIdentity.abn})` : ""} (&quot;AusMarket&quot;,
            &quot;we&quot;, &quot;us&quot;).
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">2. Information we collect</h2>
          <p className="mb-2">We currently collect:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <span className="font-medium text-navy">Account information</span> -- if you register
              for an account: name (optional), email address, and a securely hashed password. We never
              store your password in plain text.
            </li>
            <li>
              <span className="font-medium text-navy">Session information</span> -- login session data
              needed to keep you signed in.
            </li>
            <li>
              <span className="font-medium text-navy">Affiliate click information</span> -- when you
              click a provider link, we record which link, which page it was on, and when. This
              doesn&apos;t currently include your IP address or device details.
            </li>
          </ul>
          <p className="mt-2">
            We don&apos;t currently use analytics, advertising, or tracking-pixel tools on this site.
            If that changes, this policy will be updated first.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">3. How we use it</h2>
          <p>
            To provide and secure the account features you use, to understand which provider links are
            used (in aggregate, for our own commercial reporting), and to respond if you contact us.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">4. Sharing and overseas disclosure</h2>
          <p>
            We don&apos;t sell your personal information. It may be processed by service providers we
            use to run this site (e.g. hosting, database).
          </p>
          {/* \u26A0\uFE0F LEGAL REVIEW REQUIRED: name actual hosting/database
              providers and confirm which countries process/store data --
              see CONTENT-GAPS.md. */}
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">5. Data security and retention</h2>
          <p>
            We use reasonable technical measures to protect the information we hold, including
            password hashing. We retain account information for as long as your account is active.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">6. Access, correction, and complaints</h2>
          <p>
            You can ask us to access or correct your personal information, or raise a privacy concern,
            at{" "}
            {businessIdentity.privacyEmail ?? "[privacy email not yet configured \u2014 see CONTENT-GAPS.md]"}
            . If you&apos;re not satisfied with our response, you can contact the Office of the
            Australian Information Commissioner (OAIC).
          </p>
        </section>

        <section className="rounded-xl border border-gold-soft bg-panel-secondary p-4">
          <h2 className="mb-2 font-display text-lg font-bold text-navy">7. Australian Privacy Principles</h2>
          <p>
            Whether we&apos;re required to comply with the Australian Privacy Principles as an APP
            entity (as opposed to qualifying for the small-business exemption) depends on our turnover
            and business activities, which hasn&apos;t been determined.
          </p>
          <p className="mt-2 font-medium text-navy">LEGAL/COMPLIANCE REVIEW REQUIRED.</p>
          <p className="mt-2">
            Regardless of exemption status, we aim to follow the practices in this policy given the
            account and affiliate-tracking features on this site.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg font-bold text-navy">8. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The &quot;last updated&quot; date at the top
            reflects the most recent change.
          </p>
        </section>
      </div>
    </div>
  );
}