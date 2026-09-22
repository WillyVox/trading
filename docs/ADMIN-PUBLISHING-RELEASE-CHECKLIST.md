# Admin publishing & operational release checklist

Use a staging/production-like environment with a non-critical test article.

- [ ] Non-admin cannot access `/admin` or mutate admin actions.
- [ ] Admin can create a draft article with text, image, link and supported video.
- [ ] Draft does not appear in public search, sitemap or public article routes as published content.
- [ ] Preview/rendered HTML is sanitized; adversarial HTML tests pass.
- [ ] Required disclosure/editorial checklist is completed before publish.
- [ ] Publish makes the article available at the canonical route.
- [ ] Published article appears in unified search when relevant.
- [ ] `noIndex` content remains excluded from unified DB search and sitemap as designed.
- [ ] Editing preserves canonical slug behaviour or creates the intended redirect policy.
- [ ] Unpublish/retire behaviour is verified.
- [ ] Pricing verification requires a source and does not convert UNKNOWN/VARIABLE to zero.
- [ ] Affiliate links cannot go live for PROSPECT partnerships.
- [ ] Admin failure during DB outage fails closed and does not expose stack/credentials.
