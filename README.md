# ben-allen-io — Astro site + CV

Astro-powered personal site for Ben Allen, optimized for clarity and speed. The root `cv.md` is the single source of truth for the CV and is synced into the site at `/cv` during dev/build.

## What’s Here

- `cv.md`: Primary CV content (edit this only).
- `photos/`: Source images (synced to the site on build/dev).
- `AGENTS.md`: Project-specific guidance for Codex/Codex CLI agents.
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
- `src/pages/cv.md`: Generated from root `cv.md` on build/dev (do not edit)
- `src/layouts/Base.astro`: Shared layout + meta
- `src/styles/global.css`: Global theme/styles
- `public/`: Static assets copied as-is (e.g., `favicon.svg`)
- `scripts/sync-cv.js`: Syncs `cv.md`, copies `photos/` to `public/photos/`, writes `src/data/photos.json`, prepares `src/images/hero.png`
- `Dockerfile` + `nginx.conf`: Dockerized static hosting (configured for `ben.allen.io`)

## Project Scripts

- `npm run sync`: Sync CV + photos and regenerate manifests
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
- Generated `src/pages/cv.md` is ignored by git; always edit the root `cv.md`.
- The site URL is set to `https://ben.allen.io` in `astro.config.mjs` and is used for canonical/OG tags.
- In restricted environments, disable Astro telemetry to avoid permission issues: `ASTRO_TELEMETRY_DISABLED=1 npm run dev`

## Theme (Light/Dark)

- Tokens live in `src/styles/global.css` under `:root` with explicit overrides for `:root[data-theme="dark|light"]`.
- System preference is respected by default via `@media (prefers-color-scheme: light)`; user choice overrides via `data-theme`.
- An early inline script in `src/layouts/Base.astro` sets the theme before paint to avoid flashes.
- The toggle button is in the header (Base layout) and handled by `public/scripts/theme.js` which persists to `localStorage` and updates `color-scheme`.

## Generated Assets (not committed)

- `public/photos/`: Created from `photos/` during `sync`/`dev`/`build`.
- `src/images/hero.png`: Prepared by the sync script for `astro:assets` usage.

Source control rules are configured so these generated paths are ignored. Keep your source images in `photos/`.

## Conventions

- Keep the CV concise, scannable, and consistent.
- Prefer plain Markdown. Avoid adding build systems or external assets.
- Do not add unrelated files or restructure the repo unless requested.

## Notes

## Docker (Coolify-ready)

- Build image: `docker build -t ben-allen-io:latest .`
- Run: `docker run -p 8080:8080 ben-allen-io:latest` and open `http://localhost:8080`
- Coolify: point to this repo with Dockerfile deployment. The image builds the site and serves static files via Nginx over HTTP.

What the Dockerfile does:
- Stage 1 builds the Astro site (runs install then `npm run build`).
- Stage 2 serves `/dist` using Nginx with gzip and long-lived cache headers for assets.

If you prefer Node serving instead of Nginx, we can switch to `@astrojs/node` adapter and run the server in the container.

Tip: For reproducible builds, consider using `npm ci` with a committed lockfile in the builder stage.

### Coolify Deploy (step-by-step)

1) In Coolify, create an Application → Source: Git Repository → Dockerfile strategy
2) Repository: this repo; Root directory: `/`; Dockerfile path: `Dockerfile`
3) Ports: expose `80` (map to container `8080`); Healthcheck optional (Dockerfile includes it)
4) Environment variables: none required (static build)
5) Domain: set to `ben.allen.io` in Coolify; if you need HTTPS, terminate TLS at the platform/ingress
6) Deploy: Coolify builds the image (install → build → Nginx serve)

Redeploy on changes:
- Editing `cv.md` or any `src/**` file and pushing to your repo triggers a new build in Coolify; the `/cv` page updates automatically.

## Operating the Content

- Edit the CV in `cv.md` at the repo root.
- Run locally: `npm run dev` (the CV syncs to `/cv` automatically)
- Build/deploy: `npm run build` (syncs, then writes static HTML to `dist/`)
- In Docker/Coolify, the same sync happens during the image build.

Photos:
- Place images in `photos/` (PNG/JPG/JPEG/WebP/GIF). They’ll be copied to `public/photos/` when you run sync/dev/build.
- The gallery and hero use a generated manifest at `src/data/photos.json`.

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

## Security

- Photos: avoid publishing sensitive EXIF/metadata (e.g., GPS). Recommended: strip EXIF before adding to `photos/` using a tool like `exiftool -all="" file.jpg` or your editor’s export settings. The sync step enforces extension/type checks, blocks symlinks, and skips oversized files.
- CSP: inline scripts have been externalized; a single early theme snippet remains and is allowed via a strict SHA‑256 hash in the CSP header. If you modify that snippet in `src/layouts/Base.astro`, update the CSP hash in `nginx.conf`.
- Docker context: secrets and cert material are excluded via `.dockerignore`. Terminate TLS at your platform if possible; otherwise, Nginx is configured with modern ciphers and headers.
