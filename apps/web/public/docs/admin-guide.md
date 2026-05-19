# lifetracker Admin Guide

This guide explains the local runtime and operational responsibilities.

## Local URLs

| Surface            | URL                          |
| ------------------ | ---------------------------- |
| Web app            | http://localhost:3000        |
| UI Kit showcase    | http://localhost:3001        |
| API gateway health | http://localhost:4000/health |
| Realtime health    | http://localhost:4003/health |
| MongoDB            | localhost:27017              |
| Redis              | localhost:6379               |
| Kafka              | localhost:9094               |

## Start The Stack

```bash
docker compose --profile tools build
docker compose up -d
docker compose --profile tools run --rm seed
```

## Services

| Service            | Responsibility                             |
| ------------------ | ------------------------------------------ |
| `web`              | React app, SEO files, public Markdown docs |
| `ui-showcase`      | React UI Kit showcase                      |
| `api-gateway`      | Public `/api/*` entry point                |
| `auth-service`     | Registration, login, sessions, auth events |
| `habit-service`    | Habits, check-ins, dashboard, challenges   |
| `realtime-service` | Socket.IO, presence, Kafka event fanout    |
| `analytics-worker` | Event logs, projections, achievements      |
| `seed`             | Demo data                                  |

## Volumes

| Volume                            | Purpose                   |
| --------------------------------- | ------------------------- |
| `lifetracker-mongo-data`          | MongoDB data              |
| `lifetracker-mongo-config`        | MongoDB config            |
| `lifetracker-redis-data`          | Redis data                |
| `lifetracker-kafka-data`          | Kafka topic logs          |
| `lifetracker-kafka-secrets`       | Kafka image secrets mount |
| `lifetracker-kafka-shared-config` | Kafka shared config mount |

No Docker resource should use the old `mern` prefix.

## Common Checks

```bash
docker compose ps
curl http://localhost:4000/health
curl http://localhost:4003/health
curl http://localhost:3000/docs/README.md
```

If the public docs return the app shell instead of Markdown, rebuild the web
image and check the Nginx configuration for `/docs/*.md`.
