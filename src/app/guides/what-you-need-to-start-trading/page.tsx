import Link from "next/link";
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
  STATIC_SLUG_IDS.WHAT_YOU_NEED_TO_START_TRADING
);
const RELATED_PATH_WHAT_IS_TRADING = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.WHAT_IS_TRADING
);
const RELATED_PATH_OPEN_ACCOUNT = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.OPEN_SHARE_TRADING_ACCOUNT
);
const RELATED_PATH_STEPS_TO_BUY_CRYPTO = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO
);
const IMAGE = getStaticGuideArticleImage(
  STATIC_SLUG_IDS.WHAT_YOU_NEED_TO_START_TRADING
);
const TITLE = "What You Need to Start Trading: 10-Point Checklist";
const DESCRIPTION =
  "Before your first trade: money, knowledge, broker and plan. A plain-English 10-point checklist for Australian beginners on what to prepare first.";
const PUBLISHED = "2026-09-21";

const HEADINGS = [
  {
    id: "why-preparation-matters",
    text: "Why preparation matters more than picking the \u201cright\u201d stock",
    level: 2 as const,
  },
  { id: "group-money", text: "Group 1 — Money", level: 2 as const },
  {
    id: "group-knowledge",
    text: "Group 2 — Direction and knowledge",
    level: 2 as const,
  },
  { id: "group-setup", text: "Group 3 — Setup", level: 2 as const },
  { id: "group-discipline", text: "Group 4 — Discipline", level: 2 as const },
  {
    id: "signs-not-ready",
    text: "Signs you may not be ready yet",
    level: 2 as const,
  },
  { id: "ready", text: "Ready? Choose your path", level: 2 as const },
];

const WORD_COUNT = 2200;
const READING_MINUTES = estimateReadingMinutesByWordCount(WORD_COUNT);

const KEY_TAKEAWAYS = [
  "Sort out your safety net and any high-interest debt before you fund a trading account.",
  "Fees matter most on small trades — $10 brokerage on a $200 trade costs 5% each way, 10% round trip.",
  "Understand what you're buying well enough to explain how it makes or loses money.",
  "Choose a licensed broker or a registered exchange, and check who actually holds your assets.",
  "A one-page plan and simple records save you from emotional decisions and tax headaches later.",
];

const FAQS = [
  {
    question: "How much money do I need to start trading in Australia?",
    answer:
      "There's no legal minimum, but brokerage fees make small trades less cost-efficient — a $10 flat fee is 5% of a $200 trade but only 1% of a $1,000 trade. Start with an amount you can afford to lose and that keeps fees a small fraction of the trade.",
  },
  {
    question: "Do I need experience or qualifications?",
    answer:
      "No formal qualifications are required, but you should understand what you're buying and how it makes or loses money before you commit real funds. Practising first and starting small both help build that understanding.",
  },
  {
    question: "Should I use a demo account first?",
    answer:
      "It can help you learn the mechanics, and demo accounts are commonly offered by CFD and forex brokers and some charting platforms. They can't fully copy the emotion of trading with real money, so treat practice as a starting point, not a guarantee.",
  },
  {
    question: "Can I start trading with $100?",
    answer:
      "You can, but fees and the bid-ask spread take a larger percentage bite out of small trades. Many beginners find it more cost-efficient to build up a slightly larger first position, or to use a platform with low minimum brokerage.",
  },
  {
    question: "What equipment do I need?",
    answer:
      "A computer or smartphone, a stable internet connection, and an account with a licensed broker or registered exchange. No special hardware or software is required to get started.",
  },
  {
    question: "Do I have to keep records for tax?",
    answer:
      "Yes. Keep the date, asset, quantity, price and fees for every trade. Brokers and exchanges provide statements, but keeping your own copies makes tax time far easier, whichever market you trade in.",
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
  seoTitle: "What You Need to Start Trading: 10-Point Checklist (2026)",
  seoDescription: DESCRIPTION,
});

export default function WhatYouNeedToStartTradingPage() {
  const trail = guideBreadcrumbTrail("What you need to start trading", PATH);

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
        eyebrow="Guides · Getting started"
        title="What you need to start trading"
        subheading="A 10-point readiness checklist — money, knowledge, setup and discipline — to work through before you place your first trade."
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
              <p>
                <strong>At a glance:</strong> to start trading you need money
                you can afford to lose, a financial safety net, a basic grasp of
                what you&apos;re buying, a licensed broker or registered
                exchange, a short written plan, and a way to keep records for
                tax. You don&apos;t need a finance degree or thousands of
                dollars.
              </p>

              <h2 id="why-preparation-matters">
                Why preparation matters more than picking the &quot;right&quot;
                stock
              </h2>
              <p>
                Many of the problems that catch beginners out — trading money
                they&apos;ll need soon, underestimating fees, acting on emotion
                — can be sorted before your first trade rather than learned the
                hard way after it. This checklist works through four groups:
                money, then direction and knowledge, then setup, then
                discipline. If you want to understand what trading actually is
                first, start with{" "}
                <Link href={RELATED_PATH_WHAT_IS_TRADING}>
                  our guide to what trading is
                </Link>
                .
              </p>

              <h2 id="group-money">Group 1 — Money</h2>
              <p>
                <strong>1. A financial safety net first.</strong> Keep trading
                money separate from rent, bills and emergencies. Moneysmart
                suggests building an emergency fund to cover around three months
                of essential expenses before you take on other financial risk.
              </p>
              <p>
                <strong>2. Deal with high-interest debt.</strong> Credit card
                interest is often higher than what most investments can
                reasonably be expected to earn. It&apos;s worth paying that
                down, or at least weighing it up, before you fund a trading
                account.
              </p>
              <p>
                <strong>
                  3. Money you can afford to lose, and how much to start with.
                </strong>{" "}
                Fees make small trades disproportionately expensive, because
                most brokerage is either a flat fee or has a minimum.
                Here&apos;s what a $10 brokerage fee (illustrative — check the
                current fee on your platform) does to trades of different sizes:
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Trade size</th>
                    <th>Fee each way</th>
                    <th>Round trip (buy + sell)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>$200</td>
                    <td>5.0%</td>
                    <td>10.0%</td>
                  </tr>
                  <tr>
                    <td>$500</td>
                    <td>2.0%</td>
                    <td>4.0%</td>
                  </tr>
                  <tr>
                    <td>$1,000</td>
                    <td>1.0%</td>
                    <td>2.0%</td>
                  </tr>
                  <tr>
                    <td>$5,000</td>
                    <td>0.2%</td>
                    <td>0.4%</td>
                  </tr>
                </tbody>
              </table>
              <p>
                On a $500 trade, the price has to rise by roughly 4% just for
                you to break even on fees alone. A rule of thumb some traders
                use (not a recommendation): limit the loss on any single trade
                to about 1% of your account. On a $2,000 account, that&apos;s
                $20.
              </p>

              <GuideFigure caption="Small trades lose a larger share of their value to fixed fees — cost drag falls as trade size grows.">
                <GrowthTrendIllustration title="Illustrative effect of fee drag shrinking as trade size and time in the market grow" />
              </GuideFigure>

              <h2 id="group-knowledge">Group 2 — Direction and knowledge</h2>
              <p>
                <strong>4. A clear goal and time horizon.</strong> What are you
                trying to do, and by when? If you&apos;re not sure yet, the
                goal-setting step in{" "}
                <Link href="/guides/steps-to-start-investing-in-share-in-australia">
                  our steps to start investing in shares
                </Link>{" "}
                guide is a good place to start.
              </p>
              <p>
                <strong>5. Understand what you&apos;re buying.</strong> If you
                can&apos;t explain in one sentence how it makes or loses money,
                wait. For shares and ETFs, read the product disclosure
                statement; for crypto, read the project&apos;s own documentation
                and check the scam warnings first. See{" "}
                <Link href="/guides/share-trading-for-beginners">
                  Share trading for beginners
                </Link>{" "}
                and{" "}
                <Link href="/guides/how-to-start-investing-in-crypto-for-beginners">
                  How to start investing in crypto
                </Link>{" "}
                for the basics of each.
              </p>

              <GuideFigure caption="Reading the product disclosure statement or project documentation before you buy is the single most protective habit on this list.">
                <ResearchIllustration title="Researching what you're buying before you trade" />
              </GuideFigure>

              <p>
                <strong>6. Practise first, with realistic expectations.</strong>{" "}
                Your options are a demo account (commonly offered by CFD and
                forex brokers and some charting platforms), a paper-trading
                spreadsheet, or a very small first live trade. Practice
                can&apos;t fully copy the emotion of trading with real money, so
                treat it as a start, not a guarantee.
              </p>

              <h2 id="group-setup">Group 3 — Setup</h2>
              <p>
                <strong>
                  7. Choose a licensed broker or registered exchange.
                </strong>
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Check</th>
                    <th>Share brokers</th>
                    <th>Crypto exchanges</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Licence</td>
                    <td>Holds an AFS licence</td>
                    <td>Registered with AUSTRAC</td>
                  </tr>
                  <tr>
                    <td>Who holds your assets</td>
                    <td>CHESS-sponsored (HIN) vs custodian model</td>
                    <td>Held on the exchange, or your own wallet</td>
                  </tr>
                  <tr>
                    <td>Fees</td>
                    <td>Brokerage, FX, account fees</td>
                    <td>Trading, deposit and withdrawal fees</td>
                  </tr>
                  <tr>
                    <td>Funding</td>
                    <td>Bank transfer, BPAY</td>
                    <td>Bank transfer, PayID, card</td>
                  </tr>
                  <tr>
                    <td>Security</td>
                    <td>Two-factor login</td>
                    <td>Two-factor login</td>
                  </tr>
                </tbody>
              </table>
              <p>
                See our full comparisons for{" "}
                <Link href="/share-trading">share trading platforms</Link> and{" "}
                <Link href="/crypto/exchanges">crypto exchanges</Link>.
              </p>

              <p>
                <strong>8. ID, banking and security.</strong> You&apos;ll
                typically need photo ID (driver licence or passport) and an
                Australian bank account; some brokers also ask for your TFN. Set
                up a unique password and two-factor login, and avoid logging in
                over public Wi-Fi. See{" "}
                <Link href={RELATED_PATH_OPEN_ACCOUNT}>
                  how to open an online share trading account
                </Link>{" "}
                or{" "}
                <Link href={RELATED_PATH_STEPS_TO_BUY_CRYPTO}>
                  5 simple steps to buy cryptocurrency
                </Link>{" "}
                for the account-opening detail.
              </p>

              <GuideFigure caption="Two-factor login and a unique password are the baseline security setup for either a share broker or a crypto exchange account.">
                <SecurityShieldIllustration title="Securing a trading account with two-factor login" />
              </GuideFigure>

              <h2 id="group-discipline">Group 4 — Discipline</h2>
              <p>
                <strong>9. A one-page trading plan.</strong> Write down: your
                goal and timeframe; what you&apos;ll trade; your maximum loss
                per trade; when you&apos;ll enter and exit; a daily or weekly
                loss limit where you&apos;ll stop; and when you&apos;ll review
                your results. Add three rules on top: no borrowing to trade, no
                trading while stressed, and step away after a loss rather than
                trying to win it back immediately.
              </p>
              <p>
                <strong>10. Records and tax.</strong> Keep the date, asset,
                quantity, price and fees for every trade. Brokers and exchanges
                provide statements, but keep your own copies too — it makes
                working out whether you&apos;re an investor or a trader for tax
                purposes, and calculating any capital gains tax, far more
                straightforward. A registered tax agent can help if your
                situation isn&apos;t straightforward.
              </p>

              <h2 id="signs-not-ready">Signs you may not be ready yet</h2>
              <ul>
                <li>You&apos;d need the money within the next year.</li>
                <li>You&apos;re planning to borrow money to trade.</li>
                <li>You expect regular income from trading a small balance.</li>
                <li>
                  You&apos;re acting on a tip from social media or a stranger.
                </li>
                <li>You can&apos;t explain what you&apos;re about to buy.</li>
              </ul>

              <h2 id="ready">Ready? Choose your path</h2>
              <p>
                Once you&apos;ve worked through the checklist above, the next
                step depends on which market you&apos;re heading toward. Not
                sure yet? Go back to{" "}
                <Link href={RELATED_PATH_WHAT_IS_TRADING}>what is trading</Link>{" "}
                for an overview of what you can trade and how it works.
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
                  id: "ato-crypto-cgt",
                  label: "ATO — How to work out and report CGT on crypto",
                  url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/crypto-asset-investments/how-to-work-out-and-report-cgt-on-crypto",
                },
                {
                  id: "moneysmart-choose-investments",
                  label: "Moneysmart — Choose your investments",
                  url: "https://moneysmart.gov.au/how-to-invest/choose-your-investments",
                },
                {
                  id: "moneysmart-investment-warnings",
                  label: "Moneysmart — Investment warnings",
                  url: "https://moneysmart.gov.au/investment-warnings",
                },
                {
                  id: "moneysmart-emergency-fund",
                  label: "Moneysmart — Save for an emergency fund",
                  url: "https://moneysmart.gov.au/saving/save-for-an-emergency-fund",
                },
                {
                  id: "austrac-vasp-overview",
                  label: "AUSTRAC — Virtual asset service providers overview",
                  url: "https://www.austrac.gov.au/industry-and-business/your-industry/virtual-asset-service-providers/virtual-asset-service-providers-overview",
                },
              ]}
            />

            <RelatedGuides
              guides={[
                {
                  id: "what-is-trading",
                  slug: STATIC_SLUG_IDS.WHAT_IS_TRADING,
                  href: RELATED_PATH_WHAT_IS_TRADING,
                  title: "What Is Trading? A Beginner's Guide for Australians",
                  excerpt:
                    "What trading actually means, how a trade works, and how it differs from investing.",
                },
                {
                  id: "how-to-open-online-share-trading-account",
                  slug: STATIC_SLUG_IDS.OPEN_SHARE_TRADING_ACCOUNT,
                  href: RELATED_PATH_OPEN_ACCOUNT,
                  title: "How to Open an Online Share Trading Account",
                  excerpt:
                    "The step-by-step process — ID checks, HIN vs custodian, linking your bank.",
                },
                {
                  id: "simple-steps-to-buy-cryptocurrency",
                  slug: STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO,
                  href: RELATED_PATH_STEPS_TO_BUY_CRYPTO,
                  title: "5 Simple Steps to Buy Cryptocurrency",
                  excerpt:
                    "Choosing an exchange, verifying your identity, funding, buying, and storing it safely.",
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
                  id: "what-is-trading-guide",
                  slug: STATIC_SLUG_IDS.WHAT_IS_TRADING,
                  href: RELATED_PATH_WHAT_IS_TRADING,
                  title: "Not sure yet? Read what trading actually is",
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
            compareHref="/compare/crypto-exchanges"
            compareLabel="Compare crypto exchanges"
          />
        </div>
      </div>
    </>
  );
}
