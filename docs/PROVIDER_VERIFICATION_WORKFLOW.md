# Provider verification workflow

Use this workflow before changing a provider or offering from `UNVERIFIED` to `VERIFIED`.

1. Identify the exact Australian legal/provider entity and official website.
2. Check regulatory claims against the relevant primary register/source (ASIC professional registers for AFS licensing; AUSTRAC public VASP register for virtual-asset registration where applicable). Registration is a factual status, not an endorsement.
3. Check material product facts against first-party product/FSG/PDS/support material: markets/assets, CHESS/custody, account/funding/withdrawal mechanics and current fees.
4. Store the primary `sourceUrl` and `verifiedAt`; use `reviewDueAt` for volatile fee data.
5. Leave unresolved facts `UNVERIFIED`/unknown. Do not infer a value from competitors, search snippets or affiliate material.
6. Keep commercial relationships separate. Research `sourceUrl` values must not contain affiliate/referral parameters. Affiliate status never determines provider ordering, research verification, or whether a valid official website can be shown by `Visit site`.
7. Run `npm run check:providers`. Review `docs/provider-verification-report.md` and resolve all errors before launch. Warnings are explicit research backlog and must be reviewed before upgrading the affected provider.

The automated gate checks evidence structure and freshness; it cannot prove that a source still says the same thing. A human primary-source check remains required when evidence is renewed.
