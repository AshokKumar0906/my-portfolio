# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server (Turbopack) at http://localhost:3000. This alone does **not** serve `/api/chat` (see Services below).
- `npx vercel dev` — runs both services (Next.js frontend + FastAPI backend) together with the same routing as production. Use this instead of `npm run dev` when working on the AI chat feature.
- `npm run build` — production build (Turbopack) for the frontend service only; also type-checks via `tsc`.
- `npm run start` — serve the production frontend build.
- `npm run lint` — run ESLint (flat config in `eslint.config.mjs`, extends `next/core-web-vitals` + `next/typescript`).
- Backend (Python): `cd backend && python -m venv .venv && .venv/Scripts/pip install -r requirements.txt` (Windows; use `.venv/bin/pip` on macOS/Linux), then `.venv/Scripts/python -m uvicorn main:app --reload --port 8000` to run it standalone. `GOOGLE_GENERATIVE_AI_API_KEY` must be set in its environment.

There is no test suite configured in this project.

### Deployment

This project deploys as a **Vercel Services** project — two independently built services in one deployment, defined in `vercel.json`. Deployed via the CLI (project is linked; see `.vercel/`):

```bash
npx vercel --prod --yes
```

The production alias is `ashok-kumar-l-portfolio.vercel.app`. After a fresh deploy under a new deployment URL, re-point the alias if it doesn't carry over automatically:

```bash
npx vercel alias set <new-deployment-url> ashok-kumar-l-portfolio.vercel.app
```

`GOOGLE_GENERATIVE_AI_API_KEY` must be set in the Vercel project's Production environment variables (`npx vercel env add GOOGLE_GENERATIVE_AI_API_KEY production`) — the backend service reads it from `os.environ`.

SSO deployment protection is intentionally disabled (`npx vercel project protection disable portfolio-next --sso`) so the site is publicly viewable without a Vercel login.

## Architecture

The site is split into two Vercel **services** defined in `vercel.json`: a Next.js frontend (`root: "."`) and a Python FastAPI backend (`root: "backend/"`). A top-level rewrite sends `/api/chat` to the backend service; everything else goes to the frontend. Both build and deploy together as one Vercel deployment on one domain — there's no separate hosting or CORS to manage.

### Frontend (TypeScript / Next.js)

This is a single-page personal portfolio (Next.js App Router, TypeScript, Tailwind CSS v4). There is exactly one route (`/`); the whole site is one scrollable page composed of section components.

- **`src/lib/data.ts`** is the single source of truth for all content — profile info, stats, skills, experience, projects, education, and certifications. It is hand-maintained from the owner's resume. To update any content on the site (job history, projects, links, etc.), edit this file only; do not hardcode content into components.
- **`src/components/Section.tsx`** is the shared layout wrapper for every content section (numbered index, title, consistent spacing). All sections below use it except `Hero`.
- **`src/components/*.tsx`** — one component per page section (`Hero`, `About`, `Experience`, `Projects`, `Education`, `Contact`, `Nav`, `Footer`), each importing only the slice of `data.ts` it needs. `src/app/page.tsx` composes them in order.
- **`src/app/opengraph-image.tsx`** dynamically generates the social-preview image (`next/og` `ImageResponse`, edge runtime) from the same `profile`/`stats` data, so the OG image and page content can't drift out of sync. Next.js auto-wires this into `og:image`/`twitter:image` metadata — no manual `<meta>` tags needed for the image itself.
- **`src/app/layout.tsx`** sets global `<Metadata>` (title, description, Open Graph, Twitter card) and mounts `@vercel/speed-insights`. `metadataBase` must stay in sync with the actual production domain since OG image URLs are resolved against it.
- **Theming**: CSS custom properties (`--background`, `--foreground`, `--accent`, `--muted`, `--border`, `--surface`) are defined in `src/app/globals.css` and mapped into Tailwind via `@theme inline`. Single (light) theme only — dark mode was removed intentionally; don't reintroduce a `prefers-color-scheme` block or a theme toggle without being asked. Still style with the semantic Tailwind tokens (`bg-background`, `text-muted`, `border-border`, `text-accent`, etc.) rather than raw colors, since that's the single source of truth for the palette.
- `public/Ashok_Kumar_Resume.pdf` is served directly and linked from the Nav/Hero "Résumé" download buttons — keep this file in sync with the content in `data.ts` when the resume changes.
- **`src/components/AiChat.tsx`** is a floating "Ask AI about me" chat widget mounted in `layout.tsx`. It's a plain `fetch` + `ReadableStream` client (no AI SDK on this side) speaking a small custom SSE protocol — `data: {"delta": "..."}` per chunk, `data: [DONE]` to end — against the backend's `/api/chat`.

### Backend (Python / FastAPI)

- **`backend/main.py`** — the FastAPI app (`app`). `/api/chat` accepts `{"messages": [{"role": "user"|"assistant", "content": string}]}` and streams the custom SSE protocol described above. It calls Gemini's REST `:streamGenerateContent` endpoint directly via `httpx` (not the `google-genai` SDK) — this was a deliberate choice after Google's newer "Interactions API" surface couldn't be verified reliably against docs; the raw REST contract is stable and already proven in this project.
- **`backend/data.py`** is a hand-maintained Python mirror of `src/lib/data.ts`'s resume content, used to build the system prompt. **Update both files together** when the resume changes — there's no shared source across the language boundary.
- Model: `gemini-3.5-flash-lite` with `thinkingConfig.thinkingLevel: "MINIMAL"` — chosen for low latency on simple grounded Q&A. Avoid preview/newest-tier models here (e.g. `gemini-3.7-flash`) without checking current availability first; one was pulled from production after hitting Google-side capacity 503s that blew through the function timeout with no response.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
