# Frontend Quality

lifetracker keeps SEO, accessibility, localization, theming, and web-vitals
requirements close to the app code so the React surface stays production-ready
instead of demo-only. The deeper performance and SEO checklist lives in
[PERFORMANCE_AND_SEO.md](PERFORMANCE_AND_SEO.md).

## SEO Contract

- `apps/web/index.html` owns the public product metadata: descriptive title, meta description,
  canonical URL, robots directive, Open Graph, Twitter card, theme color, manifest, and JSON-LD
  `WebApplication` data.
- `apps/ui-showcase/index.html` owns the same metadata pattern for the React UI Kit showcase.
- `apps/*/public/site.webmanifest`, `robots.txt`, `sitemap.xml`, `favicon.svg`,
  and `og-image.svg` are copied by Vite into the built container images.
- `apps/web/public/docs/*.md` exposes human-readable Markdown docs from the web
  container and is included in the sitemap.
- The current canonical host is `https://lifetracker.dev/`. Replace it in HTML, robots, and
  sitemap files if production uses a different domain.

## Accessibility Contract

- The app provides a skip link, semantic `main`, labelled sections, labelled navigation, and
  form labels connected to inputs.
- Language and theme controls are keyboard-accessible, expose pressed state, and persist choices in
  `localStorage`.
- Auth errors use `role="alert"` and loading states use `role="status"` with polite live regions.
- Chart containers expose text alternatives through `role="img"` and generated summaries.
- Toggle-like controls expose `aria-pressed`; decorative icons are marked with `aria-hidden`.
- Shared UI Kit controls provide visible keyboard focus states and respect
  `prefers-reduced-motion`.

## Localization And Theme Contract

- The web app supports `en`, `ru`, `es`, `de`, `fr`, and `sr` through
  `apps/web/src/i18n.ts`; add new UI strings there first instead of hardcoding
  display text in React components.
- The first visit uses browser language detection through `navigator.languages`
  and falls back to English.
- User language is saved as `lifetracker.language`; theme is saved as `lifetracker.theme`.
- The selected language updates `document.documentElement.lang`, page title, and meta description at
  runtime.
- The selected theme updates `document.documentElement.dataset.theme`; dark mode is implemented with
  CSS variables shared by the app and `@lifetracker/ui`.
- The UI Kit showcase mirrors the same supported languages and persists
  preferences under `lifetracker.showcase.*`.

## Web Vitals Contract

- Logged-out users should not download dashboard-only dependencies. `Dashboard.tsx` is lazy loaded
  from `App.tsx`, which keeps Recharts and Socket.IO out of the initial auth route bundle.
- Vite still uses explicit manual chunks for charts, icons, TanStack Query, and realtime code so
  browser network output is easy to inspect.
- Nginx serves hashed `/assets/` files with immutable one-year caching and keeps `index.html`
  uncached so SPA deployments can update safely.
- SVG, manifest, robots, and sitemap assets are cached for one hour.
- Public Markdown docs are served with `text/markdown; charset=utf-8` and a
  short cache lifetime.

## Verification

Run the full project gate:

```bash
npm run check
```

With Docker:

```bash
docker compose build web ui-showcase
docker compose up -d web ui-showcase
```

Browser checks:

```bash
C:\Users\senio\.agents\skills\gstack\browse\dist\browse.exe goto http://localhost:3000
C:\Users\senio\.agents\skills\gstack\browse\dist\browse.exe console --errors
C:\Users\senio\.agents\skills\gstack\browse\dist\browse.exe perf
```

Manual i18n/theme checks:

1. Switch the web app to `RU` and confirm auth copy, form labels, dashboard navigation, habit
   controls, challenge labels, and live feed text change language.
2. Repeat the language check for `EN`, `RU`, `ES`, `DE`, `FR`, and `SR`.
3. Toggle dark mode and confirm panels, inputs, buttons, charts, and sidebar stay readable.
4. Repeat the same language and dark-mode checks in the UI Kit showcase on `http://localhost:3001`.
5. Open `http://localhost:3000/docs/README.md` and confirm public Markdown docs
   are reachable.
