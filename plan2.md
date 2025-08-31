# Plan 2 — Top 3 Upgrades (Award‑Level Differentiation)

This plan breaks the top three ideas into actionable tasks with acceptance criteria, dependencies, and suggested file paths.

Goals
- Make the scroll experience memorable and product‑like.
- Deliver a premium first impression (hero) without hurting LCP.
- Replace placeholders with credible, human trust signals that convert.

Milestones
1) Scrollytelling 2.0 — Shift Map + Parallax + KPIs
2) Hero Cinemagraph + Art Direction (with graceful fallbacks)
3) Real Social Proof — Faces, Roles, and Logos

---

## M1 — Scrollytelling 2.0
Narrative with a pinned “shift map”, subtle parallax, per‑step KPI chips, and captions.

Tasks
- [x] Data: extend `src/data/shift.json` with `kpi` array and `caption` per step.
- [x] Component: `src/sections/ShiftStory2.astro`
  - [x] Layout: 3 columns (map, media, steps) with sticky map/media on wide screens, stacked on mobile.
  - [x] Step markers: highlight current step; click-to-scroll; `aria-current="step"` for active.
  - [x] KPI chips under titles; compact pill style.
  - [x] Captions under media when provided.
  - [x] Reduced motion respected.
- [x] Parallax: lightweight rAF translate on media (clamped), disabled under reduced motion.
- [x] Accessibility: ordered list for steps; keyboard activation on markers; no focus traps.
- [x] Performance: images lazy by default (non-hero); hero LCP unaffected.
- [x] Integration: swapped in `src/pages/index.astro` and added public script for logic.

Acceptance criteria
- [x] Smooth scrolling with no noticeable jank on mid‑range laptops.
- [x] Map, media, and steps sync correctly; marker clicks scroll to the target step.
- [x] Fully usable with reduced‑motion and keyboard only.

Dependencies
- Optional: extra photos with consistent color grade.

---

## M2 — Hero Cinemagraph + Art Direction
A short, silent hero loop (e.g., steam at the coffee machine) with still fallback, mask, and strict performance budget.

Tasks
- [ ] Assets
  - [ ] Create `public/hero/` with: `hero.mp4`, `hero.webm`, `poster.jpg` (1280×720 or 1600×900), and `poster@2x.jpg`.
  - [ ] Keep loop 6–8s, muted, ~1–2 MB total across sources; color grade to match brand.
- [x] Component update: `src/components/Hero.astro`
  - [x] Use `<video>` when assets exist (build‑time detection), with `poster`, `playsinline`, `muted`, `loop`, `autoplay`, `preload="metadata"`; fallback to optimized `<Image />`.
  - [x] Respect `prefers-reduced-motion` by pausing autoplay via inline script.
  - [x] Add a soft gradient mask overlay to ensure headline readability.
- [x] Performance
  - [x] Poster used as LCP; no video preload beyond metadata.
- [x] SEO/Sharing
  - [x] `og:image` falls back to `/hero/poster.jpg` when present; otherwise uses featured photo.

Acceptance criteria
- [ ] Poster is LCP <= ~2.0s on Fast 3G (pending assets to validate fully).
- [x] Reduced‑motion disables autoplay via script; poster remains.
- [x] Headlines remain readable with overlay mask.

Dependencies
- Source footage or a short stock clip you have rights to.

---

## M3 — Real Social Proof (Faces + Logos)
Replace placeholders with verified quotes and add subtle logos for instant credibility.

Tasks
- [ ] Content gathering
  - [ ] Get 2–3 short quotes (<=22 words) with explicit permission to publish.
  - [ ] Obtain names, roles, and logo/affiliation (e.g., school crest, firm logo); collect 120×120 headshots.
- [ ] Data update: `src/data/testimonials.json`
  - [ ] Add proper headshot file paths (put files in `public/testimonials/`), and optional `link`.
- [ ] Logos row (optional if allowed): `src/sections/Logos.astro`
  - [ ] Small, monochrome logos; aria‑labels and `rel="noopener"` on links.
  - [ ] Keyboard focusable; treat as decorative if no links.
- [ ] Component polish: `src/sections/Testimonials.astro`
  - [ ] Add quote source link if provided; ensure alt text and names are present.
  - [ ] Optimize images (AVIF/WebP) or keep small JPG/PNG under ~12 KB.
- [ ] Micro‑case refinement
  - [ ] Replace metrics with real numbers if available (e.g., “queue time -30%”, “£X raised”).

Acceptance criteria
- [ ] Quotes and headshots feel authentic; logos look tidy and not salesy.
- [ ] Section improves trust without adding clutter; passes axe checks.

Dependencies
- Approval from people quoted and permission for logo usage.

---

## Rollout & QA
- Sequence: Build M1 → M3 → M2 (cinemagraph last due to asset prep and perf testing).
- QA checklist per milestone:
  - [ ] Lighthouse Perf ≥95, Acc ≥95, BP ≥95, SEO ≥95.
  - [ ] Test reduced‑motion, keyboard nav, and dark/light modes.
  - [ ] Validate on mobile Safari/Chrome and a mid‑range Windows laptop.
  - [ ] Verify Docker image size/regression and startup.

## Notes
- All motion hooks must be guarded by `prefers-reduced-motion`.
- Keep the home LCP to a single poster image; no render‑blocking video loads.
- Favor `astro:assets` for any media moved under `src/`.
