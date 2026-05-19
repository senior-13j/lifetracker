# Docker

lifetracker uses Docker Compose for the local runtime. The Compose project name is
explicitly set to `lifetracker`, so generated containers, networks, and named
volumes use the same project prefix instead of the old workspace name.

## Compose Project

The root [docker-compose.yml](../docker-compose.yml) starts the local stack under:

```text
name: lifetracker
```

Expected runtime resource names:

```text
lifetracker-web-1
lifetracker-ui-showcase-1
lifetracker-api-gateway-1
lifetracker-auth-service-1
lifetracker-habit-service-1
lifetracker-realtime-service-1
lifetracker-analytics-worker-1
lifetracker-mongo-1
lifetracker-redis-1
lifetracker-kafka-1
lifetracker_default
```

No Docker resource should use the old `mern` or `mern-app` prefix.

## Images

Application images are built locally and tagged with `:local`.

| Service            | Image                                | Dockerfile                         |
| ------------------ | ------------------------------------ | ---------------------------------- |
| `web`              | `lifetracker-web:local`              | `apps/web/Dockerfile`              |
| `ui-showcase`      | `lifetracker-ui-showcase:local`      | `apps/ui-showcase/Dockerfile`      |
| `api-gateway`      | `lifetracker-api-gateway:local`      | `apps/api-gateway/Dockerfile`      |
| `auth-service`     | `lifetracker-auth-service:local`     | `apps/auth-service/Dockerfile`     |
| `habit-service`    | `lifetracker-habit-service:local`    | `apps/habit-service/Dockerfile`    |
| `realtime-service` | `lifetracker-realtime-service:local` | `apps/realtime-service/Dockerfile` |
| `analytics-worker` | `lifetracker-analytics-worker:local` | `apps/analytics-worker/Dockerfile` |
| `seed`             | `lifetracker-seed:local`             | `apps/seed/Dockerfile`             |

Infrastructure images come directly from upstream registries:

| Service | Image                | Purpose                                                 |
| ------- | -------------------- | ------------------------------------------------------- |
| `mongo` | `mongo:7`            | Durable application database.                           |
| `redis` | `redis:7-alpine`     | Sessions, dashboard cache, presence, leaderboard state. |
| `kafka` | `apache/kafka:4.1.0` | Local event broker for `life.events`.                   |

## Volumes

All persistent or image-declared data mounts are explicitly named. This prevents
Docker from creating opaque hash-named anonymous volumes.

| Volume                            | Mounted by | Container path        | Purpose                                                             |
| --------------------------------- | ---------- | --------------------- | ------------------------------------------------------------------- |
| `lifetracker-mongo-data`          | `mongo`    | `/data/db`            | MongoDB database files.                                             |
| `lifetracker-mongo-config`        | `mongo`    | `/data/configdb`      | MongoDB config database files.                                      |
| `lifetracker-redis-data`          | `redis`    | `/data`               | Redis append-only/cache data when persistence is used by the image. |
| `lifetracker-kafka-data`          | `kafka`    | `/var/lib/kafka/data` | Kafka broker log and topic data.                                    |
| `lifetracker-kafka-secrets`       | `kafka`    | `/etc/kafka/secrets`  | Kafka image secrets mount point.                                    |
| `lifetracker-kafka-shared-config` | `kafka`    | `/mnt/shared/config`  | Kafka image shared config mount point.                              |

The expected volume list is:

```text
lifetracker-kafka-data
lifetracker-kafka-secrets
lifetracker-kafka-shared-config
lifetracker-mongo-config
lifetracker-mongo-data
lifetracker-redis-data
```

## Local Commands

Build every application image, including the `seed` tool image:

```bash
docker compose --profile tools build
```

Start the runtime stack:

```bash
docker compose up -d
```

Open the React app on `http://localhost:3000` and the React UI Kit showcase on
`http://localhost:3001`.

Seed demo data into MongoDB:

```bash
docker compose --profile tools run --rm seed
```

Check the running containers:

```bash
docker compose ps
```

Validate the resolved Compose file:

```bash
docker compose --profile tools config
```

List the resolved image and volume names:

```bash
docker compose --profile tools config --images
docker compose --profile tools config --volumes
```

## Recreating Docker Resources

To stop the local stack without deleting named volumes:

```bash
docker compose down --remove-orphans
```

To fully reset local Docker state for this project, including MongoDB, Kafka, and
Redis data:

```bash
docker compose down --volumes --rmi all --remove-orphans
```

After a full reset, rebuild, start, and seed the stack again:

```bash
docker compose --profile tools build
docker compose up -d
docker compose --profile tools run --rm seed
```

## Verification

The gateway and realtime service expose health endpoints:

```bash
curl http://localhost:4000/health
curl http://localhost:4003/health
```

There should be no volumes with 64-character hash names and no resources with the
old `mern` prefix. Useful checks:

```bash
docker volume ls
docker ps -a
docker images
docker network ls
```
