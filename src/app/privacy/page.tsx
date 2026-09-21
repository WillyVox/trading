import { Notice } from "@/components/ui/Notice";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { businessIdentity } from "@/lib/config/business";
import { siteConfig } from "@/lib/seo/config";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "What personal information Trading Guide collects and how it's used.",
  path: "/privacy",
});

const LAST_UPDATED = "22 September 2026";

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
      <h1 className="font-display text-navy text-4xl font-extrabold">
        Privacy policy
      </h1>
      <p className="text-muted mt-2 text-sm">Last updated {LAST_UPDATED}</p>

      <div className="mt-6">
        <Notice>
          This page is a working draft and has not yet been reviewed by a
          lawyer. Whether we&apos;re formally an APP entity under the Privacy
          Act hasn&apos;t been determined — see the note in section 7.
        </Notice>
      </div>

      <div className="text-muted mt-8 flex flex-col gap-8 text-sm leading-relaxed">
        <section>
          <h2 className="font-display text-navy mb-2 text-lg font-bold">
            1. Who operates this site
          </h2>
          <p>
            This policy covers{" "}
            {businessIdentity.legalName ?? siteConfig.shortName}
            {businessIdentity.abn ? ` (ABN ${businessIdentity.abn})` : ""}{" "}
            (&quot;Trading Guide&quot;, &quot;we&quot;, &quot;us&quot;).
          </p>
        </section>

        <section>
          <h2 className="font-display text-navy mb-2 text-lg font-bold">
            2. Information we collect
          </h2>
          <p className="mb-2">We currently collect:</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <span className="text-navy font-medium">Account information</span>{" "}
              -- if you register for an account: name (optional), email address,
              and a securely hashed password. We never store your password in
              plain text.
            </li>
            <li>
              <span className="text-navy font-medium">Session information</span>{" "}
              -- login session data needed to keep you signed in.
            </li>
            <li>
              <span className="text-navy font-medium">
                Affiliate click information
              </span>{" "}
              -- when you click a provider link, we record which link, which
              page it was on, and when. This doesn&apos;t currently include your
              IP address or device details.
            </li>
          </ul>
          <p className="mt-2">
            We don&apos;t currently use analytics, advertising, or
            tracking-pixel tools on this site. If that changes, this policy will
            be updated first.
          </p>

          <h3
            id="cookies"
            className="font-display text-navy mt-5 mb-2 scroll-mt-24 text-base font-bold"
          >
            Cookies
          </h3>
          <p className="mb-2">
            We only use cookies and browser storage that keep the site working:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <span className="text-navy font-medium">Sign-in cookies</span> --
              if you create an account or log in, we set cookies that keep you
              signed in and protect the sign-in form.
            </li>
            <li>
              <span className="text-navy font-medium">
                Cookie notice choice
              </span>{" "}
              -- once you click OK on the cookie notice, your browser remembers
              that in its local storage (not sent to our servers) so we
              don&apos;t show the notice again.
            </li>
            <li>
              <span className="text-navy font-medium">Embedded videos</span> --
              some guides embed videos from YouTube or Vimeo. Those providers
              may set their own cookies when a video loads or plays, and handle
              that information under their own policies.
            </li>
          </ul>
          <p className="mt-2">
            We don&apos;t use advertising or analytics cookies. If that changes,
            we&apos;ll update this policy and change the cookie notice to ask
            you before any are set.
          </p>
        </section>

        <section>
          <h2 className="font-display text-navy mb-2 text-lg font-bold">
            3. How we use it
          </h2>
          <p>
            To provide and secure the account features you use, to understand
            which provider links are used (in aggregate, for our own commercial
            reporting), and to respond if you contact us.
          </p>
        </section>

        <section>
          <h2 className="font-display text-navy mb-2 text-lg font-bold">
            4. Sharing and overseas disclosure
          </h2>
          <p>
            We don&apos;t sell your personal information. It may be processed by
            service providers we use to run this site (e.g. hosting, database).
          </p>
          {/* \u26A0\uFE0F LEGAL REVIEW REQUIRED: name actual hosting/database
              providers and confirm which countries process/store data --
              see CONTENT-GAPS.md. */}
        </section>

        <section>
          <h2 className="font-display text-navy mb-2 text-lg font-bold">
            5. Data security and retention
          </h2>
          <p>
            We use reasonable technical measures to protect the information we
            hold, including password hashing. We retain account information for
            as long as your account is active.
          </p>
        </section>

        <section>
          <h2 className="font-display text-navy mb-2 text-lg font-bold">
            6. Access, correction, and complaints
          </h2>
          <p>
            You can ask us to access or correct your personal information, or
            raise a privacy concern, at{" "}
            {businessIdentity.privacyEmail ??
              "privacy email not yet configured"}
            . If you&apos;re not satisfied with our response, you can contact
            the Office of the Australian Information Commissioner (OAIC).
          </p>
        </section>

        <section className="border-gold-soft bg-panel-secondary rounded-xl border p-4">
          <h2 className="font-display text-navy mb-2 text-lg font-bold">
            7. Australian Privacy Principles
          </h2>
          <p>
            Whether we&apos;re required to comply with the Australian Privacy
            Principles as an APP entity (as opposed to qualifying for the
            small-business exemption) depends on our turnover and business
            activities, which hasn&apos;t been determined.
          </p>
          <p className="text-navy mt-2 font-medium">
            LEGAL/COMPLIANCE REVIEW REQUIRED.
          </p>
          <p className="mt-2">
            Regardless of exemption status, we aim to follow the practices in
            this policy given the account and affiliate-tracking features on
            this site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-navy mb-2 text-lg font-bold">
            8. Changes to this policy
          </h2>
          <p>
            We may update this policy from time to time. The &quot;last
            updated&quot; date at the top reflects the most recent change.
          </p>
        </section>
      </div>
    </div>
  );
}
