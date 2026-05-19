# Performance And SEO

This document defines how lifetracker keeps the public web surface searchable,
fast, accessible, and easy to verify.

## Current Contract

| Area             | Implementation                                                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Metadata         | `apps/web/index.html` includes title, description, robots, canonical URL, Open Graph, Twitter card, theme color, and JSON-LD `WebApplication` data. |
| Crawl files      | `apps/web/public/robots.txt` points crawlers to `https://lifetracker.dev/sitemap.xml`.                                                              |
| Sitemap          | `apps/web/public/sitemap.xml` lists the app entry page and public Markdown docs.                                                                    |
| Manifest         | `apps/web/public/site.webmanifest` describes the installable web app shell.                                                                         |
| Social image     | `apps/web/public/og-image.svg` provides the Open Graph/Twitter preview image.                                                                       |
| Public docs      | `apps/web/public/docs/*.md` is served as static Markdown and can be linked from the sitemap.                                                        |
| Runtime metadata | `apps/web/src/App.tsx` updates `document.documentElement.lang`, page title, meta description, and theme color when language or theme changes.       |

## Production SEO Checklist

Before deploying to a real domain:

1. Replace `https://lifetracker.dev/` in `apps/web/index.html`,
   `apps/web/public/robots.txt`, and `apps/web/public/sitemap.xml` if the final
   host is different.
2. Confirm the canonical URL uses HTTPS and has one stable trailing-slash policy.
3. Keep one clear product title and one human-readable meta description.
4. Confirm Open Graph and Twitter image URLs are absolute and publicly reachable.
5. Confirm `robots.txt` is reachable at `/robots.txt`.
6. Confirm `sitemap.xml` is reachable at `/sitemap.xml` and submitted in the
   target search console.
7. Keep public Markdown docs accurate when features, routes, ports, or runtime
   contracts change.

## Web Vitals Strategy

### Largest Contentful Paint

- The logged-out page is the first meaningful surface and should stay visually
  light.
- Dashboard-only code is lazy loaded from `App.tsx`, keeping chart and realtime
  dependencies out of the initial auth bundle.
- SVG assets are small and served from `public`.
- Avoid adding large blocking images or remote fonts to the initial route.

### Interaction To Next Paint

- Forms use native inputs and buttons.
- Mutations are explicit and scoped: login, register, create habit, complete
  habit, join challenge.
- Long-running network states show concise loading text instead of blocking the
  whole UI.
- Hover and active states are CSS-only.

### Cumulative Layout Shift

- Panels, controls, charts, and toolbar elements use stable responsive
  constraints.
- The dashboard layout reserves sidebar and grid space at desktop widths.
- Mobile layout moves navigation and preferences into a stacked flow instead of
  overlaying content.
- Text containers use wrapping and sizing rules to avoid clipping in supported
  languages.

## Bundle And Runtime Rules

- `Dashboard.tsx` is lazy loaded.
- Vite manual chunks keep charts, icons, TanStack Query, and realtime code easy
  to inspect.
- Nginx serves hashed `/assets/` files with immutable one-year caching.
- Nginx keeps `index.html` uncached so deployments can roll forward safely.
- Public crawl files and docs use short-lived caching because they can change
  outside hashed asset names.
- Markdown docs are served with `text/markdown; charset=utf-8`.

## Accessibility Rules

SEO and accessibility are handled together because both need meaningful
structure.

- The app has a skip link and a single semantic `main`.
- Navigation, sections, forms, and chart regions are labelled.
- Errors use `role="alert"` and loading states use `role="status"`.
- Language and theme controls are keyboard accessible and announce state.
- Decorative icons are hidden from assistive technology.
- Charts expose text summaries through ARIA labels.
- `prefers-reduced-motion` is respected by shared UI styles.

## Internationalization Rules

Supported app languages:

- English (`en`)
- Russian (`ru`)
- Spanish (`es`)
- German (`de`)
- French (`fr`)
- Serbian (`sr`)

The app detects `navigator.languages`, falls back to English, and stores the
selection in `localStorage` as `lifetracker.language`. New user-visible strings
should be added through `apps/web/src/i18n.ts` instead of hardcoded inside React
components.

## Verification Commands

Run the automated gate:

```bash
npm run check
```

Build and run the web surface:

```bash
docker compose build web ui-showcase
docker compose up -d web ui-showcase
```

Check static SEO files:

```bash
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/site.webmanifest
curl http://localhost:3000/docs/performance-and-seo.md
```

Use the browser QA tool for runtime checks:

```bash
C:\Users\senio\.agents\skills\gstack\browse\dist\browse.exe goto http://localhost:3000
C:\Users\senio\.agents\skills\gstack\browse\dist\browse.exe console --errors
C:\Users\senio\.agents\skills\gstack\browse\dist\browse.exe perf
```

Manual checks:

1. Open the app logged out and confirm auth content appears without console
   errors.
2. Switch all six languages and confirm text fits on desktop and mobile.
3. Toggle light/dark theme and confirm contrast remains readable.
4. Log in and confirm dashboard panels do not overlap at desktop, tablet, and
   mobile widths.
5. Trigger a bad login and confirm the localized error is understandable.
6. Confirm public Markdown docs open from `/docs/*.md`.

## Known Operational Notes

- The local Docker images may report moderate npm audit findings from current
  ecosystem dependencies. Treat audit output as dependency hygiene work; it does
  not replace the app-level quality gate.
- Search engines will only index useful content after the canonical host is
  replaced with the production domain and public docs are reachable over HTTPS.
