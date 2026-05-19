# Architecture

lifetracker is split into small services so the portfolio shows architecture rather
than a single Express server with many routes.

## Services

| Service                | Responsibility                                                                                                     |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `web`                  | Consumer React application with dashboard, habits, charts, challenges, live feed, SEO files, public Markdown docs. |
| `ui-showcase`          | Standalone React showcase for the shared `@lifetracker/ui` component package.                                      |
| `api-gateway`          | Public HTTP entry point. It proxies `/api/auth`, `/api/habits`, `/api/dashboard`, and `/api/challenges`.           |
| `auth-service`         | Registration, login, JWT issuing, Redis-backed session marker, `user.registered` event.                            |
| `habit-service`        | Habit CRUD, check-ins, dashboard projection, challenge join flow, Redis cache, Kafka events.                       |
| `realtime-service`     | Authenticated Socket.IO connections, Redis presence, Kafka consumer fanout.                                        |
| `analytics-worker`     | Kafka consumer that stores event logs, invalidates cache, updates leaderboards, unlocks achievements.              |
| `lambda-daily-summary` | AWS Lambda handler that consumes Kafka event-source batches.                                                       |

## Local Container Runtime

The local Docker Compose project is named `lifetracker`. Application services are
built into `lifetracker-*:local` images, including `lifetracker-ui-showcase:local`.
MongoDB, Redis, and Kafka use upstream images. Named volumes are used for every
persistent or image-declared data mount so local Docker state remains readable.
See [DOCKER.md](DOCKER.md) for the full image and volume map.

## Data Ownership

MongoDB stores the durable application state:

- users
- habits
- check-ins
- challenges
- event logs
- achievements

Redis stores hot and ephemeral state:

- active session marker
- cached dashboard snapshots
- online presence
- streak leaderboard

Kafka carries domain events:

- `user.registered`
- `habit.created`
- `habit.completed`
- `streak.updated`
- `challenge.joined`
- `achievement.unlocked`
- `reminder.scheduled`

## Event Flow

1. User completes a habit in the React app.
2. The request goes through the API gateway to `habit-service`.
3. `habit-service` writes the check-in to MongoDB.
4. `habit-service` invalidates Redis dashboard cache and publishes `habit.completed`.
5. `analytics-worker` consumes the event, stores it in `event_logs`, updates Redis leaderboard, and unlocks achievements when thresholds are hit.
6. `realtime-service` consumes the event and broadcasts it to the user's socket room.
7. The UI updates its live feed and refreshes dashboard data.

## React-Only Frontend Contract

The frontend surface is React-only:

- `apps/web` is a React 19 Vite app.
- `apps/ui-showcase` is a React 19 Vite app.
- `packages/ui` exports React components and shared CSS.
- Vue packages, Vue files, and Vue build plugins are not part of the runtime.

## Frontend Experience Contract

The main web app owns the production-facing user experience:

- public metadata, sitemap, robots, manifest, Open Graph, Twitter card, and
  JSON-LD live in `apps/web`;
- public Markdown docs are served from `apps/web/public/docs`;
- language detection and translations support English, Russian, Spanish, German,
  French, and Serbian;
- light and dark theme state is stored in the browser;
- dashboard code is lazy loaded so logged-out users avoid chart and realtime
  bundles;
- friendly localized errors are shown for auth, dashboard, habit, challenge,
  network, and server failures.

MongoDB, Express, React, and Node.js are still the core product stack; Redis,
Kafka, Docker, and Lambda demonstrate backend maturity around it.
