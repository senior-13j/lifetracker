# Deployment

The repository includes a deploy handoff workflow at `.github/workflows/deploy.yml`.
It currently builds production images and is ready to be extended with your AWS
account-specific ECR/ECS details.

## Recommended Production Shape

- Web: static build on S3 + CloudFront, Vercel, Netlify, or containerized Nginx.
- API services: ECS Fargate or Render/Fly services.
- MongoDB: MongoDB Atlas.
- Redis: AWS ElastiCache or Upstash Redis.
- Kafka: Amazon MSK, Confluent Cloud, or a managed Kafka-compatible provider.
- Lambda: SAM deployment from `infra/aws/template.yaml`.

## Public Web Assets

The web build contains more than the React app:

- `index.html` with canonical metadata, Open Graph, Twitter cards, theme color,
  and JSON-LD;
- `robots.txt`;
- `sitemap.xml`;
- `site.webmanifest`;
- `favicon.svg`;
- `og-image.svg`;
- public Markdown docs under `/docs/*.md`.

If the production host is not `https://lifetracker.dev/`, update the canonical
host in:

- `apps/web/index.html`;
- `apps/web/public/robots.txt`;
- `apps/web/public/sitemap.xml`;
- any public docs that mention the deployed host.

## Local Docker Runtime

Local Docker Compose uses the explicit project name `lifetracker`. The local image
tags are `lifetracker-web:local`, `lifetracker-api-gateway:local`,
`lifetracker-auth-service:local`, `lifetracker-habit-service:local`,
`lifetracker-realtime-service:local`, `lifetracker-analytics-worker:local`, and
`lifetracker-seed:local`. The UI Kit showcase is built as
`lifetracker-ui-showcase:local` and served on local port `3001`.

Persistent local state is kept in named volumes such as
`lifetracker-mongo-data`, `lifetracker-redis-data`, and `lifetracker-kafka-data`.
The complete local Docker contract is documented in [DOCKER.md](DOCKER.md).

## Web Container Caching

The Nginx container for `apps/web` is configured for SPA-safe caching:

| Path                                                       | Cache behavior                                     |
| ---------------------------------------------------------- | -------------------------------------------------- |
| `/assets/*`                                                | One year, immutable hashed assets                  |
| `/index.html` through SPA fallback                         | No cache                                           |
| `/robots.txt`, `/sitemap.xml`, `/site.webmanifest`, `.svg` | One hour                                           |
| `/docs/*.md`                                               | One hour, served as `text/markdown; charset=utf-8` |

This keeps app shell rollouts safe while still allowing static assets and docs
to be cached efficiently.

## Required Secrets

For GitHub Actions AWS deployment:

```text
AWS_ROLE_TO_ASSUME
AWS_REGION
ECR_REPOSITORY
ECS_CLUSTER
ECS_SERVICE_API_GATEWAY
ECS_SERVICE_AUTH
ECS_SERVICE_HABITS
ECS_SERVICE_REALTIME
ECS_SERVICE_WORKER
```

## Lambda

Build the Lambda package:

```bash
npm run build --workspace @lifetracker/lambda-daily-summary
```

Deploy with SAM after filling network parameters:

```bash
sam deploy --guided --template-file infra/aws/template.yaml
```

The function is designed for a self-managed Kafka event source mapping and expects
the shared `life.events` contract.

## Deployment Checklist

Before a production handoff:

1. Run `npm run check`.
2. Build all production images.
3. Confirm `/health` endpoints are reachable for API gateway and realtime.
4. Replace local secrets with real secret manager values.
5. Replace local CORS origins with the production web origin.
6. Confirm MongoDB, Redis, and Kafka are managed or backed up.
7. Confirm `robots.txt`, `sitemap.xml`, `site.webmanifest`, and public Markdown
   docs are reachable on the production host.
8. Confirm `og-image.svg` is reachable through an absolute HTTPS URL.
9. Submit the sitemap in the target search console.
10. Run browser smoke checks for desktop, mobile, supported languages, dark
    theme, login, dashboard, and public docs.
