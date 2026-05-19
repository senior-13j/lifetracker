# lifetracker Performance And SEO

lifetracker ships SEO files, public Markdown docs, accessibility patterns, and
web-vitals-oriented frontend structure.

## SEO Files

| File                | Purpose                                                              |
| ------------------- | -------------------------------------------------------------------- |
| `/index.html`       | Title, description, canonical URL, Open Graph, Twitter card, JSON-LD |
| `/robots.txt`       | Crawl rules and sitemap location                                     |
| `/sitemap.xml`      | App and public docs URLs                                             |
| `/site.webmanifest` | Installable web app metadata                                         |
| `/og-image.svg`     | Social preview image                                                 |
| `/docs/*.md`        | Public human-readable Markdown docs                                  |

Before production, replace `https://lifetracker.dev/` if the real host is
different.

## Web Vitals

- The dashboard is lazy loaded so logged-out users avoid chart and realtime
  bundles.
- Hashed `/assets/*` files are cached for one year.
- `index.html` is not cached so deployments can update safely.
- Static SEO files and Markdown docs use short cache lifetimes.
- Layouts reserve stable space for sidebar, cards, charts, and controls.
- Text is tested across six supported languages.

## Accessibility

- Skip link to main content.
- Semantic `main`, navigation, sections, forms, and chart regions.
- Visible focus states.
- Keyboard-accessible language and theme controls.
- Localized `role="alert"` errors.
- Loading states with `role="status"`.
- Decorative icons hidden from assistive technology.

## Local Checks

```bash
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/site.webmanifest
curl http://localhost:3000/docs/performance-and-seo.md
```

Use browser QA to confirm console, layout, and performance:

```bash
C:\Users\senio\.agents\skills\gstack\browse\dist\browse.exe goto http://localhost:3000
C:\Users\senio\.agents\skills\gstack\browse\dist\browse.exe console --errors
C:\Users\senio\.agents\skills\gstack\browse\dist\browse.exe perf
```
