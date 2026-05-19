# Developer Guide

This guide is for engineers working inside the lifetracker repository.

## Prerequisites

- Node.js `>=22`
- npm `>=10`
- Docker Desktop or compatible Docker Compose runtime

On this machine, Docker is the preferred workflow because it provides the
runtime services and reproducible Node environment.

## Install And Check

```bash
npm ci
npm run check
npm run build
```

Docker equivalent:

```bash
docker run --rm -v "${PWD}:/app" -w /app node:24-alpine npm run check
```

## Workspace Structure

| Path                        | Role                                       |
| --------------------------- | ------------------------------------------ |
| `apps/web`                  | Main React app                             |
| `apps/ui-showcase`          | React UI Kit showcase                      |
| `apps/api-gateway`          | Public API gateway                         |
| `apps/auth-service`         | Auth domain service                        |
| `apps/habit-service`        | Habit and challenge domain service         |
| `apps/realtime-service`     | Socket.IO and Kafka realtime fanout        |
| `apps/analytics-worker`     | Kafka event projection worker              |
| `apps/lambda-daily-summary` | AWS Lambda event-source handler            |
| `apps/seed`                 | Demo data seeding tool                     |
| `packages/ui`               | React-only component library               |
| `packages/shared`           | Zod schemas, DTOs, event contracts         |
| `packages/database`         | Mongoose models and connection helpers     |
| `packages/backend-common`   | JWT, Kafka, Redis, errors, service helpers |

## Package Boundaries

- UI components belong in `packages/ui`.
- Product screens belong in `apps/web`.
- DTOs, events, and schemas belong in `packages/shared`.
- Backend service helpers belong in `packages/backend-common`.
- Database models belong in `packages/database`.
- Services should depend on shared packages, not on each other.
- Frontend code should call the API gateway, not individual backend services.

## Frontend Rules

- The frontend is React-only.
- Do not add Vue packages, Vue files, or Vue build plugins.
- Add shared reusable controls to `packages/ui`.
- Keep product-specific composition in `apps/web`.
- Add translations to `apps/web/src/i18n.ts`.
- Keep user-facing errors friendly and localized.
- Preserve keyboard access, visible focus states, and ARIA labels.
- Keep dashboard-only dependencies behind the lazy-loaded dashboard route.

## UI Kit And Showcase

The UI Kit lives in:

```text
packages/ui
```

The showcase app lives in:

```text
apps/ui-showcase
```

Run it with Docker Compose:

```bash
docker compose up -d ui-showcase
```

Open:

```text
http://localhost:3001
```

Use the showcase to verify shared component states, hover behavior, focus
states, language controls, and dark theme.

## Backend Development

All public HTTP calls enter through the API gateway:

```text
http://localhost:4000/api
```

Important service ports:

| Service            | Internal port |
| ------------------ | ------------- |
| `api-gateway`      | `4000`        |
| `auth-service`     | `4001`        |
| `habit-service`    | `4002`        |
| `realtime-service` | `4003`        |

Domain events are published to:

```text
life.events
```

When adding a new event:

1. Add or update the schema in `packages/shared`.
2. Publish from the owning domain service.
3. Update realtime formatting if users should see it.
4. Update analytics projections if the event affects stats.
5. Update docs and tests.

## Documentation Workflow

Repo documentation lives in `docs/*.md`. Site-readable Markdown lives in:

```text
apps/web/public/docs
```

When a feature changes, update both the canonical repo guide and the public
Markdown version if the change affects users, admins, developers, deployment,
performance, or SEO.

Public Markdown docs are served by the web container at:

```text
http://localhost:3000/docs/README.md
```

## Verification Checklist

Before handing off a change:

```bash
npm run check
docker compose --profile tools config
```

For frontend changes:

```bash
docker compose build web ui-showcase
docker compose up -d web ui-showcase
```

Then check:

- no browser console errors;
- desktop and mobile layouts do not overlap;
- all six languages fit;
- light and dark themes are readable;
- auth and dashboard errors are friendly;
- `/robots.txt`, `/sitemap.xml`, and `/docs/*.md` are reachable.

## Useful Docs

- [Architecture](ARCHITECTURE.md)
- [API](API.md)
- [Docker](DOCKER.md)
- [Deployment](DEPLOYMENT.md)
- [Testing](TESTING.md)
- [Frontend Quality](FRONTEND_QUALITY.md)
- [Performance And SEO](PERFORMANCE_AND_SEO.md)
