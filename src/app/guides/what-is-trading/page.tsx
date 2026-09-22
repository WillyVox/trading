import { buildMetadata } from "@/lib/seo/metadata";
import { guideBreadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { articleSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { estimateReadingMinutesByWordCount } from "@/lib/articles/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { Notice } from "@/components/ui/Notice";
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
  StepsFlowIllustration,
  FeesBarIllustration,
  SecurityShieldIllustration,
} from "@/components/guide/illustrations";
import {
  getStaticGuideArticleHref,
  getStaticGuideArticleImage,
  STATIC_SLUG_IDS,
} from "@/lib/guides/static-article-slugs";

const PATH = getStaticGuideArticleHref(STATIC_SLUG_IDS.WHAT_IS_TRADING);
const RELATED_PATH_WHAT_YOU_NEED = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.WHAT_YOU_NEED_TO_START_TRADING
);
const RELATED_PATH_SHARE_TRADING_FOR_BEGINNERS = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS
);
const RELATED_PATH_START_INVESTING_IN_CRYPTO = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO
);
const IMAGE = getStaticGuideArticleImage(STATIC_SLUG_IDS.WHAT_IS_TRADING);
const TITLE = "What Is Trading? A Beginner's Guide for Australians";
const DESCRIPTION =
  "What is trading? Learn how buying and selling shares, ETFs and crypto works, the main trading styles, what it costs, the risks, and how trading differs from investing.";
const PUBLISHED = "2026-09-21";

const HEADINGS = [
  { id: "what-is-trading", text: "What is trading?", level: 2 as const },
  {
    id: "trading-vs-investing",
    text: "Trading vs investing: what's the real difference?",
    level: 2 as const,
  },
  {
    id: "how-a-trade-works",
    text: "How does a trade actually work?",
    level: 2 as const,
  },
  { id: "what-can-you-trade", text: "What can you trade?", level: 2 as const },
  {
    id: "trading-styles",
    text: "The main styles of trading",
    level: 2 as const,
  },
  { id: "what-trading-costs", text: "What trading costs", level: 2 as const },
  {
    id: "risks",
    text: "The risks, and how people get caught out",
    level: 2 as const,
  },
  {
    id: "where-to-go-next",
    text: "Is trading right for you? Where to go next",
    level: 2 as const,
  },
];

const WORD_COUNT = 2000;
const READING_MINUTES = estimateReadingMinutesByWordCount(WORD_COUNT);

const KEY_TAKEAWAYS = [
  "Trading means buying and selling an asset — shares, ETFs, crypto and more — to try to profit from price moves, usually over days, weeks or months.",
  "Trading and investing use the same markets but differ in time horizon: trading is about price moves, investing is about long-term growth and income.",
  "You never trade directly on an exchange — your order always goes through a broker or an exchange platform.",
  "Costs (brokerage, the bid-ask spread, currency conversion, financing) decide whether frequent trading can work at all.",
  "Leveraged products such as CFDs can lose more than you deposit. Trading isn't a shortcut to income.",
];

const FAQS = [
  {
    question: "What is trading in simple terms?",
    answer:
      "Trading is buying an asset — such as a share, ETF or cryptocurrency — in the hope of selling it for more, usually within days, weeks or months, rather than holding it for years.",
  },
  {
    question: "Is trading the same as investing?",
    answer:
      "No. They use the same markets, but trading focuses on shorter-term price moves and usually involves more frequent buying and selling, while investing focuses on long-term growth and income such as dividends.",
  },
  {
    question: "Is trading legal in Australia?",
    answer:
      "Yes, for individuals. Brokers that offer share trading need an Australian financial services (AFS) licence, and cryptocurrency exchanges operating in Australia need to be registered with AUSTRAC.",
  },
  {
    question: "Is trading gambling?",
    answer:
      "Trading and gambling are different in method — trading is based on analysing real assets and markets — but overtrading and using leverage can produce gambling-like outcomes, and neither offers a guaranteed return.",
  },
  {
    question: "Can you make a living from trading?",
    answer:
      "Some people do, but most don't. Costs, tax and consistency all matter, and most retail traders who use leveraged products lose money. Treat any claim of guaranteed trading income as a red flag.",
  },
  {
    question: "Do I pay tax on trading profits?",
    answer:
      "It depends on whether the ATO views your activity as investing or as carrying on a business of trading — the two are taxed differently. See the ATO's guidance on share investing versus share trading, or speak with a registered tax agent about your situation.",
  },
];

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  image: IMAGE,
  type: "article",
  publishedTime: PUBLISHED,
  modifiedTime: PUBLISHED,
  authors: ["Trading Guide Editorial Team"],
  seoTitle: "What Is Trading? A Beginner's Guide for Australians (2026)",
  seoDescription: DESCRIPTION,
});

export default function WhatIsTradingPage() {
  const trail = guideBreadcrumbTrail("What is trading?", PATH);

  const metaItems = [
    "By Trading Guide Editorial Team",
    "Published 21 September 2026",
    "Last updated 21 September 2026",
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
          datePublished: PUBLISHED,
          dateModified: PUBLISHED,
          path: PATH,
        })}
      />
      <JsonLd data={breadcrumbSchema(trail)} />
      <JsonLd data={faqSchema(FAQS)} />

      <PageHero
        breadcrumbs={trail}
        eyebrow="Guides · Trading basics"
        title="What is trading?"
        subheading="What trading actually means, how a trade works, the main styles, and how it differs from investing — explained in plain English for Australians."
        meta={metaItems}
        graphic="guides"
      />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="max-w-3xl min-w-0">
            <Notice>
              General information only. This guide explains how trading works.
              It isn&apos;t financial advice and doesn&apos;t take your personal
              circumstances into account. Trading can lose money — including
              more than you put in when leverage is used.
            </Notice>

            <KeyTakeaways items={KEY_TAKEAWAYS} />

            <div className="mt-6 lg:hidden">
              <GuideTableOfContents headings={HEADINGS} />
            </div>

            <div className="prose prose-headings:font-display prose-headings:text-navy mt-8 max-w-none">
              <p>
                <strong>At a glance:</strong> Trading is buying and selling
                financial assets — such as shares, ETFs or crypto — to try to
                profit from price changes, usually over days, weeks or months.
                You trade through a licensed broker or a registered exchange,
                and you can lose money.
              </p>

              <h2 id="what-is-trading">What is trading?</h2>
              <p>
                Trading means buying an asset in the hope of selling it for
                more, or, less commonly, selling first and buying back lower.
                The asset could be a share, an ETF, a cryptocurrency, a currency
                pair or a commodity. What links them is the goal: profit from
                price movement, rather than from owning something for years.
              </p>
              <p>
                A simple example (illustrative only): you buy 100 shares at
                $10.00, paying $1,000. The price rises to $10.80 and you sell
                for $1,080 — an $80 gross gain. With $10 brokerage each way, you
                keep $60. If the price had dropped to $9.20 instead, you&apos;d
                be down $80, plus $20 in brokerage: $100 in total.
              </p>

              <h2 id="trading-vs-investing">
                Trading vs investing: what&apos;s the real difference?
              </h2>
              <p>
                Trading and investing happen in the same markets, but
                they&apos;re driven by different goals and time horizons.
              </p>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Trading</th>
                    <th>Investing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Main goal</td>
                    <td>Profit from price moves</td>
                    <td>Long-term growth and income (e.g. dividends)</td>
                  </tr>
                  <tr>
                    <td>Typical holding period</td>
                    <td>Hours to months</td>
                    <td>Years to decades</td>
                  </tr>
                  <tr>
                    <td>How often you buy and sell</td>
                    <td>Frequently</td>
                    <td>Occasionally</td>
                  </tr>
                  <tr>
                    <td>Time commitment</td>
                    <td>Regular monitoring</td>
                    <td>Low</td>
                  </tr>
                  <tr>
                    <td>Cost impact</td>
                    <td>Higher (fees and spread on every trade)</td>
                    <td>Lower</td>
                  </tr>
                  <tr>
                    <td>Impact of short-term swings</td>
                    <td>Large</td>
                    <td>Smaller over long periods</td>
                  </tr>
                </tbody>
              </table>
              <p>
                It matters for tax, too. The ATO decides whether you&apos;re
                treated as a share investor or as carrying on a business of
                share trading by looking at your intention, how often you trade,
                and how business-like your activity is. Most beginners who buy
                to hold are treated as investors, and capital gains tax rules
                apply — but the ATO makes that call on the facts of your
                situation, so check its guidance or a registered tax agent if
                you&apos;re unsure which applies to you.
              </p>

              <h2 id="how-a-trade-works">How does a trade actually work?</h2>
              <p>
                Whichever asset you&apos;re trading, the mechanics follow a
                similar path: you place an order, your broker routes it, the
                exchange matches a buyer and a seller, the trade is confirmed,
                and it settles.
              </p>

              <GuideFigure caption="A share trade travels from your order, through your broker, to the exchange, and on to confirmation and settlement.">
                <StepsFlowIllustration title="Five steps of a share trade: order, broker, exchange match, confirmation, settlement" />
              </GuideFigure>

              <p>
                <strong>Bid, ask and spread.</strong> The bid is the highest
                price a buyer will pay right now. The ask is the lowest price a
                seller will accept. The gap between them is the spread — a cost
                you pay every time you trade, even before brokerage.
              </p>
              <p>
                <strong>Order types.</strong> A market order buys or sells
                straight away at the best available price, but the price can
                move before you&apos;re filled. A limit order only trades at
                your price or better, though it may never fill. A stop-loss
                order triggers a sale if the price falls to your level, but in a
                fast-moving market it can fill below your stop price.
              </p>
              <p>
                <strong>Settlement.</strong> ASX share trades currently settle
                two business days after the trade (T+2); ASX has been consulting
                the industry on a possible future move to T+1, but T+2 remains
                the standard at the time of writing. Crypto exchanges typically
                match and settle within their own platform rather than on a
                fixed settlement cycle.
              </p>

              <h2 id="what-can-you-trade">What can you trade?</h2>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>What it is</th>
                    <th>When you can trade</th>
                    <th>On Trading Guide</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Shares (ASX, US)</td>
                    <td>A slice of ownership in a company</td>
                    <td>ASX: 10am–4pm Sydney time on business days</td>
                    <td>Yes — see share trading</td>
                  </tr>
                  <tr>
                    <td>ETFs</td>
                    <td>A basket of assets in a single unit</td>
                    <td>Same as shares</td>
                    <td>Covered in our share trading guides</td>
                  </tr>
                  <tr>
                    <td>Crypto assets</td>
                    <td>Digital assets traded on exchanges</td>
                    <td>24/7</td>
                    <td>Yes — see crypto exchanges</td>
                  </tr>
                  <tr>
                    <td>Forex</td>
                    <td>Currency pairs</td>
                    <td>Roughly 24 hours on weekdays</td>
                    <td>Not covered yet</td>
                  </tr>
                  <tr>
                    <td>Commodities</td>
                    <td>Gold, oil and others, via ETFs, futures or CFDs</td>
                    <td>Varies</td>
                    <td>Not covered yet</td>
                  </tr>
                  <tr>
                    <td>CFDs and other derivatives</td>
                    <td>Contracts that track a price, often leveraged</td>
                    <td>Varies</td>
                    <td>Not covered — see Moneysmart&apos;s warnings</td>
                  </tr>
                </tbody>
              </table>
              <p>
                CFDs and other leveraged derivatives carry the highest beginner
                risk of everything in this table — you can lose more than your
                original deposit. We don&apos;t cover them as a product to trade
                on this site.
              </p>

              <h2 id="trading-styles">The main styles of trading</h2>
              <ul>
                <li>
                  <strong>Day trading</strong> — buying and selling within the
                  same day. Many trades, high costs, high stress.
                </li>
                <li>
                  <strong>Swing trading</strong> — holding for days to weeks to
                  catch a bigger move.
                </li>
                <li>
                  <strong>Position trading</strong> — holding for weeks to
                  months, trading less often.
                </li>
                <li>
                  <strong>Long-term investing</strong> (for comparison) — buying
                  and holding for years.
                </li>
              </ul>
              <p>
                One honest line: shorter timeframes mean more trades, more
                costs, and more decisions made under pressure.
              </p>

              <h2 id="what-trading-costs">What trading costs</h2>
              <table>
                <thead>
                  <tr>
                    <th>Cost</th>
                    <th>What it is</th>
                    <th>Where it applies</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Brokerage</td>
                    <td>Fee per trade (flat or a percentage)</td>
                    <td>Shares, ETFs</td>
                  </tr>
                  <tr>
                    <td>Bid-ask spread</td>
                    <td>The gap between buy and sell price</td>
                    <td>Everything</td>
                  </tr>
                  <tr>
                    <td>Trading / maker-taker fee</td>
                    <td>Percentage taken per trade</td>
                    <td>Crypto exchanges</td>
                  </tr>
                  <tr>
                    <td>Currency conversion</td>
                    <td>Fee when trading in foreign currency</td>
                    <td>US shares, forex</td>
                  </tr>
                  <tr>
                    <td>Financing / overnight fees</td>
                    <td>Interest on leveraged positions</td>
                    <td>CFDs, margin</td>
                  </tr>
                  <tr>
                    <td>Withdrawal and network fees</td>
                    <td>Charged when moving money or coins out</td>
                    <td>Crypto</td>
                  </tr>
                </tbody>
              </table>

              <GuideFigure caption="Typical cost components across brokers and crypto exchanges — actual fees vary by platform and trade size.">
                <FeesBarIllustration title="Illustrative trading cost components: maker fee, taker fee, withdrawal fee, and spread" />
              </GuideFigure>

              <h2 id="risks">The risks, and how people get caught out</h2>
              <ul>
                <li>
                  <strong>Market risk</strong> — prices fall as well as rise.
                </li>
                <li>
                  <strong>Leverage risk</strong> — borrowed money magnifies
                  losses. ASIC has limited the maximum leverage retail clients
                  can be offered on CFDs (from 30:1 down to 2:1 depending on the
                  asset) because of how much money retail clients were losing.
                </li>
                <li>
                  <strong>Cost drag</strong> — small, frequent trades can lose
                  money to fees even when the price moves in your favour.
                </li>
                <li>
                  <strong>Emotional trading</strong> — chasing a rising price
                  out of fear of missing out, or trying to win back a loss
                  quickly.
                </li>
                <li>
                  <strong>Scams</strong> — &quot;guaranteed&quot; returns,
                  unlicensed trading &quot;coaches&quot;, unlicensed brokers,
                  and pressure to deposit quickly. Check a broker&apos;s licence
                  on ASIC&apos;s professional registers and read
                  Moneysmart&apos;s investment warnings before you deposit
                  anywhere.
                </li>
              </ul>

              <GuideFigure caption="An illustrative view of risk, not a rating: risk generally increases as you move from a diversified holding toward concentrated positions and leverage.">
                <SecurityShieldIllustration title="Checking a broker's licence and being alert to trading scams" />
              </GuideFigure>

              <h2 id="where-to-go-next">
                Is trading right for you? Where to go next
              </h2>
              <p>
                Trading isn&apos;t right or wrong — it&apos;s a different
                activity to investing, with different costs, time commitment and
                risk. If you&apos;re still working out whether you&apos;re ready
                to place your first trade, our 10-point readiness checklist
                covers the money, knowledge, setup and discipline to sort out
                first.
              </p>
              <p>
                From there, your next step depends on which market you&apos;re
                heading toward — share trading or crypto — both covered below.
              </p>
            </div>

            <GuideFAQ items={FAQS} />

            <GuideSourceList
              sources={[
                {
                  id: "ato-share-investing-vs-trading",
                  label: "ATO — Share investing versus share trading",
                  url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax/shares-and-similar-investments/share-investing-versus-share-trading",
                },
                {
                  id: "asx-start-investing",
                  label: "ASX — Start investing",
                  url: "https://www.asx.com.au/investors/start-investing",
                },
                {
                  id: "moneysmart-investment-warnings",
                  label: "Moneysmart — Investment warnings",
                  url: "https://moneysmart.gov.au/investment-warnings",
                },
                {
                  id: "austrac-vasp-overview",
                  label: "AUSTRAC — Virtual asset service providers overview",
                  url: "https://www.austrac.gov.au/industry-and-business/your-industry/virtual-asset-service-providers/virtual-asset-service-providers-overview",
                },
                {
                  id: "asic-search-registers",
                  label: "ASIC — Search ASIC's registers",
                  url: "https://asic.gov.au/online-services/search-asics-registers/",
                },
              ]}
            />

            <RelatedGuides
              guides={[
                {
                  id: "what-you-need-to-start-trading",
                  slug: STATIC_SLUG_IDS.WHAT_YOU_NEED_TO_START_TRADING,
                  href: RELATED_PATH_WHAT_YOU_NEED,
                  title: "What You Need to Start Trading: 10-Point Checklist",
                  excerpt:
                    "Money, knowledge, setup and discipline — what to sort out before your first trade.",
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
                  id: "how-to-start-investing-in-crypto-for-beginners",
                  slug: STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO,
                  href: RELATED_PATH_START_INVESTING_IN_CRYPTO,
                  title: "How to Start Investing in Crypto for Beginners",
                  excerpt:
                    "Understanding the asset class, sizing your risk, and researching before you buy.",
                },
              ]}
            />

            <GuideProviderLinks
              heading="Ready for share trading? Compare platforms"
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

            <GuideProviderLinks
              heading="Ready for crypto? Compare exchanges"
              basePath="/crypto/exchanges"
              compareHref="/compare/crypto-exchanges"
              compareLabel="Compare all exchanges side-by-side"
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
              ]}
            />

            <GuideNextSteps
              heading="Next steps"
              steps={[
                {
                  id: "what-you-need-checklist",
                  slug: STATIC_SLUG_IDS.WHAT_YOU_NEED_TO_START_TRADING,
                  href: RELATED_PATH_WHAT_YOU_NEED,
                  title:
                    "Work through the readiness checklist before you trade",
                },
                {
                  id: "compare-trading-platforms",
                  slug: "compare",
                  href: "/compare/trading-platforms",
                  title: "Compare share trading platforms",
                },
                {
                  id: "compare-crypto-exchanges",
                  slug: "compare",
                  href: "/compare/crypto-exchanges",
                  title: "Compare crypto exchanges",
                },
              ]}
            />
          </article>

          <GuideSidebar
            headings={HEADINGS}
            category="getting-started"
            readingMinutes={READING_MINUTES}
            compareHref="/compare/trading-platforms"
            compareLabel="Compare trading platforms"
          />
        </div>
      </div>
    </>
  );
}
