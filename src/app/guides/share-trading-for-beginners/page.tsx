import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';
import { articleSchema, breadcrumbSchema, faqSchema } from '@/lib/seo/schema';
import { estimateReadingMinutesByWordCount } from '@/lib/articles/content';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/layout/PageHero';
import { KeyTakeaways } from '@/components/guide/KeyTakeaways';
import { GuideTableOfContents } from '@/components/guide/GuideTableOfContents';
import { GuideSidebar } from '@/components/guide/GuideSidebar';
import { GuideSourceList } from '@/components/guide/GuideSourceList';
import { GuideFAQ } from '@/components/guide/GuideFAQ';
import { GuideFigure } from '@/components/guide/GuideFigure';
import { RelatedGuides } from '@/components/guide/RelatedGuides';
import { GuideProviderLinks } from '@/components/guide/GuideProviderLinks';
import { GuideNextSteps } from '@/components/guide/GuideNextSteps';
import {
  CompareColumnsIllustration,
  GrowthTrendIllustration,
} from '@/components/guide/illustrations';
import {
  getStaticGuideArticleHref,
  getStaticGuideArticleImage,
  STATIC_SLUG_IDS,
} from '@/lib/guides/static-article-slugs';

const PATH = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS
);
const RELATED_PATH_START_INVESTING_IN_CRYPTO = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO
);
const IMAGE = getStaticGuideArticleImage(
  STATIC_SLUG_IDS.SHARE_TRADING_FOR_BEGINNERS
);
const TITLE = 'Share Trading for Beginners: How to Start Investing in Shares';
const DESCRIPTION =
  'A plain-English guide to share trading for Australian beginners — how the share market works, what it costs, the risks to understand, and how to place your first trade.';

const HEADINGS = [
  {
    id: 'what-is-share-trading',
    text: 'What is share trading?',
    level: 2 as const,
  },
  {
    id: 'how-it-works',
    text: 'How share trading actually works',
    level: 2 as const,
  },
  {
    id: 'ways-to-buy-shares',
    text: 'Ways to buy shares in Australia',
    level: 2 as const,
  },
  {
    id: 'direct-ownership',
    text: 'Buying shares directly (the ASX)',
    level: 3 as const,
  },
  { id: 'managed-and-etfs', text: 'Managed funds and ETFs', level: 3 as const },
  {
    id: 'cfds-warning',
    text: 'CFDs and leveraged trading (higher risk)',
    level: 3 as const,
  },
  {
    id: 'how-to-start',
    text: 'How to start share trading in 6 steps',
    level: 2 as const,
  },
  { id: 'costs-and-fees', text: 'Costs and fees to expect', level: 2 as const },
  {
    id: 'risks',
    text: 'Risks every beginner should understand',
    level: 2 as const,
  },
  { id: 'mistakes', text: 'Common mistakes beginners make', level: 2 as const },
  {
    id: 'shares-vs-crypto',
    text: 'Share trading vs crypto trading',
    level: 2 as const,
  },
];

const WORD_COUNT = 1750;
const READING_MINUTES = estimateReadingMinutesByWordCount(WORD_COUNT);

const KEY_TAKEAWAYS = [
  'Share trading means buying and selling small ownership stakes (shares) in listed companies, most commonly through the ASX.',
  "You'll need a broker to trade — either an online broker for direct ownership, or a micro-investing app for smaller, automated amounts.",
  'Brokerage fees, the bid-ask spread, and (for managed products) ongoing management fees all eat into returns — compare them before you pick a broker.',
  'Diversifying across companies and sectors, and investing for the long term, are the two most reliable ways beginners reduce risk.',
  'CFDs and other leveraged products can amplify losses beyond your original stake — most beginners are better off starting with direct share ownership.',
];

const FAQS = [
  {
    question: 'How much money do I need to start share trading?',
    answer:
      "There's no fixed minimum in Australia, but most online brokers set a practical floor of around $50–$500 per trade once brokerage fees are factored in. Micro-investing apps let you start with smaller amounts by pooling your money into fractional shares or ETFs.",
  },
  {
    question: 'Is share trading better than crypto trading for beginners?',
    answer:
      "They're different asset classes with different risk profiles. Shares represent ownership in a regulated company with earnings and disclosure obligations; crypto assets are unregulated and typically far more volatile. Many beginners start with shares or ETFs for exposure to more established markets, then decide separately whether crypto fits their risk tolerance.",
  },
  {
    question: 'Do I need a license to trade shares in Australia?',
    answer:
      "No — individuals don't need a licence to buy and sell shares for themselves. Brokers and financial advisers who provide services to you do need to hold an Australian Financial Services Licence (AFSL), which is worth checking before you sign up.",
  },
  {
    question: "What's the difference between a broker and a trading platform?",
    answer:
      'In practice the terms overlap. A broker is the entity licensed to execute your buy and sell orders on the exchange; the trading platform is the app or website you use to place those orders. Some brokers offer both a simple app and a more advanced desktop platform under the same account.',
  },
];

export const metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  image: IMAGE,
  type: 'article',
  publishedTime: '2026-09-15',
  modifiedTime: '2026-09-15',
  authors: ['Trading Guide Editorial Team'],
  seoTitle:
    'Share Trading for Beginners (2026) — How to Start Investing in Shares',
  seoDescription:
    'New to the share market? Learn how share trading works, what it costs, the risks to watch for, and the 6 steps to place your first trade in Australia.',
});

export default function ShareTradingForBeginnersPage() {
  const trail = breadcrumbTrail([
    { name: 'Share trading for beginners', path: PATH },
  ]);

  const metaItems = [
    'By Trading Guide Editorial Team',
    'Published 15 September 2026',
    'Last updated 15 September 2026',
    `${READING_MINUTES} min read`,
  ];

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: TITLE,
          description: DESCRIPTION,
          image: IMAGE,
          author: 'Trading Guide Editorial Team',
          datePublished: '2026-09-15',
          dateModified: '2026-09-15',
          path: PATH,
        })}
      />
      <JsonLd data={breadcrumbSchema(trail)} />
      <JsonLd data={faqSchema(FAQS)} />

      <PageHero
        breadcrumbs={trail}
        eyebrow="Guides · Share trading"
        title="Share trading for beginners"
        subheading="How the share market works, what it costs, and how to place your first trade — explained without the jargon."
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
              <h2 id="what-is-share-trading">What is share trading?</h2>
              <p>
                Share trading is the buying and selling of shares — small
                ownership units in a publicly listed company. When you own a
                share, you own a proportional slice of that company: its
                profits, its losses, and (for some companies) a share of the
                dividends it pays out. In Australia, the vast majority of share
                trading happens on the{' '}
                <strong>Australian Securities Exchange (ASX)</strong>, the
                country&apos;s main public market for listed companies.
              </p>
              <p>
                &quot;Trading&quot; and &quot;investing&quot; are often used
                interchangeably, but they describe different approaches to the
                same market. Investing usually means buying shares and holding
                them for years, aiming to benefit from a company&apos;s
                long-term growth and dividends. Trading usually means buying and
                selling more frequently, aiming to profit from shorter-term
                price movements. Most beginners are better served by the
                investing approach — it requires less time, less specialist
                knowledge, and carries lower transaction costs.
              </p>

              <h2 id="how-it-works">How share trading actually works</h2>
              <p>
                Companies list on the ASX to raise money from the public,
                usually via an <strong>Initial Public Offering (IPO)</strong>.
                Once listed, their shares can be bought and sold between
                investors on the exchange, and the price moves constantly based
                on supply and demand — how many people want to buy at a given
                price versus how many want to sell.
              </p>
              <p>
                You can&apos;t trade directly on the ASX yourself; you place an
                order through a licensed broker, who routes it to the exchange.
                When your buy order matches someone else&apos;s sell order at an
                agreed price, the trade executes and the shares move into your
                name, held electronically through the ASX&apos;s settlement
                system (CHESS) or, with some brokers, in a custodial account on
                your behalf.
              </p>

              <h2 id="ways-to-buy-shares">Ways to buy shares in Australia</h2>
              <p>
                There isn&apos;t just one way to get exposure to shares. The
                right approach depends on how hands-on you want to be and how
                much risk you&apos;re comfortable taking on.
              </p>

              <h3 id="direct-ownership">Buying shares directly (the ASX)</h3>
              <p>
                This is the most straightforward approach: you open a brokerage
                account, deposit cash, and buy shares in specific companies
                you&apos;ve chosen — for example a bank, a mining company, or a
                retailer. You own those shares outright, in your name, and can
                hold them for as long as you like.
              </p>

              <h3 id="managed-and-etfs">Managed funds and ETFs</h3>
              <p>
                Instead of picking individual companies, you can buy a single
                unit that gives you exposure to a whole basket of shares. An{' '}
                <strong>Exchange Traded Fund (ETF)</strong> tracks an index
                (like the ASX 200) or a theme, and trades on the exchange just
                like an ordinary share. This spreads your risk across many
                companies at once, and is one of the most common starting points
                for beginners who don&apos;t want to research individual stocks.
              </p>

              <h3 id="cfds-warning">
                CFDs and leveraged trading (higher risk)
              </h3>
              <p>
                A <strong>Contract for Difference (CFD)</strong> lets you
                speculate on a share&apos;s price movement without owning the
                underlying share — and typically with borrowed money (leverage),
                which magnifies both gains and losses. Regulators have
                repeatedly flagged CFDs as a high-risk product: it&apos;s
                possible to lose more than your original deposit. Most beginners
                are better off building experience with direct share ownership
                before ever considering a leveraged product.
              </p>

              <GuideFigure caption="Direct share ownership vs. a diversified ETF: buying one company concentrates your risk in that business; an ETF spreads it across many.">
                <CompareColumnsIllustration
                  title="Comparing direct share ownership with a diversified ETF"
                  labelLeft="Single company"
                  labelRight="Diversified ETF"
                />
              </GuideFigure>

              <h2 id="how-to-start">How to start share trading in 6 steps</h2>
              <ol>
                <li>
                  <strong>Set a goal and a timeframe.</strong> Are you investing
                  for retirement in 30 years, or a house deposit in 5? Your
                  timeframe shapes how much risk makes sense.
                </li>
                <li>
                  <strong>Choose a broker.</strong> Compare brokerage fees per
                  trade, account-keeping fees, the range of shares and ETFs on
                  offer, and whether the broker holds an AFSL.
                </li>
                <li>
                  <strong>Open and verify your account.</strong> You&apos;ll
                  need standard identity documents and a linked bank account —
                  similar to opening any financial account.
                </li>
                <li>
                  <strong>Deposit funds.</strong> Most brokers support bank
                  transfer or BPAY; some offer instant deposits via debit card
                  for a fee.
                </li>
                <li>
                  <strong>Research before you buy.</strong> Read the
                  company&apos;s latest results or the ETF&apos;s product
                  disclosure statement before committing money.
                </li>
                <li>
                  <strong>Place your first order</strong> — either a{' '}
                  <em>market order</em> (executes immediately at the current
                  price) or a <em>limit order</em> (only executes at a price you
                  set), then monitor your holdings over time rather than
                  checking them constantly.
                </li>
              </ol>

              <h2 id="costs-and-fees">Costs and fees to expect</h2>
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Fee type</th>
                      <th>What it is</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Brokerage</td>
                      <td>
                        A flat fee or percentage charged each time you buy or
                        sell.
                      </td>
                    </tr>
                    <tr>
                      <td>Bid-ask spread</td>
                      <td>
                        The small gap between the buy price and sell price at
                        any moment.
                      </td>
                    </tr>
                    <tr>
                      <td>Management fee (ETFs/funds)</td>
                      <td>
                        An annual percentage charged for managing a fund or ETF,
                        deducted from returns.
                      </td>
                    </tr>
                    <tr>
                      <td>Account-keeping fee</td>
                      <td>
                        A periodic fee some brokers charge simply for holding an
                        account.
                      </td>
                    </tr>
                    <tr>
                      <td>Currency conversion</td>
                      <td>
                        Applies when buying shares listed outside Australia,
                        e.g. on the US market.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Small, frequent trades are usually the most fee-inefficient way
                to invest, since brokerage is charged per transaction regardless
                of size — one reason many beginners favour a slower, less
                frequent buying pattern.
              </p>

              <h2 id="risks">Risks every beginner should understand</h2>
              <ul>
                <li>
                  <strong>Market risk.</strong> Share prices can fall as well as
                  rise, sometimes sharply and without warning.
                </li>
                <li>
                  <strong>Company risk.</strong> An individual company can
                  underperform, cut its dividend, or in the worst case fail
                  entirely.
                </li>
                <li>
                  <strong>Concentration risk.</strong> Putting most of your
                  money into one company or sector magnifies the impact if it
                  performs poorly.
                </li>
                <li>
                  <strong>Liquidity risk.</strong> Smaller, thinly-traded
                  companies can be harder to sell quickly at a fair price.
                </li>
                <li>
                  <strong>Leverage risk.</strong> Products like CFDs can produce
                  losses larger than your original investment.
                </li>
              </ul>

              <h2 id="mistakes">Common mistakes beginners make</h2>
              <ul>
                <li>
                  Investing money you might need in the short term, then being
                  forced to sell at a loss.
                </li>
                <li>
                  Chasing a stock after it&apos;s already risen sharply, driven
                  by hype rather than research.
                </li>
                <li>
                  Putting most of your portfolio into a single company or
                  sector.
                </li>
                <li>
                  Checking prices daily and reacting emotionally to short-term
                  volatility.
                </li>
                <li>
                  Ignoring fees — a broker that looks cheap on brokerage can
                  still be expensive overall.
                </li>
              </ul>

              <h2 id="shares-vs-crypto">Share trading vs crypto trading</h2>
              <p>
                Shares and crypto assets sit at different points on the risk
                spectrum. A listed company has disclosure obligations, audited
                financials, and a regulator (ASIC) overseeing the market it
                trades on. Crypto assets are typically unregulated in Australia,
                trade 24/7 with far higher volatility, and aren&apos;t backed by
                a company&apos;s earnings at all — their value is driven almost
                entirely by supply, demand, and sentiment.
              </p>
              <p>
                Neither is inherently &quot;better&quot; — they&apos;re
                different tools for different risk appetites, and some investors
                hold both. If you&apos;re specifically weighing up crypto, our{' '}
                <a href={RELATED_PATH_START_INVESTING_IN_CRYPTO}>
                  guide to investing in crypto for beginners
                </a>{' '}
                covers the same ground for that asset class, and our{' '}
                <a
                  href={getStaticGuideArticleImage(
                    STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO
                  )}
                >
                  5 simple steps to buy cryptocurrency
                </a>{' '}
                walks through opening an account on a crypto exchange.
              </p>

              <GuideFigure caption="A long-term, diversified approach smooths out short-term volatility — the basis of most beginner share-trading strategies.">
                <GrowthTrendIllustration title="Illustrative long-term growth trend for a diversified portfolio" />
              </GuideFigure>
            </div>

            <GuideFAQ items={FAQS} />

            <GuideSourceList
              sources={[
                {
                  id: 'moneysmart-how-to-buy-sell-shares',
                  label: 'Moneysmart — How to buy and sell shares',
                  url: 'https://moneysmart.gov.au/shares/how-to-buy-and-sell-shares',
                },
                {
                  id: 'moneysmart-choosing-shares',
                  label: 'Moneysmart — Choosing shares to buy',
                  url: 'https://moneysmart.gov.au/shares/choosing-shares-to-buy',
                },
                {
                  id: 'moneysmart-choose-investments',
                  label: 'Moneysmart — Choose your investments',
                  url: 'https://moneysmart.gov.au/how-to-invest/choose-your-investments',
                },
                {
                  id: 'moneysmart-investment-warnings',
                  label:
                    'Moneysmart — Investment warnings (CFDs, high-risk products)',
                  url: 'https://moneysmart.gov.au/investment-warnings',
                },
              ]}
            />

            <RelatedGuides
              guides={[
                {
                  id: 'how-to-start-investing-in-crypto',
                  slug: STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO,
                  href: RELATED_PATH_START_INVESTING_IN_CRYPTO,
                  title: 'How to Start Investing in Crypto for Beginners',
                  excerpt:
                    'The same beginner-friendly grounding, applied to crypto assets.',
                },
                {
                  id: 'simple-steps-to-buy-crypto',
                  slug: STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO,
                  href: getStaticGuideArticleHref(
                    STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO
                  ),
                  title: '5 Simple Steps to Buy Cryptocurrency',
                  excerpt:
                    'A short, practical walkthrough of opening an account and making your first purchase.',
                },
              ]}
            />

            <GuideProviderLinks
              heading="Looking to trade crypto instead? Compare exchanges"
              providers={[
                {
                  slug: 'coinspot',
                  name: 'CoinSpot',
                  description: 'Beginner-friendly Australian crypto exchange.',
                },
                {
                  slug: 'swyftx',
                  name: 'Swyftx',
                  description:
                    'Australian exchange with a broad range of listed assets.',
                },
                {
                  slug: 'btc-markets',
                  name: 'BTC Markets',
                  description: 'Australian-regulated crypto trading platform.',
                },
                {
                  slug: 'independent-reserve',
                  name: 'Independent Reserve',
                  description:
                    'Australian exchange for individuals and businesses.',
                },
              ]}
            />

            <GuideNextSteps
              steps={[
                {
                  id: 'guides-home',
                  slug: 'guides',
                  href: '/guides',
                  title: 'Browse all crypto guides',
                },
                {
                  id: 'compare-exchanges',
                  slug: 'compare',
                  href: '/compare/crypto-exchanges',
                  title: 'Compare crypto exchanges side-by-side',
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
