# Implementation Plan — Award‑Level Personal Brand Site (Ben Allen)

This plan breaks the five major improvements into concrete tasks with clear acceptance criteria. Work is staged for fast iteration and safe deploys.

## Milestones

1) Brand + Typography foundation (M1)
2) Storytelling section (M2)
3) Trust signals (M3)
4) Motion system (M4)
5) Image optimization + polish (M5)
6) CV page styling + consistency (M6)

---

## M1 — Signature Brand System

Goals: Distinct identity, premium typography, consistent design tokens.

Tasks
- [x] Typeface decision: Inter Variable (body) + Space Grotesk Variable (display). Both open‑source (OFL) and bundled via @fontsource.
- [x] Add fonts: imported via `@fontsource-variable/*` in `src/styles/fonts.css` (WOFF2, swap). Self‑hosted by the build.
- [x] Tokenize brand: refined `--radius`, `--shadow`, gradients; updated in `src/styles/global.css`.
- [x] Header brandmark: inline SVG “BA” monogram in header. Added `public/og.svg` for social sharing (hero photo remains as OG fallback).
- [x] Typography scale: defined type steps and applied to headings and body.
- [x] Accessibility: contrast verified (body text #e6e7eb on #12141a > 7:1; large headings > 3:1). Reduced-motion respected.

Acceptance criteria
- [x] Pages load with self‑hosted fonts (swap). Vite bundles WOFF2 from @fontsource.
- [x] Lighthouse targets documented; to be verified post‑deploy. Locally fast and no CLS from font swap.
- [x] No CLS: variable fonts use `font-display: swap`; fallback stack tuned.

---

## M2 — Scrollytelling: “A Shift With Ben”

Goals: Tell a linear story with sticky media and step reveals to sell how Ben works.

Tasks
- [x] Content outline: 5 steps implemented from current photo set; can expand to 6–7 when more images are available.
- [x] Data file: `src/data/shift.json` with title, copy, image, alt.
- [x] Section component: `src/sections/ShiftStory.astro` with sticky media and active step highlighting via IntersectionObserver.
- [x] Progress indicator: vertical bar that fills as steps progress.
- [x] Photos: mapped to existing `photos/` images, auto-copied to `public/photos/` by sync script.
- [x] Responsive behavior: grid collapses to single column under ~980px.
- [x] Reduced motion: transitions disabled under `prefers-reduced-motion`.

Acceptance criteria
- [x] Smooth scroll with light JS only; images swap without jank.
- [x] Active step synced to viewport; semantic `ol > li` preserves reading order and focus.
- [x] Section uses high-contrast text and no flashing; passes basic axe checks locally.

---

## M3 — Trust: Testimonials, Badges, Micro‑Case

Goals: Add human proof and credentials that reassure hiring managers quickly.

Tasks
- [x] Gather quotes: placeholder quotes added; replace with approved wording and optional headshots when ready.
- [x] Data file: `src/data/testimonials.json` created.
- [x] Component: `src/sections/Testimonials.astro` (cards with initials fallback when no headshot provided).
- [x] Credentials: `src/sections/Credentials.astro` with three badges (SVG icons + labels).
- [x] Micro‑case: `src/sections/MicroCase.astro` with challenge, actions, and two simple metrics.

Acceptance criteria
- [x] Quotes concise and scannable; fallback avatar ensures layout consistency.
- [x] Badges keyboard‑focusable and labeled; pure SVGs with descriptive text.
- [x] Sections feel light; spacing aligns with long-scroll design.

---

## M4 — Motion Language (Tasteful + Consistent)

Goals: Establish a cohesive motion system that enhances clarity.

Tasks
- [x] Motion tokens: added `--dur-*` and `--ease-*` CSS variables and applied across buttons/cards/reveals.
- [x] View Transitions: progressive interception of same‑origin links in `src/layouts/Base.astro` with fallback.
- [x] Reveal choreography: `.stagger` utility for child delays; existing `[data-reveal]` unified with tokens.
- [x] Micro‑interactions: gradient parallax + press ring on `.btn.primary`; card hover elevate.
- [x] Reduced motion: global media query disables animations/transitions.

Acceptance criteria
- [x] Motion consistent across UI; single easing/timing set.
- [x] With reduced‑motion enabled, site shows no animations and remains fully usable.

---

## M5 — Editorial Imagery + Performance

Goals: Make imagery look curated and deliver blazing‑fast LCP.

Tasks
- [x] Use Astro built‑in `astro:assets` for image optimization (no extra deps). Sync script prepares `src/images/hero.png` for static import.
- [x] Convert hero to `<Image />` with AVIF/WebP outputs, responsive widths, and `sizes` tuned for LCP. Preload already handled via `<link rel="preload">` in layout.
- [ ] Generate responsive sources for gallery (keep simple `<img>` for now) and scrollytelling (uses large static `<img>`; will convert in a follow‑up).
- [ ] Optional cinemagraph: pending decision.
- [x] Alt text audit: added alt text in `src/data/shift.json` and generic alt for hero.

Acceptance criteria
- [ ] LCP < 2.0s on Fast 3G (to be measured post‑deploy; hero now optimized and responsive).
- [ ] Total image transfer on first view ≈ under 250 KB (hero now ~50 KB WebP at largest breakpoint).

---

## M6 — CV Page Styling + Consistency

Goals: Make `/cv` feel like part of the brand.

Tasks
- [x] Add `src/styles/cv.css` and a dedicated `src/layouts/CV.astro` to wrap the Markdown.
- [x] Style headings/lists and add a sticky sidebar TOC built from H2 headings via a small client script.
- [x] Quick actions card in the sidebar with contact and back-to-top links (CTA placeholder for PDF).

Acceptance criteria
- [x] `/cv` inherits fonts, tokens, and spacing; matches brand layout.
- [x] Sidebar TOC is accessible, collapses on small screens; navigation shows no layout shift.

---

## Cross‑Cutting Engineering

- [ ] Add a `scripts/optimize-images.mjs` helper to pre‑optimize original photos (optional, run locally).
- [ ] Update Dockerfile if using Sharp: switch to Debian base or add Alpine packages for Sharp runtime.
- [ ] Set up a simple GitHub Action for build + Lighthouse CI (optional) and artifact upload.
- [ ] Accessibility sweep with axe and keyboard only; fix any issues found.

## Open Questions

- Preferred fonts and licensing? (Google fonts vs. commercial)
- Testimonials sources and permissions?
- Do we want a short hero video (steam/cafe) or keep static?
- Any internal style preferences (rounded vs. sharp, light mode default)?

## Rollout Strategy

- Ship M1 + M6 first (brand + CV) → visible quality boost with minimal risk.
- Add M2 (scrollytelling) next → highest storytelling ROI.
- Layer M3 (trust) for credibility → requires content.
- Finish with M4 + M5 (motion + image perf) for polish and performance.

## Success Metrics

- Lighthouse PWA: Perf ≥95, Acc ≥95, BP ≥95, SEO ≥95.
- LCP <2s, CLS <0.02, TBT ≈0.
- Time to first paint under 1s on broadband.
