# lifetracker Developer Guide

lifetracker is a workspace-based React and Node.js application.

## Main Paths

| Path                      | Purpose                               |
| ------------------------- | ------------------------------------- |
| `apps/web`                | Main React app                        |
| `apps/ui-showcase`        | React UI Kit showcase                 |
| `apps/api-gateway`        | Public API gateway                    |
| `apps/auth-service`       | Auth service                          |
| `apps/habit-service`      | Habit service                         |
| `apps/realtime-service`   | Socket.IO realtime service            |
| `apps/analytics-worker`   | Kafka analytics worker                |
| `packages/ui`             | Shared React UI Kit                   |
| `packages/shared`         | Shared schemas, DTOs, event contracts |
| `packages/database`       | Mongoose models                       |
| `packages/backend-common` | Backend helpers                       |

## Quality Gate

```bash
npm run check
```

Docker form:

```bash
docker run --rm -v "${PWD}:/app" -w /app node:24-alpine npm run check
```

## Frontend Rules

- Use React only.
- Keep reusable UI in `packages/ui`.
- Keep product screens in `apps/web`.
- Add translations through `apps/web/src/i18n.ts`.
- Keep dashboard-only dependencies lazy loaded.
- Preserve accessible labels, focus states, and friendly localized errors.

## Public Docs

Public Markdown docs live in:

```text
apps/web/public/docs
```

They are served by the web app under:

```text
/docs/*.md
```

When features, ports, runtime names, SEO behavior, or deployment behavior change,
update the repository docs and the public Markdown docs together.
