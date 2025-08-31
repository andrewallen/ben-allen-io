# ben-allen-io — Codex Initialized

This repository now includes an Astro-based site for a gorgeous, fast personal/marketing site for Ben Allen. `cv.md` remains the single source of truth for the CV; a build script syncs it into the site.

## What’s here

- `cv.md`: Primary CV content in Markdown.
- `AGENTS.md`: Project-specific guidance for Codex agents.
- `codex.yaml`: Lightweight project metadata to hint agent scope.

## Using Codex in this project

- Ask Codex to propose or apply edits to `cv.md`. Example prompts:
  - “Tighten the summary section to 3–4 lines.”
  - “Add a ‘Selected Projects’ section with 3 bullet points.”
  - “Update employment dates for the last role to 2023–present.”
- Codex will use patch-based edits and reference files precisely.

## Stack & Structure

- Framework: Astro (static output)
- Styling: CSS (no runtime framework)
- Content source: `cv.md` at repo root (synced to `/cv`)
- Build artifact: `dist/` (static files)

Key paths:
- `src/pages/index.astro`: Homepage
- `src/pages/cv.md`: Generated from root `cv.md` on build/dev
- `src/layouts/Base.astro`: Shared layout + meta
- `src/styles/global.css`: Global theme/styles
- `public/`: Static assets copied as-is (e.g., `favicon.svg`)
- `scripts/sync-cv.js`: Copies root `cv.md` → `src/pages/cv.md`
- `Dockerfile` + `nginx.conf`: Dockerized static hosting (configured for `ben.allen.io`)

## Project Scripts

- `npm run sync`: Copy `cv.md` to `src/pages/cv.md` with frontmatter
- `npm run dev`: Sync CV, then start Astro dev server
- `npm run build`: Sync CV, then build static site to `dist/`
- `npm run preview`: Serve the production build locally

## Local Development

- Requirements: Node.js 18.14+ (Node 20 recommended), npm 9+
- Install: `npm install`
- Develop: `npm run dev` then open `http://localhost:4321`
- Preview prod build: `npm run build && npm run preview`

Notes:
- The CV page at `/cv` is generated from the root `cv.md` on every `dev` and `build` via `scripts/sync-cv.js`.
- The generated `src/pages/cv.md` is ignored by git; always edit the root `cv.md`.
 - The site URL is set to `https://ben.allen.io` in `astro.config.mjs` and is used for canonical/OG tags.
- In restricted environments, disable Astro telemetry to avoid permission issues: `ASTRO_TELEMETRY_DISABLED=1 npm run dev`

## Conventions

- Keep the CV concise, scannable, and consistent.
- Prefer plain Markdown. Avoid adding build systems or external assets.
- Do not add unrelated files or restructure the repo unless requested.

## Notes

## Docker (Coolify-ready)

- Build image: `docker build -t ben-allen-io:latest .`
- Run: `docker run -p 8080:80 ben-allen-io:latest` and open `http://localhost:8080`
- Coolify: point to this repo with Dockerfile deployment. The image builds the site and serves static files via Nginx.

What the Dockerfile does:
- Stage 1 builds the Astro site (runs `npm install` then `npm run build`).
- Stage 2 serves `/dist` using Nginx with gzip and long-lived cache headers for assets.

If you prefer Node serving instead of Nginx, we can switch to `@astrojs/node` adapter and run the server in the container.

### Coolify Deploy (step-by-step)

1) In Coolify, create an Application → Source: Git Repository → Dockerfile strategy
2) Repository: this repo; Root directory: `/`; Dockerfile path: `Dockerfile`
3) Ports: expose `80`; Healthcheck optional (Dockerfile includes it)
4) Environment variables: none required (static build)
5) Domain: set to `ben.allen.io` in Coolify and enable HTTPS/auto-cert
6) Deploy: Coolify builds the image (install → build → Nginx serve)

Redeploy on changes:
- Editing `cv.md` or any `src/**` file and pushing to your repo triggers a new build in Coolify; the `/cv` page updates automatically.

## Operating the Content

- Edit the CV in `cv.md` at the repo root.
- Run locally: `npm run dev` (the CV syncs to `/cv` automatically)
- Build/deploy: `npm run build` (syncs, then writes static HTML to `dist/`)
- In Docker/Coolify, the same sync happens during the image build.

## Configuration & Branding

- Update site URL in `astro.config.mjs` (`site` property) for correct sitemap/SEO
- Edit hero/contact details in `src/components/Hero.astro`
- Adjust colors/typography in `src/styles/global.css`
- Add pages by creating files in `src/pages/` (e.g., `about.astro` → `/about`)

## Troubleshooting

- Permission error creating telemetry folder: set `ASTRO_TELEMETRY_DISABLED=1` before `npm run dev`/`build`
- Port 4321 in use: `npm run dev -- --port 4322` (or any free port)
- Missing dependencies: ensure Node 18+ and re-run `npm install`
- Docker build slow: ensure `.dockerignore` is present (excludes `node_modules`, `.git`, etc.)
