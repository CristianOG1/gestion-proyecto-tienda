
# syntax=docker/dockerfile:1.7
FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

ENV NODE_ENV=production
ARG STRAPI_HOST
ENV STRAPI_HOST=${STRAPI_HOST}

RUN --mount=type=secret,id=strapi_token,env=STRAPI_TOKEN \
    pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
