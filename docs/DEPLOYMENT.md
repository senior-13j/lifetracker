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
