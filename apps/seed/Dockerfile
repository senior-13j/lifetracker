FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/seed/package.json apps/seed/package.json
COPY packages/database/package.json packages/database/package.json
RUN npm ci
COPY tsconfig.base.json ./
COPY apps/seed apps/seed
COPY packages/database packages/database
RUN npm run build --workspace @lifetracker/database
RUN npm run build --workspace @lifetracker/seed

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY apps/seed/package.json apps/seed/package.json
COPY packages/database/package.json packages/database/package.json
RUN npm ci --omit=dev
COPY --from=builder /app/apps/seed/dist apps/seed/dist
COPY --from=builder /app/packages/database/dist packages/database/dist
CMD ["node", "apps/seed/dist/index.js"]
