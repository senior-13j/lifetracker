# Admin Guide

This guide explains how lifetracker is operated locally and what each runtime
part is responsible for.

## Runtime Surfaces

| Surface          | Local URL                    | Purpose                                 |
| ---------------- | ---------------------------- | --------------------------------------- |
| Web app          | http://localhost:3000        | User-facing React app                   |
| UI Kit showcase  | http://localhost:3001        | Component library showcase              |
| API gateway      | http://localhost:4000/health | Public API entry point                  |
| Realtime service | http://localhost:4003/health | Socket.IO and event fanout health       |
| MongoDB          | localhost:27017              | Durable application data                |
| Redis            | localhost:6379               | Sessions, cache, presence, leaderboards |
| Kafka            | localhost:9094               | Domain event broker                     |

## Service Responsibilities

| Service                | Responsibility                                                               |
| ---------------------- | ---------------------------------------------------------------------------- |
| `web`                  | Serves the built React app, SEO files, and public Markdown docs.             |
| `ui-showcase`          | Serves the React UI Kit showcase.                                            |
| `api-gateway`          | Routes public `/api/*` traffic to backend services.                          |
| `auth-service`         | Handles registration, login, JWT issuing, Redis session marker, auth events. |
| `habit-service`        | Owns habits, check-ins, dashboard data, challenge joins, habit events.       |
| `realtime-service`     | Authenticates sockets, tracks presence, broadcasts Kafka events.             |
| `analytics-worker`     | Consumes domain events, stores logs, updates projections and leaderboards.   |
| `lambda-daily-summary` | AWS Lambda handler for Kafka event-source batches.                           |
| `seed`                 | Creates demo data for local development.                                     |

## Availability Model

| Dependency       | If unavailable                                                                        |
| ---------------- | ------------------------------------------------------------------------------------- |
| MongoDB          | Login, registration, dashboard, habits, and challenges cannot persist data.           |
| Redis            | Sessions, cache, presence, and leaderboards degrade or fail depending on service.     |
| Kafka            | Core HTTP flows can write data, but realtime/event projections may stop updating.     |
| Realtime service | Users can still use saved dashboard data, but live feed and presence are unavailable. |
| API gateway      | Web app cannot call backend APIs.                                                     |

The frontend displays localized friendly errors for failed auth, dashboard,
habit, and challenge operations.

## Start, Seed, Stop

Build all application images:

```bash
docker compose --profile tools build
```

Start the stack:

```bash
docker compose up -d
```

Seed demo data:

```bash
docker compose --profile tools run --rm seed
```

Stop without deleting data:

```bash
docker compose down --remove-orphans
```

Full reset:

```bash
docker compose down --volumes --rmi all --remove-orphans
docker compose --profile tools build
docker compose up -d
docker compose --profile tools run --rm seed
```

## Health Checks

```bash
curl http://localhost:4000/health
curl http://localhost:4003/health
docker compose ps
docker compose logs api-gateway --tail 80
docker compose logs realtime-service --tail 80
```

## Data And Volumes

Local persistent data is stored in named Docker volumes:

| Volume                            | Purpose                         |
| --------------------------------- | ------------------------------- |
| `lifetracker-mongo-data`          | MongoDB database files          |
| `lifetracker-mongo-config`        | MongoDB config database files   |
| `lifetracker-redis-data`          | Redis data                      |
| `lifetracker-kafka-data`          | Kafka broker topic logs         |
| `lifetracker-kafka-secrets`       | Kafka image secrets mount       |
| `lifetracker-kafka-shared-config` | Kafka image shared config mount |

The naming contract is documented in [DOCKER.md](DOCKER.md). No resource should
use the old `mern` prefix.

## Common Incidents

| Symptom                                  | First checks                                                          |
| ---------------------------------------- | --------------------------------------------------------------------- |
| Web app opens but login fails            | `api-gateway`, `auth-service`, MongoDB, Redis                         |
| Dashboard loads but live feed is empty   | `realtime-service`, Kafka, browser console                            |
| Habit completion succeeds but charts lag | `analytics-worker`, Kafka consumer status                             |
| Public docs return the app shell         | Web image rebuild, `apps/web/nginx.conf`, `/docs/*.md` files          |
| Search metadata is wrong                 | `apps/web/index.html`, `robots.txt`, `sitemap.xml`, production domain |

## Production Admin Notes

Before production use:

- replace local JWT secrets;
- use managed MongoDB, Redis, and Kafka;
- serve everything over HTTPS;
- configure real CORS origins;
- configure log retention and metrics;
- add backup and restore procedures;
- update sitemap and canonical URLs to the production host;
- decide data retention and user deletion policies.
