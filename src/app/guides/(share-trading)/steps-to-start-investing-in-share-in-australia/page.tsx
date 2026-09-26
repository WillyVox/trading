import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { guideBreadcrumbTrail } from "@/lib/seo/breadcrumbs";
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
  ResearchIllustration,
  CompareColumnsIllustration,
  GrowthTrendIllustration,
} from "@/components/guide/illustrations";
import {
  getStaticGuideArticleHref,
  getStaticGuideArticleImage,
  STATIC_SLUG_IDS,
} from "@/lib/guides/static-article-slugs";

const PATH = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.STEPS_TO_START_INVESTING_IN_SHARES
);
const RELATED_PATH_OPEN_ACCOUNT = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.OPEN_SHARE_TRADING_ACCOUNT
);
const RELATED_PATH_SHARE_TRADING_FOR_BEGINNERS = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS
);
const IMAGE = getStaticGuideArticleImage(
  STATIC_SLUG_IDS.STEPS_TO_START_INVESTING_IN_SHARES
);
const TITLE = "Steps to Start Investing in Shares in Australia";
const DESCRIPTION =
  "A factual walkthrough of the decisions and mechanics involved in starting to invest in Australian shares, from account structures and orders to diversification and tax basics.";

const HEADINGS = [
  {
    id: "set-goal",
    text: "Step 1: Set your goal and time horizon",
    level: 2 as const,
  },
  {
    id: "how-hands-on",
    text: "Step 2: Decide how hands-on you want to be",
    level: 2 as const,
  },
  {
    id: "choose-broker",
    text: "Step 3: Compare brokers and micro-investing services",
    level: 2 as const,
  },
  {
    id: "open-fund",
    text: "Step 4: Open and fund your account",
    level: 2 as const,
  },
  {
    id: "first-purchase",
    text: "Step 5: Make your first purchase",
    level: 2 as const,
  },
  {
    id: "diversify",
    text: "Step 6: Understand concentration and diversification",
    level: 2 as const,
  },
  {
    id: "regular-habit",
    text: "Step 7: Understand regular investing",
    level: 2 as const,
  },
  {
    id: "tax-basics",
    text: "Tax basics every new investor should know",
    level: 2 as const,
  },
];

const WORD_COUNT = 1700;
const READING_MINUTES = estimateReadingMinutesByWordCount(WORD_COUNT);

const KEY_TAKEAWAYS = [
  "Time horizon and purpose are relevant factors when researching investment products, but they do not determine a universally suitable product.",
  "Broker and micro-investing services differ in ownership structure, control, available products, fees and automation; compare those characteristics before opening an account.",
  "Diversification can reduce concentration risk, while regular-investing strategies change purchase timing; neither removes market risk or guarantees better returns.",
  "Understand capital gains tax (CGT) basics before you start selling — the 12-month discount matters.",
  "This guide covers the investing journey; if you're ready to actually open an account, see our step-by-step account-opening guide.",
];

const FAQS = [
  {
    question: "How much money do I need to start investing in shares?",
    answer:
      "There's no legal minimum, but brokerage fees make amounts under roughly $500 per trade less cost-efficient; micro-investing apps allow smaller regular contributions.",
  },
  {
    question: "Should I buy individual shares or ETFs as a beginner?",
    answer:
      "ETFs and individual shares have different diversification, control, cost and research characteristics. Neither is universally preferable; the differences should be understood before making a product decision.",
  },
  {
    question: "Do I have to pay tax on shares I haven't sold?",
    answer:
      "Capital gains tax only applies when you sell for a profit. However, dividend income is taxable in the year you receive it, whether or not you sell the shares.",
  },
  {
    question:
      'What\'s the difference between this guide and "Share Trading for Beginners"?',
    answer:
      "That guide explains what share trading is and how the market works; this one walks through the practical steps of actually starting, from goal-setting to your first purchase.",
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
  authors: ["Editorial Team"],
  seoTitle: "Steps to Start Investing in Shares in Australia (2026 Guide)",
  seoDescription: DESCRIPTION,
});

export default function StepsToStartInvestingInSharesPage() {
  const trail = guideBreadcrumbTrail(
    "Steps to start investing in shares in Australia",
    PATH
  );

  const metaItems = [
    "By Editorial Team",
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
          author: "Editorial Team",
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
        title="Steps to start investing in shares in Australia"
        subheading="From setting a goal to your first purchase — the full path to investing in Australian shares, one step at a time."
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
              <h2 id="set-goal">Step 1: Set your goal and time horizon</h2>
              <p>
                Are you investing for a house deposit in three years, retirement
                in thirty, or just to learn how markets work? Your timeframe
                shapes almost everything else that follows. Shorter horizons
                generally call for more caution, since there's less time to ride
                out a downturn, while longer horizons can absorb more short-term
                volatility in exchange for potentially higher long-term returns.
              </p>
              <p>
                Writing your goal down — even just a sentence — makes the
                choices in the rest of this guide easier, because &quot;what
                should I buy&quot; is really a downstream question of &quot;what
                am I investing for and when do I need the money.&quot;
              </p>

              <GuideFigure caption="Hands-on stock-picking vs a diversified, lower-maintenance approach — both are valid starting points.">
                <ResearchIllustration title="Research-driven stock picking compared with a lower-maintenance diversified approach" />
              </GuideFigure>

              <h2 id="how-hands-on">
                Step 2: Decide how hands-on you want to be
              </h2>
              <p>
                Some investors want to research and pick individual companies —
                reading annual reports, comparing sectors, and deciding when to
                buy and sell. Others prefer a diversified ETF that tracks an
                index, like the ASX 200, with far less ongoing decision-making
                once the initial purchase is made.
              </p>
              <p>
                Neither approach is inherently &quot;better&quot;. They differ
                in diversification, control, costs and the amount of research a
                person may need to do. This guide describes those differences
                rather than selecting an approach for the reader.
              </p>

              <h2 id="choose-broker">
                Step 3: Compare brokers and micro-investing services
              </h2>
              <p>
                Full-service online brokers and micro-investing services can
                differ in ownership structure, available investments, order
                control, minimums, automation and fees. Some services let users
                select individual securities and order conditions; others use
                managed or pooled portfolios with different fee structures.
              </p>
              <p>
                When comparing these services, check the ownership model,
                available investments, brokerage or management fees, minimums,
                automation features and transfer rules. Those factual
                differences are more useful than treating either service type as
                universally suitable.
              </p>

              <h2 id="open-fund">Step 4: Open and fund your account</h2>
              <p>
                This is the mechanical step covered in full in our companion
                guide —{" "}
                <Link href={RELATED_PATH_OPEN_ACCOUNT}>
                  how to open an online share trading account
                </Link>{" "}
                — which walks through ID verification, linking a bank account,
                and choosing between a HIN and custodian model. It typically
                takes 10–20 minutes to apply, with verification completed
                anywhere from the same day to a few business days.
              </p>

              <h2 id="first-purchase">Step 5: Make your first purchase</h2>
              <p>
                A first purchase involves choosing an order type, quantity and
                price conditions, then reviewing brokerage and settlement
                details before submission. Trading Guide does not suggest an
                amount or security; the purpose here is to explain the
                mechanics.
              </p>

              <GuideFigure caption="Spreading investment across companies and sectors reduces the impact of any single one underperforming.">
                <CompareColumnsIllustration
                  title="Concentrated holding compared with a diversified spread across companies and sectors"
                  labelLeft="One company"
                  labelRight="Diversified"
                />
              </GuideFigure>

              <h2 id="diversify">
                Step 6: Understand concentration and diversification
              </h2>
              <p>
                Holding a single company creates greater exposure to that
                company's performance. Diversification spreads exposure across
                multiple holdings or sectors and can reduce concentration risk,
                but it does not prevent losses or guarantee smoother returns.
              </p>

              <GuideFigure caption="Regular investing spreads purchase dates across time; it changes timing exposure but does not guarantee a lower average price or protect against losses.">
                <GrowthTrendIllustration title="Regular contributions over time smoothing out short-term price swings" />
              </GuideFigure>

              <h2 id="regular-habit">Step 7: Understand regular investing</h2>
              <p>
                Investing a fixed amount on a regular schedule is commonly
                called <strong>dollar-cost averaging</strong>. It spreads
                purchases across different dates and prices. It does not
                guarantee a lower average purchase price, protect against
                falling markets, or make regular investing preferable to a
                lump-sum approach.
              </p>

              <h2 id="tax-basics">Tax basics every new investor should know</h2>
              <p>
                Selling or otherwise disposing of shares can create a capital
                gains tax (CGT) event. Australian resident individuals may be
                eligible for the CGT discount when the relevant conditions are
                met, including generally holding the asset for at least 12
                months. Tax outcomes depend on individual circumstances.
              </p>
              <p>
                Franked dividends may include franking credits reflecting tax
                already paid by the company. How those credits and any capital
                gains affect a person's tax position depends on their
                circumstances. Keep transaction and income records and use ATO
                guidance or professional tax advice where needed.
              </p>
            </div>

            <GuideFAQ items={FAQS} />

            <GuideSourceList
              sources={[
                {
                  id: "moneysmart-choose-investments",
                  label: "Moneysmart — Choose your investments",
                  url: "https://moneysmart.gov.au/how-to-invest/choose-your-investments",
                },
                {
                  id: "ato-cgt-on-shares",
                  label: "ATO — Capital gains tax on sale of shares or units",
                  url: "https://www.ato.gov.au/api/public/content/da016d46ea1b41259235d0db60f050f5",
                },
                {
                  id: "asx-investing-basics",
                  label: "ASX — Investing basics",
                  url: "https://www.asx.com.au/investors/start-investing",
                },
              ]}
            />

            <RelatedGuides
              guides={[
                {
                  id: "how-to-open-online-share-trading-account",
                  slug: STATIC_SLUG_IDS.OPEN_SHARE_TRADING_ACCOUNT,
                  href: RELATED_PATH_OPEN_ACCOUNT,
                  title: "How to Open an Online Share Trading Account",
                  excerpt:
                    "The step-by-step process — ID checks, HIN vs custodian, linking your bank.",
                },
                {
                  id: "share-trading-for-beginners",
                  slug: STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS,
                  href: RELATED_PATH_SHARE_TRADING_FOR_BEGINNERS,
                  title: "Share Trading for Beginners",
                  excerpt:
                    "How the share market works, what it costs, and how to place your first trade.",
                },
                {
                  id: "what-is-trading",
                  slug: STATIC_SLUG_IDS.WHAT_IS_TRADING,
                  href: getStaticGuideArticleHref(
                    STATIC_SLUG_IDS.WHAT_IS_TRADING
                  ),
                  title: "What Is Trading? A Beginner's Guide for Australians",
                  excerpt:
                    "How trading works across all markets, and how it differs from investing.",
                },
              ]}
            />

            <GuideProviderLinks
              heading="Ready to invest? Compare share trading platforms"
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
                  id: "open-account-guide",
                  slug: STATIC_SLUG_IDS.OPEN_SHARE_TRADING_ACCOUNT,
                  href: RELATED_PATH_OPEN_ACCOUNT,
                  title: "Read the account-opening guide",
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
