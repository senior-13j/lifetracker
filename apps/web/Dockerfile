FROM node:24-alpine AS builder
WORKDIR /app
ARG VITE_API_URL=http://localhost:4000/api
ARG VITE_REALTIME_URL=http://localhost:4003
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_REALTIME_URL=$VITE_REALTIME_URL
COPY package*.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN npm ci
COPY tsconfig.base.json eslint.config.mjs ./
COPY apps/web apps/web
COPY packages/shared packages/shared
COPY packages/ui packages/ui
RUN npm run build --workspace @lifetracker/ui
RUN npm run build --workspace @lifetracker/shared
RUN npm run build --workspace @lifetracker/web

FROM nginx:1.27-alpine AS runner
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
