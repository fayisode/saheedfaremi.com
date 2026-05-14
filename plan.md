# Saheed Faremi — Digital Profile

> A world-class researcher-engineer portfolio. Editorial × Neuro-Tech identity. SvelteKit static site, deployed to Azure Static Web Apps. Built so any reviewer — academic, recruiter, journalist, or peer — rates it 100/100.

**Status:** Planning locked. Ready to build.
**Working directory:** `/Users/saheedfaremi/WebstormProjects/saheed_cv/`
**Owner:** Saheed Faremi
**Bench:** lucalongo.eu (target: dominate on design, depth, and interactivity while keeping academic gravitas)

---

## 1. North Star

Three things every visitor should leave knowing in under 60 seconds:

1. **You are a serious researcher** — PhD-track work in EEG microstates / variational autoencoders, with publications and citable artefacts.
2. **You ship production systems** — fintech (Curnance), healthcare (HIS Core, predict_dx, pressure_ulcer), education (Moodle, Skills Hub, LMS), HR (Etihuku), agriculture (Farmer Call Center), GIS. Multi-domain credibility.
3. **You operate internationally** — Eswatini representative at the UNESCO India-Africa Hackathon 2022 (gold medal, ₹3 lakh prize, Team Geeks_on_Fire).

Tagline candidate (we'll iterate):
> *"Researcher of the brain. Engineer of the systems people rely on."*

---

## 2. Tech Stack (locked)

| Layer | Choice | Why |
|---|---|---|
| Framework | **SvelteKit 2** with `@sveltejs/adapter-static` | Smallest JS payload at our complexity. Familiar to you (curnance_admin_svelte). First-class View Transitions. |
| Language | **TypeScript** (strict) | Catches content-shape errors at build time. |
| Styling | **Tailwind CSS v4** + CSS custom properties for theming | v4 is CSS-native, zero runtime, native `@theme`. |
| Content | **MDsveX** (Markdown-in-Svelte) + content collections in `/content/**/*.md` | Author publications/projects in Markdown, type-check frontmatter with Zod. |
| 3D / WebGL | **OGL** (lighter than Three.js, ~20KB) for hero microstate field; **Three.js** only if specific shader needs it | Lazy-loaded via dynamic import after first paint. |
| Animation | **GSAP** (ScrollTrigger) + **Motion One** for declarative micro-interactions | Lazy-loaded; respects `prefers-reduced-motion`. |
| Icons | **Lucide** + custom SVGs for project marks | Tree-shakeable. |
| Fonts | **GT Sectra** (display, self-hosted woff2) or open alternative **Fraunces**; **Inter** for body; **Geist Mono** for code | Self-hosted, `font-display: swap`, preloaded. |
| Image pipeline | **`@sveltejs/enhanced-img`** (AVIF/WebP, blur placeholders) | Native to SvelteKit. |
| Forms | Contact form via **Azure Functions** (Node 20) + **Cloudflare Turnstile** | SWA's built-in serverless. |
| Analytics | **Plausible** (self-hosted or cloud, GDPR-friendly) | No cookies, no banner. |
| Search | **Pagefind** (static, runs at build) | Zero infra, full-text on publications. |
| i18n | **Paraglide-JS** (compile-time, zero runtime) | English first; Yoruba and French stretch goal. |
| Testing | **Vitest** for content shape; **Playwright** for visual regression on hero | Catches drift before deploy. |
| Quality | **Lighthouse CI** in GH Actions, budget 100/100/100/100 on `/` | Hard gate on every PR. |
| Deploy | **Azure Static Web Apps** (Free tier — 100GB bandwidth, custom domain, SSL) | Per your spec. |
| CI/CD | **GitHub Actions** (Azure SWA template) | Branch deploys = staging URL per PR. |

**Estimated cost:** $0/mo on Azure SWA Free + ~$12/yr for domain.

---

## 3. Visual Identity (locked: Editorial × Neuro-Tech)

### Palette
- **Ink:** `#0A0E1A` (deep slate, primary background)
- **Paper:** `#F8F6F1` (warm cream, light-mode background)
- **Phosphor (accent):** `#5EEAD4` (luminous teal, used sparingly for emphasis)
- **Violet (secondary):** `#A78BFA` (microstate signal color)
- **Signal grades:** 5-step ramp `#E2E8F0 → #94A3B8 → #475569 → #1E293B → #0A0E1A`
- **Semantic:** success `#22C55E`, warn `#F59E0B`, error `#EF4444`

### Type system
- **Display:** Fraunces (variable), used at 64–144px for section openers
- **Body:** Inter (variable), 16/18/20px
- **Mono:** Geist Mono for code, captions, metadata
- **Scale:** modular 1.25 (major third)
- **Vertical rhythm:** 8px baseline grid

### Motion principles
1. **Earned motion** — every animation must have a function (orient, reveal, confirm). No decoration for its own sake.
2. **Reduced-motion respected** — `prefers-reduced-motion: reduce` collapses to fade/instant.
3. **Performance budget** — hero animation < 60KB JS, < 5% main-thread time after first paint.

### Signature element: The Microstate Field
- A WebGL canvas behind the hero showing a slowly evolving 2D field of EEG-microstate-like polarity patches (your actual research, abstracted).
- Patches transition through the four canonical microstate maps (A, B, C, D).
- Color: phosphor teal × violet × slate, low contrast against ink background.
- Disables on `prefers-reduced-motion` → static topology image.

---

## 4. Information Architecture

Eight sections, each with a single thesis. One scroll, one nav.

### `/` — Index
| Section | Thesis | Key elements |
|---|---|---|
| **Hero** | Who, what, where, why now | Name (display type), one-line positioning, microstate field, "Read CV" + "Get in touch" CTAs |
| **About** | Who you are in 90 seconds | Two-column: portrait + biographical narrative; pulled quotes |
| **Research** | The brain work | EEG microstates, VAE/GMMVAE architecture diagrams (you have these!), current PhD focus, supervisor link |
| **Projects** | The systems work | Filterable grid by domain (Fintech, Health, Education, HR, Agri, GIS, Research); cards open detail pages |
| **Publications & Talks** | The citable record | Year-grouped list, BibTeX export, DOI/PDF links, Pagefind search |
| **Recognition** | Third-party validation | UNESCO India-Africa 2022 gold medal (with article link); other awards; press |
| **Skills & Stack** | The technical surface | Categorized: Languages, Frameworks, Cloud, Research methods. Honest proficiency bands. |
| **Contact** | The call-to-action | Form (Azure Function) + direct email + Calendly link + social row |

### Per-project page: `/projects/[slug]`
- Hero image / live demo embed
- Problem → Approach → Outcome → Role narrative
- Tech stack tags
- Screenshots gallery (lazy)
- Outbound: live URL, repo (if public), case study PDF
- Related projects

### Per-publication page: `/publications/[slug]`
- Title, authors, venue, year, DOI
- Abstract
- BibTeX block (copy button)
- PDF embed (if open-access)
- "Cite this" tools

### Other routes
- `/cv` — Print-optimized full CV (also exports `cv.pdf` at build time via Playwright)
- `/now` — What you're working on this month (a la nownownow.com)
- `/uses` — Hardware/software you actually use (a la uses.tech)
- `/blog/[slug]` — Optional, MDsveX-powered writeups (start with 2 seed posts)
- `/api/contact` — Azure Function, POST → email via Resend

---

## 5. Domain Recommendations

You said you want to buy one. Three candidates, ranked:

1. **`saheedfaremi.com`** (Recommended) — Plain, professional, citable. Check on Namecheap/Porkbun (~$12/yr).
2. **`saheed.dev`** — Short, modern, dev-leaning. (~$15/yr.) Risk: less academic.
3. **`faremi.io`** — Surname-only, edgy. Risk: `.io` is being deprecated by ICANN (the IO TLD lives on for now but uncertainty is real); avoid.

**Action:** Tell me which to register and I'll add the DNS + Azure SWA custom-domain steps to the deploy phase.

---

## 6. Phased Roadmap

Each phase is a `/work` session. Run them in order; each ends with something deployed.

### Phase 0 — Foundation (IN PROGRESS as of 2026-05-14)

Resumable sub-units. Each one captures its own pre-state so a cold restart can resume by inspecting the working tree and skipping any unit whose post-state is already satisfied.

- [x] **0.1 Probe toolchain** — verify node>=18.13, pnpm, git, gh, az present. *Post-state:* environment OK, gh unauth'd, az auth'd on Etihuku CSP sub.
- [x] **0.2 Scaffold SvelteKit** — `pnpm dlx sv create` minimal + TS strict + ESLint + Prettier + Vitest + Playwright. *Post-state:* `package.json` + `src/` + `svelte.config.js` exist at repo root.
- [x] **0.3 Install Tailwind v4 (Vite plugin path)** — `pnpm add -D tailwindcss @tailwindcss/vite`; wire `vite.config.ts`; replace `src/app.css` with `@import "tailwindcss"` and a `@theme` block holding our locked color tokens. *Post-state:* dev server renders a Tailwind-styled page.
- [x] **0.4 Wire `@sveltejs/adapter-static`** — install adapter, swap into `svelte.config.js`, set `prerender = true` in root `+layout.ts`, configure 404 fallback. *Post-state:* `pnpm build` emits a fully static `build/` directory.
- [x] **0.5 Author seed page** — `src/routes/+page.svelte` shows name + tagline + theme tokens applied; nothing fancy. *Post-state:* visible "hello world" with Editorial × Neuro-Tech tokens already loaded.
- [x] **0.6 Quality gates** — `pnpm check` (svelte-check) clean, `pnpm lint` clean, `pnpm build` clean. *Post-state:* all three pass exit 0.
- [x] **0.7 Git init + initial commit** — `.gitignore` extended (`.env*`, `.azure/`, `.DS_Store`), initial commit recorded. *Post-state:* `git log` shows one commit on `main`.
- [x] **0.8 Azure SWA workflow scaffold** — write `.github/workflows/azure-static-web-apps.yml` from official template; secret name placeholder; comment block explaining the two manual steps user must do. *Post-state:* workflow file present, valid YAML, will execute correctly once secret exists.
- [x] **0.9 Adversarial review** — 3 review subagents ran; 4 HIGH + 2 MEDIUM + 3 LOW findings; all HIGH/MEDIUM fixed in commit `init`. Findings summary:
  - HIGH: CSP `unsafe-inline` in script-src → moved CSP to SvelteKit `kit.csp` hash mode in `svelte.config.js`; dropped CSP from `staticwebapp.config.json`.
  - HIGH: `swa-cli.config.json` missing from `.gitignore` → added.
  - HIGH: `<section>` no accessible name → `aria-labelledby="hero-heading"` + `id` on `<h1>`.
  - HIGH: JS budget exceeded (~65 KB gzip) → `csr = false` in `src/routes/+page.ts`. JS shipped on `/` is now 0 KB.
  - HIGH: dead `my-auto` (overridden by `justify-between`) → removed `justify-between` from `<main>`.
  - MEDIUM: action SHAs not pinned → all four pinned to commit SHA with `# v4`/`# v1` comment.
  - MEDIUM: stale `text-scale` meta in `app.html` → removed.
  - LOW: redundant `@sveltejs/vite-plugin-svelte` dep → removed.
  - LOW: redundant `ssr = true` export → removed.
  - DEFERRED: web font preloading → Phase 1 (design system).
- [x] **0.10 Quality gates re-run** — `pnpm check` 0/0, `pnpm lint` clean, `pnpm build` clean. Measured: HTML 4.3 KB, CSS 12 KB raw, JS 0 KB. CSP meta tag emitted with `script-src 'self'`.
- [x] **0.11 Initial commit** — local `main` branch with one commit; tree clean.
- [x] **0.12 User inputs locked** — Azure: Saheed to create SWA in portal (CLI auth proved expensive — fayisode@gmail.com has no Azure sub, Etihuku token revoked, Curnance token expired). GitHub: public repo `fayisode/saheedfaremi.com`. Region: West Europe.
- [x] **0.13 Git remote configured** — `origin = https://github.com/fayisode/saheedfaremi.com.git` (HTTPS, so `gh auth login` can store the credential).
- [ ] **0.14 Saheed pushes `main`** *(manual)* — `git push -u origin main`. Will prompt for GitHub auth on first push; either run `! gh auth login` first (preferred) OR use a personal access token.
- [ ] **0.15 Saheed creates Azure SWA via portal** *(manual)* — portal.azure.com → "Create a resource" → "Static Web App". Settings: Subscription = any sub with Owner/Contributor (Curnance works once admin@curnance.com re-authenticates), Resource group = `rg-saheedfaremi-com` (create new), Name = `saheedfaremi-com`, Plan type = **Free**, Region = **West Europe**, **Source = "Other"** (NOT GitHub — that path generates a duplicate workflow file that conflicts with ours). Click "Review + create".
- [ ] **0.16 Saheed copies deployment token** *(manual)* — once SWA is provisioned, open it in portal → left nav → "Manage deployment token" → copy the value (treat like a password).
- [ ] **0.17 Saheed adds GitHub secret** *(manual)* — github.com/fayisode/saheedfaremi.com → Settings → Secrets and variables → Actions → "New repository secret" → Name = `AZURE_STATIC_WEB_APPS_API_TOKEN`, Value = paste token. Click "Add secret".
- [ ] **0.18 First deploy fires** — once secret is set, any push to `main` triggers `.github/workflows/azure-static-web-apps.yml`; workflow runs check + lint + build + upload to SWA.
- [ ] **0.19 Verify staging URL live** — portal → SWA resource → "URL" field (looks like `https://<name>-<random>.westeurope-NN.azurestaticapps.net`); open in browser; confirm hero renders.

### Phase 1 — Design system (COMPLETE as of 2026-05-14)

- [x] **1.1 Fonts installed** — Fontsource variable: `@fontsource-variable/{inter,fraunces,geist-mono}` (5.2.x).
- [x] **1.2 Fonts wired + preload** — `@import` in `app.css` (wght axis); preload links for Fraunces + Inter latin in `+layout.svelte` `<svelte:head>` using Vite `?url` imports for content-hashed URLs.
- [x] **1.3 `@theme` tokens expanded** — semantic bg/fg/accent + raw palette + radii (sharp/soft/card/pill) + motion durations + z-scale; light-mode overrides via `[data-theme='light']` selectors.
- [x] **1.4 Pre-paint theme script** — initially inline in `app.html`, but review found CSP `script-src 'self'` doesn't auto-hash app.html scripts on csr=false routes (only routes that go through SvelteKit's render pipeline). MOVED to external `static/theme-init.js`; same-origin script passes without hash.
- [x] **1.5 Base components built** — `Container`, `Section` (counter-based unique id), `Button` (primary/ghost/subtle × sm/md/lg), `Link` (inline/arrow/plain + auto-external), `Tag` (outline/solid/accent), `Card` (default/elevated/outlined + interactive).
- [x] **1.6 `ThemeToggle.svelte`** — reads theme via `$app/environment.browser` guarded init; sun/moon SVGs; aria-pressed; reduced-motion respected.
- [x] **1.7 Kitchen sink route** — `/dev/kitchen-sink` with csr=true; noindex meta + robots.txt Disallow + (defense in depth).
- [x] **1.8 Hero refactored** — wrapped in `Container`, uses semantic tokens (`text-fg-soft`, `bg-bg-soft`, `text-accent`) so light mode works.
- [x] **1.9 Quality gates** — check 0/0, lint clean, build clean.
- [x] **1.10 Adversarial review** — 3 parallel agents (component / build+perf / security+SEO); 11 distinct findings. **Fixed:** CSP-blocks-inline-on-`/` (external file), Section id collision (counter), reduced-motion transforms (`transform: none !important`), font preload, metric-matched fallback @font-faces (size-adjust), frame-ancestors moved to HTTP header, ThemeToggle init via `$app/environment.browser`, Section heading+labelledById guard, handleHttpError allowlist. **Deferred:** sitemap.xml (Phase 2 — needs content), OG/Twitter cards (Phase 2), theme-transition flash suppression (LOW probability).
- [x] **1.11 Final quality gates + commit** — check/lint/build all clean; CSP verified per-route in built HTML.
- [x] **1.12 Memory updated** — `lessons_phase1_design_system.md` (font loading, CSP gotcha, Svelte 5 component patterns).

### Phase 2 — Content schema + seed (1 session)
- Define Zod schemas for: project, publication, talk, award, experience, education
- Seed with stubbed content from your existing repos (READMEs become drafts)
- Build content loaders + type-safe imports

### Phase 3 — Hero + microstate field (1 session)
- OGL canvas with microstate shader
- Reduced-motion fallback
- Performance budget enforcement

### Phase 4 — About + Research sections (1 session)
- Portrait optimization
- Bio narrative
- Embed VAE/GMMVAE architecture diagrams from your Documents folder
- Pulled quotes

### Phase 5 — Projects grid + detail pages (1–2 sessions)
- Grid with domain filter
- One detail page per real project (need your input on which 8–10 to feature)
- Live demo embeds where appropriate

### Phase 6 — Publications + Talks (1 session)
- Year-grouped list
- BibTeX export
- Pagefind search index

### Phase 7 — Recognition + Contact (1 session)
- UNESCO 2022 with link to the Medium piece
- Azure Function contact endpoint
- Turnstile spam protection

### Phase 8 — CV print mode + PDF export (1 session)
- `/cv` route with print stylesheet
- Build-time PDF generation via Playwright

### Phase 9 — Polish + ship (1 session)
- Lighthouse CI green across the board
- View Transitions between routes
- SEO: Open Graph images per route, sitemap, robots, JSON-LD Person + ScholarlyArticle
- Custom domain + SSL
- Plausible analytics
- Final visual QA

**Total:** ~10 focused sessions. Each phase can pause at a deployable state.

---

## 7. Quality Bar (non-negotiable)

- Lighthouse 100/100/100/100 on `/` (mobile and desktop)
- LCP < 1.5s on 4G, FCP < 0.8s
- Cumulative Layout Shift < 0.02
- Total JS shipped on `/` before interaction: < 50 KB gzipped
- WCAG 2.2 AA, tested with axe-core
- Works without JavaScript (graceful degradation; only animations and contact form require JS)
- Works at `prefers-reduced-motion: reduce`, `prefers-color-scheme: dark/light`, `prefers-contrast: more`
- Print stylesheet for `/cv`
- Valid HTML5, valid JSON-LD, valid sitemap

---

## 8. Data I Need From You (collected as `/work` runs)

Sorted by when each phase will ask:

**Phase 0:**
- GitHub username (to create repo)
- Azure account ready? (free tier — I'll guide through setup if not)

**Phase 2 (content seed):**
- Your CV (PDF) — drop in `/Users/saheedfaremi/WebstormProjects/saheed_cv/_inputs/cv.pdf`
- Headshot + 2–3 supporting photos → `/_inputs/photos/`
- Publication list (or Google Scholar URL)
- 8–10 projects you want featured (we'll pick from your portfolio)

**Phase 3:**
- One-line positioning statement (we'll workshop this)

**Phase 4:**
- Long-form bio (300–500 words) or seed text I draft and you edit
- The VAE/GMMVAE diagrams from your Documents folder → I'll copy

**Phase 7:**
- Contact email destination
- Calendly link (or alternative)
- Social links: LinkedIn, Google Scholar, GitHub, Twitter/X, ORCID

**Phase 9:**
- Chosen domain (see §5)

---

## 9. Open Decisions (defer until later phases)

- Blog or no blog at launch? (Recommend: ship 2 seed posts in Phase 9)
- Languages: English-only at launch, or add Yoruba + French stretch?
- Newsletter signup? (Adds Buttondown integration ~30 min)
- 3D portrait avatar (Three.js head model) for hero — high risk/high reward, skip at launch
- Audio: subtle ambient soundscape on hero (toggle in nav) — defer, polarizing

---

## 10. Out of Scope (deliberately)

- CMS (no Sanity/Contentful — Markdown is faster and you don't need editorial workflow yet)
- Comments / Disqus
- Server-side rendering with Node (we're static)
- Multi-author support
- Job board / hiring page

---

## How to use this plan with `/work`

After you read this:

1. Pick the phase to start with (usually Phase 0).
2. Invoke `/work Phase 0` — I'll execute it end-to-end, asking only for things in §8 that the phase needs.
3. At the end of each phase, the site is in a deployable state. You decide whether to push to staging.
4. We move to the next phase when you say so.

---

*Plan version 1.0 — drafted 2026-05-14. Iterate by editing this file or asking me to revise specific sections.*
