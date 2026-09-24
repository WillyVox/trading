# Trust content production approval

The public **Editorial Policy**, **Comparison Methodology**, and **Affiliate Disclosure** describe how Trading Guide operates. They are therefore release-controlled content, not ordinary marketing copy.

Before setting `TRUST_CONTENT_APPROVED=true` in production, confirm that:

- provider and comparison ordering remains independent of affiliate status;
- comparison cells do not invent missing values or convert unknown fees to zero;
- affiliate links are visibly disclosed when active;
- non-affiliate providers remain eligible for factual coverage and verified official-site navigation;
- the Affiliate Disclosure accurately describes whether commercial relationships are currently active;
- sponsored/promoted placement wording matches the UI actually shipped; and
- the three pages contain no unresolved draft or release-approval markers.

`TRUST_CONTENT_APPROVED` records **internal product/editorial release approval**. It does not represent that a lawyer has reviewed the pages and must not be described publicly as legal approval.
