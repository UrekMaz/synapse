# Synapse

Synapse is a no-code **portfolio and website builder** that runs in the browser. A user picks a layout, gets a ready-made portfolio (or a blank page), edits it visually on a canvas (sections, text, images, links, animations, themes, moods and ambient sound), then **publishes** it to a public link at `/s/<site-name>`.

This README is a handover document. It covers what the product does, how to run and deploy it, how the code is organised, and how the main systems work together.

---

## Table of contents

1. [What the product does](#1-what-the-product-does)
2. [Tech stack](#2-tech-stack)
3. [Getting started](#3-getting-started)
4. [Deployment](#4-deployment)
5. [Folder structure](#5-folder-structure)
6. [The data model](#6-the-data-model)
7. [Architecture overview](#7-architecture-overview)
8. [Core systems in depth](#8-core-systems-in-depth)
9. [Publishing API reference](#9-publishing-api-reference)
10. [How to extend Synapse](#10-how-to-extend-synapse)
11. [Conventions](#11-conventions)
12. [Known gaps, placeholders and leftovers](#12-known-gaps-placeholders-and-leftovers)

---

## 1. What the product does

### User journey

| Step | Route | What happens |
|---|---|---|
| Landing | `/` | Animated "Synapse" wordmark stitched in thread, then a **Start building** button. |
| Dashboard | `/dashboard` | Choose **Create your portfolio** or **Business website**. Shows the current project (if any) and its live link. |
| Wizard, step 1 | `/new` | Choose the project type. For a portfolio, enter your **name** and **what you do**; these fill in the starter copy. Then pick a **layout preset** (Full width, Boxed, Narrow, Split, Sidebar, Bento). |
| Wizard, step 2 | `/new/configure` | Fine-tune the grid: width mode, composition, max width, columns, gutter, side margins, plus tablet and mobile overrides. **Create** builds the page and opens the editor. |
| Editor | `/editor` | The visual builder (see below). |
| Draft preview | `/preview`, `/preview/:slug` | Full-screen render of the unpublished draft, exactly as visitors will see it. |
| Published site | `/s/:site`, `/s/:site/:page` | The public site, loaded from the publishing API. |

Portfolio projects start with eight sections already in place: Menu → Intro (Spotlight hero) → Work → About → Services → Testimonials → Contact → Footer. The copy uses the owner's name and role, and the navbar links are connected to the matching sections automatically. A business website starts empty.

### Editor features

- **Canvas** with Desktop (1440px), Tablet (820px) and Mobile (390px) simulation, zoom (buttons or Ctrl/Cmd + wheel), grid and bounds overlay.
- **Section library** with 15 categories: Navigation (6 navbars), Hero (6 signature heroes), Features, About, Services, Statistics, Logos, Testimonials, Team, Portfolio, Pricing, FAQ, CTA, Contact and Footer (5 footers). Most body sections ship 3 design variations. Portfolio projects see friendlier category names (Skills, Projects, Kind words, and so on).
- **Hero Studio**: a full-screen modal for previewing and customising a library section on every device before adding it to the page.
- **Drag and drop**: from the library onto the canvas, and to reorder sections between layout regions.
- **Layers panel**: the section/element tree. Click an item to select it.
- **Inspector** (right panel): page settings when nothing is selected; otherwise section and element properties grouped into Content, Layout, Typography, Colors, and so on, with per-breakpoint overrides and a **Design / Animations** tab.
- **Inline editing**: double-click text on the canvas to edit it in place. Drag handles resize elements, and the bar under a selected section changes its height.
- **Animations**: about 50 presets (entrance, exit, emphasis, hover, scroll), choreographies (one-click animation sets per section), and a **timeline dock** for timing elements.
- **Theme Studio**: 20 theme presets (10 "Professional", 10 "Inspired by Music & Eras"), plus colour, typography, component and effect editing and custom saved themes. Themes can be applied to the whole site, selected sections only, or new sections only.
- **Mood / Experience layer**: decorative SVG motifs (leaves, serpents, polaroids, stars…), materials, headline and image styles, motion, and **generative ambient soundscapes** synthesised in the browser.
- **Smart links**: links point at sections or pages by stable id, so renaming a section or changing its anchor never breaks them. A links panel audits the site and can auto-connect links by label. Deleting a section that other links point to asks whether to redirect or unlink them.
- **Multi-page sites**: add, duplicate, rename, re-slug and delete pages, and choose the home page. New pages inherit the navbar, footer, layout and theme.
- **Undo/redo** (Ctrl/Cmd+Z, Ctrl/Cmd+Shift+Z), up to 80 steps; rapid edits are merged into one step.
- **Autosave** to `localStorage` (there is no account system).
- **Publish / Update**: choose a site name and address once, then each later publish pushes a new version to the same link.

---

## 2. Tech stack

| Area | Library |
|---|---|
| UI | React 19, React Router 7 |
| Build / dev server | Vite 8 (`@vitejs/plugin-react`) |
| State | Zustand 5 with the `immer` and `persist` middleware |
| Styling | Tailwind CSS 3 (editor chrome) + plain CSS and CSS variables (site output) |
| Animation | Framer Motion |
| Drag and drop | Native HTML5 DnD (`@dnd-kit` is installed but not used by the canvas) |
| Icons | lucide-react |
| IDs | uuid |
| Backend | Plain Node `http` server / Vite middleware / Vercel serverless function |
| Storage | JSON files on disk, or Upstash Redis via its REST API |
| Fonts | Google Fonts, loaded on demand |
| Images | Unsplash URLs as placeholders; user uploads are stored inline as data URLs |

The code is JavaScript/JSX only (no TypeScript) and there is no test suite.

---

## 3. Getting started

**Requirements:** Node 20+ (Vite 8 needs a modern Node) and npm.

```bash
npm install
npm run dev        # http://localhost:5173
```

During `npm run dev` the publishing API runs inside Vite as middleware (see `vite.config.js`), and published sites are saved as JSON files in `.synapse-data/sites/`. That folder is git-ignored and is not watched by Vite.

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server + publishing API middleware |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve `dist/` with Vite (the API middleware is mounted here too) |
| `npm start` | Production Node server (`server/index.js`): serves `dist/` and the API |
| `npm run lint` | ESLint |

### Environment variables

| Variable | Used by | Purpose |
|---|---|---|
| `PORT` | `server/index.js` | Port for the self-hosted server (default `3000`) |
| `SYNAPSE_DATA_DIR` | dev server, `server/index.js` | Folder for file storage (default `.synapse-data`) |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | all | Upstash Redis, as set by Vercel's Upstash integration |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | all | Upstash Redis, for a standalone Upstash database |

If either Redis pair is set, Redis is used. Otherwise sites are stored as files.

### Resetting local state

The whole project lives in the browser under the `localStorage` key **`synapse:editor:v1`**. To start fresh, delete that key in DevTools → Application → Local Storage. The visitor's sound preference is stored separately under `synapse:sound`.

---

## 4. Deployment

### Vercel (recommended)

The app is a static Vite build plus one serverless function (`api/sites.js`). Vercel's disk is read-only and not shared between requests, so published sites are stored in **Upstash Redis**.

1. **Deploy**
   ```bash
   npx vercel login
   npx vercel --prod
   ```
   Or push to GitHub and import the repo at vercel.com/new. If the repo contains other folders, set **Root Directory** to this folder.
2. **Add the database:** Vercel dashboard → project → **Storage** → **Create Database** → **Upstash for Redis** (free tier) → connect it to the project. This sets `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
3. **Redeploy** (`npx vercel --prod`) so the function picks up the new variables.

The app is then live at `https://<project>.vercel.app`, with published sites at `https://<project>.vercel.app/s/<site>`.

`vercel.json` rewrites `/api/sites/:slug` and `/api/sites/:slug/available` to the single function, sends every other path to `index.html` (SPA routing), and gives `/assets/*` long-lived immutable caching.

Notes:
- Without the database, the app still loads but Publish returns **503** with "Publishing isn't set up on this deployment yet".
- Vercel caps request bodies at 4.5 MB, so the function limits a published site (including uploaded images and audio) to **4 MB**. The self-hosted server allows 25 MB.
- `.vercelignore` keeps `.synapse-data`, `node_modules` and `dist` out of uploads.

### Self-host on any Node server

```bash
npm run build && npm start   # PORT (default 3000), SYNAPSE_DATA_DIR (default .synapse-data)
```

This uses files on disk, or Redis if the variables above are set. The server serves static files from `dist/` (with immutable caching for `/assets/`) and returns `index.html` for every other route.

---

## 5. Folder structure

```
synapse/
├── api/
│   └── sites.js                 Vercel serverless entry for the publishing API (requires Redis)
├── server/
│   ├── index.js                 Self-hosted production server (static dist/ + API)
│   ├── sitesApi.js              Publishing API handler, shared by dev, self-hosted and Vercel
│   └── siteStores.js            Storage back ends: fileStore (JSON on disk) / redisStore (Upstash REST)
├── public/                      Static files copied as-is (favicon)
├── .synapse-data/sites/         Local published sites, one <slug>.json each (git-ignored)
├── index.html                   SPA shell
├── vite.config.js               React plugin + mounts the API as dev/preview middleware
├── vercel.json                  Rewrites, SPA fallback, asset caching
├── tailwind.config.js           Editor colour palette (`ed-*`), glow shadow, Inter font
└── src/
    ├── main.jsx                 React entry point
    ├── app/                     Route-level pages
    ├── store/                   Zustand editor store (all project state + actions)
    ├── registry/                Section registry and shared inspector field definitions
    ├── renderer/                Renders a section node (wrapper, motifs, hero runtime)
    ├── library/                 Every section design: heroes, navbars, body sections, footers, motifs
    ├── components/              Editor UI (canvas, panels, studios, inspector controls, wizard)
    ├── animations/              Animation presets and the Framer Motion engine
    ├── audio/                   Generative soundscape engine and the visitor sound toggle
    ├── data/                    Static data: layout presets, themes, moods, portfolio copy
    ├── utils/                   Pure helpers: tokens, links, layout grid, colours, fonts, publish client…
    └── styles/index.css         Global CSS: editor chrome classes and all site-output CSS
```

### `src/app/` – pages and routing

| File | Purpose |
|---|---|
| `App.jsx` | Wraps the app in `BrowserRouter`. |
| `routes.jsx` | All routes (see the table in section 1). Unknown paths redirect to `/`. |
| `Landing.jsx` | Public landing page with the stitched wordmark. |
| `Dashboard.jsx` | Project start screen and current-project card. |
| `Editor.jsx` | Redirects to `/new` if there is no page yet; otherwise renders `EditorLayout`. |
| `PreviewRoute.jsx` | Renders the draft from the store. |
| `PublishedSiteRoute.jsx` | Fetches a published snapshot from the API; handles loading, 404 and page-not-found. |
| `SiteRenderer.jsx` | Shared renderer for preview and published sites: provides the link context, scroll container, `#anchor` scrolling, back/forward handling and the document title. |

### `src/store/editorStore.js` – the single source of state

One Zustand store, wrapped in `immer` (for mutable-style updates) and `persist` (saves to `localStorage`). It holds:

- **Project data** (persisted): `page` (the page being edited), `pages` (the site's other pages), `linkSettings`, `customThemes`, `published` (slug, token, version of the live site), the wizard `draft`, and some view preferences.
- **Editor UI state** (mostly not persisted): selection, active panel, viewport, zoom, edit/preview mode, open studios and dialogs, drag state, animation replay keys, undo/redo stacks.
- **Actions** grouped as wizard, page, sections, theme, links, pages, history and UI. See [8.1](#81-state-and-undo).

### `src/registry/`

| File | Purpose |
|---|---|
| `heroRegistry.js` | **The source of truth for every section type.** It maps a type id to its definition (navbars, heroes, body sections, footers) and lazy-loads components so a published page only downloads the sections it uses. It also exports `getHero`/`getSection`, `listHeroes`, `listLibrary` (one card per body-section variation) and the category lists. |
| `fieldGroups.js` | Reusable inspector field groups (typography, colour roles, placement, buttons, text, float motion, hide-per-breakpoint). |

### `src/renderer/`

| File | Purpose |
|---|---|
| `SectionRenderer.jsx` | Outer wrapper for every section: anchor `id`, full-bleed vs contained width, navbar sticky/fixed/overlay positioning, per-section theme lock (CSS vars), motif layers (back, front, seams between sections), cursor CSS vars for parallax motifs, and the editor height-resize bar. |
| `HeroRenderer.jsx` | Resolves the definition, picks the breakpoint (taking the region width into account), and renders the lazy component inside `HeroHost` with a `Suspense` placeholder. |

### `src/library/` – the section designs

```
library/
├── heroes/                     6 "signature" heroes, each in its own folder
│   ├── TypographyExplosion/    Brutalist oversized type, mask reveals, letter displacement
│   ├── FloatingUniverse/       Floating spheres, rings and sculptures with depth parallax
│   ├── FloatingDashboard/      Perspective product dashboard and floating UI cards (DashboardMock.jsx)
│   ├── CinematicReveal/        Editorial image grid that wipes, zooms and assembles
│   ├── LiquidChrome/           Morphing liquid-metal sculpture that follows the cursor
│   ├── Spotlight/              Theme-native hero built only from tokens (used by the portfolio starter)
│   └── shared/                 defaults.js (el() helper), spatial.js/.jsx (3D/parallax helpers),
│                               themeMap.js (how each hero adopts a theme: "accent" or "full")
├── navbars/
│   ├── index.js                6 designs as data: Minimal, SaaS (mega menu), Luxury, E-commerce, Transparent, Centered
│   ├── fields.js               Element builders (logo, link, icon, search, buttons) + inspector schemas
│   └── Navbar.jsx              One configurable component that renders every navbar design
├── sections/                   12 body sections, each folder = definition.js (data) + Component.jsx
│   ├── Features, About, Services, Stats, Logos, Testimonials,
│   ├── Team, Portfolio, Pricing, FAQ, CTA, Contact
│   ├── index.js                BODY_SECTIONS list (definition + lazy component)
│   └── shared/                 kit.js (data builders and field groups), Shell.jsx (shared renderers:
│                               section shell, header, buttons, media, cards), style.js, icons.jsx
├── footers/
│   ├── index.js                5 designs: Minimal, Multi-column, SaaS (newsletter), E-commerce (payments), Creative
│   └── Footer.jsx              One configurable component; newsletter form posts to a configurable endpoint
└── motifs/                     The mood layer's decorative artwork
    ├── catalog.js              Motif library (data): Nature, Objects, Celestial, Abstract, Music & nostalgia
    ├── Motifs.jsx              SVG artwork + animation for each motif, MotifLayer renderer
    ├── experience.js           Experience schema, defaults, resolver, which motifs go on which section
    └── MotifContext.jsx        React contexts for the page experience and per-section motifs
```

### `src/components/` – editor UI

| Folder | Contents |
|---|---|
| `editor/` | `EditorLayout` (shell + Ctrl+Z shortcuts), `TopToolbar` (dashboard, undo/redo, pages menu, project type, Theme Studio, Preview, open preview tab, live-link chip, Publish), `BottomToolbar` (viewport, zoom, timeline toggle), `LeftSidebar` (Layers / Section library / Theme / Links tabs), `RightInspector`, `PagesMenu`, `LinksPanel`, `ThemePanel`, `PublishDialog`, `DeleteGuard` |
| `editor/Canvas/` | `Canvas` (zoom, preview-mode link behaviour, link-picker mode), `PageContainer` (**renders a whole page; shared by editor, preview and published sites**), `EditorSections` (editor-only region with drag & drop and section toolbars, code-split away from published pages), `GridOverlay`, `Frame` |
| `editor/inspector/` | `PageSettingsInspector` (layout and responsive grid), `StoreHeroInspector` (connects the selected section to `HeroInspector` through the store; also edits section name and anchor) |
| `hero-studio/` | `SectionLibrary` (searchable, categorised cards), `HeroThumbnail` (live, scaled render of a section; plays its animation on hover), `HeroStudio` (customise-before-adding modal), `HeroInspector` (Design / Animations tabs, variation picker, property controls) |
| `hero-studio/runtime/` | The runtime every section component uses: `HeroRuntime` (`HeroHost`, `HeroElement`, `useHeroRuntime`, `useMouseVars`), `HeroText`, `HeroButton`, `EditableText` (double-click editing), `ResizeHandles`, `links.js` (`LinkContext`, `useLinkProps`, `scrollToAnchor`), `heroContext.js` |
| `animation-studio/` | `AnimationInspector` (preset and parameters per element), `AnimationTimeline` (tracks, drag timing, reordering), `TimeLineDock` (timeline docked under the canvas) |
| `theme-studio/` | `ThemeStudio` (modal: Explore, Colors, Typography, Components, Effects, Custom; apply scope and hero level), `MoodStudio` (mood tabs: Explore Moods, Visual Identity, Motifs & Objects, Motion, Sound & Music, Typography, Materials, Custom), `ThemeCard`, `ThemePreview` (live miniature using the real renderer) |
| `inspector/` | `PropertyControls` (generic field renderer: text, range, select, segmented, colour with token linking, font, image upload, link, nested lists), `LinkControl` (universal link editor + "choose on canvas") |
| `layout-selection/` | The `/new` wizard: `LayoutSelectionPage`, `ConfigureLayoutPage`, `LayoutConfiguration`, `LayoutCard`, `LayoutPreview`, `AdvancedSettings`, `WizardHeader` |
| `landing/` | `StitchedWordmark` (needle-and-thread animation) and `synapsePath.js` (generated cursive stroke data) |
| `ui/` | Small primitives: `IconButton`, `Pill`, `Tag`, `Segmented`, `Collapsible`, `Choice`, `Logo` |

### `src/animations/`

| File | Purpose |
|---|---|
| `presets/index.js` | Animation preset catalogue (`PRESETS`): 23 entrance, 5 exit, 11 emphasis, 6 hover and 5 scroll presets. Each declares its controls, defaults and a `from()` state. `buildPlan()` turns an element's animation config into Framer Motion props. |
| `engine/AnimatedElement.jsx` | Runs a plan: static, auto (page-load / after-delay / viewport), hover and scroll-linked variants; handles split text. |
| `engine/TextContent.jsx` | Splits text into words or characters for staggered reveals. |
| `engine/ScrollContainerContext.js` | The scrolling element (the canvas or the site root) for viewport and scroll triggers. |

### `src/audio/`

| File | Purpose |
|---|---|
| `soundscapes.js` | 12 original **generative** soundscapes defined as small recipes (scale, chords, pad, arpeggio, bass, kick, noise, birds) and synthesised live with the Web Audio API. No recordings are bundled, so nothing needs licensing. Exposes a tiny play/stop/subscribe engine. |
| `SoundControl.jsx` | Visitor-facing play/volume toggle on published pages. Sound is always off until the visitor presses play. Volume is remembered in `localStorage`. Also supports a user-uploaded audio file. |

### `src/data/`

| File | Purpose |
|---|---|
| `layoutPresets.js` | Viewport widths, the 6 layout presets, the default wizard draft and option lists. |
| `themes.js` | 20 theme presets built with `buildTheme()` and the theme filter tags. Music themes include a mood experience. |
| `moods.js` | Mood/experience packages (motifs, materials, styles, motion, recommended sounds) for the music-inspired themes. These are original interpretations: no artwork, logos or recordings. |
| `portfolio.js` | Portfolio mode: site types, default owner, app wording (`siteWords`), portfolio category labels, per-section portfolio copy (`applyPortfolioCopy`) and the `PORTFOLIO_STARTER` section list. |

### `src/utils/`

| File | Purpose |
|---|---|
| `tokens.js` | Design system: `buildTheme`, `DEFAULT_THEME`, `resolveTheme`, `themeCssVars` (theme → `--syn-*` CSS vars), `css()` (resolves `"$token"` strings), `isToken`. |
| `links.js` | Smart-link model, `resolveHref`, `siteSummary`, `pageUrl`, `slugify`, `anchorOf`, `walkLinks`, validators, label-to-section matching. |
| `layoutUtils.js` | Wizard draft → page JSON, grid maths per viewport, page CSS vars, composition regions (standard, split, sidebar, editorial, bento), bleed and alternating-background helpers. |
| `heroNode.js` | Creates section nodes from definitions and mutates them in place: props, responsive overrides, elements, animations, variations, theme adoption, reset-to-theme. |
| `heroApi.js` | `makeHeroApi()`: the action object the inspector uses. The same API drives the store (canvas) and local state (Hero Studio). |
| `heroResolve.js` | Breakpoints (`tablet < 1024`, `mobile < 640`), desktop-first prop cascade, `useBreakpoint`, colour-role resolution. |
| `choreography.js` | Applies a choreography (per element type, staggered) to a section's elements. |
| `publish.js` | Browser client for the publishing API: `checkName`, `publishSite`, `fetchSite`, `siteSlug`, `siteUrl`, `isLocalHost`. |
| `imageUpload.js` | Reads an uploaded image, downscales it to at most 1600px and returns a data URL (SVG and GIF are kept as-is). |
| `fonts.js` | The 28 supported Google Fonts, `loadFont` (injects a stylesheet link once per font), `fontStack` (maps `$heading` and similar to CSS vars). |
| `color.js` | Hex parsing, mixing, lighten/darken, luminance, contrast and readable-text helpers. |
| `easings.js` | Easing options and Framer Motion transitions (including spring and custom bezier). |

---

## 6. The data model

Everything a user builds is **plain serialisable JSON**. That one JSON shape is saved to `localStorage`, sent to the server on publish, and rendered back unchanged on the public site.

### Page

```js
{
  id: "page-52c2710a",
  name: "Home",
  slug: "",                 // "" for the home page, otherwise the URL part: /s/<site>/<slug>
  home: true,
  order: 0,
  siteType: "portfolio",    // "portfolio" | "website" (wording and starter copy)
  owner: { name, role },    // portfolio owner, woven into the copy
  meta: { title },          // optional page title
  layout: { type: "standard", width: "full", maxWidth: 1280, columns: 12, columnGap: 24, sideMargin: 32 },
  responsive: {
    desktop: { columns: 12, sideMargin: 32 },
    tablet:  { columns: 8,  sideMargin: 24 },
    mobile:  { columns: 4,  sideMargin: 16 },
  },
  theme: { /* full theme: colors, typography, buttons, cards, forms, nav, sections, footer, effects, experience? */ },
  sections: [ /* section nodes, top to bottom */ ],
}
```

The theme is **site-wide**: theme actions write the same theme to every page.

### Section node

```js
{
  id: "section-9d7715",     // stable; links reference this and it never changes
  kind: "nav" | "hero" | "body" | "footer",
  type: "nav-luxury",       // registry id
  name: "About",            // editable, shown in pickers
  anchor: "about",          // editable URL fragment (#about)
  region: "main",           // which composition region it sits in
  variation: "image-left",  // current design variation (body sections)
  props: { ... },           // section-level props (desktop values)
  responsive: { tablet: {...}, mobile: {...} },   // per-device overrides
  elements: [
    { id: "heading", type: "heading", label: "Heading", visible: true,
      props: { text, fontSize: "$h2", color: "$headingText", ... },
      responsive: { tablet: {...}, mobile: {...} },
      animation: { preset: "slide-up", trigger: "page-load", duration: 0.8, delay: 0.1, easing: "expo-out", ... } },
  ],
  animationSettings: { choreography: "rise" },
  themeLock: { /* optional theme snapshot: this section ignores later site-theme changes */ },
  hideMotifs: true,         // optional: this section shows no mood motifs
}
```

### Important rules

- **Responsive cascade:** desktop is the base; tablet overrides apply on tablet and mobile; mobile overrides apply on mobile only (`resolveProps` in `utils/heroResolve.js`).
- **Theme tokens:** a prop value like `"$primary"`, `"$heading"`, `"$h2"` or `"$radius"` is *linked* to the theme. A concrete value is an override that survives theme changes until the user runs "reset to theme defaults".
- **Links:** link props (`href`, `ctaHref`, `promoHref`, `url`, `link`) hold either a legacy string or an object such as `{ type: "section", sectionId, pageId? }`, `{ type: "page", pageId }`, `{ type: "external", url, newTab }`, `{ type: "email" }`, `{ type: "phone" }`, `{ type: "file" }`, `{ type: "custom" }` or `{ type: "none" }`. They resolve to an href only at render time.
- **Uploads** (images, audio) are stored inline as data URLs, which is why publish payloads can be large.

### Published site record (server side)

```js
{ slug, name, pages: [...], linkSettings, version, createdAt, publishedAt, tokenHash }
```

`tokenHash` is never returned by `GET`.

---

## 7. Architecture overview

```
                ┌──────────────────────── Browser (React SPA) ────────────────────────┐
                │                                                                     │
 Wizard (/new) ─┼─► editorStore (Zustand + immer + persist → localStorage)            │
                │        │  page, pages, theme, linkSettings, published, undo/redo    │
                │        ▼                                                            │
 Editor ────────┼─► Canvas → PageContainer → SectionRenderer → HeroRenderer           │
 Preview ───────┼─► SiteRenderer → PageContainer → …   (same renderer, editor=false)  │
 /s/:site ──────┼─► fetchSite() → SiteRenderer → PageContainer → …                    │
                │                           ▲                                         │
                │        heroRegistry ──────┘ (definition + lazy component per type)  │
                └──────────────┬──────────────────────────────────────────────────────┘
                               │  PUT /api/sites/:slug  ·  GET /api/sites/:slug(/available)
                ┌──────────────▼──────────────┐
                │ server/sitesApi.js          │  mounted by: Vite middleware (dev/preview),
                │   createSitesApi({ store }) │              server/index.js (self-host),
                └──────────────┬──────────────┘              api/sites.js (Vercel)
                               ▼
                   fileStore (.synapse-data/sites/*.json)  or  redisStore (Upstash REST)
```

The key design decision is **one renderer for everything**. The editor canvas, Hero Studio, library thumbnails, Theme Studio preview, `/preview` and the published site all go through `PageContainer` / `SectionRenderer` / `HeroRenderer`. The `editor` and `viewport` props switch editor-only behaviour on or off:

- `viewport` set (editor): the device width is simulated and breakpoint values are applied inline.
- `viewport` null (live): the real browser width decides, through CSS media queries and ResizeObserver.
- Editor-only code (`EditorSections`, drag and drop, toolbars) is code-split, so published sites never download it.

---

## 8. Core systems in depth

### 8.1 State and undo

- Every page edit goes through the store's internal `mutatePage(fn, coalesceKey)`. It pushes the previous `page` onto `past` (up to 80 steps) and clears `future`. Edits with the same `coalesceKey` within 1 second merge into one undo step; this is how dragging a slider produces a single undo.
- Undo/redo covers the **current page only**. Switching pages clears history.
- Page switching swaps `page` with an entry in `pages`, so `page` is always the page being edited. `allPages()` returns every page in order, with the home page first.
- `partialize` limits what is saved to `localStorage`: project data plus a few view settings. UI state such as selection and open dialogs is not saved.

### 8.2 Section registry and definitions

Every section type is a **definition object** (data) plus a **component** (renderer). A definition contains:

| Field | Meaning |
|---|---|
| `id`, `name`, `description`, `tags`, `library` | Identity and library placement |
| `kind` | `"nav"`, `"hero"`, `"body"` or `"footer"` (set by the helper that builds it) |
| `defaults` | `{ props, responsive, elements }` used to create a new node |
| `variations` | Design variants: style-only patches `{ props, byType, byId }`. Patches can carry `$ifEmpty` (never overwrite user values) and `$soft` (replace placeholder copy only) |
| `editableProperties` | Inspector fields for the section |
| `elementSchemas` | Inspector fields per element type |
| `elementTemplates` | Element types the user can add (for example another fact, card or plan) |
| `choreographies` | Named animation sets, applied per element type with automatic staggering |

`createHeroNode(type, variation)` deep-clones the defaults, gives the node a new id and applies the chosen (or first) variation. Body sections, navbars and footers use `defineSection` / `defineNavbar` from `library/sections/shared/kit.js` and `library/navbars/fields.js`. A single component renders all designs of its kind; the designs differ only in data.

**Signature heroes vs token-native sections:** the five older heroes use raw colour props, and `HeroHost` converts `$tokens` into `var(--syn-…)` for them. Body sections, navbars, footers and Spotlight are *token-native* and resolve tokens themselves. The theme studio's `heroLevel` option (`none`, `accent` or `full`, see `library/heroes/shared/themeMap.js`) controls how much a signature hero adopts the site theme.

### 8.3 Hero runtime

Section components don't read the store. They use the runtime from `components/hero-studio/runtime/`:

- `HeroHost` supplies the node, the resolved breakpoint, editor flags and callbacks through context.
- `HeroElement id="…"` renders one element with positioning, selection chrome, resize handles, animation (through `AnimatedElement`) and double-click editing.
- `HeroText` and `HeroButton` are ready-made elements; `EditableText` handles inline editing of any string prop.
- `useLinkProps()` turns any link value into `{ href, target, rel, onClick }`. In the editor, links are inert in edit mode and work for real in preview mode.

### 8.4 Layout and grid

- The wizard produces `layout` + `responsive`. `getGridForViewport` is the single source of grid numbers for the canvas, overlay and preview.
- **Width**: `full` (content spans the page and full-span sections bleed edge to edge), `boxed` (max-width container) or `narrow` (at most 720px).
- **Composition** defines regions on a 12-column basis, scaled to the actual column count: `standard` (main), `split` (content + media), `sidebar` (side + main), `editorial` (centred article), `bento` (feature/tiles grid). On mobile, regions stack.
- Published pages get generated media-query CSS so regions are placed correctly at each breakpoint (`liveRegionCss` in `PageContainer.jsx`).

### 8.5 Theme system (design tokens)

- `buildTheme(spec)` takes a compact spec and derives a complete token set (colours, hover states, surfaces, borders, readable button text, typography scale, buttons, cards, forms, nav, sections, footer, effects).
- `themeCssVars(theme)` exposes the tokens as `--syn-*` CSS variables on the page root. Sections reference those variables, so changing a token re-themes the whole site without touching section data.
- **Theme Studio apply scopes**: `site` (everything follows, except locked sections), `sections` (only chosen sections, each locked to a snapshot), `new` (existing sections are locked to today's look, and only new sections pick up the theme).
- Custom themes are stored in `customThemes` and can be reused across projects in the same browser.

### 8.6 Mood / experience layer

An optional `theme.experience` object adds atmosphere. It is plain data, interpreted at render time:

- **Motifs**: SVG artwork instances with placement (`hero`, `sections`, `between` = seams between sections, `footer`…), layer (back or front), position, size, rotation, opacity, animation, cursor hover (`parallax`, `follow`, `tilt`) and per-device visibility. `motifsForSection()` decides which motifs each section shows.
- **Materials and styles**: card material (paper, polaroid, metal, scales, glass), nav, headline, image and CTA styles. These are applied as `data-*` attributes on the page root and styled in `styles/index.css`.
- **Motion**: intensity, section reveal transition on published pages (fade, rise, blur, curtain, through IntersectionObserver), card and image hovers, and an entrance choreography for new body sections.
- **Sound**: a soundscape id or an uploaded file, volume, loop, fades and optional interaction sound effects. Playback never starts automatically.

### 8.7 Links and multi-page sites

- Links reference sections **by id**. The visible anchor is looked up at render time, so renaming a section or changing its anchor never breaks links.
- `autoConnectLinks()` connects unconnected links whose label matches a section name ("About" → About section). It runs once when a portfolio is created.
- Deleting a referenced section opens `DeleteGuard`, which offers to redirect the links, unlink them, or cancel.
- URLs: in preview, the home page is `/preview` and other pages are `/preview/<slug>`. On a published site, the home page is `/s/<site>` and other pages are `/s/<site>/<slug>`, with `#anchor` for sections. `SiteRenderer` scrolls to the anchor, offset by the height of a sticky navbar.

### 8.8 Publishing flow

1. **Publish** opens `PublishDialog`. The site name defaults to the owner's name, and the address is derived from it with `siteSlug`.
2. While the user types, the address is checked (debounced) with `GET /api/sites/:slug/available`.
3. On publish, the client sends `PUT /api/sites/:slug` with `{ name, pages: allPages(), linkSettings }`.
4. On the first publish the server claims the slug and returns a **secret token**. Only its SHA-256 hash is stored. The client saves `{ slug, token, version, … }` in `published`, which is persisted in `localStorage`.
5. Later publishes send the token and replace the snapshot (version + 1). Without the right token, the request returns 409 "That name is already taken."
6. A published site is an **immutable snapshot**: later edits stay private until the user publishes again.

> The token lives only in the browser that first published the site. If `localStorage` is cleared, that site can no longer be updated from the UI. There is currently no recovery flow.

### 8.9 Animations

- Each element can have an `animation` config: `preset`, `trigger` (`page-load`, `after-delay`, `viewport`, `hover`, `scroll`), duration, delay, easing, and preset-specific parameters (distance, scale, blur, direction, split/stagger for text…).
- `buildPlan()` in `animations/presets/index.js` turns that config into Framer Motion `initial`/`animate`/`transition` values. `AnimatedElement` runs it.
- The timeline (`AnimationTimeline`) shows the auto-playing tracks of a section on a time axis. Dragging a track changes its delay, and reordering swaps start times.
- The editor can replay a whole section (`replaySection`) or a single element with its delay ignored (`previewElement`).

### 8.10 Forms

- **Contact** section: validates input, then POSTs `FormData` to the configured `endpoint` (Formspree-style). If no endpoint is set, it opens a `mailto:` to the fallback `recipient`.
- **Footer newsletter**: POSTs to its `endpoint`, and only reports success when the endpoint accepts the request.
- Synapse has no backend of its own for form submissions.

---

## 9. Publishing API reference

Implemented in `server/sitesApi.js`, with the same behaviour in all three hosts.

| Method & path | Description | Responses |
|---|---|---|
| `GET /api/sites/:slug` | Fetch a published snapshot (public) | `200` site · `404` not found · `400` invalid slug |
| `GET /api/sites/:slug/available?token=…` | Check whether an address is free (or already yours) | `200 { available, mine, reason? }` |
| `PUT /api/sites/:slug` | Publish or update. Body: `{ name, pages, linkSettings, token? }` | `201` first publish (returns `token`) · `200` update · `400` no pages / invalid · `409` taken / wrong token · `413` too large |

Slug rules: 3–48 characters, lowercase letters, digits and dashes, and it must not start or end with a dash. Reserved names: `api, admin, assets, editor, preview, new, s, www, app, static, synapse`.

Storage interface (`server/siteStores.js`): `{ kind, get(slug) → site | null, put(slug, site) }`. The file store writes to a temporary file and then renames it, so a reader never sees a half-written file. The Redis store uses keys of the form `synapse:site:<slug>`.

---

## 10. How to extend Synapse

### Add a body-section design variation

Add an entry to `variations` in `src/library/sections/<Name>/definition.js`. It appears automatically as a new library card. If the variation needs new layout behaviour, handle its `variant` prop in the component.

### Add a new body section

1. Create `src/library/sections/MySection/definition.js` using `defineSection` and the builders in `shared/kit.js` (`header`, `textEl`, `btnEl`, `mediaEl`, `shellDefaults`, `shellFields`…).
2. Create `MySection.jsx` using the runtime (`HeroElement`, `HeroText`, `HeroButton`) and the shared renderers in `shared/Shell.jsx`.
3. Register it in `src/library/sections/index.js` with `lazy(() => import(...))`.
4. If it uses a new `library` category, add it to `LIBRARY_CATEGORIES` in `registry/heroRegistry.js` and to `PORTFOLIO_CATEGORY_LABELS` in `data/portfolio.js`.
5. Optionally, add portfolio copy for it in `copyFor()` in `data/portfolio.js`.

### Add a signature hero

Create a folder under `src/library/heroes/`, register it in `heroRegistry` with the `hero(def, load)` helper, and add a theme map entry in `heroes/shared/themeMap.js` so Theme Studio can restyle it.

### Add a navbar or footer design

Add a `defineNavbar({...})` to `library/navbars/index.js`, or a footer entry to `library/footers/index.js`, and include it in the exported list. If the design needs a new arrangement or layout, extend `Navbar.jsx` or `Footer.jsx`.

### Add a theme preset

Add a `pro({...})` (or `music(...)`) spec to `THEME_PRESETS` in `src/data/themes.js`. Missing tokens are derived automatically.

### Add an animation preset

Call `add({ id, label, kind, controls, defaults, from })` in `src/animations/presets/index.js`.

### Add a motif, soundscape or font

- Motif: data in `library/motifs/catalog.js`, artwork in `Motifs.jsx`.
- Soundscape: a recipe in `audio/soundscapes.js`.
- Font: an entry in `FONTS` in `utils/fonts.js`, with `axis: null` for static fonts or Google returns a 400.

### Add a new inspector field type

Handle it in `Control` in `components/inspector/PropertyControls.jsx`.

### Change the persisted state shape

The store is persisted under `synapse:editor:v1` with no migration function. For a breaking change, either add `version` + `migrate` to the `persist` options in `editorStore.js` or rename the key. Remember that already-published snapshots on the server keep the old shape, so renderers must stay backward compatible (for example, link props still accept legacy strings).

---

## 11. Conventions

- **Data, not code:** section designs, variations, themes, moods, motifs and soundscapes are plain serialisable objects. Functions never go into anything that is saved or published.
- **Mutate inside immer:** helpers in `utils/heroNode.js` mutate the node they receive and return nothing. Call them inside store `set`/`mutatePage` or `immer.produce`.
- **Stable ids:** section ids never change. Names and anchors are for display only.
- **Lazy components:** section components are always `lazy()` imports, so published sites stay small.
- **Editor styling:** editor chrome uses Tailwind with the `ed-*` palette and helper classes (`panel`, `field`, `label`) in `styles/index.css`. Site output uses CSS variables and inline styles, never editor Tailwind colours.
- **Comments:** most files start with a short block comment explaining their role. Read it first.
- Run `npm run lint` before committing.

---

## 12. Known gaps, placeholders and leftovers

Things a new developer should know are unfinished or unused:

- **No accounts or cloud save:** one project per browser, stored in `localStorage`. Starting a new project from the wizard **replaces** the current one (`createPage` resets `page` and `pages`) without asking.
- **Publish token recovery:** see [8.8](#88-publishing-flow). If the token is lost, the site can't be updated or deleted from the UI. There is no delete endpoint at all.
- **Placeholder UI:** the left-sidebar **Assets** and **Components** tabs show "arrives in a later module", and the top-bar **AI** button and the **Tools** pill do nothing. The **Saved** badge is static; saving is automatic through `persist`.
- **Large payloads:** uploads are inline data URLs. Images are downscaled to 1600px, but audio uploads aren't compressed, so sites can hit the 4 MB (Vercel) or 25 MB (self-hosted) limit.
- **No tests** and no CI configuration.
- **Unused files and dependencies:** `src/App.css`, `src/assets/` (`hero.png`, `react.svg`, `vite.svg`) and `public/icons.svg` are Vite template leftovers and are not imported anywhere. `@dnd-kit/*` is installed, but the canvas uses native HTML5 drag and drop.
- **Sample data:** `.synapse-data/sites/` contains a few locally published test sites (`alex-morgan`, `maureen-miranda`, `siddhesh`, `test1`). They are git-ignored and safe to delete.
- **Content licensing:** placeholder images are hot-linked from Unsplash. The music-inspired themes are original mood interpretations; keep them free of real artwork, logos, lyrics and recordings.
