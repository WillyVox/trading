import type { ResearchGuideConfig } from "@/components/guide/ResearchGuidePage";

const reviewed = "22 September 2026";
const published = "2026-09-22";
const moneysmartShares = {
  id: "moneysmart-shares",
  label: "Moneysmart — How to buy and sell shares (updated 18 June 2026)",
  url: "https://moneysmart.gov.au/shares/how-to-buy-and-sell-shares",
};
const asxHolder = {
  id: "asx-holder",
  label: "ASX — Holder management and CHESS sponsored holders",
  url: "https://www.asx.com.au/holder-management",
};
const asxDefaults = {
  id: "asx-defaults",
  label: "ASX — Company defaults FAQs: CHESS, HINs and custodial holdings",
  url: "https://www.asx.com.au/investors/investment-tools-and-resources/faqs-company-defaults",
};
const fractional = {
  id: "moneysmart-fractional",
  label: "Moneysmart — Fractional share trading (updated 16 September 2026)",
  url: "https://moneysmart.gov.au/shares/fractional-share-trading",
};
const crypto = {
  id: "moneysmart-crypto",
  label: "Moneysmart — Crypto assets (updated 26 August 2026)",
  url: "https://moneysmart.gov.au/complex-investment-products/crypto-assets",
};
const austrac = {
  id: "austrac-vasp",
  label:
    "AUSTRAC — Virtual asset service provider register goes public (30 June 2026)",
  url: "https://www.austrac.gov.au/news-and-media/article/virtual-asset-service-provider-register-goes-public",
};
const austracOverview = {
  id: "austrac-overview",
  label: "AUSTRAC — Virtual asset service providers overview",
  url: "https://www.austrac.gov.au/industry-and-business/your-industry/virtual-asset-service-providers/virtual-asset-service-providers-overview",
};

export const PHASE_9_3_GUIDES: Record<string, ResearchGuideConfig> = {
  "brokerage-fees-australia": {
    path: "/guides/brokerage-fees-australia",
    eyebrow: "Guides · Share trading costs",
    title: "Brokerage Fees in Australia: How Share Trading Costs Work",
    description:
      "Understand flat, percentage, minimum and conditional brokerage before comparing Australian share trading platforms.",
    published,
    updated: reviewed,
    readMinutes: 7,
    takeaways: [
      "Brokerage is the fee a broker charges when you buy or sell shares, but it is not always the only trading cost.",
      "A headline fee can be flat, percentage-based, minimum-based or conditional, so compare the rule rather than just the advertised number.",
      "Moneysmart notes that fees can make up a large share of a small trade and that overseas shares can add foreign-exchange costs.",
      "Trading Guide calculators keep variable, stale and unsupported fee components separate rather than assuming they are zero.",
    ],
    sections: [
      {
        id: "what-is-brokerage",
        title: "What is brokerage?",
        paragraphs: [
          "Brokerage is the transaction fee charged by a broker when an order to buy or sell shares is executed. Australian online brokers use different pricing structures, so two platforms can produce different costs for the same trade amount.",
          "Moneysmart says online brokers commonly charge a flat fee for smaller trades and may switch to a percentage for larger amounts. Some use a single flat fee. The important comparison is therefore the pricing rule that applies to your scenario, not just the smallest number shown in an advertisement.",
        ],
      },
      {
        id: "common-rules",
        title: "Common brokerage pricing rules",
        paragraphs: [
          "A flat fee stays the same across the trade sizes covered by that rule. A percentage fee rises with trade value. A minimum fee means a percentage calculation cannot fall below a stated floor. Some providers combine rules, for example charging the greater of a fixed minimum and a percentage.",
        ],
        bullets: [
          "Flat: one stated amount for an eligible order.",
          "Percentage: trade value multiplied by the published rate.",
          "Greater-of/minimum: whichever is higher — the minimum charge or percentage calculation.",
          "Conditional: the price depends on factors such as order type, market, settlement method, trade side or promotional eligibility.",
        ],
      },
      {
        id: "small-trades",
        title: "Why trade size matters",
        paragraphs: [
          "Fixed brokerage has a larger proportional effect on a small trade. A $10 fee on a $500 purchase is 2% of the purchase amount before considering any other cost; the same $10 on a $10,000 purchase is 0.1%. This is why Moneysmart specifically warns that fees can be a big share of a small trade.",
          "This does not mean a larger trade is automatically preferable. It only shows why fee comparisons should include the trade amount rather than comparing fee labels in isolation.",
        ],
      },
      {
        id: "other-costs",
        title: "Brokerage is not the whole cost",
        paragraphs: [
          "For overseas shares, foreign-exchange charges may apply when Australian dollars are converted into another currency. A platform may also disclose platform, inactivity, transfer, regulatory or pass-through charges. These costs should not be silently rolled into brokerage unless the provider's published rule actually does so.",
          "Trading Guide therefore separates brokerage and FX calculations and only combines components when their currencies and calculation rules can be represented safely.",
        ],
      },
      {
        id: "compare",
        title: "How to compare brokerage without false precision",
        paragraphs: [
          "Start with a hypothetical trade amount and market, then identify the exact published rule that applies. Check minimums, caps, GST treatment and conditions. Finally, inspect costs that sit outside brokerage, particularly FX for international investing.",
          "If a provider publishes a variable or scenario-dependent fee that cannot be reduced to one defensible number, leaving it unresolved is more accurate than displaying $0.",
        ],
      },
    ],
    sources: [moneysmartShares],
    next: [
      {
        href: "/tools/brokerage-calculator",
        title: "Brokerage calculator",
        description:
          "Apply supported verified brokerage rules to a hypothetical trade.",
      },
      {
        href: "/tools/trading-cost-calculator",
        title: "Trading cost calculator",
        description: "Inspect supported brokerage and FX components together.",
      },
      {
        href: "/compare/trading-platforms",
        title: "Compare platforms",
        description: "Compare source-linked platform facts side by side.",
      },
      {
        href: "/guides/share-trading",
        title: "Share trading research path",
        description: "Continue through ownership, tools and provider research.",
      },
    ],
  },
  "chess-vs-custody": {
    path: "/guides/chess-vs-custody",
    eyebrow: "Guides · Share ownership",
    title:
      "CHESS Sponsorship vs Custody: What Australian Investors Should Understand",
    description:
      "Learn how CHESS-sponsored holdings differ from custodial or omnibus structures, and what to verify on a broker profile.",
    published,
    updated: reviewed,
    readMinutes: 7,
    takeaways: [
      "ASX says a CHESS-sponsored holder is registered in CHESS as the owner of the securities and is identified by a HIN.",
      "A custodial structure can give an investor a beneficial interest while legal title is held by a custodian.",
      "Ownership structure can affect statements, transfers, voting processes and what happens operationally if a broker fails.",
      "The structure is a factual difference to understand, not a universal winner label.",
    ],
    sections: [
      {
        id: "chess",
        title: "What CHESS sponsorship means",
        paragraphs: [
          "CHESS is part of Australia's settlement infrastructure for listed securities. ASX states that a CHESS-sponsored holder is the person or entity whose name is registered in CHESS as the owner of the securities. Each sponsored holder is identified by a Holder Identification Number, or HIN.",
          "A sponsoring participant facilitates creation and maintenance of the holder record. CHESS holdings can therefore be associated with the investor's registration details rather than being pooled solely under a platform's name.",
        ],
      },
      {
        id: "custody",
        title: "What a custodial or omnibus structure means",
        paragraphs: [
          "ASX explains that an investor may instead have a beneficial interest where legal title is held by a custodian on the investor's behalf. This can be referred to as an omnibus structure.",
          "Custody is common in investment markets and does not by itself tell you whether a platform is suitable. The useful questions are who holds legal title, how client assets are recorded, what transfer process applies, and what contractual rights the investor has.",
        ],
      },
      {
        id: "differences",
        title: "Practical differences worth checking",
        paragraphs: [
          "Ownership structure can affect the paperwork and processes around your holdings. CHESS-sponsored holdings use a HIN and CHESS statements. Custodial arrangements rely on the platform/custodian's records and terms. Voting, corporate actions, transfers and fractional interests may also be handled differently.",
        ],
        bullets: [
          "Who is recorded as legal owner?",
          "Do you receive a HIN for Australian securities?",
          "Can holdings be transferred to another broker, and what fees or restrictions apply?",
          "How are dividends, voting and corporate actions handled?",
          "Are fractional interests transferable, or must they be sold first?",
        ],
      },
      {
        id: "failure",
        title: "Why the distinction matters when something goes wrong",
        paragraphs: [
          "ASX's guidance on broker defaults distinguishes legal-title CHESS holdings from beneficial interests held through a custodian. If securities are held through a custodian, queries about the holding may need to be directed to the relevant custodian.",
          "That does not mean CHESS eliminates investment or broker risk. It means the recordkeeping and legal ownership structure is different, which is why Trading Guide displays custody alongside fees rather than treating it as a marketing badge.",
        ],
      },
    ],
    sources: [asxHolder, asxDefaults],
    next: [
      {
        href: "/tools/chess-vs-custody",
        title: "CHESS vs custody explorer",
        description:
          "Inspect ownership structures in Trading Guide's provider data.",
      },
      {
        href: "/guides/what-is-a-hin",
        title: "What is a HIN?",
        description:
          "Understand the identifier used for CHESS-sponsored holdings.",
      },
      {
        href: "/share-trading",
        title: "Platform profiles",
        description:
          "Research custody, markets and fees for individual platforms.",
      },
      {
        href: "/compare/trading-platforms",
        title: "Compare platforms",
        description: "Put ownership structures and other facts side by side.",
      },
    ],
  },
  "what-is-a-hin": {
    path: "/guides/what-is-a-hin",
    eyebrow: "Guides · Share ownership",
    title: "What Is a HIN? CHESS-Sponsored Share Ownership Explained",
    description:
      "A plain-English explanation of Holder Identification Numbers, CHESS-sponsored holdings and how a HIN differs from an SRN.",
    published,
    updated: reviewed,
    readMinutes: 5,
    takeaways: [
      "HIN stands for Holder Identification Number.",
      "ASX uses a HIN to identify a sponsored holder on the CHESS subregister.",
      "An SRN is different: it identifies an issuer-sponsored holding and is issued by the relevant company registry.",
      "Not receiving a HIN does not automatically mean you do not have an economic interest in shares; some platforms use custodial structures.",
    ],
    sections: [
      {
        id: "definition",
        title: "What is a Holder Identification Number?",
        paragraphs: [
          "A Holder Identification Number is the identifier used for a sponsored holder on the CHESS subregister. ASX says the HIN links holding details in CHESS with the holder's registration information, such as name and address.",
          "A HIN is often compared with an account number because one HIN can identify multiple CHESS-sponsored holdings associated with that sponsored holder.",
        ],
      },
      {
        id: "hin-vs-srn",
        title: "HIN vs SRN",
        paragraphs: [
          "A HIN relates to broker-sponsored holdings on the CHESS subregister. An SRN, or Securityholder Reference Number, relates to an issuer-sponsored holding recorded through the issuer's share registry.",
          "ASX notes that a person can use the same HIN across their CHESS holdings, while issuer-sponsored holdings generally have a different SRN for each holding.",
        ],
      },
      {
        id: "custody",
        title: "What if a platform does not give you a HIN?",
        paragraphs: [
          "Some platforms hold securities through a custodian. In that case the investor may have a beneficial interest while legal title is held by the custodian. The absence of a personal HIN is therefore a prompt to investigate the custody arrangement, not enough information by itself to describe the investor's rights.",
        ],
      },
      {
        id: "research",
        title: "What to check on a platform",
        paragraphs: [
          "When a platform advertises CHESS sponsorship, verify whether the HIN is issued to you for the relevant Australian holdings and whether the statement applies to every product you plan to use. International shares, fractional shares and other products can use different custody arrangements even when Australian shares are CHESS sponsored.",
        ],
      },
    ],
    sources: [asxHolder, asxDefaults],
    next: [
      {
        href: "/tools/chess-vs-custody",
        title: "CHESS vs custody explorer",
        description: "Explore documented provider ownership structures.",
      },
      {
        href: "/guides/chess-vs-custody",
        title: "CHESS sponsorship vs custody",
        description: "Go deeper into the two ownership models.",
      },
      {
        href: "/share-trading",
        title: "Research share platforms",
        description: "Check provider custody and HIN records.",
      },
    ],
  },
  "fractional-shares-australia": {
    path: "/guides/fractional-shares-australia",
    eyebrow: "Guides · Share ownership",
    title: "Fractional Shares in Australia: Ownership, Fees and Transfers",
    description:
      "Understand what it means to buy part of a share, how ownership can differ, and which fees and transfer restrictions to research.",
    published,
    updated: reviewed,
    readMinutes: 7,
    takeaways: [
      "Fractional investing lets you buy part of a share instead of a whole share.",
      "Moneysmart says fractional structures can affect investor rights, ownership and transferability.",
      "A platform may use a custodian or another structure to provide the fractional interest.",
      "Check the fee path for fractional orders separately; it may differ from the platform's standard whole-share brokerage.",
    ],
    sections: [
      {
        id: "what",
        title: "What are fractional shares?",
        paragraphs: [
          "Fractional trading allows an investor to purchase less than one whole share. If a share costs more than the amount you want to invest, the platform may let you buy an economic interest representing a fraction of that share.",
          "Moneysmart notes that this can lower the amount needed to start, make regular investing easier and help spread smaller amounts across investments. Those conveniences do not remove the need to understand the legal structure.",
        ],
      },
      {
        id: "ownership",
        title: "Who owns the underlying share?",
        paragraphs: [
          "Fractional interests do not always work like whole shares registered directly to an investor. Moneysmart specifically tells investors to understand how the investment is owned and held. Depending on the provider, a custodian or platform entity may hold the whole security while the customer has a contractual or beneficial interest in part of it.",
          "That distinction can affect voting, corporate actions and the process if the provider stops operating.",
        ],
      },
      {
        id: "fees",
        title: "Check the fractional-order fee rule",
        paragraphs: [
          "Do not assume a provider's headline whole-share brokerage also applies to fractional orders. Some platforms use a percentage, cap or different execution pathway for fractional trades. If Trading Guide cannot model that rule faithfully, the calculator should leave it unresolved rather than substitute the whole-share fee.",
        ],
      },
      {
        id: "transfers",
        title: "Can fractional holdings be transferred?",
        paragraphs: [
          "Transferability is another key question. Whole shares may sometimes be transferred between brokers while fractional interests may need to be sold or converted first. Moneysmart highlights transferability as one of the issues to understand before using fractional trading.",
          "Before opening an account, check the provider's current transfer terms, whether only whole units can move, and whether transfer or sale fees apply.",
        ],
      },
    ],
    sources: [fractional],
    next: [
      {
        href: "/tools/chess-vs-custody",
        title: "CHESS vs custody explorer",
        description: "Understand how ownership structures differ.",
      },
      {
        href: "/share-trading",
        title: "Share trading profiles",
        description: "Research products, custody and fees by platform.",
      },
      {
        href: "/guides/brokerage-fees-australia",
        title: "Brokerage fees explained",
        description: "Understand how transaction-fee rules are represented.",
      },
    ],
  },
  "crypto-exchange-fees-australia": {
    path: "/guides/crypto-exchange-fees-australia",
    eyebrow: "Guides · Crypto costs",
    title:
      "Crypto Exchange Fees in Australia: Trading, Funding and Withdrawal Costs",
    description:
      "Learn where crypto exchange costs can occur and why one headline trading fee rarely describes the whole transaction flow.",
    published,
    updated: reviewed,
    readMinutes: 7,
    takeaways: [
      "Crypto costs can arise when funding an account, buying or selling, converting currencies and withdrawing crypto.",
      "Trading fees can use instant-buy percentages, maker/taker schedules or volume tiers.",
      "Blockchain network fees can vary and should not be represented as a permanent zero or fixed amount unless the provider actually guarantees that rule.",
      "Compare the transaction path you intend to use rather than one marketing headline.",
    ],
    sections: [
      {
        id: "fee-path",
        title: "Think in stages, not one fee",
        paragraphs: [
          "A crypto purchase can involve several separate stages: moving Australian dollars to a platform, executing the purchase, and later transferring or selling the asset. Each stage can have a different pricing rule.",
          "Moneysmart also notes that blockchain transactions can involve transaction fees and that unfamiliar users can overpay or underpay network fees. This is one reason Trading Guide keeps exchange charges and network-dependent costs separate.",
        ],
      },
      {
        id: "trading",
        title: "Trading fees: instant buy, maker/taker and tiers",
        paragraphs: [
          "Some platforms quote a simple percentage for an instant-buy transaction. Others operate an order book with maker and taker fees, often with rates that change according to 30-day volume or another published tier condition.",
          "These are not interchangeable fee models. A comparison should identify which trading path the number applies to instead of placing every percentage into one column without context.",
        ],
      },
      {
        id: "funding",
        title: "Funding and currency conversion",
        paragraphs: [
          "Funding can be free for one payment method and charged for another. Card payments, bank transfers, PayID and currency conversion can have different treatment. A zero bank-transfer fee does not prove that every funding method is free.",
        ],
      },
      {
        id: "withdrawal",
        title: "Crypto withdrawal and network fees",
        paragraphs: [
          "Withdrawing crypto can involve a provider withdrawal charge, a blockchain network charge, or both. Network conditions can change, and some platforms update withdrawal amounts dynamically.",
          "When a cost is variable, Trading Guide's preferred representation is VARIABLE rather than $0. That preserves the distinction between 'no fee' and 'not safely reducible to one current number'.",
        ],
      },
      {
        id: "risk",
        title: "Fees are only one part of crypto research",
        paragraphs: [
          "Moneysmart describes crypto as highly speculative and warns that many crypto providers may not provide the same protections as regulated financial products. Fee research should therefore sit alongside custody, platform identity, security practices and regulatory checks rather than replacing them.",
        ],
      },
    ],
    sources: [crypto],
    next: [
      {
        href: "/tools/crypto-fee-calculator",
        title: "Crypto fee calculator",
        description: "Apply supported verified trading-fee rules.",
      },
      {
        href: "/tools/crypto-funding-withdrawal-fees",
        title: "Funding & withdrawal fees",
        description: "Inspect supported funding and withdrawal records.",
      },
      {
        href: "/tools/crypto-cost-calculator",
        title: "Crypto cost calculator",
        description:
          "Combine supported components without hiding variable costs.",
      },
      {
        href: "/compare/crypto-exchanges",
        title: "Compare exchanges",
        description: "Compare structured exchange facts side by side.",
      },
    ],
  },
  "austrac-crypto-registration": {
    path: "/guides/austrac-crypto-registration",
    eyebrow: "Guides · Crypto regulation",
    title:
      "AUSTRAC's VASP Register: What Registration Means — and What It Doesn't",
    description:
      "Understand Australia's public virtual asset service provider register and how to use it as one factual check when researching a crypto platform.",
    published,
    updated: reviewed,
    readMinutes: 6,
    takeaways: [
      "AUSTRAC made its public Virtual Asset Service Provider register available in June 2026.",
      "Businesses providing registrable virtual asset services in Australia must be registered with AUSTRAC before providing those services, subject to applicable transition rules.",
      "Registration is an AML/CTF regulatory check; it should not be presented as a recommendation, investment-quality score or guarantee that a crypto asset will retain value.",
      "Use the legal or trading name and, where available, ABN/ACN to reduce the risk of confusing similarly named businesses.",
    ],
    sections: [
      {
        id: "what",
        title: "What is the VASP register?",
        paragraphs: [
          "AUSTRAC's public Virtual Asset Service Provider register lets the public verify whether a virtual asset service provider is registered with AUSTRAC. AUSTRAC made the register public on 30 June 2026 as part of Australia's updated AML/CTF framework.",
          "AUSTRAC says providers of registrable virtual asset services must enrol and register, and that it can refuse, suspend, cancel or impose conditions on a registration.",
        ],
      },
      {
        id: "means",
        title: "What registration tells you",
        paragraphs: [
          "A current registration tells you that the business appears on AUSTRAC's register for the relevant virtual asset services and is within the AML/CTF regulatory framework administered by AUSTRAC. The framework includes obligations around money-laundering and terrorism-financing risk, customer due diligence, reporting and record keeping.",
        ],
      },
      {
        id: "not-mean",
        title: "What registration does not tell you",
        paragraphs: [
          "Do not turn 'AUSTRAC registered' into 'AUSTRAC approved investment'. Registration is not a prediction of investment performance, a guarantee against platform failure or hacking, or a statement that every crypto asset offered by the platform is a regulated financial product.",
          "ASIC and Moneysmart separately explain that consumer protections depend on whether the particular digital asset or service falls within financial-services laws. That distinction should remain visible on provider profiles.",
        ],
      },
      {
        id: "how-check",
        title: "How to check a provider",
        paragraphs: [
          "AUSTRAC's user guidance says the VASP register can be searched by legal name or trading name, and by identifiers such as ABN, ACN or ARBN. For Trading Guide research, the safest process is to match the provider's legal entity and identifier rather than relying on a brand name alone.",
        ],
        bullets: [
          "Find the legal entity named in the provider's Australian terms or regulatory disclosure.",
          "Search the AUSTRAC VASP register using the legal/trading name or business identifier.",
          "Check any conditions shown on the registration record.",
          "Keep the AUSTRAC check separate from ASIC/AFSL checks that may apply to financial products or services.",
        ],
      },
    ],
    sources: [austrac, austracOverview],
    next: [
      {
        href: "/crypto/exchanges",
        title: "Crypto exchange profiles",
        description:
          "See source-linked provider identity, regulation and fee records.",
      },
      {
        href: "/guides/crypto",
        title: "Crypto research path",
        description: "Continue through fees, funding and comparisons.",
      },
      {
        href: "/methodology",
        title: "Trading Guide methodology",
        description:
          "See how provider facts and verification dates are handled.",
      },
    ],
  },
  "crypto-exchange-funding-australia": {
    path: "/guides/crypto-exchange-funding-australia",
    eyebrow: "Guides · Crypto funding",
    title:
      "Funding a Crypto Exchange in Australia: Bank Transfer, PayID and Card Fees",
    description:
      "Map the funding method to the published fee before comparing crypto exchange deposit costs.",
    published,
    updated: reviewed,
    readMinutes: 6,
    takeaways: [
      "A platform can charge different fees for different funding methods.",
      "A free bank transfer does not mean card funding, currency conversion or every deposit pathway is free.",
      "Funding fees and trading fees are separate stages and should be compared separately.",
      "Verify the provider's current limits, processing conditions and supported account names before sending money.",
    ],
    sections: [
      {
        id: "flow",
        title: "Start with the funding flow",
        paragraphs: [
          "Before buying crypto, money usually has to reach the platform. Australian platforms may support bank transfer, PayID or card funding, but availability and pricing differ by provider.",
          "Treat each funding rail as its own rule. If one provider lists bank transfer as free and card funding as percentage-based, displaying a single 'deposit fee' would hide the difference.",
        ],
      },
      {
        id: "bank",
        title: "Bank transfer and PayID",
        paragraphs: [
          "Bank transfer and PayID can be low-cost ways to fund an Australian-dollar account, but users should still check the provider's current deposit instructions, limits and account-name requirements. Processing speed is operational information, not a guarantee that every transfer will arrive instantly.",
        ],
      },
      {
        id: "card",
        title: "Card funding",
        paragraphs: [
          "Card deposits can use a different fee schedule and may involve third parties. Check whether the published percentage is charged by the exchange, a payment processor or both, and whether the provider sets minimum or maximum amounts.",
        ],
      },
      {
        id: "conversion",
        title: "Watch for currency conversion",
        paragraphs: [
          "If the account or purchase requires conversion from AUD into another currency, a conversion charge or spread can matter even when the deposit itself is labelled free. Trading Guide therefore keeps funding and FX/conversion concepts distinct where the product structure requires it.",
        ],
      },
      {
        id: "after",
        title: "Funding is only the first cost stage",
        paragraphs: [
          "After funds arrive, a trading fee or spread can apply when crypto is purchased. Later, selling or transferring crypto can create another cost. Compare the full path relevant to your scenario rather than choosing a platform from the deposit fee alone.",
        ],
      },
    ],
    sources: [crypto],
    next: [
      {
        href: "/tools/crypto-funding-withdrawal-fees",
        title: "Funding & withdrawal fee tool",
        description:
          "Inspect supported provider funding and withdrawal records.",
      },
      {
        href: "/tools/crypto-cost-calculator",
        title: "Crypto cost calculator",
        description: "Combine supported funding and trading stages.",
      },
      {
        href: "/guides/crypto-exchange-fees-australia",
        title: "Crypto exchange fees explained",
        description: "See how trading, funding and withdrawal fees differ.",
      },
    ],
  },
  "trading-costs-explained": {
    path: "/guides/trading-costs-explained",
    eyebrow: "Guides · Cost methodology",
    title:
      "The Real Cost of a Trade: Brokerage, FX, Spread and Withdrawal Fees",
    description:
      "A cross-market framework for separating the costs that can occur before, during and after a trade.",
    published,
    updated: reviewed,
    readMinutes: 7,
    takeaways: [
      "There is no single universal 'trading fee' across shares and crypto.",
      "Share trades can involve brokerage and, for overseas markets, FX; crypto flows can add funding, trading and withdrawal/network costs.",
      "Spreads and explicit fees are different concepts and should not be merged without evidence.",
      "A trustworthy calculator should show what it includes, what it excludes and when a cost is variable or unknown.",
    ],
    sections: [
      {
        id: "model",
        title: "Use a transaction-path model",
        paragraphs: [
          "The cleanest way to understand trading costs is to map the transaction from funding through execution to any later withdrawal or transfer. Different products use different stages, so a single total is only defensible when all included components use compatible currencies and sufficiently precise rules.",
        ],
      },
      {
        id: "shares",
        title: "Share trading costs",
        paragraphs: [
          "For shares, Moneysmart identifies brokerage, platform fees and foreign-exchange fees as costs to check. Brokerage applies to the order according to the broker's pricing rule. Platform or inactivity charges may sit outside the individual trade. FX may apply when Australian dollars are converted for an overseas market.",
        ],
      },
      {
        id: "crypto",
        title: "Crypto transaction costs",
        paragraphs: [
          "Crypto can add funding-method fees, trading fees, conversion, provider withdrawal charges and blockchain network fees. Moneysmart notes that users need to understand transaction fees on crypto networks and that those fees can be mishandled by unfamiliar users.",
        ],
      },
      {
        id: "spread",
        title: "Explicit fee vs spread",
        paragraphs: [
          "An explicit fee is a separately stated charge. A spread is the difference between prices available to buy and sell or between a quoted execution price and a reference price. A provider can advertise a low explicit commission while other transaction economics still matter. Trading Guide should only quantify spread when there is a defensible methodology and data source.",
        ],
      },
      {
        id: "precision",
        title: "Why some totals should remain incomplete",
        paragraphs: [
          "A calculator should not create false precision by converting VARIABLE, UNKNOWN or stale information into zero. If a network fee changes dynamically, or a provider publishes a condition that the engine cannot model, the result should say what remains excluded.",
          "This is why Trading Guide uses the phrase 'estimated costs covered by this calculator' rather than implying every possible cost has been captured.",
        ],
      },
    ],
    sources: [moneysmartShares, crypto],
    next: [
      {
        href: "/tools/trading-cost-calculator",
        title: "Trading cost calculator",
        description: "Combine supported brokerage and FX components.",
      },
      {
        href: "/tools/crypto-cost-calculator",
        title: "Crypto cost calculator",
        description:
          "Inspect supported crypto funding, trading and withdrawal stages.",
      },
      {
        href: "/methodology",
        title: "Methodology",
        description:
          "Understand source, verification and unknown-data handling.",
      },
    ],
  },
};
