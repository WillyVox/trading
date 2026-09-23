# Accessibility & responsive release checklist

Target: WCAG 2.2 AA as an engineering benchmark; do not claim conformance until tested.

## Automated

- [ ] ESLint/TypeScript/tests/build pass.
- [ ] Run an accessibility scanner on representative public/admin pages.
- [ ] No horizontal overflow at 320, 360, 390, 430, 768, 1024 and 1440 CSS px.

## Keyboard/focus

- [ ] Every interactive control reachable by keyboard.
- [ ] Visible focus indicator is not removed.
- [ ] Sticky headers/overlays do not entirely obscure focused controls.
- [ ] Research Navigator traps focus while open, Escape closes, trigger focus is restored.
- [ ] Menus/search work without hover.

## Touch/mobile

- [ ] Primary controls use comfortable targets; WCAG 2.2 AA minimum target-size/spacing rule is satisfied.
- [ ] Inputs have visible labels and useful input modes.
- [ ] Tables/cards remain understandable without horizontal page overflow.

## Content

- [ ] Heading hierarchy is logical.
- [ ] Images have meaningful alt text or empty alt when decorative.
- [ ] Error/status messages are not colour-only.
- [ ] Calculator result updates are announced without excessive live-region noise.

## Manual assistive-technology smoke test

- [ ] VoiceOver + Safari (macOS/iOS) or equivalent.
- [ ] Research Navigator and search result count are understandable.
- [ ] Form validation, comparison semantics and calculator results are understandable.
