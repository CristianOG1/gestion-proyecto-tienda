FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

# Variables necesarias para que Strapi compile sin errores
ENV NODE_ENV=development

RUN pnpm run build

EXPOSE 1337

CMD ["pnpm", "develop"]