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
    "Contact Trading Guide about corrections, privacy, complaints, partnerships, media, or general enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  const trail = breadcrumbTrail([{ name: "Contact", path: "/contact" }]);
  const supportEmail = businessIdentity.supportEmail;
  const privacyEmail = businessIdentity.privacyEmail ?? supportEmail;
  const complaintsEmail = businessIdentity.complaintsEmail ?? supportEmail;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <JsonLd data={breadcrumbSchema(trail)} />
      <Breadcrumbs items={trail} />

      <section className="bg-navy mt-6 rounded-3xl px-6 py-9 text-white sm:px-9 sm:py-11">
        <p className="text-gold font-mono text-xs font-bold tracking-[0.18em] uppercase">
          Contact
        </p>
        <h1 className="font-display mt-3 max-w-3xl text-4xl font-extrabold text-white sm:text-5xl">
          Help us keep Trading Guide accurate
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg">
          Whether you have spotted outdated information, have feedback, or want
          to work with us, choose the route below that best matches your
          enquiry.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {supportEmail ? (
            <a
              className="text-navy rounded-xl bg-white px-4 py-3 text-sm font-bold no-underline transition hover:bg-slate-100"
              href={`mailto:${supportEmail}?subject=Trading%20Guide%20correction`}
            >
              Report a correction
            </a>
          ) : null}
          {supportEmail ? (
            <a
              className="rounded-xl border border-white/40 px-4 py-3 text-sm font-bold text-white no-underline transition hover:bg-white/10"
              href={`mailto:${supportEmail}?subject=Trading%20Guide%20general%20enquiry`}
            >
              General enquiry
            </a>
          ) : null}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="contact-reasons-title">
        <p className="text-gold font-mono text-xs font-bold tracking-[0.18em] uppercase">
          Contact routes
        </p>
        <h2
          id="contact-reasons-title"
          className="font-display text-navy mt-2 text-3xl font-bold"
        >
          What would you like to contact us about?
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <section className="border-border bg-panel rounded-2xl border p-6">
            <p className="text-gold font-mono text-[11px] font-bold tracking-[0.16em] uppercase">
              Editorial
            </p>
            <h3 className="font-display text-navy mt-2 text-xl font-bold">
              Corrections & data
            </h3>
            <p className="text-muted mt-2 text-sm leading-relaxed">
              Flag inaccurate or outdated fees, product features, market
              information, or editorial content. Include the page URL and the
              detail you think we should review.
            </p>
            {supportEmail ? (
              <a
                className="text-blue mt-4 inline-block text-sm font-semibold underline"
                href={`mailto:${supportEmail}?subject=Trading%20Guide%20correction`}
              >
                Report a correction →
              </a>
            ) : null}
          </section>

          <section className="border-border bg-panel rounded-2xl border p-6">
            <p className="text-gold font-mono text-[11px] font-bold tracking-[0.16em] uppercase">
              Your data
            </p>
            <h3 className="font-display text-navy mt-2 text-xl font-bold">
              Privacy
            </h3>
            <p className="text-muted mt-2 text-sm leading-relaxed">
              Ask about analytics, personal information, access, correction, or
              other privacy concerns.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {privacyEmail ? (
                <a
                  className="text-blue font-semibold underline"
                  href={`mailto:${privacyEmail}?subject=Trading%20Guide%20privacy%20request`}
                >
                  Contact privacy →
                </a>
              ) : null}
              <Link
                className="text-blue font-semibold underline"
                href="/privacy"
              >
                Privacy policy →
              </Link>
            </div>
          </section>

          <section className="border-border bg-panel rounded-2xl border p-6">
            <p className="text-gold font-mono text-[11px] font-bold tracking-[0.16em] uppercase">
              Feedback
            </p>
            <h3 className="font-display text-navy mt-2 text-xl font-bold">
              Complaints
            </h3>
            <p className="text-muted mt-2 text-sm leading-relaxed">
              Tell us what went wrong, where it happened, and how you would like
              us to respond so we can review the matter properly.
            </p>
            {complaintsEmail ? (
              <a
                className="text-blue mt-4 inline-block text-sm font-semibold underline"
                href={`mailto:${complaintsEmail}?subject=Trading%20Guide%20complaint`}
              >
                Make a complaint →
              </a>
            ) : null}
          </section>

          <section className="border-border bg-panel rounded-2xl border p-6">
            <p className="text-gold font-mono text-[11px] font-bold tracking-[0.16em] uppercase">
              Business
            </p>
            <h3 className="font-display text-navy mt-2 text-xl font-bold">
              Partnerships & media
            </h3>
            <p className="text-muted mt-2 text-sm leading-relaxed">
              For affiliate, provider, advertising, data, media, or other
              commercial enquiries. Learn how commercial relationships are
              handled before contacting us.
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {supportEmail ? (
                <a
                  className="text-blue font-semibold underline"
                  href={`mailto:${supportEmail}?subject=Trading%20Guide%20business%20enquiry`}
                >
                  Business enquiry →
                </a>
              ) : null}
              <Link
                className="text-blue font-semibold underline"
                href="/how-we-get-paid"
              >
                How we get paid →
              </Link>
            </div>
          </section>
        </div>
      </section>

      <aside className="border-border bg-subtle mt-8 rounded-2xl border p-5 sm:p-6">
        <h2 className="font-display text-navy text-lg font-bold">
          Need help with a trading or exchange account?
        </h2>
        <p className="text-muted mt-2 text-sm leading-relaxed">
          Trading Guide is an information and comparison website. We do not
          operate provider accounts or execute trades. For account access,
          identity verification, deposits, withdrawals, transactions, or
          provider-specific support, please contact your broker or exchange
          directly.
        </p>
      </aside>

      <section className="mt-12 border-t border-slate-200 pt-8">
        <h2 className="font-display text-navy text-2xl font-bold">
          Contact details
        </h2>
        <div className="mt-5 grid gap-5 text-sm sm:grid-cols-2">
          {supportEmail ? (
            <div>
              <p className="text-navy font-semibold">Email</p>
              <a
                className="text-blue mt-1 inline-block underline"
                href={`mailto:${supportEmail}`}
              >
                {supportEmail}
              </a>
            </div>
          ) : null}
          {businessIdentity.businessAddress ? (
            <div>
              <p className="text-navy font-semibold">Business address</p>
              <p className="text-muted mt-1 leading-relaxed">
                {businessIdentity.businessAddress}
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
