app/guides/simple-steps-to-buy-cryptocurrency (5 steps)
app/guides/how-to-start-investing-in-crypto-for-beginners

similar to:

app/guides/share-trading-for-beginners
app/guides/how-to-open-online-share-trading-account
app/guides/steps-to-start-investing-in-share-in-australia

## Request

- what is trading, how to what need to be prepared while start investing in trading

Build and generate me static pages,

These will be located in app/guides folder

Which include:

- clear contents
- include images related to the topic, content, with full details for SEO
- impelementing SEO Perfectly and Smartly
- link/navigate to other working pages in my app
  - if it is a cryptocurrency or exchanges related article, then link/navigate to other cryptocurrency or exchanges sections, for example featured exchanges, related articles, etc
  - if it is a share/stock trading related article, then link/navigate to other share trading sections, for example featured online share trading platforms, related articles, etc

- clear and smart instructions
- follow the layout of current article details page (or can be improved to be better look and feel) you can provide suggessions
- be a smart and most beautiful doc/guide to help people learn trading.
- be consistent with other articles, and pages across the app
- Ultimate contents and SEO goals of my side are TradingGuide, an Australian topical authority that owns hundreds of high-intent searches around brokers, trading platforms, fees, comparisons and investing education.

return me the mockup contents first before i decide when to start coding.

TradingGuide: "What is trading" guides — content mockup
Status: mockup v1 for your review. No code has been written or changed. Prepared: 21 September 2026. Based on the latest Archive.zip.

Items marked [VERIFY] are facts or URLs I want to confirm against the official source before anything is published.

1. The proposal in one minute
   Build two static guides that work as a small cluster and link into both halves of the site (share trading and crypto):

Guide A Guide B
Slug /guides/what-is-trading /guides/what-you-need-to-start-trading
Search intent it owns "what is trading", trading vs investing, types of trading, how trading works "what do I need to start trading", "before you start trading", trading checklist, how much money to start
Job Explain the idea Get the reader ready
Hands off to Guide B, then the share-trading or crypto path The share-trading or crypto path
Category getting-started getting-started
Why two and not one: the two searches are different questions, a single page would run past 4,000 words, and two focused pages give the hub stronger internal linking.

2. What I found in your code (this shaped the plan)
   What is already covered

Existing guide Already covers
share-trading-for-beginners What share trading is, trading vs investing (short), ways to buy, 6 steps, fees, risks, mistakes, shares vs crypto
how-to-open-online-share-trading-account Documents needed, HIN vs custodian, funding, first trade
steps-to-start-investing-in-share-in-australia Goal, broker, first purchase, diversifying, habit, CGT basics
how-to-start-investing-in-crypto-for-beginners Risk tolerance, position size, DCA, scams, storage, tax
simple-steps-to-buy-cryptocurrency 5 steps to buy on an exchange
cryptocurrency-exchanges-in-australia What to compare, AUSTRAC, exchange profiles
Gaps the new guides fill

No page explains trading across all markets (shares, ETFs, crypto, forex, CFDs) in one place.
Nothing covers being ready before the first step: safety net, debt, how much to start with, practising first, a written plan.
Order types, the bid-ask spread, and how costs eat small trades are only touched on.
Trader vs investor for tax (the ATO treats them differently) is not covered.
Cannibalisation guardrails (important)

Guide A owns "what is trading / trading vs investing / types of trading".
Guide B owns "what you need / before you start / checklist".
steps-to-start-investing-in-share-in-australia keeps "how to start investing in shares"; share-trading-for-beginners keeps "share trading for beginners".
Each new page hands off with different anchor text, and each existing guide gets a link back.
Technical things I noticed while reading (affect the new pages)

Social preview images. docs/og-images.md says static guides were moved from .svg to .png because Facebook, X and LinkedIn generally don't show SVG link previews. But getStaticGuideArticleImage() still returns .svg, so all six current guides still point at SVG. Three of them have no PNG at all.
A broken link. In share-trading-for-beginners, the "5 simple steps to buy cryptocurrency" link uses getStaticGuideArticleImage(...) as its href, so it points at an image file instead of the guide.
No callout component. There is nowhere to put "General information only", "Example" or "Warning" boxes in a consistent style.
buildMetadata() sends only an image URL. No alt text or width/height.
articleSchema lists the author as a Person called "Trading Guide Editorial Team", and has no inLanguage or publisher logo.
Compare links use the canonical routes /compare/trading-platforms and /compare/crypto-exchanges. Use canonical routes in all generated internal links.
None of these are changed by this mockup. I list them so you can decide.

3. Competitor benchmark (light)
   Based on search-result excerpts only. I did not read the full pages.

Source What they do well What to adopt Where TradingGuide can be better
IG Australia Free demo account with virtual funds, an academy, CFD risk banner at the top Practise-first advice, an up-front risk warning Independent, not selling a product; covers shares and crypto together
Arielle (AU broker comparison) General-information disclaimer, "last updated" date, reading time, "Important!" callouts Disclaimer, dates, callout boxes Source-linked claims, plainer language, cross-links into real platform pages
Pearler (AU) Lists investment types for beginners A plain "what can you trade" table Adds risk levels and what we do or don't cover
CommSec Learn Trader vs investor tax explainer The tax distinction, sourced to the ATO Written for all platforms, not one broker
Generic explainer pages A short definition box at the top, trading vs investing table Snippet-style "at a glance" box Australian rules, real costs, a readiness checklist with numbers
I have not used a keyword-volume tool, so I can't give search volumes. Search Console data (or a keyword tool) should be checked before we finalise the keyword targets.

4. Guide A mockup: What is trading?
   URL: /guides/what-is-trading Title tag (58 chars): What Is Trading? A Beginner's Guide for Australians (2026) Meta description (150 chars): What is trading? Learn how buying and selling shares, ETFs and crypto works, the main styles, costs and risks, and how trading differs from investing. Hero: eyebrow Guides · Trading basics · H1 What is trading? Subheading: What trading actually means, how a trade works, the main styles, and how it differs from investing — explained in plain English for Australians. Meta line: By Trading Guide Editorial Team · Published 21 September 2026 · Last updated 21 September 2026 · about 10 min read

General information only. This guide explains how trading works. It isn't financial advice and doesn't consider your situation. Trading can lose money — including more than you put in when leverage is used.

At a glance (snippet-style box) Trading is buying and selling financial assets, such as shares, ETFs or crypto, to try to profit from price changes, usually over days, weeks or months. You trade through a licensed broker or a registered exchange, and you can lose money.

Key takeaways

Trading is about profiting from price moves. Investing is about holding for growth and income. Same markets, different time horizon and mindset.
You never trade directly on an exchange yourself. Your order goes through a broker or exchange platform.
Trading styles differ mostly by how long you hold: hours (day), days to weeks (swing), weeks to months (position).
Costs (brokerage, the bid-ask spread, currency conversion, financing) decide whether frequent trading can work at all.
Leveraged products such as CFDs can lose more than you deposit. Trading isn't a shortcut to income.
H2. What is trading?
Trading means buying an asset in the hope of selling it for more, or, less commonly, selling first and buying back lower. The asset could be a share, an ETF, a cryptocurrency, a currency pair or a commodity. What links them is the goal: profit from price movement, rather than from owning something for years.

A simple example (illustrative only). You buy 100 shares at $10.00, paying $1,000. The price rises to $10.80 and you sell for $1,080, a $80 gross gain. With $10 brokerage each way, you keep $60. If the price had dropped to $9.20 instead, you'd be down $80, plus $20 in brokerage: $100 in total.

H2. Trading vs investing: what's the real difference?
Trading Investing
Main goal Profit from price moves Long-term growth and income (e.g. dividends)
Typical holding period Hours to months Years to decades
How often you buy and sell Frequently Occasionally
Time commitment Regular monitoring Low
Cost impact Higher (fees and spread on every trade) Lower
Impact of short-term swings Large Smaller over long periods
Short paragraph on why it matters for tax: the ATO decides whether you are a share investor or a share trader by looking at your intention, how often you trade, and how business-like your activity is. Most beginners who buy to hold are treated as investors and capital gains tax rules apply, but the ATO decides on the facts. Link to the ATO page and suggest a registered tax agent for personal questions.

H2. How does a trade actually work?
Figure 1 — How a share trade travels from your order to settlement. Five steps: You place an order → Your broker routes it → The exchange matches a buyer and a seller → The trade is confirmed → Settlement.

Bid, ask and spread. The bid is the highest price a buyer will pay right now. The ask is the lowest price a seller will accept. The gap is the spread, a cost you pay every time you trade. Figure 2 shows a stock quoted at $9.98 bid / $10.00 ask.
Order types
Order What it does Watch out for
Market Buys or sells straight away at the best available price The price can move before you're filled
Limit Only trades at your price or better It may never fill
Stop-loss Triggers a sale if the price falls to your level In a fast market it can fill below your stop price
Settlement. ASX share trades settle two business days after the trade (T+2). [VERIFY] Crypto exchanges usually match and settle inside their own platform. [VERIFY]
H2. What can you trade?
Product What it is When you can trade Beginner risk (our plain-English view) On TradingGuide
Shares (ASX, US) A slice of ownership in a company ASX: 10am–4pm Sydney time on business days [VERIFY] Medium Yes → share trading section
ETFs A basket of assets in a single unit Same as shares Lower to medium Covered in our share guides
Crypto assets Digital assets traded on exchanges 24/7 High Yes → crypto exchanges section
Forex Currency pairs Roughly 24 hours on weekdays High Not covered yet
Commodities Gold, oil and others via ETFs, futures or CFDs Varies High Not covered yet
CFDs and other derivatives Contracts that track a price, often leveraged Varies Very high; you can lose more than your deposit Not covered; see Moneysmart's investment warnings
Note under the table: Risk column is an editorial guide, not a rating.

H2. The main styles of trading
Figure 3 — a horizontal time-horizon line from "Minutes and hours" to "Decades".

Day trading — buying and selling within the same day. Many trades, high costs, high stress.
Swing trading — holding for days to weeks to catch a bigger move.
Position trading — holding for weeks to months, trading less often.
Long-term investing (for comparison) — buying and holding for years.
One honest line: shorter timeframes mean more trades, more costs and more decisions made under pressure.

H2. What trading costs
Cost What it is Where it applies
Brokerage Fee per trade (flat or a percentage) Shares, ETFs
Bid-ask spread The gap between buy and sell price Everything
Trading or maker/taker fee Percentage taken per trade Crypto exchanges
Currency conversion Fee when trading in foreign currency US shares, forex
Financing / overnight fees Interest on leveraged positions CFDs, margin
Withdrawal and network fees Charged when moving money or coins out Crypto
Link out: "See fees side by side" → share trading compare page and crypto compare page.

H2. The risks, and how people get caught out
Figure 4 — Illustrative risk ladder (not a rating): diversified ETF → individual shares → crypto assets → leveraged CFDs.

Market risk — prices fall as well as rise.
Leverage risk — borrowed money magnifies losses. ASIC has put limits and protections in place for CFDs sold to retail clients because of this. [VERIFY exact wording and link]
Cost drag — small, frequent trades can lose money to fees even when the price goes your way.
Emotional trading — chasing a rising price (fear of missing out) or trying to win back a loss fast.
Scams — "guaranteed" returns, trading "coaches", unlicensed brokers, pressure to deposit quickly. Check a broker's licence on ASIC's registers [VERIFY link] and read Moneysmart's investment warnings.
H2. Is trading right for you? Where to go next
Short paragraph, then the two-path block.

Path 1 — Share trading: guides Share trading for beginners, Steps to start investing in shares, How to open a share trading account; featured platforms CommSec and CMC Invest; "Compare share trading platforms". Path 2 — Crypto: guides How to start investing in crypto, 5 simple steps to buy crypto, Top crypto exchanges in Australia; featured exchanges (to be chosen, see decisions); "Compare crypto exchanges". Not sure yet? → Guide B, the 10-point readiness checklist.

FAQ (also FAQPage schema)
What is trading in simple terms?
Is trading the same as investing?
Is trading legal in Australia? (Yes for individuals. Brokers need an AFSL; crypto exchanges need AUSTRAC registration.)
Is trading gambling? (Different in method, but leverage and overtrading can make results look alike; no guaranteed return.)
Can you make a living from trading? (Some do, most don't; costs, tax and consistency matter. No income promises.) [VERIFY any statistic before quoting]
Do I pay tax on trading profits? (Depends on whether the ATO views you as an investor or a trader; link to the ATO.)
Sources (only real, checked URLs)
ATO — Share investing versus share trading (checked).
ASX — Start investing (already used in existing guides).
Moneysmart — Investment warnings; Choose your investments (already used).
AUSTRAC — virtual asset service providers overview (already used).
ASIC — CFD product intervention page [VERIFY]. 5. Guide B mockup: What you need to start trading
URL: /guides/what-you-need-to-start-trading Title tag (57 chars): What You Need to Start Trading: 10-Point Checklist (2026) Meta description (145 chars): Before your first trade: money, knowledge, broker and plan. A plain-English 10-point checklist for Australian beginners on what to prepare first. Hero: eyebrow Guides · Getting started · H1 What you need to start trading Subheading: A 10-point readiness checklist — money, knowledge, setup and discipline — to work through before you place your first trade.

General information only. This checklist isn't personal advice. Only trade with money you can afford to lose.

At a glance To start trading you need money you can afford to lose, a financial safety net, a basic grasp of what you're buying, a licensed broker or registered exchange, a short written plan, and a way to keep records for tax. You don't need a finance degree or thousands of dollars.

Key takeaways

Sort out your safety net and any high-interest debt before you fund a trading account.
Fees matter most on small trades: $10 brokerage on a $200 trade costs 5% each way.
Understand what you're buying well enough to explain how it makes or loses money.
Choose a licensed broker or a registered exchange, and check who holds your assets.
A one-page plan and simple records save you from emotional decisions and tax headaches.
H2. Why preparation matters more than picking the "right" stock
Short intro: many avoidable beginner problems (trading money you'll need soon, underestimating fees, acting on emotion) can be sorted before your first trade.

Figure 1 — the four groups at a glance: Money → Direction and knowledge → Setup → Discipline.

H2. Group 1 — Money

1. A financial safety net first. Keep trading money separate from rent, bills and emergencies. Many financial educators suggest holding a buffer for a few months of essential expenses first. [VERIFY Moneysmart wording and link] 2. Deal with high-interest debt. Credit card interest is often higher than what most investments can reasonably be expected to earn. It's worth weighing before you fund an account. 3. Money you can afford to lose, and how much to start with.

Figure 2 (bar chart) — What a $10 brokerage fee does to different trade sizes (illustrative fee; check current fees on the platform):

Trade size Fee each way Round trip (buy + sell)
$200	5.0%	10.0%
$500 2.0% 4.0%
$1,000	1.0%	2.0%
$5,000 0.2% 0.4%
Line under the table: On a $500 trade the price has to rise about 4% just for you to break even.

A rule of thumb some traders use (not a recommendation). Limit the loss on any single trade to about 1% of your account. On a $2,000 account, that's $20.

H2. Group 2 — Direction and knowledge 4. A clear goal and time horizon. What are you trying to do, and by when? Link to the goal-setting step in Steps to start investing in shares. 5. Understand what you're buying. If you can't explain in one sentence how it makes or loses money, wait. Read an ETF's product disclosure statement; for crypto, read the project's own documents and check the scam warnings. Links: Share trading for beginners, How to start investing in crypto. 6. Practise first, with realistic expectations. Options: a demo account (mostly offered by CFD and forex brokers and some charting platforms [VERIFY]), a paper-trading spreadsheet, or a very small first live trade. Honest note: practice can't copy the emotion of real money.

H2. Group 3 — Setup 7. Choose a licensed broker or registered exchange.

Check Share brokers Crypto exchanges
Licence Holds an AFSL Registered with AUSTRAC
Who holds your assets CHESS-sponsored (HIN) vs custodian Held on the exchange or your own wallet
Fees Brokerage, FX, account fees Trading, deposit and withdrawal fees
Funding Bank transfer, BPAY Bank transfer, PayID, card
Security Two-factor login Two-factor login
Links: share trading platforms → /share-trading and compare; crypto exchanges → /crypto/exchanges and compare. 8. ID, banking and security. Photo ID (driver licence or passport), an Australian bank account, your TFN if the broker asks [VERIFY], a unique password and two-factor login. Avoid public Wi-Fi when logging in. Links: How to open a share trading account, 5 simple steps to buy crypto.

H2. Group 4 — Discipline 9. A one-page trading plan.

Template (copy into your notes) Goal and timeframe · What I'll trade · Maximum loss per trade · When I'll enter and exit · Daily or weekly loss limit where I stop · When I'll review results

Add: no borrowing to trade, no trading while stressed, and step away after a loss rather than trying to win it back. 10. Records and tax. Keep the date, asset, quantity, price and fees for every trade. Brokers and exchanges provide statements, but keep your own copies. Links: ATO share investing vs trading; ATO crypto CGT; suggest a registered tax agent.

H2. Signs you may not be ready yet
You'd need the money within the next year.
You're planning to borrow to trade.
You expect regular income from a small balance.
You're acting on a tip from social media or a stranger.
You can't explain what you're about to buy.
H2. A sample first month (illustrative)
Week Focus
1 Work through the checklist; write the one-page plan
2 Compare and choose a broker or exchange; open and verify the account
3 Fund with a small amount; make one small first trade
4 Review: costs paid, what you learned, whether to continue
H2. Ready? Choose your path
Same two-path block as Guide A (share trading and crypto), plus a link back to What is trading?

FAQ
How much money do I need to start trading in Australia?
Do I need experience or qualifications?
Should I use a demo account first?
Can I start trading with $100?
What equipment do I need?
Do I have to keep records for tax?
Sources
ATO (share investing vs trading; crypto CGT), Moneysmart (choose your investments; investment warnings; savings buffer [VERIFY]), ASX (start investing), AUSTRAC (VASP overview).

6. Image plan (with SEO details)
   The site's convention is custom inline SVG figures with captions, plus a raster image for social sharing. I'd keep that: no stock photos, since I can't source or license them for you.

# Page Figure Type Alt text / caption (SEO-relevant) Files

1 A Social + listing image PNG 1200×630 and SVG "Diagram of how a trade travels from an investor through a broker to an exchange" what-is-trading.png / .svg
2 A How a trade works Inline SVG "Five steps of a share trade: order, broker, exchange match, confirmation, settlement" Component
3 A Bid-ask spread Inline SVG "Example of a bid price of $9.98 and an ask price of $10.00 showing the spread" Component
4 A Time horizon Inline SVG "Trading styles from day trading to long-term investing arranged by how long you hold" Component
5 A Risk ladder Inline SVG "Illustrative ladder of risk from diversified ETFs to leveraged CFDs (not a rating)" Component
6 B Social + listing image PNG 1200×630 and SVG "Ten-point checklist for getting ready to start trading in Australia" what-you-need-to-start-trading.png / .svg
7 B Four groups of the checklist Inline SVG "Money, knowledge, setup and discipline: the four groups of the trading readiness checklist" Component
8 B Fee drag by trade size Inline SVG bar chart "How a $10 brokerage fee affects trades of $200, $500, $1,000 and $5,000" Component (extends the existing fees chart)
Image SEO details I'd apply to all of them: keyword-relevant <title> and <desc> inside each SVG, a matching <figcaption> (the existing GuideFigure already does this), explicit width and height to avoid layout shift, lazy loading below the fold, and og:image:alt plus image dimensions in buildMetadata().

If you want real photography instead, you'd need to supply licensed images and I'd build the layout around them.

7. SEO plan
   Keyword themes (to validate with Search Console or a keyword tool)

Guide A: what is trading, trading vs investing, types of trading, how does trading work, is trading gambling, is trading legal in Australia.
Guide B: what do I need to start trading, how to start trading, how much money to start trading Australia, trading checklist for beginners, demo trading account.
On-page

Answer-first "at a glance" box, then depth: this suits featured snippets and AI-answer extraction.
One H1, question-style H2s, descriptive anchor text, tables for comparisons.
"Last updated" date, editorial-policy link, and sources on both pages (this is finance content, so trust signals matter).
Structured data

Article (I'd add inLanguage: en-AU, publisher logo, and the author as an Organization), BreadcrumbList, FAQPage.
A note on expectations: Google now limits FAQ rich results to a small set of sites and has retired HowTo rich results, so I would keep FAQ markup because it's harmless but not count on rich results from it, and skip HowTo.
Internal links out (every one is a real route today)

From To
Guide A Guide B; the three share-trading guides; the three crypto guides; /share-trading; /share-trading/commsec; /share-trading/cmc-invest; /compare/trading-platforms; /crypto/exchanges; two or three exchange profiles; /compare/crypto-exchanges; /methodology/editorial-policy; /guides
Guide B Guide A; open-account guide; steps guide; crypto buy-steps guide; the same platform and compare pages; /how-we-get-paid
Internal links in (existing pages that get a new link)

"Related guides" on all six existing static guides.
STATIC_GUIDES (so /guides and the sitemap pick them up automatically).
Guides menu in nav/config.ts (your call).
Sitemap and canonical: automatic through STATIC_GUIDES; buildMetadata sets the canonical.

8. Layout and design suggestions
   Follow the current article layout (hero, key takeaways, table of contents, prose, figures, FAQ, sources, related guides, next steps, sidebar). Suggested improvements, all optional:

"At a glance" box under the hero (definition or summary in about 50 words).
GuideCallout component with Info, Warning, Example and Template variants. It would also let older guides gain a proper risk warning.
GuideMarketPaths block: a two-column "Share trading path / Crypto path" call to action, for cross-market pages. The existing GuideProviderLinks handles only one market at a time.
Interactive checklist for Guide B (checkboxes with "6 of 10 done", page stays server-rendered). This is a real differentiator, but it's the one item I'd leave for a second phase.
General-information notice near the top of each guide (currently only the footer carries it).
"Reviewed by / how we write our guides" line linking to the editorial policy. 9. Facts and links to verify before build
ASX trading hours and pre-open timing; T+2 settlement.
ASIC CFD leverage protections wording and the correct ASIC page URL.
ASIC's register for checking a broker's licence: correct name and URL.
Moneysmart's guidance on a savings buffer and its URL.
Whether demo accounts are commonly offered by ASX share brokers (I expect not; wording depends on this).
Whether brokers ask for a TFN and how it's described.
Any statistic about how many retail traders lose money: only quote if I can link the official report. 10. Build plan
Stage What Notes
0 (optional, recommended first) Route registry and compare-route move Avoids editing new pages' compare links again
1 Shared pieces: slugs in STATIC_SLUG_IDS, entries in STATIC_GUIDES, GuideCallout, new illustrations, PNG share images via the existing generator Delivered file by file
2 Guide A page ~2,100 words
3 Guide B page ~2,300 words
4 Links into existing guides, nav decision, docs update, and (if approved) the two small fixes from section 2 11. Decisions for you
Two guides (recommended), one combined guide, or one per market?
Guide topic split: OK with A = "what is trading" and B = "what you need to start", or do you want a different split?
Images: custom SVG figures plus a PNG for social (recommended), or will you supply photography?
Featured crypto exchanges for the crypto path: which two or three? (CommSec and CMC Invest are the only share platforms seeded.)
Sequence: route registry first (recommended), or new guides first?
New UI pieces: approve GuideCallout and GuideMarketPaths? Interactive checklist now or later?
Existing-page fixes: include the SVG→PNG social image fix and the broken crypto link in share-trading-for-beginners?
Nav: should the new guides appear in the Guides menu?
