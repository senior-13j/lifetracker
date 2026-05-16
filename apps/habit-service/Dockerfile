FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/habit-service/package.json apps/habit-service/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/backend-common/package.json packages/backend-common/package.json
COPY packages/database/package.json packages/database/package.json
RUN npm ci
COPY tsconfig.base.json eslint.config.mjs ./
COPY apps/habit-service apps/habit-service
COPY packages/shared packages/shared
COPY packages/backend-common packages/backend-common
COPY packages/database packages/database
RUN npm run build --workspace @lifetracker/shared
RUN npm run build --workspace @lifetracker/database
RUN npm run build --workspace @lifetracker/backend-common
RUN npm run build --workspace @lifetracker/habit-service

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY apps/habit-service/package.json apps/habit-service/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/backend-common/package.json packages/backend-common/package.json
COPY packages/database/package.json packages/database/package.json
RUN npm ci --omit=dev
COPY --from=builder /app/apps/habit-service/dist apps/habit-service/dist
COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/packages/backend-common/dist packages/backend-common/dist
COPY --from=builder /app/packages/database/dist packages/database/dist
EXPOSE 4002
CMD ["npm", "run", "start", "--workspace", "@lifetracker/habit-service"]
