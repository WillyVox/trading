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
  ContinueLearning,
  LearningJourneyHeader,
} from "@/components/learning/LearningJourney";
import {
  GrowthTrendIllustration,
  ResearchIllustration,
  SecurityShieldIllustration,
} from "@/components/guide/illustrations";
import {
  getStaticGuideArticleHref,
  getStaticGuideArticleImage,
  STATIC_SLUG_IDS,
} from "@/lib/guides/static-article-slugs";

const PATH = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO
);
const RELATED_PATH_SHARE_TRADING_FOR_BEGINNERS = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS
);
const TITLE = "How to Start Investing in Crypto for Beginners";
const IMAGE = getStaticGuideArticleImage(
  STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO
);
const DESCRIPTION =
  "A beginner's guide to investing in crypto responsibly — understanding the asset class, sizing your risk, researching before you buy, avoiding scams, and thinking about tax.";

const HEADINGS = [
  {
    id: "investing-vs-buying",
    text: "Investing vs. just buying crypto",
    level: 2 as const,
  },
  {
    id: "understand-the-asset-class",
    text: "Understand what you're investing in",
    level: 2 as const,
  },
  {
    id: "know-your-risk-tolerance",
    text: "Know your risk tolerance first",
    level: 2 as const,
  },
  {
    id: "how-much-to-invest",
    text: "How much of your money should go into crypto?",
    level: 2 as const,
  },
  {
    id: "dollar-cost-averaging",
    text: "Dollar-cost averaging: how the strategy works",
    level: 2 as const,
  },
  {
    id: "researching-a-project",
    text: "Researching a crypto project before you buy",
    level: 2 as const,
  },
  {
    id: "avoiding-scams",
    text: "Avoiding common crypto scams",
    level: 2 as const,
  },
  {
    id: "storage-and-security",
    text: "Storage and security",
    level: 2 as const,
  },
  {
    id: "tax-in-australia",
    text: "Crypto and tax in Australia",
    level: 2 as const,
  },
  { id: "getting-started", text: "Getting started", level: 2 as const },
];

const WORD_COUNT = 1900;
const READING_MINUTES = estimateReadingMinutesByWordCount(WORD_COUNT);

const KEY_TAKEAWAYS = [
  "Investing in crypto means deliberately sizing your risk and time horizon — it's different from a one-off purchase out of curiosity.",
  "Most regulators, including Australia's ASIC and Moneysmart, class crypto assets as high-risk and highly volatile — treat that as a starting assumption, not a worst case.",
  "Crypto can be highly volatile and losses can be substantial. Before buying, understand the asset, the service you are using, custody arrangements, fees, scams and recordkeeping obligations.",
  "Crypto scams are widespread — be sceptical of unsolicited investment opportunities, guaranteed returns, and pressure to act quickly.",
  "Crypto held as an investment is generally subject to Capital Gains Tax in Australia — keep records of every transaction from day one.",
];

const FAQS = [
  {
    question: "Is crypto a good investment for beginners?",
    answer:
      "There is no universal answer. Moneysmart describes most crypto assets as high-risk and highly volatile. Whether any investment is appropriate depends on individual circumstances; this guide explains the risks and mechanics rather than recommending an allocation.",
  },
  {
    question: "How much should a beginner invest in crypto?",
    answer:
      "There is no fixed percentage that is suitable for everyone. Crypto can lose substantial value quickly, so consider the possibility of losing the amount committed and how that would affect your other financial obligations. Personal allocation decisions depend on individual circumstances.",
  },
  {
    question: "What should I check before using a crypto service?",
    answer:
      "Check whether AUSTRAC registration is required for the service and, where relevant, whether the provider appears on AUSTRAC's VASP register. AUSTRAC registration relates to Australia's AML/CTF framework and is not the same as ASIC approval of a platform or crypto asset. Also review custody, authentication, withdrawal controls, fees and recovery procedures.",
  },
  {
    question: "Do I have to pay tax on crypto in Australia?",
    answer:
      "Generally yes. The ATO treats crypto assets held as an investment as subject to Capital Gains Tax when you sell, swap, or spend them — buying with AUD and simply holding isn't a taxable event. Rules can be detailed and change over time, so it's worth checking the ATO's current guidance or speaking with a tax professional.",
  },
];

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  image: IMAGE,
  type: "article",
  publishedTime: "2026-09-15",
  modifiedTime: "2026-09-24",
  authors: ["Trading Guide Editorial Team"],
  seoTitle: "How to Start Investing in Crypto for Beginners (2026 Guide)",
  seoDescription:
    "Thinking about investing in crypto? Learn how to size your risk, research before you buy, avoid scams, and understand tax — before you put money in.",
});

export default function HowToStartInvestingInCryptoForBeginnersPage() {
  const trail = guideBreadcrumbTrail(
    "How to Start Investing in Crypto for Beginners",
    PATH
  );

  const metaItems = [
    "By Trading Guide Editorial Team",
    // "Published 15 September 2026",
    "Last updated 24 September 2026",
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
          datePublished: "2026-09-15",
          dateModified: "2026-09-15",
          path: PATH,
        })}
      />
      <JsonLd data={breadcrumbSchema(trail)} />
      <JsonLd data={faqSchema(FAQS)} />

      <PageHero
        breadcrumbs={trail}
        eyebrow="Guides · Investing"
        title="How to start investing in crypto for beginners"
        subheading="Understand the asset class, size your risk sensibly, and avoid the most common beginner mistakes — before you put any money in."
        meta={metaItems}
        graphic="crypto"
      />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="max-w-3xl min-w-0">
            <LearningJourneyHeader href={PATH} />
            <KeyTakeaways items={KEY_TAKEAWAYS} />

            <div className="mt-6 lg:hidden">
              <GuideTableOfContents headings={HEADINGS} />
            </div>

            <div className="prose prose-headings:font-display prose-headings:text-navy mt-8 max-w-none">
              <h2 id="investing-vs-buying">Investing vs. just buying crypto</h2>
              <p>
                There's a meaningful difference between buying a small amount of
                crypto out of curiosity and actually <em>investing</em> in it.
                Investing implies a plan: a rough idea of how much you're
                putting in, over what timeframe, and why — versus reacting to a
                headline or a friend's tip. If you're only after the mechanics
                of making a first purchase, our{" "}
                <Link
                  href={getStaticGuideArticleHref(
                    STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO
                  )}
                >
                  5 simple steps to buy cryptocurrency
                </Link>{" "}
                guide covers that. This guide is about the thinking that should
                happen before and alongside that purchase.
              </p>

              <h2 id="understand-the-asset-class">
                Understand what you're investing in
              </h2>
              <p>
                Crypto assets are a broad category — cryptocurrencies, tokens,
                and coins built on blockchain networks. Unlike a share, a crypto
                asset doesn't represent ownership in a company with earnings or
                assets behind it; its value comes almost entirely from supply,
                demand, and how useful or trusted the network behind it is
                perceived to be. That makes it a fundamentally different kind of
                asset to shares, property, or cash — and one that Australia's
                Moneysmart explicitly flags as high-risk, alongside CFDs and
                forex trading.
              </p>

              <h2 id="know-your-risk-tolerance">
                Know your risk tolerance first
              </h2>
              <p>
                Before choosing an amount, be honest about how you'd react if
                that amount fell by half in a week — because crypto assets have
                historically done exactly that, more than once. If that thought
                is genuinely distressing rather than merely uncomfortable,
                that's useful information about how much (if any) crypto
                exposure suits you right now.
              </p>

              <h2 id="how-much-to-invest">
                How much of your money should go into crypto?
              </h2>
              <p>
                There's no universal percentage that applies to everyone — it
                depends on your income, existing savings, debt, and other
                financial goals. What most beginner-friendly guidance agrees on
                is the principle, not the number: treat crypto as money you
                could afford to lose entirely without affecting your ability to
                pay rent, cover an emergency, or meet other financial
                commitments.
              </p>

              <GuideFigure caption="Regular contributions spread purchase dates across time, but they do not remove crypto volatility or guarantee a better outcome.">
                <GrowthTrendIllustration title="Illustrative effect of investing gradually over time rather than all at once" />
              </GuideFigure>

              <h2 id="dollar-cost-averaging">
                Dollar-cost averaging: how the strategy works
              </h2>
              <p>
                Rather than investing a lump sum at once,{" "}
                <strong>dollar-cost averaging (DCA)</strong> means investing a
                smaller, fixed amount at regular intervals — say, weekly or
                monthly — regardless of the price on that particular day. This
                doesn't protect against an asset losing value overall, but it
                does smooth out the impact of buying at a single, potentially
                high, price point, and it removes the pressure of trying to time
                the market.
              </p>

              <h2 id="researching-a-project">
                Researching a crypto project before you buy
              </h2>
              <p>Before buying a specific asset, it's worth looking into:</p>
              <ul>
                <li>
                  What problem the network or token is actually trying to solve.
                </li>
                <li>
                  How long it's been operating, and how the team behind it
                  communicates publicly.
                </li>
                <li>
                  Trading volume and liquidity — thinly-traded tokens can be
                  harder to sell at a fair price.
                </li>
                <li>
                  Whether independent sources (not just the project's own
                  marketing) corroborate its claims.
                </li>
              </ul>

              <GuideFigure caption="A little research before buying — beyond the project's own marketing — is one of the simplest risk-reduction habits for beginners.">
                <ResearchIllustration title="Researching a crypto project before investing" />
              </GuideFigure>

              <h2 id="avoiding-scams">Avoiding common crypto scams</h2>
              <p>
                Crypto's combination of popularity and irreversible transactions
                makes it a frequent target for scammers. Common patterns include
                unsolicited investment &quot;opportunities&quot; from strangers
                or new online contacts, promises of guaranteed or unusually high
                returns, fake or cloned trading platforms, and pressure to act
                quickly or keep the opportunity secret. Genuine investments
                don't require secrecy or urgency — treat both as warning signs.
              </p>

              <h2 id="storage-and-security">Storage and security</h2>
              <p>
                Crypto can be held through a platform-controlled wallet or
                through a wallet where you control the private keys.
                Self-custody changes the risk rather than removing it: control
                and recovery responsibility move to the user. Hardware wallets
                can keep private keys offline, while loss of keys or recovery
                information can result in loss of access.
              </p>

              <GuideFigure caption="Self-custody puts you in control of your crypto — and the responsibility for keeping it secure.">
                <SecurityShieldIllustration title="Securing crypto investments with self-custody" />
              </GuideFigure>

              <h2 id="tax-in-australia">Crypto and tax in Australia</h2>
              <p>
                The ATO treats crypto assets held as an investment as subject to{" "}
                <strong>Capital Gains Tax (CGT)</strong>. Broadly, buying crypto
                with Australian dollars and simply holding it isn't a taxable
                event, but selling it, swapping it for another crypto asset, or
                spending it generally is. Keeping accurate records — dates,
                amounts, and AUD values — from your very first transaction makes
                this far easier at tax time. Tax treatment can be detailed and
                is subject to change, so check the ATO's current guidance or
                speak with a tax professional for your specific situation.
              </p>

              <h2 id="getting-started">Getting started</h2>
              <p>
                Once you've thought through your risk tolerance, roughly how
                much you're comfortable allocating, and how you'll keep records,
                the practical next step is researching how a crypto service
                works, checking the relevant registration and custody
                information, and understanding the transaction path before
                deciding whether to make a purchase. Our{" "}
                <Link
                  href={getStaticGuideArticleHref(
                    STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO
                  )}
                >
                  5 simple steps to buy cryptocurrency
                </Link>{" "}
                guide walks through exactly that.
              </p>
            </div>

            <GuideFAQ items={FAQS} />

            <GuideSourceList
              sources={[
                {
                  id: "moneysmart-crypto-assets",
                  label:
                    "Moneysmart — Crypto assets (how they work and their risks)",
                  url: "https://moneysmart.gov.au/investment-warnings/crypto-assets",
                },
                {
                  id: "moneysmart-crypto-scams",
                  label: "Moneysmart — Crypto scams",
                  url: "https://moneysmart.gov.au/investment-warnings/crypto-scams",
                },
                {
                  id: "ato-crypto-cgt",
                  label: "ATO — How to work out and report CGT on crypto",
                  url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/crypto-asset-investments/how-to-work-out-and-report-cgt-on-crypto",
                },
              ]}
            />

            <ContinueLearning href={PATH} />

            <RelatedGuides
              guides={[
                {
                  id: "simple-steps-to-buy-crypto",
                  slug: STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO,
                  href: getStaticGuideArticleHref(
                    STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO
                  ),
                  title: "5 Simple Steps to Buy Cryptocurrency",
                  excerpt:
                    "The practical walkthrough — choosing an exchange, verifying, and placing your first order.",
                },
                {
                  id: "share-trading-for-beginners",
                  slug: STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS,
                  href: RELATED_PATH_SHARE_TRADING_FOR_BEGINNERS,
                  title: "Share Trading for Beginners",
                  excerpt:
                    "How a more regulated asset class compares, if you're weighing up both.",
                },
              ]}
            />

            <GuideProviderLinks
              heading="Ready to buy? Compare exchanges first"
              providers={[
                {
                  slug: "swyftx",
                  name: "Swyftx",
                  description:
                    "Australian exchange with a broad range of listed assets.",
                },
                {
                  slug: "coinspot",
                  name: "CoinSpot",
                  description: "Beginner-friendly Australian crypto exchange.",
                },
                {
                  slug: "kraken",
                  name: "Kraken",
                  description:
                    "Global exchange with an Australian-facing service.",
                },
                {
                  slug: "independent-reserve",
                  name: "Independent Reserve",
                  description:
                    "Australian exchange for individuals and businesses.",
                },
              ]}
            />

            <GuideNextSteps
              steps={[
                {
                  id: "buy-steps",
                  slug: STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO,
                  href: getStaticGuideArticleHref(
                    STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO
                  ),
                  title: "5 simple steps to buy cryptocurrency",
                },
                {
                  id: "compare-exchanges",
                  slug: "compare",
                  href: "/compare/crypto-exchanges",
                  title: "Compare crypto exchanges side-by-side",
                },
              ]}
            />
          </article>

          <GuideSidebar
            headings={HEADINGS}
            category="beginner-guides"
            readingMinutes={READING_MINUTES}
          />
        </div>
      </div>
    </>
  );
}
