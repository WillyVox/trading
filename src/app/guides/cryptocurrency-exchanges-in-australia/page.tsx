import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { guideBreadcrumbTrail } from "@/lib/seo/breadcrumbs";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { estimateReadingMinutesByWordCount } from "@/lib/articles/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { KeyTakeaways } from "@/components/guide/KeyTakeaways";
import { GuideTableOfContents } from "@/components/guide/GuideTableOfContents";
import { GuideSidebar } from "@/components/guide/GuideSidebar";
import { GuideSourceList } from "@/components/guide/GuideSourceList";
import { GuideFigure } from "@/components/guide/GuideFigure";
import { RelatedGuides } from "@/components/guide/RelatedGuides";
import { GuideProviderLinks } from "@/components/guide/GuideProviderLinks";
import { GuideNextSteps } from "@/components/guide/GuideNextSteps";
import {
  getStaticGuideArticleHref,
  getStaticGuideArticleImage,
  STATIC_SLUG_IDS,
} from "@/lib/guides/static-article-slugs";

const PATH = getStaticGuideArticleHref(STATIC_SLUG_IDS.TOP_CRYPTO_EXCHANGES);
const RELATED_PATH_STEPS_TO_BUY_CRYPTO = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO
);
const RELATED_PATH_START_INVESTING_IN_CRYPTO = getStaticGuideArticleHref(
  STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO
);

const TITLE =
  "Cryptocurrency Exchanges in Australia: Fees, Features & Key Differences";
const DESCRIPTION =
  "Learn how cryptocurrency exchanges in Australia differ on trading fees, AUD funding, supported assets, security and AUSTRAC registration, with source-linked information for beginners.";

const HEADINGS = [
  {
    id: "quick-comparison",
    text: "Quick comparison: established exchanges available in Australia",
    level: 2 as const,
  },
  {
    id: "what-is-an-exchange",
    text: "What is a cryptocurrency exchange?",
    level: 2 as const,
  },
  {
    id: "how-australian-exchanges-work",
    text: "How crypto exchanges work in Australia",
    level: 2 as const,
  },
  {
    id: "exchange-profiles",
    text: "Cryptocurrency exchanges to research",
    level: 2 as const,
  },
  { id: "coinspot", text: "CoinSpot", level: 3 as const },
  { id: "swyftx", text: "Swyftx", level: 3 as const },
  { id: "btc-markets", text: "BTC Markets", level: 3 as const },
  { id: "coinjar", text: "CoinJar", level: 3 as const },
  { id: "independent-reserve", text: "Independent Reserve", level: 3 as const },
  { id: "kraken", text: "Kraken", level: 3 as const },
  {
    id: "what-to-compare",
    text: "What to compare before choosing an exchange",
    level: 2 as const,
  },
  {
    id: "fees",
    text: "Understand the total cost, not just the headline fee",
    level: 2 as const,
  },
  { id: "austrac", text: "AUSTRAC registration explained", level: 2 as const },
  { id: "security", text: "Security, custody and wallets", level: 2 as const },
  {
    id: "scams",
    text: "Crypto exchange scams and red flags",
    level: 2 as const,
  },
  { id: "tax", text: "Crypto and tax in Australia", level: 2 as const },
  {
    id: "before-opening-account",
    text: "Before opening an exchange account",
    level: 2 as const,
  },
];

const WORD_COUNT = 2850;
const READING_MINUTES = estimateReadingMinutesByWordCount(WORD_COUNT);

const KEY_TAKEAWAYS = [
  "Australian crypto exchanges can differ materially in trading fees, spreads, AUD deposit methods, available assets, trading tools and withdrawal costs.",
  "Virtual asset service providers that provide registrable services in Australia must be registered with AUSTRAC. The public VASP register can be used to check registration status.",
  "AUSTRAC registration is not a guarantee that an exchange or a crypto asset is safe, and it should not be confused with the consumer protections that may apply to licensed financial products.",
  "Compare the total cost of using an exchange: trading fees are only one part of the picture, alongside spreads, card or payment fees and crypto network or withdrawal charges.",
  "Crypto is highly volatile and scams are common. An exchange comparison can explain platform differences, but it cannot remove the underlying investment, custody or fraud risks.",
];

const SOURCES = [
  {
    id: "austrac-vasp-overview",
    label: "AUSTRAC — Virtual asset service providers overview",
    url: "https://www.austrac.gov.au/industry-and-business/your-industry/virtual-asset-service-providers/virtual-asset-service-providers-overview",
  },
  {
    id: "austrac-vasp-register",
    label:
      "AUSTRAC — Virtual asset service provider register goes public (30 June 2026)",
    url: "https://www.austrac.gov.au/news-and-media/article/virtual-asset-service-provider-register-goes-public",
  },
  {
    id: "moneysmart-crypto-assets",
    label: "Moneysmart — Crypto assets: how they work and their risks",
    url: "https://moneysmart.gov.au/complex-investment-products/crypto-assets",
  },
  {
    id: "moneysmart-crypto-scams",
    label: "Moneysmart — Crypto scams",
    url: "https://moneysmart.gov.au/financial-scams/crypto-scams",
  },
  {
    id: "coinspot-markets",
    label: "CoinSpot — Markets and market trading fee",
    url: "https://www.coinspot.com.au/markets",
  },
  {
    id: "swyftx-fees",
    label: "Swyftx — Trading fee tiers",
    url: "https://support.swyftx.com/en/articles/12005536-our-trading-fees",
  },
  {
    id: "btc-markets-fees",
    label: "BTC Markets — Fees",
    url: "https://www.btcmarkets.net/fees",
  },
  {
    id: "coinjar-fees",
    label: "CoinJar — Australian fees and spreads",
    url: "https://www.coinjar.com/au/fees",
  },
  {
    id: "independent-reserve-fees",
    label: "Independent Reserve — Australian fee schedule",
    url: "https://www.independentreserve.com/au/fees",
  },
  {
    id: "kraken-australia",
    label: "Kraken — Australia",
    url: "https://www.kraken.com/en-au",
  },
  {
    id: "ato-crypto",
    label: "Australian Taxation Office — Crypto asset investments",
    url: "https://www.ato.gov.au/individuals-and-families/investments-and-assets/crypto-asset-investments",
  },
];

export const metadata = buildMetadata({
  title:
    "Cryptocurrency Exchanges in Australia: Fees, Features & Key Differences",
  description: DESCRIPTION,
  path: PATH,
  image: getStaticGuideArticleImage(STATIC_SLUG_IDS.TOP_CRYPTO_EXCHANGES),
  type: "article",
  publishedTime: "2026-09-17",
  modifiedTime: "2026-09-17",
  authors: ["Trading Guide Editorial Team"],
});

export default function TopCryptocurrencyExchangesInAustraliaPage() {
  const trail = guideBreadcrumbTrail(
    "Cryptocurrency Exchanges in Australia",
    PATH
  );
  const metaItems = [
    "By Trading Guide Editorial Team",
    "Last updated 17 September 2026",
    `${READING_MINUTES} min read`,
  ];

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: TITLE,
          description: DESCRIPTION,
          image: getStaticGuideArticleImage(
            STATIC_SLUG_IDS.TOP_CRYPTO_EXCHANGES
          ),
          author: "Trading Guide Editorial Team",
          datePublished: "2026-09-17",
          dateModified: "2026-09-17",
          path: PATH,
        })}
      />
      <JsonLd data={breadcrumbSchema(trail)} />

      <PageHero
        breadcrumbs={trail}
        eyebrow="Guides · Crypto exchanges"
        title="Cryptocurrency exchanges in Australia: fees, features and key differences"
        subheading="Australian crypto exchanges differ in fees, AUD funding, available assets, trading tools and security features. This guide explains the differences and the checks to make before opening an account."
        meta={metaItems}
        graphic="crypto"
      />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="max-w-3xl min-w-0">
            <GuideFigure caption="A cryptocurrency exchange connects Australian-dollar funding with digital-asset markets. Fees, funding methods, security controls and available assets differ between providers.">
              <Image
                src={getStaticGuideArticleImage(
                  STATIC_SLUG_IDS.TOP_CRYPTO_EXCHANGES
                )}
                alt="Illustration comparing cryptocurrency exchanges in Australia by AUD funding, fees, security and digital assets"
                width={1200}
                height={630}
                priority
                className="h-auto w-full"
              />
            </GuideFigure>

            <KeyTakeaways items={KEY_TAKEAWAYS} />

            <div className="mt-6 lg:hidden">
              <GuideTableOfContents headings={HEADINGS} />
            </div>

            <div className="prose prose-headings:font-display prose-headings:text-navy mt-8 max-w-none">
              <p>
                Cryptocurrency exchanges are online services that let people
                buy, sell and often store digital assets such as Bitcoin and
                Ether. For Australians, the practical differences between
                exchanges can be substantial: one platform may focus on a simple
                instant-buy experience, while another offers an order book,
                advanced orders or lower fees for higher-volume traders.
              </p>
              <p>
                This guide does <strong>not</strong> rank a universal
                &quot;best&quot; exchange. Instead, it profiles established
                services available to Australian users and explains the facts a
                beginner should compare. If you already know what matters to
                you, you can also{" "}
                <Link href="/compare/crypto-exchanges">
                  compare crypto exchanges side-by-side
                </Link>{" "}
                or browse our{" "}
                <Link href="/crypto/exchanges">crypto exchange profiles</Link>.
              </p>

              <h2 id="quick-comparison">
                Quick comparison: established exchanges available in Australia
              </h2>
              <div className="not-prose border-border bg-panel my-6 overflow-x-auto rounded-2xl border">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-panel-secondary text-navy">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Exchange</th>
                      <th className="px-4 py-3 font-semibold">AUD funding</th>
                      <th className="px-4 py-3 font-semibold">Trading style</th>
                      <th className="px-4 py-3 font-semibold">
                        Useful to research if you want…
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-border divide-y">
                    <tr>
                      <td className="text-navy px-4 py-3 font-semibold">
                        CoinSpot
                      </td>
                      <td className="px-4 py-3">Yes</td>
                      <td className="px-4 py-3">Instant buy plus Markets</td>
                      <td className="px-4 py-3">
                        A simple retail interface plus AUD market trading
                      </td>
                    </tr>
                    <tr>
                      <td className="text-navy px-4 py-3 font-semibold">
                        Swyftx
                      </td>
                      <td className="px-4 py-3">Yes</td>
                      <td className="px-4 py-3">Retail trading platform</td>
                      <td className="px-4 py-3">
                        A broad retail feature set and volume-based fees
                      </td>
                    </tr>
                    <tr>
                      <td className="text-navy px-4 py-3 font-semibold">
                        BTC Markets
                      </td>
                      <td className="px-4 py-3">Yes</td>
                      <td className="px-4 py-3">Order-book exchange</td>
                      <td className="px-4 py-3">
                        AUD markets and a trading-oriented interface
                      </td>
                    </tr>
                    <tr>
                      <td className="text-navy px-4 py-3 font-semibold">
                        CoinJar
                      </td>
                      <td className="px-4 py-3">Yes</td>
                      <td className="px-4 py-3">
                        Retail conversion plus CoinJar Exchange
                      </td>
                      <td className="px-4 py-3">
                        Simple conversions and a separate order-book interface
                      </td>
                    </tr>
                    <tr>
                      <td className="text-navy px-4 py-3 font-semibold">
                        Independent Reserve
                      </td>
                      <td className="px-4 py-3">Yes</td>
                      <td className="px-4 py-3">
                        Order book, recurring buys and OTC
                      </td>
                      <td className="px-4 py-3">
                        AUD trading, business/SMSF features and volume discounts
                      </td>
                    </tr>
                    <tr>
                      <td className="text-navy px-4 py-3 font-semibold">
                        Kraken
                      </td>
                      <td className="px-4 py-3">Yes</td>
                      <td className="px-4 py-3">
                        Global exchange and advanced trading
                      </td>
                      <td className="px-4 py-3">
                        A global platform with advanced market tools
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The table is a starting point, not a recommendation or ranking.
                Fees, available assets and funding methods can change, so verify
                current details with the provider before making a decision.
              </p>

              <h2 id="what-is-an-exchange">
                What is a cryptocurrency exchange?
              </h2>
              <p>
                A cryptocurrency exchange is a platform that facilitates
                transactions involving crypto assets. Depending on the service,
                you may deposit Australian dollars, place an order to buy a
                crypto asset, hold the asset in a platform-hosted wallet, sell
                it later, or withdraw it to a wallet you control. The exact
                model matters: an instant-buy service can quote you a price
                directly, while an order-book market matches buy and sell orders
                from market participants.
              </p>

              <GuideFigure caption="A common beginner journey is AUD deposit → exchange purchase → exchange wallet, with an optional withdrawal to a personal wallet. The exact steps and fees vary by provider.">
                <Image
                  src="/images/articles/how-cryptocurrency-exchange-works-australia.svg"
                  alt="Diagram showing Australian dollars moving from a bank to a cryptocurrency exchange, then to a crypto purchase and optional personal wallet"
                  width={1200}
                  height={630}
                  className="h-auto w-full"
                />
              </GuideFigure>

              <h2 id="how-australian-exchanges-work">
                How crypto exchanges work in Australia
              </h2>
              <p>
                Australian-facing exchanges commonly support identity
                verification and AUD funding by bank transfer or PayID, although
                payment methods differ. Once funds arrive, users can purchase
                crypto using an instant-buy interface or place orders on a
                market where the provider offers one. Selling generally reverses
                the process: crypto is sold for AUD and eligible funds can then
                be withdrawn to a bank account.
              </p>
              <p>
                The important point for beginners is that &quot;buying
                crypto&quot; is not one standardised service. A provider may
                charge a visible transaction fee, include a spread in the quoted
                price, charge for particular payment methods, or apply a
                network-related fee when crypto is sent to an external wallet.
                Compare the whole transaction path rather than one number.
              </p>

              <h2 id="exchange-profiles">
                Cryptocurrency exchanges to research
              </h2>
              <p>
                The exchanges below are examples of established services
                available to Australian users. Inclusion is not a ranking,
                endorsement or statement that one exchange is suitable for every
                person. Use the provider profiles and primary sources to check
                current details.
              </p>

              <h3 id="coinspot">CoinSpot</h3>
              <p>
                CoinSpot has operated in Australia since 2013 and offers both a
                retail buy/sell interface and CoinSpot Markets. Its Markets page
                currently advertises a 0.1% market trading fee. That distinction
                is useful for beginners: the price and fee structure of a
                provider&apos;s instant-buy service can differ from its
                order-book market. See our{" "}
                <Link href="/crypto/exchanges/coinspot">CoinSpot profile</Link>{" "}
                for the structured facts and sources we track.
              </p>

              <h3 id="swyftx">Swyftx</h3>
              <p>
                Swyftx is an Australian crypto platform with AUD funding and a
                retail-focused trading interface. Its published trading-fee
                schedule currently starts at 0.6% for users below $100,000 of
                rolling 30-day trading volume and steps down through volume
                tiers, reaching 0.1% at the highest published tier. The
                practical lesson is that the same provider can charge different
                trading rates depending on activity. See our{" "}
                <Link href="/crypto/exchanges/swyftx">Swyftx profile</Link>.
              </p>

              <h3 id="btc-markets">BTC Markets</h3>
              <p>
                BTC Markets is an Australian exchange with AUD markets and an
                order-book trading model. It is useful to compare separately
                from instant-buy-first services because an order book gives
                traders more direct control over order price and type. BTC
                Markets also publishes its own fee schedule, which should be
                checked before trading because fee tiers and product pricing can
                change. See our{" "}
                <Link href="/crypto/exchanges/btc-markets">
                  BTC Markets profile
                </Link>
                .
              </p>

              <h3 id="coinjar">CoinJar</h3>
              <p>
                CoinJar operates a retail conversion service as well as CoinJar
                Exchange. Its Australian fee page currently lists a 1% fee for
                standard fiat-to-crypto, crypto-to-fiat and crypto-to-crypto
                conversions, while CoinJar Exchange publishes a separate
                maker/taker schedule for order-book trading. This is a good
                example of why comparing only a brand name is not enough: the
                service used within the same provider can materially change the
                cost.
              </p>

              <h3 id="independent-reserve">Independent Reserve</h3>
              <p>
                Independent Reserve is an Australian exchange offering an order
                book, recurring buys, API access and OTC services. Its
                Australian fee schedule currently starts at 0.50% and reduces
                with rolling 30-day trading volume, with lower published rates
                at high volume. It also supports free EFT bank withdrawals
                according to its current fee page. See our{" "}
                <Link href="/crypto/exchanges/independent-reserve">
                  Independent Reserve profile
                </Link>
                .
              </p>

              <h3 id="kraken">Kraken</h3>
              <p>
                Kraken is a global exchange with an Australian-facing service
                and AUD funding options. It offers both simpler purchase flows
                and more advanced trading tools. Because Kraken operates
                multiple products and services, check the Australian product,
                legal entity, fee schedule and regulatory scope relevant to the
                service you intend to use rather than assuming every Kraken
                product works the same way. See our{" "}
                <Link href="/crypto/exchanges/kraken">Kraken profile</Link>.
              </p>

              <h2 id="what-to-compare">
                What to compare before choosing an exchange
              </h2>
              <p>
                A useful exchange comparison should go beyond brand recognition.
                For a beginner, these are the main questions worth checking:
              </p>
              <ul>
                <li>
                  <strong>AUD funding:</strong> Can you deposit and withdraw
                  Australian dollars using the method you prefer?
                </li>
                <li>
                  <strong>Total trading cost:</strong> What transaction fee,
                  spread or market fee applies to the exact service you will
                  use?
                </li>
                <li>
                  <strong>Crypto withdrawals:</strong> Can you withdraw assets
                  to your own wallet, and what network or withdrawal charges
                  apply?
                </li>
                <li>
                  <strong>Available assets:</strong> Does the platform list the
                  assets you actually intend to research or buy?
                </li>
                <li>
                  <strong>Order types:</strong> Do you need simple purchases
                  only, or market, limit and stop-style orders?
                </li>
                <li>
                  <strong>Security controls:</strong> Does the account support
                  two-factor authentication and useful withdrawal/security
                  controls?
                </li>
                <li>
                  <strong>Australian registration:</strong> If the provider
                  supplies registrable virtual asset services in Australia, can
                  you verify it on AUSTRAC&apos;s VASP register?
                </li>
                <li>
                  <strong>Support and records:</strong> Can you obtain
                  transaction history and records you may need for tax and
                  account management?
                </li>
              </ul>

              <GuideFigure caption="A useful crypto-exchange comparison looks at the whole service: costs, AUD funding, security, available assets, withdrawals and Australian registration information.">
                <Image
                  src="/images/articles/how-to-compare-crypto-exchanges-australia.svg"
                  alt="Diagram of factors to compare when choosing a cryptocurrency exchange in Australia, including fees, AUD funding, security, assets, withdrawals and AUSTRAC registration"
                  width={1200}
                  height={630}
                  className="h-auto w-full"
                />
              </GuideFigure>

              <h2 id="fees">
                Understand the total cost, not just the headline fee
              </h2>
              <p>
                Crypto pricing can be confusing because &quot;fee&quot; does not
                always mean the same thing. A <strong>trading fee</strong> is a
                direct charge on a transaction. A <strong>spread</strong> is the
                difference between buy and sell pricing or the margin
                incorporated into a quoted price. A <strong>network fee</strong>{" "}
                relates to moving an asset on its blockchain and can vary with
                the network and provider policy.
              </p>
              <p>
                Payment method also matters. Card, PayPal or third-party payment
                options may cost more than bank transfer or PayID. Before
                comparing two exchanges, map the journey you expect to use —
                deposit AUD, buy, potentially sell, and potentially withdraw
                crypto — and compare costs at each stage. Our{" "}
                <Link href="/guides/crypto-exchange-fees-australia-explained">
                  crypto exchange fees guide
                </Link>{" "}
                goes deeper into the terminology.
              </p>

              <h2 id="austrac">AUSTRAC registration explained</h2>
              <p>
                AUSTRAC states that a business providing registrable virtual
                asset services in Australia must be registered before providing
                those services. Since 30 June 2026, AUSTRAC has made its VASP
                register public, allowing consumers to search for registered
                providers. Registration supports Australia&apos;s
                anti-money-laundering and counter-terrorism-financing framework
                and can be an important legitimacy check.
              </p>
              <div className="not-prose border-gold/40 bg-gold/10 my-6 rounded-2xl border p-5">
                <h3 className="font-display text-navy text-lg font-bold">
                  Registration is not a safety guarantee
                </h3>
                <p className="text-text mt-2 text-sm leading-6">
                  AUSTRAC registration does not mean AUSTRAC has endorsed a
                  crypto asset, guaranteed an exchange, or guaranteed that
                  customer assets cannot be lost. Moneysmart warns that many
                  crypto providers do not carry the same licensing or
                  protections people may associate with traditional financial
                  products. Treat registration as one check, not the end of your
                  research.
                </p>
              </div>
              <p>
                For more context, read our{" "}
                <Link href="/guides/austrac-registration-crypto-exchanges-explained">
                  AUSTRAC registration explainer
                </Link>{" "}
                and verify current status directly with AUSTRAC.
              </p>

              <h2 id="security">Security, custody and wallets</h2>
              <p>
                No exchange can remove the underlying risks of crypto.
                Moneysmart describes crypto as highly speculative and warns that
                assets can be lost if a platform fails, is hacked, or a user
                loses access credentials. When comparing exchanges, look for
                account controls such as two-factor authentication, withdrawal
                confirmation and address-management features, but also
                understand where your assets are held.
              </p>
              <p>
                Leaving crypto on an exchange is convenient because the provider
                manages the wallet infrastructure. Withdrawing to a personal
                wallet gives you control of the private keys, but it also
                transfers responsibility to you: losing the recovery phrase or
                sending to the wrong address can cause permanent loss. Our{" "}
                <Link href="/guides/crypto-wallet-vs-exchange-beginners">
                  wallet vs exchange guide
                </Link>{" "}
                explains the trade-off in beginner-friendly terms.
              </p>

              <h2 id="scams">Crypto exchange scams and red flags</h2>
              <p>
                A familiar exchange name does not protect you from
                impersonation. Moneysmart warns that scammers create fake
                trading platforms, wallet sites and apps, and also impersonate
                legitimate digital-asset platforms. Always navigate to the
                provider&apos;s verified website yourself rather than trusting
                an unexpected message or advertisement.
              </p>
              <p>Common warning signs include:</p>
              <ul>
                <li>
                  unsolicited contact offering investment advice or access to a
                  crypto platform;
                </li>
                <li>
                  guaranteed or unusually high returns with supposedly low risk;
                </li>
                <li>pressure to deposit or transfer crypto immediately;</li>
                <li>
                  a website or app that closely imitates a known exchange but
                  uses a different address;
                </li>
                <li>
                  requests to share passwords, recovery phrases or remote access
                  to your device; and
                </li>
                <li>
                  unexpected &quot;tax&quot;, &quot;release&quot; or
                  &quot;withdrawal&quot; payments demanded before funds can be
                  returned.
                </li>
              </ul>

              <h2 id="tax">Crypto and tax in Australia</h2>
              <p>
                Crypto transactions can have Australian tax consequences
                depending on what you do and your circumstances. Selling,
                swapping, spending, receiving or otherwise disposing of crypto
                can create record-keeping and tax obligations. Keep transaction
                dates, AUD values, fees and transfer records from the beginning
                rather than trying to reconstruct them at tax time.
              </p>
              <p>
                Tax treatment can be detailed and can change. Check the
                Australian Taxation Office&apos;s current crypto guidance or
                obtain professional tax advice for your circumstances. This
                guide provides general information only and is not personal tax
                advice.
              </p>

              <h2 id="before-opening-account">
                Before opening an exchange account
              </h2>
              <p>
                Start by deciding what you actually need. A beginner making
                occasional purchases may value a clear interface and simple AUD
                funding. Someone placing limit orders may care more about
                order-book liquidity and trading fees. Someone intending to
                self-custody may care most about crypto withdrawal support and
                network costs.
              </p>
              <p>
                Then verify the provider independently, read the current fee
                schedule, understand how assets are held, enable strong account
                security, and start with an amount small enough to learn how
                deposits, orders and withdrawals work. If you are making your
                first purchase, continue with our{" "}
                <Link href={RELATED_PATH_STEPS_TO_BUY_CRYPTO}>
                  5 simple steps to buy cryptocurrency
                </Link>{" "}
                or read{" "}
                <Link href={RELATED_PATH_START_INVESTING_IN_CRYPTO}>
                  how to start investing in crypto for beginners
                </Link>
                .
              </p>
            </div>

            <GuideSourceList sources={SOURCES} />

            <RelatedGuides
              guides={[
                {
                  id: "start-investing-crypto",
                  slug: STATIC_SLUG_IDS.START_INVESTING_IN_CRYPTO,
                  href: RELATED_PATH_START_INVESTING_IN_CRYPTO,
                  title: "How to Start Investing in Crypto for Beginners",
                  excerpt:
                    "Understand risk, research, storage and the decisions to make before putting money into crypto.",
                },
                {
                  id: "simple-steps-buy-crypto",
                  slug: STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO,
                  href: RELATED_PATH_STEPS_TO_BUY_CRYPTO,
                  title: "5 Simple Steps to Buy Cryptocurrency",
                  excerpt:
                    "A practical walkthrough from choosing an exchange to placing a first purchase.",
                },
                {
                  id: "what-you-need-to-start-trading",
                  slug: STATIC_SLUG_IDS.WHAT_YOU_NEED_TO_START_TRADING,
                  href: getStaticGuideArticleHref(
                    STATIC_SLUG_IDS.WHAT_YOU_NEED_TO_START_TRADING
                  ),
                  title: "What You Need to Start Trading: 10-Point Checklist",
                  excerpt:
                    "Money, safety net, knowledge and a plan to sort out before you choose an exchange.",
                },
              ]}
            />

            <GuideProviderLinks
              heading="Research exchange profiles"
              providers={[
                {
                  slug: "coinspot",
                  name: "CoinSpot",
                  description:
                    "Australian exchange with instant-buy services and AUD market trading.",
                },
                {
                  slug: "swyftx",
                  name: "Swyftx",
                  description:
                    "Australian retail crypto platform with tiered trading fees.",
                },
                {
                  slug: "btc-markets",
                  name: "BTC Markets",
                  description:
                    "Australian order-book exchange with AUD markets.",
                },
                {
                  slug: "independent-reserve",
                  name: "Independent Reserve",
                  description:
                    "Australian exchange with order-book, recurring-buy and OTC services.",
                },
                {
                  slug: "kraken",
                  name: "Kraken",
                  description:
                    "Global exchange with an Australian-facing service and advanced trading tools.",
                },
              ]}
            />

            <GuideNextSteps
              steps={[
                {
                  id: "compare-exchanges",
                  slug: "compare-crypto-exchanges",
                  href: "/compare/crypto-exchanges",
                  title: "Compare crypto exchanges side-by-side",
                },
                {
                  id: "buy-crypto",
                  slug: STATIC_SLUG_IDS.STEPS_TO_BUY_CRYPTO,
                  href: RELATED_PATH_STEPS_TO_BUY_CRYPTO,
                  title: "Learn the 5 simple steps to buy cryptocurrency",
                },
              ]}
            />
          </article>
          <GuideSidebar
            headings={HEADINGS}
            category="crypto-exchanges"
            readingMinutes={READING_MINUTES}
          />
        </div>
      </div>
    </>
  );
}
