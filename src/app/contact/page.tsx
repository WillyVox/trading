import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { businessIdentity } from "@/lib/config/business";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Trading Guide about corrections, privacy, commercial relationships, or general enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  const trail = breadcrumbTrail([{ name: "Contact", path: "/contact" }]);
  const supportEmail = businessIdentity.supportEmail;
  const privacyEmail = businessIdentity.privacyEmail ?? supportEmail;
  const complaintsEmail = businessIdentity.complaintsEmail ?? supportEmail;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />
      <p className="text-gold font-mono text-xs font-bold tracking-[0.18em] uppercase">
        Contact
      </p>
      <h1 className="font-display text-navy mt-3 text-4xl font-extrabold">
        How can we help?
      </h1>
      <p className="text-muted mt-3 leading-relaxed">
        Contact Trading Guide about a factual correction, privacy request,
        commercial relationship, or general site enquiry.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section className="border-border bg-panel rounded-2xl border p-5">
          <h2 className="font-display text-navy text-lg font-bold">
            General enquiries & corrections
          </h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            Found information that may be out of date or incorrect? Please
            include the page URL and the detail you think needs review.
          </p>
          {supportEmail ? (
            <a
              className="text-blue mt-3 inline-block text-sm underline"
              href={`mailto:${supportEmail}`}
            >
              {supportEmail}
            </a>
          ) : null}
        </section>
        <section className="border-border bg-panel rounded-2xl border p-5">
          <h2 className="font-display text-navy text-lg font-bold">Privacy</h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            For access, correction, or privacy concerns, contact our privacy
            address.
          </p>
          {privacyEmail ? (
            <a
              className="text-blue mt-3 inline-block text-sm underline"
              href={`mailto:${privacyEmail}`}
            >
              {privacyEmail}
            </a>
          ) : null}
        </section>
        <section className="border-border bg-panel rounded-2xl border p-5">
          <h2 className="font-display text-navy text-lg font-bold">
            Complaints
          </h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            For a complaint about Trading Guide or our content, tell us what
            happened and how you would like us to respond.
          </p>
          {complaintsEmail ? (
            <a
              className="text-blue mt-3 inline-block text-sm underline"
              href={`mailto:${complaintsEmail}`}
            >
              {complaintsEmail}
            </a>
          ) : null}
        </section>
        <section className="border-border bg-panel rounded-2xl border p-5">
          <h2 className="font-display text-navy text-lg font-bold">
            Commercial relationships
          </h2>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            Questions about affiliate or provider relationships can be sent to
            our support address. See how commercial relationships are handled
            before contacting us.
          </p>
          <Link
            className="text-blue mt-3 inline-block text-sm underline"
            href="/how-we-get-paid"
          >
            How we get paid →
          </Link>
        </section>
      </div>

      {businessIdentity.businessAddress ? (
        <p className="text-muted mt-8 text-sm">
          Business address: {businessIdentity.businessAddress}
        </p>
      ) : null}
    </div>
  );
}
