FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/ui-showcase/package.json apps/ui-showcase/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN npm ci
COPY tsconfig.base.json eslint.config.mjs ./
COPY apps/ui-showcase apps/ui-showcase
COPY packages/ui packages/ui
RUN npm run build --workspace @lifetracker/ui
RUN npm run build --workspace @lifetracker/ui-showcase

FROM nginx:1.27-alpine AS runner
COPY apps/ui-showcase/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/ui-showcase/dist /usr/share/nginx/html
EXPOSE 80
