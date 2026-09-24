# Edge rate limiting — production launch requirement

The application has database-backed throttling for credential login and registration. That is intentionally **not** treated as a replacement for host/edge abuse protection.

Before setting `EDGE_RATE_LIMITING_CONFIGURED=true` in Production:

1. Configure Vercel Firewall/WAF rate limiting for abuse-sensitive endpoints, especially `/api/auth/*`, login/registration traffic, and write-capable/admin endpoints exposed publicly.
2. Use limits appropriate to normal traffic. Do not create a single global rule that can lock all users out behind a shared NAT.
3. Confirm Vercel remains the trusted proxy supplying the client IP headers used by the application limiter.
4. Exercise the rule from a Preview/Production candidate and confirm excess traffic is challenged or rejected at the edge while ordinary browsing remains unaffected.
5. Record the rule names/settings and verification date in the launch checklist. Do not store credentials or tokens in this document.
6. Only then set `EDGE_RATE_LIMITING_CONFIGURED=true` for the Production environment and redeploy.

The automated `verify:security:production` command cannot prove dashboard/WAF configuration, so this remains an explicit deployment attestation.
