# Estructura del proyecto

> Documento basado en el estado real del repositorio (HEAD `d2b3df5` más el cambio local sin commit en `web/lib/get-categories.ts`). No describe una estructura ideal: el árbol refleja solo archivos existentes.

## 1. Vista general

El repositorio aloja **dos aplicaciones pnpm independientes** que se comunican por HTTP:

- `web/`: frontend Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4.
- `backend/`: API REST y panel de administración Strapi 5, con PostgreSQL/SQLite y Cloudinary.

En la raíz no hay `package.json`, workspace ni código compartido. Cada aplicación se instala y ejecuta por separado. El contrato entre ambas es la API REST de Strapi.

## 2. Árbol real de la raíz

```text
proyecto-web/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── AGENTS.md
├── README.md
├── opencode.jsonc
├── docs/
│   ├── ESTRUCTURA_PROYECTO.md
│   ├── ARQUITECTURA.md
│   └── ESTADO_PROYECTO.md
├── web/          # aplicación Next.js (ver árbol detallado)
└── backend/      # aplicación Strapi (ver árbol detallado)
```

| Elemento | Responsabilidad | Estado |
| --- | --- | --- |
| `.github/workflows/ci.yml` | Integración continua: instala, compila backend, despierta Render, ejecuta lint/tipos no bloqueantes y compila web. | Existente |
| `.gitignore` | Ignora `node_modules`, `.env*`, `.next`, `dist`, `build`, logs y comprimidos. | Existente |
| `AGENTS.md` | Instrucciones operativas para agentes: comandos, entorno, arquitectura, deuda conocida. | Existente; sin trackear en git |
| `README.md` | Descripción del proyecto, integrantes, stack y pasos de instalación/ejecución. | Existente; desactualizado en el comando `dev` |
| `opencode.jsonc` | Configuración local del MCP de CodeGraph. | Existente; sin trackear en git |
| `docs/` | Documentación técnica generada en esta fase. | Creada en esta fase |
| `web/` | Frontend Next.js. | Existente |
| `backend/` | Backend Strapi. | Existente |

> `.codegraph/` existe en disco como índice local de CodeGraph, pero es metadato de herramienta, no código de la aplicación. Se excluye del árbol y del análisis funcional.

## 3. Árbol real de `web/`

```text
web/
├── .env.local                 # variables locales (sin valores documentados)
├── .gitignore
├── AGENTS.md                  # bloque autogenerado por `next dev`
├── CLAUDE.md                  # importa AGENTS.md
├── README.md                  # README de create-next-app
├── eslint.config.mjs
├── next-env.d.ts              # generado por Next.js
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── tsconfig.json
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── cart/
│   │   └── page.tsx
│   └── categories/
│       └── [categoryId]/
│           └── page.tsx
├── components/
│   ├── AddToCartButton.tsx
│   ├── Categories.tsx
│   ├── Hero.tsx
│   ├── Menu.tsx
│   ├── Pagination.tsx
│   └── SortBy.tsx
├── lib/
│   ├── cart-store.ts
│   ├── get-categories.ts
│   ├── get-home-into.ts
│   ├── get-product.ts
│   ├── image-url.ts
│   └── strapi.ts
└── public/
    ├── file.svg
    ├── globe.svg
    ├── next.svg
    ├── vercel.svg
    └── window.svg
```

Directorios locales excluidos: `node_modules/`, `.next/` y el archivo generado `tsconfig.tsbuildinfo`.

### 3.1 Configuración y manifiestos

| Archivo | Responsabilidad | Observaciones |
| --- | --- | --- |
| `package.json` | Dependencias y scripts (`dev`, `build`, `start`, `lint`). | `dev` apunta a `nex dev`, binario inexistente. Declara `pnpm@12.3.4`. |
| `next.config.ts` | Configuración de Next: `typescript.ignoreBuildErrors: true` y `images.remotePatterns` solo para `res.cloudinary.com`. | Permite builds con errores de tipos. |
| `tsconfig.json` | TypeScript estricto, `moduleResolution: bundler`, alias `@/*` → raíz de `web/`. | Existente |
| `eslint.config.mjs` | ESLint 9 flat config con `eslint-config-next` (core-web-vitals + TypeScript). | Existente |
| `postcss.config.mjs` | Plugin `@tailwindcss/postcss`. | Existente |
| `pnpm-workspace.yaml` | Configuración local de pnpm; bloquea builds de `sharp` y `unrs-resolver`. | Existente |
| `.env.local` | `STRAPI_HOST` y `STRAPI_TOKEN` para el servidor. | Existe, ignorado por git; valores no documentados. |
| `next-env.d.ts` | Tipos de entorno generados por Next. | Generado, ignorado por git. |
| `AGENTS.md` | Único bloque de reglas de Next.js, reescrito por `next dev`. | No contiene reglas de negocio; éstas viven en el `AGENTS.md` raíz. |
| `CLAUDE.md` | Redirección a `AGENTS.md`. | Existente |

### 3.2 Rutas y páginas

| Archivo | Responsabilidad | Dependencias | Estado |
| --- | --- | --- | --- |
| `app/layout.tsx` | Layout raíz async: fuentes Geist, `globals.css`, `getCategories()` y `NavMenu`. Metadata por defecto (`Create Next App`). | `lib/get-categories`, `components/Menu` | Existente; duplica la consulta de categorías de la home |
| `app/page.tsx` | Home `/`: renderiza `Hero` y `Categories`; define metadata `MiduShop`. | `components/Hero`, `components/Categories` | Existente; importa `Image` y `NavMenu` sin usarlos |
| `app/cart/page.tsx` | Carrito `/cart`: lista ítems, cambia cantidades, elimina, vacía y calcula total. Client Component. | `lib/cart-store` | Existente; sin checkout |
| `app/categories/[categoryId]/page.tsx` | Listado de productos por slug de categoría; `SortBy`, grilla, `AddToCartButton` y `Pagination`. | `lib/get-product`, componentes de catálogo | Existente; pasa `product.id` que el getter no devuelve |
| `app/globals.css` | Tailwind 4, variables CSS y modo oscuro por `prefers-color-scheme`. | Tailwind | Existente |
| `app/favicon.ico` | Icono del sitio. | Next.js | Existente |

### 3.3 Componentes

| Archivo | Responsabilidad | Tipo | Observaciones |
| --- | --- | --- | --- |
| `components/Menu.tsx` | Navegación, enlaces a inicio/categorías, contador del carrito y menú móvil. | Cliente | Usa el tipo `Category`, no definido; `useEffect` con `setState` dispara el error de lint. |
| `components/Hero.tsx` | Hero de la home: título, bloques rich-text y portada. | Servidor async | Llama a `getHomeInfo`; `image` puede ser `null`. |
| `components/Categories.tsx` | Grilla de categorías con enlace a `/categories/<slug>`. | Servidor async | Vuelve a llamar a `getCategories`; usa el índice como `key`. |
| `components/AddToCartButton.tsx` | Añade un producto al carrito y muestra confirmación temporal. | Cliente | Recibe `id: string`, pero el listado envía `undefined`. |
| `components/SortBy.tsx` | Selector visual “Default / By price”. | Sin estado | No acepta props ni tiene `onClick`; no ordena. |
| `components/Pagination.tsx` | Botones “Anterior / Siguiente”. | Sin estado | No acepta props ni tiene manejadores; no pagina. |

### 3.4 Acceso a datos y estado (`lib/`)

| Archivo | Responsabilidad | Depende de |
| --- | --- | --- |
| `lib/strapi.ts` | Cliente HTTP mínimo: `query(url)` hace `fetch` a `${STRAPI_HOST}/api/${url}` con `Authorization: Bearer ${STRAPI_TOKEN}`. | Variables de entorno del servidor |
| `lib/image-url.ts` | `getImageUrl(url)`: deja intactas URLs absolutas (Cloudinary) y prefija `STRAPI_HOST` a rutas relativas (`/uploads/...`). | `STRAPI_HOST` |
| `lib/get-categories.ts` | Consulta `product-categories` con campos y `populate[image]`; mapea a `{name, slug, description, image}`. | `query`, `getImageUrl` |
| `lib/get-product.ts` | Consulta `products` filtrando por slug de categoría y `populate=images`; mapea nombre, slug, descripción, imagen y precio. | `query`, `getImageUrl` |
| `lib/get-home-into.ts` | Consulta el single type `home` con `populate=cover`; devuelve título, descripción e imagen. Nombre con typo histórico (`into`). | `query`, `getImageUrl` |
| `lib/cart-store.ts` | Store Zustand con `persist`: ítems, alta, baja, cantidad, vaciado y totales. Persiste en `localStorage` como `cart-storage`. | Zustand |

## 4. Árbol real de `backend/`

```text
backend/
├── .env                       # variables locales (sin valores documentados)
├── .env.example
├── .gitignore
├── README.md
├── favicon.png
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
├── config/
│   ├── admin.ts
│   ├── api.ts
│   ├── database.ts
│   ├── middlewares.ts
│   ├── plugins.ts
│   └── server.ts
├── data/
│   ├── data.json
│   └── uploads/               # imágenes del seed de blog
├── database/
│   └── migrations/
│       └── .gitkeep
├── public/
│   ├── robots.txt
│   └── uploads/
│       └── .gitkeep
├── scripts/
│   └── seed.js
├── src/
│   ├── index.ts
│   ├── admin/
│   │   ├── app.ts
│   │   ├── tsconfig.json
│   │   └── vite.config.example.ts
│   ├── api/
│   │   ├── .gitkeep
│   │   ├── about/
│   │   │   ├── content-types/about/schema.json
│   │   │   ├── controllers/about.ts
│   │   │   ├── routes/about.ts
│   │   │   └── services/about.ts
│   │   ├── article/
│   │   │   ├── content-types/article/schema.json
│   │   │   ├── controllers/article.ts
│   │   │   ├── routes/article.ts
│   │   │   └── services/article.ts
│   │   ├── author/
│   │   │   ├── content-types/author/schema.json
│   │   │   ├── controllers/author.ts
│   │   │   ├── routes/author.ts
│   │   │   └── services/author.ts
│   │   ├── category/
│   │   │   ├── content-types/category/schema.json
│   │   │   ├── controllers/category.ts
│   │   │   ├── routes/category.ts
│   │   │   └── services/category.ts
│   │   ├── global/
│   │   │   ├── content-types/global/schema.json
│   │   │   ├── controllers/global.ts
│   │   │   ├── routes/global.ts
│   │   │   └── services/global.ts
│   │   ├── home/
│   │   │   ├── content-types/home/schema.json
│   │   │   ├── controllers/home.ts
│   │   │   ├── routes/home.ts
│   │   │   └── services/home.ts
│   │   ├── product/
│   │   │   ├── content-types/product/schema.json
│   │   │   ├── controllers/product.ts
│   │   │   ├── routes/product.ts
│   │   │   └── services/product.ts
│   │   └── product-category/
│   │       ├── content-types/product-category/schema.json
│   │       ├── controllers/product-category.ts
│   │       ├── routes/product-category.ts
│   │       └── services/product-category.ts
│   ├── components/
│   │   └── shared/
│   │       ├── media.json
│   │       ├── quote.json
│   │       ├── rich-text.json
│   │       ├── seo.json
│   │       └── slider.json
│   └── extensions/
│       └── .gitkeep
└── types/
    └── generated/
        ├── components.d.ts
        └── contentTypes.d.ts
```

Directorios y artefactos locales excluidos: `node_modules/`, `dist/`, `.tmp/`, `.strapi/`, `.strapi-updater.json`, `*.log`, `tienda.tar.gz`.

### 4.1 Configuración

| Archivo | Responsabilidad | Observaciones |
| --- | --- | --- |
| `config/admin.ts` | Secretos del panel (`ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT`, `ENCRYPTION_KEY`) y flags de NPS/EE/docs. | Todo por entorno |
| `config/api.ts` | REST: límite por defecto 25, máximo 100, `withCount`, `strictParams`; documentos con `strictParams` y `strictRelations`. | Parámetros desconocidos devuelven error |
| `config/database.ts` | Conexiones MySQL, PostgreSQL y SQLite. SQLite es el default del código; PostgreSQL usa `DATABASE_URL` o variables separadas y SSL opcional. | El `.env` local declara `DATABASE_CLIENT=postgres` |
| `config/middlewares.ts` | Stack estándar de Strapi; CSP permite `res.cloudinary.com` en `img-src` y `media-src`. | `strapi::cors` sin configuración explícita |
| `config/plugins.ts` | `users-permissions` (JWT refresh, cookie httpOnly) y `upload` con provider Cloudinary, credenciales por entorno y listas de tipos permitidos/denegados. | Deniega SVG y ejecutables |
| `config/server.ts` | Host, puerto (default `8888`), `APP_KEYS` y webhooks. | `.env.example` dice `1337`; el default real es 8888 |
| `src/index.ts` | `register` y `bootstrap` vacíos. | Punto de extensión sin lógica |
| `src/admin/app.ts` | Configura el panel con `locales: ["es"]`; `bootstrap` vacío. | Activo |
| `src/admin/vite.config.example.ts` | Ejemplo de configuración Vite del admin. | Ejemplo, no se carga automáticamente |
| `src/admin/tsconfig.json` | Configuración TypeScript del admin. | Existente |

### 4.2 Content types

Cada tipo tiene `schema.json` y archivos `controllers/`, `routes/` y `services/` generados con `factories.createCore*`, sin lógica personalizada.

| Content type | Tipo | Campos principales | Uso desde la tienda |
| --- | --- | --- | --- |
| `product` | Colección, draft/publish, i18n | `name`, `slug`, `isActive`, `price`, `product_category` (manyToOne), `description` (blocks), `color` (enum), `images` (media múltiple), `stock` | Sí: listado por categoría |
| `product-category` | Colección, draft/publish, i18n | `name`, `slug`, `description`, `image`, `products` (oneToMany) | Sí: home, menú y filtro de productos |
| `home` | Single type, draft/publish, i18n | `title`, `description` (blocks), `cover` | Sí: hero de la home |
| `about` | Single type | `title`, `blocks` (dynamic zone) | No consumido por el frontend |
| `article` | Colección, draft/publish | `title`, `description`, `slug`, `cover`, `author`, `category`, `blocks` | No consumido por el frontend |
| `author` | Colección | `name`, `avatar`, `email`, `articles` | No consumido por el frontend |
| `category` | Colección | `name`, `slug`, `description`, `articles` | No consumido; distinto de `product-category` |
| `global` | Single type | `siteName`, `favicon`, `siteDescription`, `defaultSeo` | No consumido por el frontend |

Relaciones confirmadas:

- `product-category.products` (oneToMany) ↔ `product.product_category` (manyToOne).
- `author.articles` (oneToMany) ↔ `article.author` (manyToOne).
- `category.articles` (oneToMany) ↔ `article.category` (manyToOne).

No hay políticas, middlewares, validadores ni lifecycles personalizados en `src/api/`.

### 4.3 Componentes compartidos, datos y almacenamiento

| Elemento | Responsabilidad | Observaciones |
| --- | --- | --- |
| `src/components/shared/` | Define `media`, `quote`, `rich-text`, `seo` y `slider`. | Usados por las dynamic zones de `about`/`article` y `seo` en `global`; la tienda no los usa |
| `data/data.json` | Datos de ejemplo del template de blog: `global`, `about`, `categories`, `authors`, `articles`. | No contiene productos, categorías de producto ni home |
| `data/uploads/` | Imágenes usadas por el seed del blog. | Versionadas |
| `scripts/seed.js` | Carga Strapi, comprueba primera ejecución, asigna permisos públicos a los tipos de blog e importa los datos de ejemplo. | No siembra el catálogo de la tienda |
| `public/uploads/` | Uploads locales/legacy de Strapi. | Solo `.gitkeep` versionado; con Cloudinary las subidas nuevas no caen aquí |
| `public/robots.txt` | Robots por defecto de Strapi. | Sin configuración específica |
| `database/migrations/` | Carpeta de migraciones. | Solo `.gitkeep`; no hay migraciones propias |
| `src/extensions/` | Extensiones de plugins. | Vacía (solo `.gitkeep`) |
| `types/generated/` | Tipos TypeScript generados por Strapi. | Versionados; deben regenerarse al cambiar esquemas |

### 4.4 Variables de entorno del backend

Nombres detectados (sin valores):

- Servidor: `HOST`, `PORT`, `APP_KEYS`, `WEBHOOKS_POPULATE_RELATIONS`.
- Admin/seguridad: `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY`.
- Base de datos: `DATABASE_CLIENT`, `DATABASE_URL`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_SSL*`, `DATABASE_FILENAME`, `DATABASE_SCHEMA`, `DATABASE_POOL_*`, `DATABASE_CONNECTION_TIMEOUT`.
- Cloudinary: `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`.

`.env.example` solo incluye variables de servidor y admin, con `PORT=1337`; no incluye base de datos ni Cloudinary.

## 5. Configuración general y CI

| Archivo | Responsabilidad | Observaciones |
| --- | --- | --- |
| `README.md` (raíz) | Descripción, integrantes, stack y pasos de instalación/ejecución. | El comando `pnpm run dev` del frontend no funciona con el script actual |
| `AGENTS.md` (raíz) | Instrucciones para agentes: comandos, entorno, arquitectura, deuda conocida y CodeGraph. | No modificar en esta fase |
| `.github/workflows/ci.yml` | CI en push/PR a `main`: pnpm 10 + Node 24, build backend, instalación web, warm-up de Render, lint/tsc no bloqueantes, build web y artefacto `.next`. | `STRAPI_HOST` fijo en el YAML; `STRAPI_TOKEN` desde secrets; sin despliegue |
| `.gitignore` (raíz) | Ignora `node_modules`, `.env*`, `.next`, `dist`, `build`, logs y comprimidos. | — |
| `web/.gitignore` / `backend/.gitignore` | Reglas específicas de cada app. | Backend ignora `.tmp`, `.strapi`, `dist`, uploads y logs |
| `opencode.jsonc` | Configura el MCP local de CodeGraph. | Sin trackear |
| `docs/` | Documentación de estructura, arquitectura y estado. | Generada en esta fase |

## 6. Clasificación del código

Esta sección separa explícitamente lo que existe de lo que está generado, lo que no se referencia y lo que está incompleto.

### 6.1 Archivos generados automáticamente

| Archivo / directorio | Origen | ¿Versionado? |
| --- | --- | --- |
| `web/next-env.d.ts` | Next.js | No (ignorado) |
| `web/.next/` | Build/dev de Next.js | No (ignorado) |
| `web/tsconfig.tsbuildinfo` | `tsc` incremental | No (ignorado) |
| `backend/types/generated/components.d.ts` | Strapi | Sí |
| `backend/types/generated/contentTypes.d.ts` | Strapi | Sí |
| `backend/dist/` | Build de Strapi | No (ignorado) |
| `backend/.tmp/` | Base SQLite / temporales | No (ignorado) |
| `backend/.strapi/` | Metadatos de Strapi | No (ignorado) |
| `backend/.strapi-updater.json` | Comprobación de actualizaciones | No (ignorado) |
| `backend/*.log`, `backend/tienda.tar.gz` | Artefactos locales de import/export | No (ignorado) |

### 6.2 Código aparentemente sin uso

No se marca como obsoleto: solo no tiene referencias directas desde la tienda.

| Elemento | Motivo |
| --- | --- |
| `backend/src/api/about`, `article`, `author`, `category`, `global` | Template de blog; ningún getter ni página del frontend los consume |
| `backend/src/components/shared/*` | Usados por los esquemas de blog, no por los de tienda |
| `backend/data/data.json` y `backend/data/uploads/` | Solo alimentan `seed:example` del blog |
| `web/public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Assets de `create-next-app` sin referencias en `app/` ni `components/` |
| `backend/src/admin/vite.config.example.ts` | Archivo de ejemplo; no se carga por convención |
| `web/app/page.tsx`: imports `Image` y `NavMenu` | Importados pero no usados |
| `backend/src/extensions/`, `backend/database/migrations/` | Solo contienen `.gitkeep` |
| `STRAPI_HOST` en `get-categories.ts`, `get-home-into.ts`, `get-product.ts` | Variables declaradas y no usadas (warnings de lint) |

### 6.3 Código incompleto o pendiente de verificar

| Elemento | Estado |
| --- | --- |
| `components/Pagination.tsx` | Sin props ni handlers; la página le pasa `pagination` y TypeScript lo rechaza |
| `components/SortBy.tsx` | Sin props, estado ni handlers |
| `lib/get-product.ts` | No devuelve `id`; deja `console.log(data)`; usa `$contains` |
| `app/categories/[categoryId]/page.tsx` | Enlaces de producto a `#`; no existe detalle |
| `lib/get-home-into.ts` | Nombre con typo; `image` puede ser `null` y `Hero` no lo maneja |
| `backend/scripts/seed.js` | No crea datos de tienda |
| `backend/.env.example` | No refleja DB ni Cloudinary |
| Autenticación de clientes / checkout | No hay código |
| Permisos públicos y alcance del API token | Viven en la base de datos; no verificables desde el repo |

### 6.4 Estructura futura recomendada (propuesta, no implementada)

> **Esta subsección es una propuesta.** Ninguno de estos archivos existe hoy y no se creó nada fuera de `docs/`.

Si se decide completar el catálogo, la estructura mínima coherente con el código actual sería:

```text
# PROPUESTA — NO EXISTE EN EL REPOSITORIO
web/
├── app/
│   └── products/
│       └── [slug]/
│           └── page.tsx          # detalle de producto
├── lib/
│   └── types.ts                  # Category, Product, PaginationMeta
└── ...
```

No se propone mover archivos existentes ni crear un workspace raíz: la separación actual de dos proyectos pnpm es válida y no es la causa de los problemas detectados.

## 7. Archivos compartidos y pruebas

- No hay paquetes ni tipos compartidos entre `web/` y `backend/`. El contrato es la API REST.
- No hay pruebas unitarias, de integración ni E2E; tampoco configuración de Vitest/Jest/Playwright.
- No hay migraciones propias ni scripts de base de datos fuera del seed de ejemplo.
- No hay configuración de despliegue del frontend en el repositorio; el CI solo compila y sube `.next`.

## 8. Verificación del contexto conocido

| Afirmación inicial | Resultado |
| --- | --- |
| `web/` es Next.js + React + TypeScript | Confirmado: Next 16.3.4, React 19.2.8, TypeScript ^5 |
| `backend/` es Strapi 5 | Confirmado: `@strapi/strapi 5.52.3` |
| Dos proyectos pnpm independientes, sin workspace raíz | Confirmado |
| App Router | Confirmado: `web/app/` |
| Rutas `/`, `/cart`, `/categories/[categoryId]` | Confirmado; `categoryId` es el slug |
| Carrito con Zustand y localStorage | Confirmado: `persist` con clave `cart-storage` |
| Comunicación centralizada en `web/lib/strapi.ts` | Confirmado: todos los getters usan `query` |
| `getImageUrl` gestiona URLs de imágenes | Confirmado |
| Cloudinary para nuevas subidas | Confirmado en `config/plugins.ts` |
| Content types principales: `product`, `product-category`, `home` | Confirmado |

Diferencias relevantes frente a la documentación existente:

- `README.md` indica `pnpm run dev` para el frontend, pero el script real es `nex dev`.
- `README.md` menciona SQLite como base local, mientras el `.env` local declara `postgres` y el código soporta ambos.
- `backend/.env.example` está desactualizado (`PORT=1337`, sin DB ni Cloudinary).
- `web/AGENTS.md` solo contiene el bloque generado por `next dev`; las reglas del proyecto están en el `AGENTS.md` raíz.
