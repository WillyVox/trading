import type { ResearchGuideConfig } from "@/components/guide/ResearchGuidePage";

const reviewed = "24 September 2026";
const published = "2026-09-24";

export const LEARNING_FOUNDATION_GUIDES: Record<string, ResearchGuideConfig> = {
  "how-the-asx-works": {
    path: "/guides/how-the-asx-works",
    eyebrow: "Guides · Share trading foundations",
    title: "How the ASX Works: Orders, Execution and Settlement",
    description:
      "Learn how an Australian share order travels from your broker to the market, how market and limit orders differ, and what happens after a trade executes.",
    published,
    updated: reviewed,
    readMinutes: 7,
    takeaways: [
      "A broker sends your buy or sell order to the market; a trade occurs when a compatible buy order and sell order are matched.",
      "A market order prioritises execution at the next available price, while a limit order sets a price boundary and may not execute.",
      "The quoted price is not a promise that every order will execute at that exact price; available orders and liquidity matter.",
      "Australian cash-equity trades currently settle on a T+2 basis, two business days after the trade date.",
    ],
    sections: [
      {
        id: "marketplace",
        title: "What the ASX does",
        paragraphs: [
          "The Australian Securities Exchange is a marketplace where quoted securities can be bought and sold. For an individual investor, access normally happens through a broker or trading platform rather than by sending an order directly to ASX.",
          "A share represents part ownership in a company. Once shares are quoted, investors can submit buy and sell orders through market participants. The market brings those orders together; it does not guarantee that a buyer and seller will always agree on a price.",
        ],
      },
      {
        id: "order-flow",
        title: "From your screen to an executed trade",
        paragraphs: [
          "When you submit an order, your broker sends the order into the relevant market process. ASX explains that buy and sell orders are generally matched by price and then by the sequence in which they entered the platform. A trade occurs when a buy order can be matched with a sell order.",
          "After execution, your broker provides a trade confirmation showing details such as the security, quantity, execution price and fees. Execution is separate from settlement: the trade happens first, then cash and securities are exchanged through the settlement process.",
        ],
        visual: {
          title: "From order to settlement",
          caption:
            "A simplified Australian share-trading flow. Individual brokers can add their own order controls and account processes.",
          steps: [
            { label: "You", detail: "Submit a buy or sell order" },
            { label: "Broker", detail: "Routes the eligible order" },
            { label: "Market", detail: "Compatible orders can match" },
            {
              label: "Execution",
              detail: "Trade price and quantity are confirmed",
            },
            {
              label: "Settlement",
              detail: "Cash and securities exchange, normally T+2",
            },
          ],
          footer:
            "Execution and settlement are separate events: a trade can execute today while settlement completes later.",
        },
      },
      {
        id: "market-limit",
        title: "Market orders vs limit orders",
        paragraphs: [
          "A market order seeks to buy or sell at the next available price. It can prioritise getting the order executed, but the final price can differ from the last price you saw if the market moves or available liquidity changes.",
          "A limit order sets a boundary: the maximum price you are prepared to pay when buying, or the minimum price you are prepared to accept when selling. The price condition gives you more control, but the order may remain unfilled if the market never reaches it.",
        ],
        bullets: [
          "Market order: execution is prioritised; price is not fixed in advance.",
          "Limit buy: do not pay above the stated limit.",
          "Limit sell: do not sell below the stated limit.",
          "Other order types may exist; understand the provider's rules before using them.",
        ],
      },
      {
        id: "bid-ask",
        title: "Bid, ask and why the displayed price can move",
        paragraphs: [
          "The bid represents prices buyers are currently offering; the ask represents prices sellers are currently requesting. The difference between them is commonly called the bid-ask spread.",
          "The most recent traded price is historical information about the last matched trade. It is not necessarily the price available for the full size of your next order. This distinction becomes more noticeable when a security has lower liquidity or the market is moving quickly.",
        ],
      },
      {
        id: "settlement",
        title: "What happens after execution",
        paragraphs: [
          "ASX currently settles Australian cash-equity trades on a T+2 basis. That means settlement normally completes two business days after the trade date. Through CHESS, settlement transfers securities and funds between market participants using delivery versus payment.",
          "Settlement is also where concepts covered later in this learning path—CHESS sponsorship, custody and HINs—become relevant. Those concepts describe how holdings can be recorded and administered after trading.",
        ],
      },
      {
        id: "example",
        title: "A simple order example",
        paragraphs: [
          "Suppose a share is showing sellers at $10.05 and buyers at $10.00. A market buy order may interact with the available sell orders, while a limit buy at $10.00 will not pay more than $10.00 and may therefore remain unfilled. This is an illustration only: real order books can contain many prices and quantities and can change rapidly.",
          "The useful question is not which order type is universally better. It is what trade-off you are making between price control and the chance of execution.",
        ],
        visual: {
          title: "Hypothetical order-book snapshot",
          caption:
            "Illustration only — prices and available quantities can change continuously.",
          columns: [
            {
              title: "Market buy",
              items: [
                "Seeks the next available sell price",
                "May execute around $10.05 in this simplified example",
                "Final price is not fixed in advance",
              ],
            },
            {
              title: "Limit buy at $10.00",
              items: [
                "Will not pay above $10.00",
                "Does not match the $10.05 seller",
                "May remain unfilled",
              ],
            },
          ],
          example: [
            { label: "Best bid", value: "$10.00" },
            { label: "Best ask", value: "$10.05" },
          ],
          footer:
            "The example explains the trade-off between execution priority and price control; it is not a recommendation to use either order type.",
        },
      },
    ],
    sources: [
      {
        id: "asx-buy-sell",
        label: "ASX — How to buy and sell investments",
        url: "https://www.asx.com.au/investors/start-investing/how-to-buy-and-sell-investments",
      },
      {
        id: "asx-settlement",
        label: "ASX — ASX Settlement and CHESS",
        url: "https://www.asx.com.au/markets/clearing-and-settlement-services/asx-settlement",
      },
      {
        id: "moneysmart-buy-sell",
        label: "Moneysmart — How to buy and sell shares (updated 18 June 2026)",
        url: "https://moneysmart.gov.au/shares/how-to-buy-and-sell-shares",
      },
    ],
    next: [
      {
        href: "/guides/trading-costs-explained",
        title: "Trading costs explained",
        description:
          "Follow the transaction path and identify where costs can arise.",
      },
      {
        href: "/guides/brokerage-fees-australia",
        title: "Brokerage fees",
        description: "Understand the fee attached to share transactions.",
      },
      {
        href: "/guides/chess-vs-custody",
        title: "CHESS vs custody",
        description: "Learn what happens to ownership records after trading.",
      },
    ],
  },
  "how-crypto-exchanges-and-wallets-work": {
    path: "/guides/how-crypto-exchanges-and-wallets-work",
    eyebrow: "Guides · Crypto foundations",
    title: "How Crypto Exchanges and Wallets Work: Custody, Keys and Transfers",
    description:
      "Understand what a crypto exchange does, how custodial and self-custody wallets differ, and what changes when crypto moves between them.",
    published,
    updated: reviewed,
    readMinutes: 8,
    takeaways: [
      "A crypto exchange can provide a way to exchange money or crypto assets, but trading and custody are separate concepts.",
      "In a custodial arrangement, a service controls the private keys used to authorise blockchain transactions on your behalf.",
      "In self-custody, you control the private keys and take responsibility for protecting and recovering them.",
      "AUSTRAC VASP registration relates to Australia's AML/CTF framework; it is not the same as ASIC approval of a platform or crypto asset.",
    ],
    sections: [
      {
        id: "exchange",
        title: "What a crypto exchange does",
        paragraphs: [
          "A crypto exchange or trading service can provide a venue or service for exchanging Australian dollars for crypto assets, crypto for money, or one crypto asset for another. The exact model varies: some services operate an order book, some quote prices directly, and some provide multiple transaction paths.",
          "Before comparing fees, identify what service is actually being provided. A quoted instant-buy price, an order-book trade and a transfer to an external wallet can involve different costs and different operational steps.",
        ],
      },
      {
        id: "wallet",
        title: "What a crypto wallet actually stores",
        paragraphs: [
          "A crypto wallet is best understood as a way of managing the private keys that authorise transactions involving crypto assets on a blockchain. Moneysmart distinguishes software or hot wallets from hardware or cold wallets.",
          "The crypto asset is not a physical coin stored inside a device. The wallet manages credentials used to control blockchain transactions. Losing access to private keys or recovery information can therefore mean losing access to the crypto.",
        ],
      },
      {
        id: "custodial",
        title: "Custodial wallets",
        paragraphs: [
          "With a custodial service, the platform or custodian controls the private keys used for assets held on your behalf. This can simplify account access, trading and recovery, but it means you depend on the service's custody arrangements, security controls, withdrawal processes and terms.",
          "Ask how holdings are recorded, whether assets can be withdrawn to an external wallet, what withdrawal controls apply and what happens if access to the service is disrupted.",
        ],
        visual: {
          title: "Who controls the private keys?",
          columns: [
            {
              title: "Custodial",
              items: [
                "Service controls the private keys",
                "User depends on the service's access and withdrawal processes",
                "Recovery may be account-based",
              ],
            },
            {
              title: "Self-custody",
              items: [
                "User controls the private keys",
                "User is responsible for secure backup and recovery",
                "Wrong-address or lost-key mistakes can be irreversible",
              ],
            },
          ],
          footer:
            "Neither column is a universal 'better' answer. The structures place operational responsibilities and risks in different places.",
        },
      },
      {
        id: "self-custody",
        title: "Self-custody wallets",
        paragraphs: [
          "With self-custody, the user controls the private keys. That removes reliance on an exchange to authorise ordinary wallet transactions, but it also transfers responsibility for key security and recovery to the user.",
          "A hardware wallet can keep private keys offline, which can reduce some online attack exposure. It does not remove risks such as sending assets to the wrong address, losing recovery information, interacting with malicious software or misunderstanding a transaction.",
        ],
      },
      {
        id: "transfer",
        title: "What changes when you withdraw crypto",
        paragraphs: [
          "Moving crypto from an exchange account to an external wallet is a blockchain transfer. The destination address and network must be compatible with the asset and transfer method. Blockchain transfers can be difficult or impossible to reverse once confirmed.",
          "A withdrawal can also introduce provider withdrawal fees, network fees or minimum amounts. That is why the later funding and fee lessons separate trading costs from transfer costs rather than presenting one headline percentage.",
        ],
        visual: {
          title: "A simplified crypto custody and transfer path",
          caption:
            "Trading, custody and blockchain transfer are related but distinct steps.",
          steps: [
            { label: "AUD", detail: "Funding method" },
            { label: "Exchange", detail: "Trade or conversion" },
            { label: "Custodial balance", detail: "Service controls keys" },
            {
              label: "Withdrawal",
              detail: "Address + network + possible fees",
            },
            { label: "Self-custody wallet", detail: "User controls keys" },
          ],
          footer:
            "Moving to self-custody changes who controls the keys and who carries recovery responsibility; it does not remove risk.",
        },
      },
      {
        id: "regulation",
        title: "AUSTRAC registration is one check, not an endorsement",
        paragraphs: [
          "AUSTRAC requires businesses providing designated virtual-asset services with the relevant Australian connection to register as VASPs. AUSTRAC made its public VASP register available in June 2026 so people can verify registration status.",
          "Registration is part of Australia's anti-money-laundering and counter-terrorism-financing framework. ASIC separately explains that financial-services protections depend on whether a digital asset or related service is subject to the financial-services laws. Registration should therefore be treated as one factual check, not as a recommendation, investment-quality score or guarantee against loss.",
        ],
      },
    ],
    sources: [
      {
        id: "moneysmart-crypto",
        label: "Moneysmart — Crypto assets (updated 26 August 2026)",
        url: "https://moneysmart.gov.au/complex-investment-products/crypto-assets",
      },
      {
        id: "austrac-vasp",
        label:
          "AUSTRAC — Virtual asset service provider register goes public (30 June 2026)",
        url: "https://www.austrac.gov.au/news-and-media/article/virtual-asset-service-provider-register-goes-public",
      },
      {
        id: "asic-digital-assets",
        label: "ASIC — Digital assets: Financial products and services",
        url: "https://www.asic.gov.au/regulatory-resources/digital-transformation/digital-assets-financial-products-and-services",
      },
    ],
    next: [
      {
        href: "/guides/crypto-exchange-funding-australia",
        title: "Funding a crypto exchange",
        description:
          "Map bank transfer, PayID and card funding to the transaction path.",
      },
      {
        href: "/guides/crypto-exchange-fees-australia",
        title: "Crypto exchange fees",
        description:
          "Separate trading, instant-buy, funding and withdrawal costs.",
      },
      {
        href: "/guides/austrac-crypto-registration",
        title: "AUSTRAC registration",
        description:
          "Understand what VASP registration does—and does not—tell you.",
      },
    ],
  },
};
