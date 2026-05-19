# Testing

The project includes focused automated tests where regressions are most likely:

- shared Zod contracts
- JWT and domain event helpers
- habit streak calculation
- Lambda Kafka payload decoding
- database helper behavior
- React UI Kit and showcase type safety
- public Markdown documentation reachability
- SEO/static asset smoke checks

Run:

```bash
npm run check
```

That command runs:

1. `eslint .`
2. `npm run typecheck --workspaces --if-present`
3. `npm run test --workspaces --if-present`

Docker-level checks:

```bash
docker compose config
docker compose --profile tools build
docker compose up -d
docker compose --profile tools run --rm seed
```

Manual QA path:

1. Open `http://localhost:3000`.
2. Log in with `demo@lifetracker.dev / demo1234`.
3. Complete a habit.
4. Confirm the streak changes.
5. Confirm the live feed receives `habit.completed`.
6. Join a challenge and confirm `challenge.joined` appears.
7. Check browser console for errors.
8. Clear local storage and reload the logged-out page. Confirm the landing/auth page does not load
   dashboard-only chart or realtime chunks before login.
9. Inspect the page metadata and confirm title, description, canonical, manifest, robots, and
   structured data are present.
10. Switch language to `RU`, `ES`, `DE`, `FR`, and `SR`, toggle dark mode, log
    in, and confirm dashboard text and controls stay translated and readable.
11. Open public Markdown docs from `/docs/README.md`, `/docs/user-guide.md`,
    `/docs/admin-guide.md`, `/docs/developer-guide.md`, and
    `/docs/performance-and-seo.md`.

UI Kit QA path:

1. Open `http://localhost:3001`.
2. Confirm the React UI Kit showcase renders.
3. Use the segmented control, buttons, and color swatches.
4. Switch every supported language and toggle dark mode.
5. Check browser console for errors.

Accessibility and web vitals checks:

```bash
C:\Users\senio\.agents\skills\gstack\browse\dist\browse.exe goto http://localhost:3000
C:\Users\senio\.agents\skills\gstack\browse\dist\browse.exe console --errors
C:\Users\senio\.agents\skills\gstack\browse\dist\browse.exe perf
```

Static docs and SEO checks:

```bash
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/site.webmanifest
curl http://localhost:3000/docs/README.md
curl http://localhost:3000/docs/user-guide.md
curl http://localhost:3000/docs/admin-guide.md
curl http://localhost:3000/docs/developer-guide.md
curl http://localhost:3000/docs/performance-and-seo.md
```

Expected results:

- every command returns `200`;
- Markdown docs are served as `text/markdown; charset=utf-8` by the web
  container;
- sitemap entries match the public docs that are actually shipped;
- no stale `mern` names appear in Docker resources or docs.
