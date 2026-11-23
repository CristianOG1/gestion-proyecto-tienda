# AGENTS.md

Dos proyectos pnpm independientes, sin manifiesto ni workspace en la raíz. Ejecuta `pnpm` dentro de `web/` o `backend/`; en la raíz no hay nada que instalar.

## Comandos

```bash
cd backend && pnpm install && pnpm develop                          # Strapi, puerto 8888
cd web     && pnpm install && pnpm dev                              # Next.js, puerto 3000
cd web     && pnpm lint
cd web     && pnpm exec next typegen && pnpm exec tsc --noEmit
cd web     && pnpm test                                             # Vitest
cd web     && pnpm build
cd backend && pnpm build                                            # panel de administración
```

- `web/` usa Vitest (`pnpm test`); `backend/` no tiene runner de pruebas.
- `next dev` reescribe el bloque de reglas de `web/AGENTS.md`; consérvalo en los diffs. `web/CLAUDE.md` solo importa ese archivo.

## Configuración de Next.js (`web/`)

- `web/next.config.ts` usa `output: process.env.VERCEL ? undefined : "standalone"` para soportar tanto el build ligero en Docker como despliegues nativos en Vercel. Validación estricta de tipos activa (sin `ignoreBuildErrors`).
- Las páginas principales (`web/app/page.tsx`, `web/app/categorias/page.tsx`) usan `export const dynamic = "force-dynamic"` y `web/lib/strapi.ts` usa `cache: "no-store"` para consultar Strapi en tiempo real y evitar HTML cacheado del build.
- Gestor de paquetes fijado en `pnpm@10` (`web/package.json`, `web/Dockerfile` y CI). Si hay conflictos de lockfile, regéneralo con `npx pnpm@10 install`.

## Entorno

- `web/.env.local` (ver `web/.env.example`): `STRAPI_HOST`, `STRAPI_TOKEN` y `STRIPE_SECRET_KEY`. Todas son variables solo de servidor (no hay `NEXT_PUBLIC_*`); las peticiones a Strapi pasan por `lib/strapi.ts#query` y Stripe se instancia dentro del handler `POST /api/checkout` (nunca a nivel de módulo).
- `backend/.env` (ver `backend/.env.example`): `PORT=8888`, `DATABASE_CLIENT` (`sqlite` por defecto en `.tmp/data.db`, o `postgres`), credenciales de Cloudinary (`CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`) y llaves de Strapi.
- Usa `lib/image-url.ts#getImageUrl` para media: respeta URLs absolutas de Cloudinary y completa las relativas `/uploads/...`. No concatenes `${STRAPI_HOST}${url}` a mano.
- `next/image` solo permite `res.cloudinary.com`; el catálogo usa `<img>`. Agrega el host de Render antes de migrar a `<Image>`.

## Arquitectura

- Next.js App Router: `/` (`app/page.tsx`), `/categorias` (`app/categorias/page.tsx`), `/categories/[categoryId]` (`app/categories/[categoryId]/page.tsx`, `categoryId` es el **slug**), `/cart` (`app/cart/page.tsx`, cliente), `/pago/exito`, `/pago/cancelado` y `POST /api/checkout` (`app/api/checkout/route.ts`).
- `app/layout.tsx` es async: llama a `getCategories` (envuelta en `cache()` de React para deduplicar entre `layout`, `Hero`, `Categories` y `Footer`).
- `getHomeInfo` vive en `lib/get-home-into.ts` (typo histórico). El import válido es `@/lib/get-home-into`; no renombres el archivo sin actualizar `Hero.tsx`.
- El carrito es estado de cliente: `lib/cart-store.ts` (Zustand + `localStorage`), sincronizado en `NavMenu` y `CartPage` con `useSyncExternalStore` para evitar hydration mismatch.

| Ruta | Componentes principales | Función de `lib/` | Endpoint / content type |
| --- | --- | --- | --- |
| `/` | `Hero`, `Categories`, `FeaturedProducts` | `getHomeInfo`, `getCategories`, `getFeaturedProducts` | `home`, `product-category`, `product` (`isActive=true`) |
| `/categorias` | `HeroCategorias` | `getCategories` | `product-category` |
| `/categories/[categoryId]` | `HeroCategoria`, `SortBy`, `Pagination`, `AddToCartButton` | `getProducts`, `getCategories` | `products` (`pagination[page]`, `sort=price:asc`) |
| `/cart` | `CartPage` | `useCartStore`, `getImageUrl` | `POST /api/checkout` (Stripe Checkout MXN) |

- Backend Strapi 5: content types en `src/api/<nombre>/content-types/<nombre>/schema.json`, con `types/generated/` versionado.
- `config/api.ts` activa `strictParams` y `strictRelations`: parámetros desconocidos devuelven error; las respuestas vienen aplanadas (`data[].name`, `documentId`).
- Solo `product`, `product-category` y `home` se usan en la tienda. `about`, `article`, `author`, `category` y `global` son plantilla de blog sin uso.

## Docker y Docker Compose (`web/Dockerfile`, `compose.yaml`)

- `web/Dockerfile` usa multi-stage build con `node:20-alpine` (`deps -> builder -> runner`) y lee el secreto en build con `RUN --mount=type=secret,id=strapi_token STRAPI_TOKEN=$(cat /run/secrets/strapi_token) pnpm run build` (compatible con `dockerfile:1.7`).
- `compose.yaml` levanta `web` (puerto `3000`) y `backend` (puerto `8888` con healthcheck en `/_health`). `web` se conecta al backend local mediante `STRAPI_HOST=http://backend:8888` y carga `web/.env.local`.
- **Gotcha:** `docker run --env-file` no elimina comillas dobles, por lo que `web/.env.local` y `backend/.env` nunca deben llevar comillas en sus valores.

## GitHub Actions (`.github/workflows/ci.yml`)

- Node `20` + `pnpm` `10` con `--frozen-lockfile` (commitea el lockfile al cambiar dependencias).
- Antes de compilar `web`, despierta el backend de Render haciendo polling a `/_health`.
- En la validación de TypeScript, ejecutar siempre `pnpm exec next typegen` antes de `pnpm exec tsc --noEmit` para generar `PageProps` y `LayoutProps` en `.next/types/`. `lint`, `tsc` y `pnpm test` son bloqueantes.
- Al hacer push a `main`, construye y publica la imagen de `web` en Docker Hub usando BuildKit secrets (`STRAPI_TOKEN` desde `${{ secrets.STRAPI_TOKEN }}`).

## Jenkins (`Jenkinsfile` y `Dockerfile.jenkins`)

- Jenkins corre contenerizado (`jenkins-devops`) con Docker CLI instalado y `/var/run/docker.sock` montado (puerto local `8081:8080`).
- `Jenkinsfile` en la raíz define 4 etapas:
  1. Checkout desde GitHub.
  2. Lint y pruebas unitarias en `node:20-alpine` usando `--volumes-from jenkins-devops -w "${WORKSPACE}/web"`.
  3. Build de imagen Docker con `DOCKER_BUILDKIT=1` y secreto `STRAPI_TOKEN` desde credenciales de Jenkins.
  4. Despliegue y verificación del contenedor en el puerto `3001`.

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.

OpenCode puts the MCP server's key in front of each tool's name, so it lists this tool as `codegraph_codegraph_explore` where other agents list `codegraph_explore`; if the server is registered under another key, that key replaces the first `codegraph_`.
<!-- CODEGRAPH_END -->
