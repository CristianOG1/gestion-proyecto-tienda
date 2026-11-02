FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

ENV NODE_ENV=production
ENV STRAPI_HOST="https://mi-tienda-backend-y9xx.onrender.com"

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]