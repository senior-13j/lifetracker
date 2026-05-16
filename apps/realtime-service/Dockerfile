FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/realtime-service/package.json apps/realtime-service/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/backend-common/package.json packages/backend-common/package.json
RUN npm ci
COPY tsconfig.base.json eslint.config.mjs ./
COPY apps/realtime-service apps/realtime-service
COPY packages/shared packages/shared
COPY packages/backend-common packages/backend-common
RUN npm run build --workspace @lifetracker/shared
RUN npm run build --workspace @lifetracker/backend-common
RUN npm run build --workspace @lifetracker/realtime-service

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY apps/realtime-service/package.json apps/realtime-service/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/backend-common/package.json packages/backend-common/package.json
RUN npm ci --omit=dev
COPY --from=builder /app/apps/realtime-service/dist apps/realtime-service/dist
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/packages/backend-common/dist packages/backend-common/dist
EXPOSE 4003
CMD ["npm", "run", "start", "--workspace", "@lifetracker/realtime-service"]
