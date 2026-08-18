# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build (Turbopack); also type-checks via `tsc` as part of the Next.js build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint (flat config in `eslint.config.mjs`, extends `next/core-web-vitals` + `next/typescript`)

There is no test suite configured in this project.

### Deployment

Deployed to Vercel via the CLI (project is linked; see `.vercel/`):

```bash
npx vercel --prod --yes
```

The production alias is `ashok-kumar-l-portfolio.vercel.app`. After a fresh deploy under a new deployment URL, re-point the alias if it doesn't carry over automatically:

```bash
npx vercel alias set <new-deployment-url> ashok-kumar-l-portfolio.vercel.app
```

SSO deployment protection is intentionally disabled (`npx vercel project protection disable portfolio-next --sso`) so the site is publicly viewable without a Vercel login.

## Architecture

This is a single-page personal portfolio (Next.js App Router, TypeScript, Tailwind CSS v4). There is exactly one route (`/`); the whole site is one scrollable page composed of section components.

- **`src/lib/data.ts`** is the single source of truth for all content — profile info, stats, skills, experience, projects, education, and certifications. It is hand-maintained from the owner's resume. To update any content on the site (job history, projects, links, etc.), edit this file only; do not hardcode content into components.
- **`src/components/Section.tsx`** is the shared layout wrapper for every content section (numbered index, title, consistent spacing). All sections below use it except `Hero`.
- **`src/components/*.tsx`** — one component per page section (`Hero`, `About`, `Experience`, `Projects`, `Education`, `Contact`, `Nav`, `Footer`), each importing only the slice of `data.ts` it needs. `src/app/page.tsx` composes them in order.
- **`src/app/opengraph-image.tsx`** dynamically generates the social-preview image (`next/og` `ImageResponse`, edge runtime) from the same `profile`/`stats` data, so the OG image and page content can't drift out of sync. Next.js auto-wires this into `og:image`/`twitter:image` metadata — no manual `<meta>` tags needed for the image itself.
- **`src/app/layout.tsx`** sets global `<Metadata>` (title, description, Open Graph, Twitter card) and mounts `@vercel/speed-insights`. `metadataBase` must stay in sync with the actual production domain since OG image URLs are resolved against it.
- **Theming**: CSS custom properties (`--background`, `--foreground`, `--accent`, `--muted`, `--border`, `--surface`) are defined in `src/app/globals.css` and mapped into Tailwind via `@theme inline`. Dark mode is automatic via `prefers-color-scheme` (no manual toggle/class-based dark mode) — always style with the semantic Tailwind tokens (`bg-background`, `text-muted`, `border-border`, `text-accent`, etc.) rather than raw colors so both themes stay correct.
- `public/Ashok_Kumar_Resume.pdf` is served directly and linked from the Nav/Hero "Résumé" download buttons — keep this file in sync with the content in `data.ts` when the resume changes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
