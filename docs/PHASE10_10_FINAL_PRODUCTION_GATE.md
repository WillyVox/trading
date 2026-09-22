# Phase 10.10 — Final production gate

`npm run launch:gate` is the final automated release command. It runs the complete code-validation pipeline, SEO release invariants and the fail-closed production readiness checker. It has no bypass flag.

A successful command is necessary but not sufficient: complete and retain evidence for the production DB backup/restore rehearsal, WAF tests, CSP observation/enforcement test, legal approval, responsive/accessibility QA and admin publishing smoke test.

## Current expected state

Without real production secrets/URL and external attestations, `check:production` remains blocked. This is intentional. Do not set attestation variables merely to obtain a green command.
