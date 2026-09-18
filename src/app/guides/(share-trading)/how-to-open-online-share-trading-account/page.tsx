import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { estimateReadingMinutesByWordCount } from "@/lib/articles/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { KeyTakeaways } from "@/components/guide/KeyTakeaways";
import { GuideTableOfContents } from "@/components/guide/GuideTableOfContents";
import { GuideSidebar } from "@/components/guide/GuideSidebar";
import { GuideSourceList } from "@/components/guide/GuideSourceList";
import { GuideFAQ } from "@/components/guide/GuideFAQ";
import { GuideFigure } from "@/components/guide/GuideFigure";
import { RelatedGuides } from "@/components/guide/RelatedGuides";
import { GuideProviderLinks } from "@/components/guide/GuideProviderLinks";
import { GuideNextSteps } from "@/components/guide/GuideNextSteps";
import {
  CompareColumnsIllustration,
  StepsFlowIllustration,
} from "@/components/guide/illustrations";
import {
  getStaticGuideArticleHref,
  getStaticGuideArticleImage,
  STATIC_SLUG_IDS,
} from "@/lib/guides/static-article-slugs";

const PATH = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.OPEN_SHARE_TRADING_ACCOUNT
);
const RELATED_PATH_SHARE_TRADING_FOR_BEGINNERS = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS
);
const RELATED_PATH_STEPS_TO_START_INVESTING = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.STEPS_TO_START_INVESTING_IN_SHARES
);
const IMAGE = getStaticGuideArticleImage(
  STATIC_SLUG_IDS.OPEN_SHARE_TRADING_ACCOUNT
);
const TITLE = "How to Open an Online Share Trading Account";
const DESCRIPTION =
  "Opening a share trading account takes minutes but a few decisions matter. Here's the step-by-step process — ID checks, HIN vs custodian, linking your bank — explained plainly.";

const HEADINGS = [
  {
    id: "what-you-need",
    text: "What you need before you start",
    level: 2 as const,
  },
  {
    id: "choosing-account-type",
    text: "Choosing the right type of account",
    level: 2 as const,
  },
  {
    id: "hin-vs-custodian",
    text: "HIN vs custodian model — why it matters",
    level: 2 as const,
  },
  {
    id: "step-by-step",
    text: "Step-by-step: opening the account",
    level: 2 as const,
  },
  {
    id: "linking-funding",
    text: "Linking and funding your bank account",
    level: 2 as const,
  },
  {
    id: "verifying-identity",
    text: "Verifying your identity",
    level: 2 as const,
  },
  { id: "first-trade", text: "Placing your first trade", level: 2 as const },
  {
    id: "mistakes",
    text: "Common account-opening mistakes",
    level: 2 as const,
  },
];

const WORD_COUNT = 1700;
const READING_MINUTES = estimateReadingMinutesByWordCount(WORD_COUNT);

const KEY_TAKEAWAYS = [
  "Opening an account online typically takes 10–20 minutes, but verification can take 1–3 business days.",
  "You'll need a Tax File Number (optional but recommended), a linked Australian bank account, and standard ID (driver's licence or passport).",
  "Decide upfront between a broker-sponsored HIN (your own holding in the CHESS system) and a custodian model (shares held in a trust structure) — this affects portability later.",
  "Most platforms require you to fund the account before your first trade settles.",
  "Compare brokerage fees and account fees before signing up — switching later can mean selling and re-buying.",
];

const FAQS = [
  {
    question:
      "How long does it take to open a share trading account in Australia?",
    answer:
      "Usually 10–20 minutes to apply, with verification completed same-day to a few business days depending on the broker.",
  },
  {
    question: "Do I need a Tax File Number to open an account?",
    answer:
      "No, it's optional — but without one, unfranked dividend income has tax withheld at the top marginal rate.",
  },
  {
    question: "What's the difference between a HIN and a custodian account?",
    answer:
      "A HIN means shares are registered directly in your name on the ASX's CHESS system; a custodian account holds them in the broker's name on your behalf.",
  },
  {
    question: "Can I open more than one share trading account?",
    answer:
      "Yes — many investors hold accounts with more than one broker to access different markets or fee structures.",
  },
];

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  image: IMAGE,
  type: "article",
  publishedTime: "2026-09-18",
  modifiedTime: "2026-09-18",
  authors: ["Trading Guide Editorial Team"],
  seoTitle: "How to Open an Online Share Trading Account in Australia (2026)",
  seoDescription: DESCRIPTION,
});

export default function OpenShareTradingAccountPage() {
  const trail = breadcrumbTrail([
    { name: "How to open an online share trading account", path: PATH },
  ]);

  const metaItems = [
    "By Trading Guide Editorial Team",
    "Published 18 September 2026",
    "Last updated 18 September 2026",
    `${READING_MINUTES} min read`,
  ];

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: TITLE,
          description: DESCRIPTION,
          image: IMAGE,
          author: "Trading Guide Editorial Team",
          datePublished: "2026-09-18",
          dateModified: "2026-09-18",
          path: PATH,
        })}
      />
      <JsonLd data={breadcrumbSchema(trail)} />
      <JsonLd data={faqSchema(FAQS)} />

      <PageHero
        breadcrumbs={trail}
        eyebrow="Guides · Share trading"
        title="How to open an online share trading account"
        subheading="The paperwork, ID checks and account choices you'll hit when opening your first share trading account — explained step by step."
        meta={metaItems}
        graphic="guides"
      />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="max-w-3xl min-w-0">
            <KeyTakeaways items={KEY_TAKEAWAYS} />

            <div className="mt-6 lg:hidden">
              <GuideTableOfContents headings={HEADINGS} />
            </div>

            <div className="prose prose-headings:font-display prose-headings:text-navy mt-8 max-w-none">
              <h2 id="what-you-need">What you need before you start</h2>
              <p>
                Before opening an account, gather three things: a form of photo
                ID (driver&apos;s licence or passport), your{" "}
                <strong>Tax File Number (TFN)</strong>, and your bank account
                details for linking. A TFN isn&apos;t compulsory to open an
                account, but skipping it means tax is withheld at the top
                marginal rate on any unfranked dividend income you receive —
                most beginners provide it upfront to avoid the surprise later.
              </p>
              <p>
                Most Australian brokers also ask for your residential address
                history and employment details as part of standard
                anti-money-laundering and counter-terrorism financing (AML/CTF)
                checks — this is a legal obligation for the broker, not
                something specific to you, so expect the same questions
                regardless of which platform you choose.
              </p>

              <h2 id="choosing-account-type">
                Choosing the right type of account
              </h2>
              <p>
                Individual, joint, company, trust, or self-managed super fund
                (SMSF) — most beginners open an <strong>individual</strong>{" "}
                account in their own name, which is the simplest option and the
                quickest to verify. A joint account works well for shared
                investing with a partner, but both parties typically need to
                consent to trades and account changes.
              </p>
              <p>
                Company, trust and SMSF accounts involve extra documentation —
                trust deeds, company extracts, and sometimes a certified copy of
                a fund&apos;s trust deed — and are usually set up with guidance
                from an accountant rather than through a self-service online
                form. Unless you already have a specific reason to use one of
                these structures, an individual account is the practical
                starting point.
              </p>

              <GuideFigure caption="HIN (CHESS-sponsored) vs custodian model — where your shares are actually registered.">
                <CompareColumnsIllustration
                  title="Comparison of the HIN and custodian share registration models"
                  labelLeft="HIN (CHESS)"
                  labelRight="Custodian"
                />
              </GuideFigure>

              <h2 id="hin-vs-custodian">
                HIN vs custodian model — why it matters
              </h2>
              <p>
                A broker-sponsored <strong>HIN</strong> (Holder Identification
                Number) means the shares sit directly in your name on the
                ASX&apos;s CHESS register — you get a HIN and can move those
                holdings to another broker relatively freely, because the
                ASX&apos;s own record shows you, not the broker, as the holder.
              </p>
              <p>
                A <strong>custodian model</strong> pools client shares under the
                broker&apos;s own name or HIN, which is often cheaper or
                fee-free to run, but means you don&apos;t hold a HIN yourself —
                moving providers later can be more involved, since the broker
                (not the ASX register) is the one who has to action the
                transfer. Neither model is &quot;wrong,&quot; but it&apos;s
                worth knowing which one you&apos;re signing up for before you
                commit, especially if portability between brokers matters to
                you.
              </p>

              <GuideFigure caption="The typical seven-step flow for opening an online share trading account.">
                <StepsFlowIllustration title="The seven-step flow for opening an online share trading account" />
              </GuideFigure>

              <h2 id="step-by-step">Step-by-step: opening the account</h2>
              <ol>
                <li>Pick a broker and compare fees and account type</li>
                <li>Start the online application (10–15 minutes)</li>
                <li>Enter personal and tax details (TFN optional)</li>
                <li>Choose an individual, joint, company or trust structure</li>
                <li>Upload ID for verification</li>
                <li>Link and verify your bank account</li>
                <li>
                  Wait for approval (often same-day, up to a few business days)
                </li>
              </ol>
              <p>
                Most of the time in this flow is spent on step two — the
                application form itself — rather than waiting. Have your ID and
                bank details ready before you start and the whole process rarely
                takes more than 20 minutes of active time.
              </p>

              <h2 id="linking-funding">
                Linking and funding your bank account
              </h2>
              <p>
                Most brokers use a small deposit or verification step — or
                direct bank-feed matching — to confirm the linked account
                actually belongs to you before your first trade can settle. This
                protects both you and the broker from funds being sent to or
                from an account that isn&apos;t yours.
              </p>
              <p>
                Funding methods vary by platform: BPAY and direct debit are
                widely supported and typically take one to two business days to
                clear, while PayID or OSKO transfers can land in your trading
                account almost instantly, which matters if you want to place a
                trade the same day you fund the account.
              </p>

              <h2 id="verifying-identity">Verifying your identity</h2>
              <p>
                Australian brokers are bound by AML/CTF obligations, so ID
                verification is mandatory, not optional, regardless of which
                platform you choose. Most brokers now use instant digital
                verification — matching your ID against government databases —
                rather than requiring certified paper copies sent by mail.
              </p>
              <p>
                Expect this step to be near-instant for most applicants, with
                manual review only kicking in if something doesn&apos;t match
                automatically — a changed address that hasn&apos;t been updated
                on your licence, for example, or a name that doesn&apos;t
                exactly match across documents. If you&apos;re asked for manual
                review, it doesn&apos;t necessarily mean anything is wrong; it
                just means a human needs to check the details a computer
                couldn&apos;t confirm.
              </p>

              <h2 id="first-trade">Placing your first trade</h2>
              <p>
                Once approved and funded, you can place a{" "}
                <strong>market order</strong> (executes at the current price) or
                a <strong>limit order</strong> (executes only at your specified
                price or better). For a first trade, many beginners use a limit
                order to avoid unexpected slippage on a volatile stock — you set
                the maximum price you&apos;re willing to pay, and the order
                simply won&apos;t fill above it.
              </p>
              <p>
                If you&apos;re still deciding what to actually buy — an ETF, an
                individual company, or a mix of both — our{" "}
                <a href={RELATED_PATH_STEPS_TO_START_INVESTING}>
                  guide to the steps for starting to invest in shares
                </a>{" "}
                walks through that decision in more detail.
              </p>

              <h2 id="mistakes">Common account-opening mistakes</h2>
              <ul>
                <li>
                  Not linking a bank account in your own name, which gets
                  rejected by verification.
                </li>
                <li>
                  Skipping the TFN and being surprised by withholding tax on
                  dividends later.
                </li>
                <li>
                  Not checking whether the account uses a HIN or custodian model
                  before committing.
                </li>
                <li>
                  Comparing headline brokerage only, while ignoring inactivity
                  or account-keeping fees.
                </li>
              </ul>
            </div>

            <GuideFAQ items={FAQS} />

            <GuideSourceList
              sources={[
                {
                  id: "moneysmart-how-to-buy-sell-shares",
                  label: "Moneysmart — How to buy and sell shares",
                  url: "https://moneysmart.gov.au/shares/how-to-buy-and-sell-shares",
                },
                {
                  id: "asx-chess-explained",
                  label: "ASX — CHESS explained",
                  url: "https://www.asx.com.au/content/dam/asx/investors/investment-tools-and-resources/education/chess-brochure-march-2016.pdf",
                },
                {
                  id: "asic-afsl-broker-obligations",
                  label: "ASIC — Checking a broker's AFS licence",
                  url: "https://moneysmart.gov.au/tools-and-resources/check-asic-lists/check-a-financial-adviser",
                },
              ]}
            />

            <RelatedGuides
              guides={[
                {
                  id: "share-trading-for-beginners",
                  slug: STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS,
                  href: RELATED_PATH_SHARE_TRADING_FOR_BEGINNERS,
                  title: "Share Trading for Beginners",
                  excerpt:
                    "How the share market works, what it costs, and how to place your first trade.",
                },
                {
                  id: "steps-to-start-investing-in-shares",
                  slug: STATIC_SLUG_IDS.STEPS_TO_START_INVESTING_IN_SHARES,
                  href: RELATED_PATH_STEPS_TO_START_INVESTING,
                  title: "Steps to Start Investing in Shares in Australia",
                  excerpt:
                    "The full investing journey — from goal-setting to your first purchase.",
                },
              ]}
            />

            <GuideProviderLinks
              heading="Ready to open an account? Compare platforms"
              basePath="/share-trading"
              compareHref="/compare/trading-platforms"
              compareLabel="Compare all trading platforms side-by-side"
              providers={[
                {
                  slug: "commsec",
                  name: "CommSec",
                  description:
                    "Australia's largest online broker, backed by CBA.",
                },
                {
                  slug: "cmc-invest",
                  name: "CMC Invest",
                  description:
                    "Established Australian online trading platform.",
                },
              ]}
            />

            <GuideNextSteps
              heading="Next steps"
              steps={[
                {
                  id: "guides-home",
                  slug: "guides",
                  href: "/guides",
                  title: "Browse all share trading guides",
                },
                {
                  id: "compare-trading-platforms",
                  slug: "compare",
                  href: "/compare/trading-platforms",
                  title: "Compare trading platforms side-by-side",
                },
              ]}
            />
          </article>

          <GuideSidebar
            headings={HEADINGS}
            category="share-trading"
            readingMinutes={READING_MINUTES}
            compareHref="/compare/trading-platforms"
            compareLabel="Compare trading platforms"
          />
        </div>
      </div>
    </>
  );
}
