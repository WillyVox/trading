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

const LAST_UPDATED = "23 September 2026";

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
            We use Google Analytics to understand how visitors use the site,
            including page views, navigation and general website interactions.
            We do not use Google Analytics for advertising or remarketing in
            this implementation.
          </p>

          <h3
            id="cookies"
            className="font-display text-navy mt-5 mb-2 scroll-mt-24 text-base font-bold"
          >
            Cookies
          </h3>
          <p className="mb-2">
            We use cookies and similar browser technologies for site
            functionality and analytics, including:
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <span className="text-navy font-medium">Sign-in cookies</span> --
              if you create an account or log in, we set cookies that keep you
              signed in and protect the sign-in form.
            </li>
            <li>
              <span className="text-navy font-medium">Analytics cookies</span>{" "}
              -- Google Analytics may set cookies or use similar technologies to
              distinguish visits and help us understand how the website is used.
            </li>
          </ul>
          <p className="mt-2">
            Google Analytics may collect information such as pages viewed,
            referral information, approximate location, and general device and
            browser information. We do not intentionally send names, email
            addresses, financial form values, or other directly identifying
            information to Google Analytics.
          </p>
        </section>

        <section>
          <h2 className="font-display text-navy mb-2 text-lg font-bold">
            3. How we use it
          </h2>
          <p>
            To provide and secure the account features you use, to understand
            which provider links are used (in aggregate, for our own commercial
            reporting), to understand website usage and improve our guides,
            comparisons, tools and website experience, and to respond if you
            contact us.
          </p>
        </section>

        <section>
          <h2 className="font-display text-navy mb-2 text-lg font-bold">
            4. Data may be processed by hosting/database providers and Google
          </h2>
          <p>
            Your personal information may be processed by service providers we
            use to run this site (e.g. hosting and database services). Website
            usage information is also processed by Google as the provider of
            Google Analytics.
          </p>
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
      </div>
    </div>
  );
}
