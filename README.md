# saheedfaremi.com

Personal website, CV, and blog of **Saheed Faremi** — PhD researcher (EEG microstates
with variational autoencoders, University College Cork) and founding engineer at
Curnance. Live at <https://saheedfaremi.com>.

## Stack

- **SvelteKit 2 + Svelte 5** (runes), TypeScript strict, fully prerendered via
  `adapter-static`
- **Tailwind CSS v4** with custom design tokens and dark/light themes
- **MDsveX** for prose; content validated at build time with **Zod**
- **Vitest** unit tests, **Playwright** e2e scaffolding
- Deployed to **Azure Static Web Apps** from GitHub Actions (see
  `.github/workflows/`), which runs check → lint → test → build on every push/PR

## Content model

All content lives in `src/content/<collection>/*.md` with YAML frontmatter.
Collections: `projects`, `publications`, `talks`, `awards`, `experience`,
`education`, `news`, `blog`.

- `src/lib/content/_plugin.ts` parses and Zod-validates every entry at build time
  (the build fails on invalid content) and exposes it as a `virtual:content` module.
- `src/lib/content/loader.ts` provides the typed collections plus helpers
  (`publishedOnly`, `sortByYearDesc`, `toBibtex`, …). Prose bodies are lazy-loaded
  per detail page, so listing routes never pay the body-bundle cost.
- A sitemap is generated at build time by `src/lib/content/_sitemap-plugin.ts`.

To add a publication, talk, post, etc., drop a new Markdown file into the matching
collection directory — slug comes from the filename. Set `status: published` for it
to appear in listings and feeds.

## Commands

```sh
pnpm install        # install dependencies (Node >= 22, pnpm 11)
pnpm dev            # dev server with content hot-reload
pnpm run check      # svelte-check + TypeScript
pnpm run lint       # prettier + eslint
pnpm run test:unit -- --run   # vitest unit tests
pnpm run test:e2e   # playwright e2e (installs browsers first)
pnpm build          # production build into build/ (also emits sitemap.xml)
pnpm preview        # preview the production build
```

## CV PDF

`scripts/generate-cv-pdf.sh` builds the site, previews it, and prints `/cv` to
`static/saheed-faremi-cv.pdf` with headless Chrome.
