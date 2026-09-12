# ROLE

Act as a **senior Australian fintech product architect, UX designer, financial-services compliance researcher, affiliate-business specialist, content strategist, SEO specialist, and senior Next.js/TypeScript engineer**.

You are working on my existing Australian website project.

Do **not** immediately start coding.

First inspect and understand the complete existing project, architecture, Prisma schema, routes, components, affiliate domain, provider/exchange domain, article system, methodology system, SEO implementation, design system and current public pages.

My website currently focuses on:

> **Independent Australian crypto exchange research, comparisons, educational content, market information and affiliate/referral links.**

The current brand in the project is **AusMarket Crypto / AusMarket**.

The business may earn money when visitors click an affiliate/referral link and subsequently register, apply, deposit, trade, purchase a service or otherwise complete a qualifying action with a provider.

The website itself does not execute trades.

---

# CRITICAL WORKING RULE

Before proposing or modifying code:

1. Explore the existing project thoroughly.
2. Identify what already exists.
3. Identify incomplete or placeholder implementations.
4. Research the latest Australian legal/regulatory guidance relevant to this website.
5. Compare our approach with strong Australian competitors such as:
   - Finder
   - Canstar
   - Compare the Market where relevant
   - other reputable Australian financial comparison/research websites where useful.
6. Explain:
   - what competitors do well;
   - what we should adopt;
   - what we should **not** copy;
   - weaknesses in our current implementation;
   - compliance risks;
   - UX risks;
   - trust/SEO risks;
   - business risks.
7. Give me your recommendations **before editing code**.

Do not assume that wording from another comparison website is legally suitable for us.

Do not copy competitor legal text verbatim.

---

# IMPORTANT AUSTRALIAN REGULATORY CONTEXT

Research and verify the **latest available information at the time you perform this task**, prioritising primary official sources.

At minimum research:

- ASIC
- ACCC
- AUSTRAC
- OAIC
- ACMA
- Federal Register of Legislation where necessary

Pay particular attention to:

- ASIC RG 234 — Advertising financial products and services
- Corporations Act financial-product advice distinctions
- factual information vs general financial advice vs personal advice
- AFS licensing implications
- Financial Services Guide / website disclosure requirements where applicable
- general advice warning requirements where applicable
- Design and Distribution Obligations where applicable
- Target Market Determinations where applicable
- misleading or deceptive conduct
- affiliate/commercial relationship disclosures
- sponsored/promoted/featured content
- crypto/digital-asset regulation
- AUSTRAC VASP registration
- Privacy Act and Australian Privacy Principles
- Spam Act obligations for newsletters/marketing email

Do not assume that a disclaimer can cure conduct that is legally financial advice or another regulated activity.

If something depends on our exact legal structure, AFSL status, authorised representative status, referral agreement, provider contract or operating model, mark it:

> **LEGAL/COMPLIANCE REVIEW REQUIRED**

rather than inventing an answer.

---

# FIRST: AUDIT OUR CURRENT PROJECT

Inspect the current implementation carefully.

I know that the project already contains at least some of the following concepts, but verify everything yourself:

- global Footer
- `/methodology`
- `/affiliate-disclosure`
- `/methodology/editorial-policy`
- `/methodology/comparisons`
- affiliate CTA components
- affiliate disclosure component
- `/go/[partner]` server-side affiliate redirect
- affiliate click tracking
- AffiliatePartnership
- AffiliateProgram
- AffiliateLink
- AffiliateClick
- AffiliateConversion
- Article affiliate disclosure configuration
- provider/exchange pages
- crypto guide pages
- comparison pages
- source/provenance/verification information

Determine what is:

- complete;
- partially implemented;
- placeholder;
- duplicated;
- inconsistent;
- missing.

Do not recreate something that already exists properly.

---

# OBJECTIVE

Design and implement a professional footer and supporting trust/legal/transparency pages suitable for an Australian crypto comparison and affiliate website.

The result should:

- be trustworthy;
- be concise;
- be easy for normal users to understand;
- not overwhelm visitors with legal text;
- make affiliate relationships transparent;
- clearly explain our role;
- clearly explain the limitations of our comparison service;
- separate editorial content from commercial arrangements;
- support SEO and E-E-A-T;
- work beautifully on desktop and mobile;
- match the existing AusMarket design system;
- avoid unnecessary pages;
- avoid fake regulatory claims;
- avoid duplicated disclaimers everywhere.

---

# PROPOSE THE FOOTER INFORMATION ARCHITECTURE

Before coding, propose the ideal footer.

I expect approximately 4–5 logical columns, but choose the best structure after reviewing the project.

For example:

## Explore

Potential links:

- Crypto Exchanges
- Compare Exchanges
- Guides
- News
- Methodology

Only include links that actually make sense for our existing routes.

---

## About / Our Standards

Potential links:

- About Us
- How We Compare
- Editorial Policy
- How We Make Money
- Affiliate Disclosure
- Sources & Verification

Determine whether some of these should be combined to avoid excessive pages.

---

## Legal

Potential links:

- Terms of Use
- Privacy Policy
- Affiliate / Advertiser Disclosure
- Financial Information Disclaimer

Do not create redundant legal pages when one well-designed page can cover the requirement more clearly.

---

## Support

Potential links:

- Contact
- Corrections
- Complaints / Feedback

Determine whether Corrections and Complaints should be separate pages or a section of Contact/Editorial Policy.

---

# FOOTER BOTTOM AREA

Design a compact trust/disclaimer area below the footer navigation.

It should communicate, in concise plain English, concepts such as:

### Affiliate relationship

AusMarket may receive a commission or referral payment when visitors use certain provider links.

### Independence

Commercial relationships should not affect editorial opinions or rankings **if our implementation genuinely guarantees this**.

Do not make an absolute independence claim unless the underlying ranking implementation confirms it.

### Coverage limitation

Clearly state that we do **not necessarily compare every provider, exchange, product or offer available in Australia**.

### Information limitation

Explain that:

- provider fees;
- promotions;
- features;
- terms;
- availability;
- eligibility;
- regulatory status

can change.

Users should verify important information directly with the provider and relevant official sources before acting.

### Financial information boundary

Draft wording appropriate to our actual operating model.

Do not simply write “this is not financial advice” and assume the issue is solved.

Assess whether our content is intended to remain factual/educational/general information and identify any parts of the website that could potentially cross into regulated financial-product advice.

### Crypto risk

Provide a short, proportionate warning about the volatility and risk of crypto assets.

Do not use alarmist language.

### Copyright/business identity

Include:

- © current year dynamically
- legal/business name if known
- ABN/ACN only if genuine and configured
- Australian location/jurisdiction only if accurate

Never fabricate:

- ABN
- ACN
- AFSL
- ACL
- authorised representative number
- regulator approval
- licence
- registration.

---

# REQUIRED SUPPORTING CONTENT

Create concise but complete content for the following areas.

---

# 1. AFFILIATE / ADVERTISER DISCLOSURE

The current page is too minimal.

Rewrite it in concise plain English.

It should explain:

### What affiliate links are

Some links are tracking/referral links provided by commercial partners.

### How we may earn money

Depending on the commercial arrangement, AusMarket may receive compensation when a visitor:

- clicks;
- registers;
- opens an account;
- deposits;
- trades;
- purchases;
- completes another qualifying action.

Only mention compensation models that the project/business actually supports.

### Cost to users

Explain whether using an affiliate link normally changes the user's price.

Do not state that it “never costs users more” unless confirmed across partner agreements.

Use safer wording where appropriate.

### Editorial independence

Explain the relationship between affiliate arrangements and:

- editorial opinions;
- provider reviews;
- comparison methodology;
- rankings;
- ratings.

Verify this against the code.

### Sponsored placement

Define labels such as:

- Sponsored
- Promoted
- Featured
- Advertisement

if we intend to use them.

Paid placement must never visually masquerade as an independent editorial award/ranking.

### Market coverage

Explain that commercial relationships do not mean we compare every provider in the market.

### Partner relationship

Clarify that clicking a provider link takes users to a third-party website and they ultimately deal with that provider.

### Changes

Commercial relationships may change over time.

### Questions

Provide a contact path for questions about commercial relationships.

Keep this page concise.

---

# 2. “HOW WE MAKE MONEY”

Decide whether this should:

A. be its own page;

B. be combined with Affiliate Disclosure;

or

C. be a prominent section within Affiliate Disclosure.

Prefer simplicity.

Explain only revenue streams we actually use or genuinely plan to enable, such as:

- referral commissions;
- CPA;
- revenue share;
- sponsored placements;
- advertising;
- sponsored content.

Do not present theoretical revenue models as existing relationships.

Clearly distinguish:

**current monetisation**

from

**possible future monetisation**.

Public pages should generally mention only actual/current practices.

---

# 3. COMPARISON METHODOLOGY

The current page is a placeholder.

Create useful but reasonably short content explaining:

### What we compare

For example:

- trading fees;
- spreads where available;
- deposit/withdrawal methods;
- supported crypto assets;
- AUD support;
- security-related features;
- regulatory/registration information;
- customer support;
- platform functionality;
- other structured provider facts actually stored by the system.

### Sources

Explain source priority.

Prefer:

1. Australian regulators/government
2. official provider documentation
3. product documentation
4. reputable secondary sources where primary evidence is unavailable.

### Verification

Explain:

- verified dates;
- evidence/provenance;
- unverified information;
- stale information;
- missing values.

Your project already models evidence and verification; reuse that philosophy.

### Ranking

This is critical.

Inspect the current comparison-order logic and explain exactly how it works.

If there is no editorial ranking algorithm yet, do not invent one.

If tables are sorted alphabetically, by a chosen metric, manually, or otherwise, say so.

### Commercial influence

Explicitly explain whether affiliate status can affect:

- inclusion;
- ranking;
- score;
- default order;
- badges;
- CTA visibility.

This statement must match the implementation.

### Market coverage

Include:

> We do not necessarily compare every provider or product available in the market.

Use our own wording.

### Updates

Explain that provider information can change and show “last verified” information where available.

---

# 4. EDITORIAL POLICY

The current page is a placeholder.

Create a concise professional editorial policy containing:

- editorial independence;
- sourcing standards;
- primary-source preference;
- factual accuracy;
- review/update process;
- corrections;
- handling conflicts of interest;
- sponsored content;
- AI-assisted content if used;
- human review expectations if appropriate;
- distinction between editorial and commercial teams/processes.

Do not claim we employ teams, editors, analysts or lawyers that do not exist.

Write for the actual size of this project.

---

# 5. FINANCIAL INFORMATION / GENERAL DISCLAIMER

Create a concise disclaimer suitable for the actual site.

Potential concepts include:

- content is provided for informational/educational purposes;
- information may be general;
- individual objectives, financial situation and needs are not considered;
- visitors should independently assess whether a product/service is appropriate;
- where appropriate, seek professional financial/legal/tax advice;
- provider information may change;
- crypto involves risk and volatility;
- past performance does not guarantee future results;
- third-party websites have their own terms/privacy practices.

However:

## CRITICAL

First determine whether our website is merely publishing factual/general information or whether any current features could constitute financial product advice.

Flag concerns such as:

- “best exchange for you” recommendations;
- personalised recommendations;
- recommendation questionnaires;
- suitability scoring;
- ranked recommendations expressed as suitability;
- personalised notifications;
- statements encouraging acquisition of specific financial products.

If found, explicitly explain the risk before implementation.

---

# 6. TERMS OF USE

Create reasonably concise Terms of Use suitable for this website.

Cover only necessary topics, including:

- acceptance/use of website;
- informational nature of content;
- no guarantee of completeness/accuracy;
- third-party providers and links;
- affiliate links;
- no responsibility for provider services;
- user responsibility;
- intellectual property;
- acceptable use;
- website availability;
- limitation of liability where legally appropriate;
- Australian governing law/jurisdiction;
- changes to the terms;
- contact information.

Do not add aggressive or unrealistic liability exclusions.

Do not attempt to exclude consumer rights that cannot legally be excluded.

Flag wording requiring legal review.

---

# 7. PRIVACY POLICY

Inspect the codebase before drafting.

Determine what personal information we currently or imminently collect through:

- account registration;
- authentication;
- email;
- newsletter;
- contact forms;
- analytics;
- affiliate-click tracking;
- cookies;
- IP address;
- device/browser information;
- session IDs;
- campaign/placement identifiers;
- watchlists;
- alerts;
- saved preferences;
- admin systems.

Do not write a generic privacy policy disconnected from the implementation.

The policy should explain:

- who operates the site;
- information collected;
- how it is collected;
- why it is used;
- analytics;
- cookies/tracking;
- affiliate click tracking;
- service providers;
- overseas disclosure/storage where applicable;
- data security;
- retention;
- access/correction;
- complaints;
- contact;
- policy updates.

Research current OAIC requirements.

Determine whether the operator is an APP entity.

If this cannot be determined because legal entity/turnover/business activities are unknown, explicitly state:

> LEGAL/COMPLIANCE REVIEW REQUIRED

Even if the business may currently qualify for a small-business exemption, recommend sensible privacy transparency because accounts, analytics and affiliate tracking are present.

Also identify upcoming Australian privacy changes that should influence the architecture.

---

# 8. COOKIE / TRACKING NOTICE

Inspect the actual technology first.

Identify whether we use:

- essential cookies;
- NextAuth/Auth.js cookies;
- analytics cookies;
- advertising pixels;
- remarketing;
- affiliate tracking;
- third-party embeds;
- social-media trackers.

Do not automatically create a huge European-style cookie banner unless legally/business-wise justified.

Recommend the appropriate Australian approach based on the actual tracking technologies and international audience.

If future expansion to EU/UK/other jurisdictions would materially change consent requirements, mention that separately.

---

# 9. CONTACT, CORRECTIONS AND COMPLAINTS

Create a simple way for users/providers to report:

- inaccurate provider data;
- outdated fees;
- regulatory-status changes;
- broken links;
- editorial concerns;
- affiliate disclosure concerns;
- privacy concerns;
- other complaints.

Recommend a simple page or form architecture.

Do not fabricate contact addresses.

Use environment/config placeholders where necessary.

---

# 10. NEWSLETTER / MARKETING COMMUNICATIONS

If the project includes newsletter subscriptions now or in the roadmap:

Review requirements under Australia's Spam Act.

Ensure implementation supports:

- proper consent;
- evidence of consent;
- accurate sender identification;
- valid contact information;
- unsubscribe;
- processing unsubscribe requests appropriately.

Do not pre-tick marketing consent boxes.

Keep service communications separate from promotional messages where appropriate.

---

# PAGE-LEVEL DISCLOSURE STRATEGY

Do not rely exclusively on the footer.

Design a layered disclosure system.

For example:

## Affiliate CTA

Near commercial CTA:

> We may earn a commission if you sign up through this link.

Keep it brief.

## Multiple affiliate products in a comparison

A single visible disclosure near the comparison may be preferable to repeating text on every card, provided it is sufficiently prominent.

## Sponsored placement

Display an explicit:

> Sponsored

or:

> Promoted

label directly next to the placement.

## Article containing affiliate links

Use the existing article-level:

`affiliateDisclosureRequired`

logic where appropriate.

## Provider/exchange review

Display relevant affiliate relationship disclosure close enough to the CTA that visitors cannot reasonably miss the relationship.

## Footer

Use the footer as a persistent high-level summary plus links to the full disclosure documents.

---

# DO NOT OVERLOAD THE FOOTER

The footer should not become a wall of legal text.

Target:

- useful navigation;
- trust links;
- approximately 2–4 short disclaimer paragraphs;
- clear visual hierarchy;
- mobile accordion/stacking if appropriate;
- accessible semantic HTML.

Longer explanations belong on linked pages.

---

# DESIGN REQUIREMENTS

Match the existing visual system.

Inspect:

- typography;
- navy/gold branding;
- panels;
- border tokens;
- muted text;
- spacing;
- max widths;
- responsive behaviour.

Create a polished professional financial-information footer.

Avoid:

- generic SaaS footer appearance;
- tiny unreadable legal text;
- excessive columns;
- giant blocks of disclaimers;
- duplicated links;
- dark patterns;
- hiding affiliate disclosure.

Aim for the trust level of a serious Australian comparison/research website.

---

# ACCESSIBILITY

Ensure:

- semantic `<footer>`;
- semantic `<nav>`;
- descriptive headings;
- keyboard accessibility;
- sufficient contrast;
- proper focus states;
- meaningful link labels;
- good mobile behaviour.

---

# SEO

Legal/transparency pages should be crawlable unless there is a very specific reason otherwise.

Add appropriate:

- metadata;
- canonical URLs through the existing SEO utilities;
- sitemap entries where appropriate;
- internal links.

Do not stuff legal pages with SEO keywords.

Their main purpose is trust and transparency.

---

# ARCHITECTURE

Reuse the existing codebase patterns.

Prefer:

- Next.js `<Link>` instead of raw `<a>` for internal navigation;
- existing `siteConfig`;
- existing metadata helpers;
- shared layout primitives;
- existing design tokens.

Consider creating structured configuration such as:

```ts
footerSections
legalLinks
companyConfig
```

if it reduces duplication.

Do not over-engineer.

---

# BUSINESS IDENTITY CONFIGURATION

Create a single source of truth if one does not already exist for optional business details such as:

```ts
legalName
tradingName
abn
acn
afsl
authorisedRepresentativeNumber
supportEmail
privacyEmail
complaintsEmail
businessAddress
```

However:

- do not expose empty values;
- do not fabricate values;
- do not imply licences/registrations we do not hold.

---

# REVIEW CURRENT AFFILIATE WORDING

Audit all existing affiliate-disclosure text across the project.

For example, inspect any wording equivalent to:

> This is a paid/affiliate link. It does not affect our independent comparison ranking.

Determine whether:

- “paid link” is accurate;
- “affiliate link” is clearer;
- “independent ranking” is technically true;
- disclosure placement is sufficiently prominent;
- disclosure should be shortened;
- provider pages and guide pages are consistent.

Recommend one consistent disclosure system.

---

# REVIEW CLAIM LANGUAGE THROUGHOUT THE SITE

Search the project for potentially risky terms such as:

- best
- safest
- recommended
- top
- trusted
- secure
- regulated
- licensed
- approved
- guaranteed
- low risk
- perfect
- suitable
- cheapest

Do not automatically remove them.

Instead classify each occurrence:

1. objectively supported;
2. methodology-supported;
3. needs qualification;
4. potentially misleading;
5. potentially financial-advice-sensitive.

Give me the findings.

This is especially important under current ASIC advertising guidance.

---

# REGULATORY STATUS PRESENTATION

Because this website covers crypto providers, make sure we do not oversimplify regulation.

For example:

- AUSTRAC registration;
- ASIC/AFSL status;
- Australian digital-asset financial-product licensing;
- future Digital Assets Framework status

are not necessarily the same thing.

Do not display a generic:

> Regulated in Australia

badge unless the underlying claim is clearly defined and evidenced.

Prefer labels such as:

> AUSTRAC VASP registration verified

or another precise description supported by evidence.

Explain the significance and limitations to users.

---

# COMPETITOR ANALYSIS

Before coding, compare our proposed footer/transparency system with at least:

## Finder

Study:

- advertiser disclosure;
- editorial independence;
- “how we make money”;
- market coverage warning;
- sponsored/promoted labels;
- provider verification language;
- Financial Services Guide/disclaimer architecture where relevant.

## Canstar

Study:

- general information/advice warnings;
- detailed disclosure;
- referral fee disclosure;
- comparison methodology;
- provider-document warnings;
- licensing information;
- TMD wording where relevant.

## Compare the Market

Study where relevant:

- legal navigation;
- privacy;
- terms;
- complaints;
- licensing disclosure;
- “who we compare” approach.

Do not copy text.

Produce a comparison table containing:

| Area | AusMarket now | Competitor pattern | Adopt? | Reason |
|---|---|---|---|---|

---

# MANDATORY VS RECOMMENDED MATRIX

Before implementation provide a table with:

| Requirement | Mandatory before production? | Conditional? | Strongly recommended? | Reason | Action |
|---|---|---|---|---|---|

Include at least:

- Affiliate Disclosure
- Financial Information Disclaimer
- Terms of Use
- Privacy Policy
- Cookie/Tracking Notice
- Comparison Methodology
- Editorial Policy
- Market Coverage Disclosure
- Sponsored Content Policy
- Contact
- Complaints
- Corrections Policy
- Newsletter Consent
- Unsubscribe
- FSG / website disclosure information
- General Advice Warning
- DDO/TMD obligations

Do not incorrectly mark conditional financial-services obligations as universally mandatory.

---

# IMPORTANT QUESTIONS TO IDENTIFY

During the audit, determine whether the following information is missing:

- legal entity name;
- ABN;
- ACN;
- business address;
- contact email;
- privacy email;
- complaints email;
- whether we hold an AFSL;
- whether we are an authorised representative;
- exact affiliate agreement models;
- whether rankings can ever be commercially influenced;
- analytics provider;
- marketing/advertising pixels;
- email marketing provider;
- hosting/database countries;
- whether users can create accounts;
- whether minors can create accounts;
- whether personalised recommendations will exist.

Do not block the entire analysis if some are unknown.

Use placeholders and identify exactly what I must later supply.

---

# IMPLEMENTATION PHASE

After completing the audit and recommendations, propose an implementation plan.

Group the work into sensible phases.

For example:

### Phase 1 — Critical pre-production transparency

Footer
Affiliate disclosure
Financial-information disclaimer
Market coverage statement
Comparison methodology
Editorial policy

### Phase 2 — Legal/privacy

Terms
Privacy
tracking review
contact/complaints

### Phase 3 — Commercial labelling

Sponsored-placement system
affiliate disclosure consistency
article disclosure integration

### Phase 4 — Ongoing governance

corrections
review dates
regulatory data verification
content update workflow

Adjust these phases after reviewing the actual project.

---

# CODE QUALITY

When we eventually approve implementation:

- preserve TypeScript strictness;
- avoid `any`;
- reuse existing utilities;
- avoid unnecessary client components;
- keep footer server-rendered/static if possible;
- use Next.js `<Link>`;
- avoid hydration solely for the footer;
- preserve SEO/static generation;
- ensure lint/build/typecheck pass;
- update tests where relevant.

---

# CONTENT STYLE

All public legal/disclosure content should be:

- plain Australian English;
- professional;
- transparent;
- concise;
- calm;
- understandable by ordinary investors;
- not excessively legalistic;
- not marketing-heavy.

Avoid phrases like:

> We take absolutely no responsibility for anything.

Avoid burying important commercial relationships in long legal documents.

---

# DELIVERABLES — BEFORE CODING

First return:

## A. Current Project Audit

Explain what exists and what is missing.

## B. Competitor Comparison

Compare us with Finder, Canstar and other relevant Australian sites.

## C. Regulatory / Compliance Findings

Separate:

- clearly applicable requirements;
- conditional requirements;
- recommendations;
- issues requiring legal advice.

## D. Recommended Footer Structure

Show the exact menu structure.

## E. Draft Footer Copy

Provide the proposed concise bottom disclaimer text.

## F. Required Supporting Pages

For each proposed page:

- URL
- title
- purpose
- approximate content length
- required before launch?
- merge with another page?
- content outline.

## G. Mandatory Production Checklist

Clearly identify:

🔴 MUST ADDRESS BEFORE PRODUCTION

🟠 STRONGLY RECOMMENDED

🟡 CAN FOLLOW AFTER MVP

⚠️ LEGAL/COMPLIANCE REVIEW REQUIRED

## H. Content Drafts

Draft concise initial content for each recommended page.

## I. Technical Implementation Plan

List exact files likely to:

- create;
- modify;
- remove;
- consolidate.

## J. Concerns / Questions

Tell me anything that concerns you about the current business, wording, implementation, compliance approach or UX.

---

# STOP POINT

After completing the analysis above:

**STOP.**

Do not change the code yet.

Wait for my decision on:

- footer structure;
- content;
- legal-page architecture;
- disclosure wording;
- implementation scope.

The objective is to understand the problem thoroughly and agree on the strategy **before touching production code**.