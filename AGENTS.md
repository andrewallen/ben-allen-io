# Codex Agent Guide

This repository powers Ben Allen’s personal site using Astro (static output). The root `cv.md` is the single source of truth for the CV; a sync script copies it into the site at `/cv` for builds and local dev.

## Goals

- Maintain a high-quality, succinct CV in `cv.md`.
- Keep the structure simple, readable, and consistent across sections.
- Optimize for clarity, impact, and scannability by recruiters.

## Editing Rules

- Use patch-based edits only; reference exact file paths and start lines when relevant.
- Keep the stack minimal: Astro + CSS; avoid adding heavy runtime frameworks unless requested.
- Do not introduce unrelated files or reorganize structure without a clear purpose.
- Preserve existing tone and style unless asked to change it.
- Prefer tight language, strong verbs, measurable outcomes.

## Format Guidance

- Markdown only; no HTML, images, or footnotes without explicit request.
- Section suggestions:
  - Summary
  - Skills / Technologies
  - Experience (reverse-chronological, with achievements and metrics)
  - Education / Certifications
  - Selected Projects (optional)

## Operability

- Local dev: `npm install`, then `npm run dev`.
- Build: `npm run build` (outputs to `dist/`).
- Docker: build and run using the provided `Dockerfile` (Nginx serves static files). Suitable for Coolify.
- The file `src/pages/cv.md` is generated—edit only the root `cv.md`.

## When In Doubt

- Ask for clarifications on role targets, seniority, preferred regions, or industries.
- Propose options (e.g., alternate summaries or bullet phrasings) before applying broad changes.
