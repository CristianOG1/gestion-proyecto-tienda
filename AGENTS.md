# AGENTS.md

Dos proyectos pnpm independientes, sin manifiesto ni workspace en la raíz. Ejecuta `pnpm` dentro de `web/` o `backend/`; en la raíz no hay nada que instalar.

## Comandos

```bash
cd backend && pnpm install && pnpm develop        # Strapi, puerto 8888
cd web     && pnpm install && pnpm exec next dev   # Next.js, puerto 3000
cd web     && pnpm build
cd web     && pnpm lint
cd web     && pnpm exec tsc --noEmit
cd backend && pnpm build                           # panel de administración
```

- `web/package.json` tiene `"dev": "nex dev"` (ese binario no existe): `pnpm dev` falla. Usa `pnpm exec next dev` o corrige el script a `next dev`.
- No hay runner de pruebas en ninguno de los dos proyectos.
- CI (`.github/workflows/ci.yml`): pnpm 10 + Node 24, build de `backend`, instalación de `web` con `--frozen-lockfile` (si cambias dependencias, commitea el lockfile), despierta Render con hasta 10 `GET $STRAPI_HOST/_health` cada 10 s, luego `lint` y `tsc --noEmit` con `continue-on-error`, y build de `web`. Bloquean el pipeline los builds y el warm-up de Render; lint/tipos no. El workflow fija pnpm 10 aunque `web/package.json` declara `packageManager: pnpm@12.3.4`, y `STRAPI_HOST` está fijo en el YAML mientras `STRAPI_TOKEN` viene de `secrets`.
- `next dev` reescribe el bloque de reglas de `web/AGENTS.md`; consérvalo en los diffs. `web/CLAUDE.md` solo importa ese archivo.

## Entorno

- `web/.env.local`: `STRAPI_HOST` y `STRAPI_TOKEN`. Se leen solo del lado del servidor, no hay variables `NEXT_PUBLIC_*`; todas las peticiones pasan por `lib/strapi.ts#query`.
- El `backend/.env` local puede apuntar a PostgreSQL (`DATABASE_CLIENT=postgres`), aunque el default del código es SQLite (`config/database.ts`, archivo `.tmp/data.db`). Para usar SQLite: `DATABASE_CLIENT=sqlite` y `DATABASE_FILENAME`.
- `backend/.env.example` está desactualizado (dice `PORT=1337` y no incluye variables de base de datos ni Cloudinary); no lo uses como fuente de verdad.
- Cloudinary es el provider de upload (`config/plugins.ts`) y requiere `CLOUDINARY_NAME`, `CLOUDINARY_KEY` y `CLOUDINARY_SECRET`. Las subidas nuevas van a Cloudinary; las antiguas siguen en `backend/public/uploads`.
- Usa `lib/image-url.ts#getImageUrl` para media: respeta URLs absolutas de Cloudinary y completa las relativas `/uploads/...`. No concatenes `${STRAPI_HOST}${url}` a mano.
- `next/image` solo permite `res.cloudinary.com`; el catálogo usa `<img>`. Agrega el host de Render antes de migrar a `<Image>`.

## Arquitectura

- Next.js App Router con tres rutas: `/` (`app/page.tsx`), `/cart` (`app/cart/page.tsx`, cliente) y `/categories/[categoryId]` (`app/categories/[categoryId]/page.tsx`). El parámetro `categoryId` es el **slug** de la categoría.
- `app/layout.tsx` es async: llama a `getCategories` en cada render y pasa el resultado a `NavMenu`.
- `getHomeInfo` vive en `lib/get-home-into.ts` (typo histórico del nombre). El import válido es `@/lib/get-home-into`; no renombres el archivo sin actualizar `Hero.tsx`.
- El carrito es estado de cliente: `lib/cart-store.ts` (Zustand + `localStorage`), sin llamadas a Strapi.

| Página | Componentes | Función de `lib/` | Endpoint / content type |
| --- | --- | --- | --- |
| `/` | `Hero`, `Categories` | `getHomeInfo`, `getCategories` | `GET /api/home?populate=cover` (`home`), `GET /api/product-categories?...` (`product-category`) |
| `/categories/[categoryId]` | `SortBy`, `Pagination`, `AddToCartButton` | `getProducts` | `GET /api/products?filters[product_category][slug][$contains]=...&populate=images` (`product`) |
| `/cart` | `CartPage` | `useCartStore` | Ninguno |

- Backend Strapi 5: content types en `src/api/<nombre>/content-types/<nombre>/schema.json`, con routers/controllers/services basados en `factories`. `types/generated/` está versionado; regenéralo junto con los cambios de esquema.
- `config/api.ts` activa `strictParams` y `strictRelations`: parámetros desconocidos devuelven error, y REST pagina 25 por defecto (máximo 100). Las respuestas vienen aplanadas (`data[].name`, no `attributes.name`).
- Solo `product`, `product-category` y `home` se usan en la tienda. `about`, `article`, `author`, `category` (distinto de `product-category`) y `global` son plantilla de blog sin uso, igual que los datos de `backend/data/data.json` y `seed:example`.

## Deuda conocida

- `pnpm lint` falla en `components/Menu.tsx` (`react-hooks/set-state-in-effect`) y `tsc --noEmit` reporta errores previos (implicit `any`, `Category` sin definir, props de `Pagination`, `image` nullable en `Hero`). `next.config.ts` ignora errores de TypeScript y el CI no bloquea lint/tipos; no asumas que son nuevos.
- `Pagination` no acepta props (la página le pasa `pagination`) y sus botones no hacen nada; `SortBy` tampoco tiene manejadores. Son UI inerte.
- `getProducts` no devuelve `id`, pero `CategoryPage` pasa `product.id` a `AddToCartButton`: el carrito identifica productos por `undefined` y puede fusionar artículos distintos. También queda un `console.log(data)`.
- `layout.tsx` y `Categories.tsx` llaman a `getCategories` por separado en el mismo request.

<!-- CODEGRAPH_START -->
## CodeGraph

In repositories indexed by CodeGraph (a `.codegraph/` directory exists at the repo root), reach for it BEFORE grep/find or reading files when you need to understand or locate code:

- **MCP tool** (when available): `codegraph_explore` answers most code questions in one call — the relevant symbols' verbatim source plus the call paths between them, including dynamic-dispatch hops grep can't follow. Name a file or symbol in the query to read its current line-numbered source. If it's listed but deferred, load it by name via tool search.
- **Shell** (always works): `codegraph explore "<symbol names or question>"` prints the same output.

If there is no `.codegraph/` directory, skip CodeGraph entirely — indexing is the user's decision.
<!-- CODEGRAPH_END -->
