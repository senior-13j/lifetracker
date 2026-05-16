FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/api-gateway/package.json apps/api-gateway/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/backend-common/package.json packages/backend-common/package.json
RUN npm ci
COPY tsconfig.base.json eslint.config.mjs ./
COPY apps/api-gateway apps/api-gateway
COPY packages/shared packages/shared
COPY packages/backend-common packages/backend-common
RUN npm run build --workspace @lifetracker/shared
RUN npm run build --workspace @lifetracker/backend-common
RUN npm run build --workspace @lifetracker/api-gateway

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY apps/api-gateway/package.json apps/api-gateway/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/backend-common/package.json packages/backend-common/package.json
RUN npm ci --omit=dev
COPY --from=builder /app/apps/api-gateway/dist apps/api-gateway/dist
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/packages/backend-common/dist packages/backend-common/dist
EXPOSE 4000
CMD ["npm", "run", "start", "--workspace", "@lifetracker/api-gateway"]
