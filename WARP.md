# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is Ben Allen's personal website built with Astro (static site generator). The site serves dual purposes:
1. **Marketing homepage** (`/`) - Showcases Ben's skills and availability for front-of-house work
2. **CV page** (`/cv`) - Full curriculum vitae generated from the root `cv.md` file

The architecture follows a unique **single source of truth** pattern where `cv.md` at the repository root is the authoritative CV content, automatically synced to the site during builds.

## Key Architecture Patterns

### CV Synchronization System
- **Source**: `cv.md` (root) - Edit this file only
- **Target**: `src/pages/cv.md` - Generated automatically with frontmatter
- **Sync script**: `scripts/sync-cv.js` - Runs before dev/build
- **Photo handling**: Copies `photos/` to `public/photos/` and generates `src/data/photos.json` manifest

### Content Strategy
- Homepage focuses on work availability and key skills for hospitality/retail roles
- CV page provides comprehensive experience and education details
- Photos are auto-detected and integrated into the Hero component with smart selection (prefers images matching `computer|portrait|supermarket|barman|barista`)

## Development Commands

### Local Development
```bash
npm install                    # Install dependencies
npm run dev                   # Sync CV + start dev server (http://localhost:4321)
npm run sync                  # Manual CV sync only
```

### Building & Deployment
```bash
npm run build                 # Sync CV + build to dist/
npm run preview              # Serve production build locally
```

### Docker (Production)
```bash
docker build -t ben-allen-io:latest .
docker run -p 8080:80 ben-allen-io:latest
```

## File Structure & Responsibilities

### Content Files
- `cv.md` - **Primary CV content** (single source of truth)
- `photos/` - Personal photos (auto-synced to site)
- `src/data/photos.json` - Generated photo manifest

### Site Architecture  
- `src/layouts/Base.astro` - Shared layout with SEO, schema.org markup, and interactive features
- `src/components/Hero.astro` - Homepage hero section with contact info and photo
- `src/pages/index.astro` - Marketing homepage highlighting work availability
- `src/pages/cv.md` - **Generated file** (never edit directly)

### Build System
- `scripts/sync-cv.js` - CV/photo sync with error handling
- `astro.config.mjs` - Astro configuration with sitemap generation
- `Dockerfile` + `nginx.conf` - Multi-stage build for static hosting

## Agent Guidelines (from AGENTS.md)

### Content Editing Rules
- **Only edit `cv.md`** - Never modify `src/pages/cv.md` directly
- Use patch-based edits with exact file paths and line references  
- Preserve existing tone and style unless explicitly requested to change
- Prefer tight language, strong verbs, and measurable outcomes
- Keep sections: Summary, Skills, Experience (reverse-chronological), Education, Certifications

### Technical Constraints
- Maintain minimal stack: Astro + CSS only
- No heavy runtime frameworks unless explicitly requested
- Avoid adding unrelated files or restructuring without clear purpose
- Markdown only for CV content - no HTML, images, or footnotes unless requested

## Key Features & Components

### Interactive Elements
- Intersection Observer-based reveal animations
- Number count-up animations for statistics
- Scroll progress indicator
- Mobile-friendly navigation with details/summary

### SEO & Meta
- Schema.org Person markup with contact details
- Open Graph tags with photo selection
- Canonical URLs and sitemaps via Astro integration
- Dynamic meta descriptions and titles

### Styling Architecture
- `src/styles/global.css` - Complete styling system
- CSS custom properties for theming
- Responsive grid system for cards and content
- Dark/light theme meta tags

## Common Tasks

### Updating CV Content
1. Edit `cv.md` in repository root
2. Run `npm run dev` or `npm run build` (auto-syncs)
3. Changes appear on `/cv` route

### Adding Photos
1. Place images in `photos/` directory
2. Supported formats: PNG, JPG, JPEG, WebP, GIF
3. Auto-synced to `public/photos/` on build
4. Hero component auto-selects preferred image

### Deployment (Coolify)
- Uses Dockerfile strategy
- Builds static site and serves via Nginx
- Exposes port 80 with health checks
- No environment variables required

## Development Notes

### Node.js Requirements
- Node.js 18.14+ (Node 20 recommended)
- npm 9+
- ESM modules throughout

### Error Handling
- Sync script continues build if `cv.md` missing (dev/prod safety)
- Photo sync is optional (warns but doesn't fail)
- Astro telemetry can be disabled: `ASTRO_TELEMETRY_DISABLED=1`

### Troubleshooting
- Port conflicts: Use `npm run dev -- --port 4322`
- Permission issues: Set `ASTRO_TELEMETRY_DISABLED=1`
- Missing photos: Check `photos/` directory exists and has valid image files

## Site Configuration

### Domain & URLs
- Site URL: `https://ben.allen.io` (set in `astro.config.mjs`)
- Contact email: `ben@allen.io`
- LinkedIn: `linkedin.com/in/ben-allen-uk`

### Content Focus Areas
- Part-time work availability in High Wycombe area
- Food service and retail experience
- Customer service and EPOS skills
- AI-assisted productivity capabilities
- Sixth Form student with relevant certifications (Food Hygiene L2, First Aid, DBS)
