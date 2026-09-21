# Tools Milestone 1 — Foundation

## Implemented scope

- `/tools` first-class landing route.
- Tools added as a first-class shared desktop/mobile navigation link. Tool-specific dropdown links are deliberately deferred until their routes exist, preventing dead navigation.
- `/tools` added to the static sitemap.
- Shared Tools catalog and calculation-result domain contract.
- First reusable `ToolCard` presentation component.
- Phase 1 tools are intentionally shown as **Coming soon** until their routes and engines are implemented; navigation does not pretend unfinished calculators are usable.
- No Prisma/schema changes.
- No calculator engine yet.
- No provider pricing duplicated in UI/source code.

## Product contract

A calculation result is not merely a number. The shared contract can represent:

- calculated/partial/variable/unknown/stale/unsupported state;
- inputs;
- applicable rule;
- calculation steps;
- assumptions;
- exclusions;
- source URL;
- verification status/date.

## Next milestone

Milestone 2 should implement the Brokerage Cost Calculator against only deterministic, calculator-eligible fee rows. It should add real-provider validation fixtures before expanding the supported rule set.
