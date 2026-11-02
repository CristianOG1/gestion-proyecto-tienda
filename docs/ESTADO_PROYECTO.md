# Estado del proyecto

> Evaluación basada en análisis estático, en la exploración con CodeGraph y en la ejecución de `pnpm lint` y `pnpm exec tsc --noEmit` dentro de `web/`. No se levantaron Next.js ni Strapi, no se consultó la base de datos y no se inspeccionaron tokens ni permisos reales.

## 1. Resumen ejecutivo

La tienda tiene un núcleo funcional: home con hero y categorías, listado de productos por categoría, carrito local persistente y backend Strapi con Cloudinary. Todavía no tiene detalle de producto, ordenamiento, paginación real, checkout, autenticación de clientes ni pruebas.

El proyecto compila en CI, pero la calidad está sostenida por configuraciones permisivas: `next.config.ts` ignora errores de TypeScript y el CI ejecuta lint/tipos con `continue-on-error`. Hay además dos problemas que afectan el uso real: el script `dev` del frontend está roto y el carrito identifica productos por un `id` que nunca llega.

## 2. Metodología y verificaciones

| Actividad | Resultado |
| --- | --- |
| Lectura de `AGENTS.md` raíz, `README.md`, `web/AGENTS.md`, `web/CLAUDE.md` y READMEs de cada app | Completada |
| Exploración con CodeGraph de páginas, componentes, getters, store y content types | Completada |
| Lectura directa de configuración, esquemas, CI y manifiestos | Completada |
| `cd web && pnpm lint` | Falla: 1 error y 9 warnings |
| `cd web && pnpm exec tsc --noEmit` | Falla: 8 errores |
| `cd backend && pnpm build` | No ejecutado en esta fase |
| Tests | No existen |
| Servicios en vivo / base de datos / permisos | No verificados |

Salida resumida de `tsc`:

- `app/categories/[categoryId]/page.tsx`: `product` implícito `any`; prop `pagination` inexistente en `Pagination`.
- `components/Categories.tsx`: `category` e `index` implícitos `any`.
- `components/Hero.tsx`: `image` puede ser `null`.
- `components/Menu.tsx`: `Category` no existe.
- `lib/get-categories.ts` y `lib/get-product.ts`: parámetros implícitos `any`.

## 3. Funcionalidades implementadas y verificadas

| Funcionalidad | Evidencia | Estado |
| --- | --- | --- |
| Home con hero editable desde Strapi | `app/page.tsx`, `components/Hero.tsx`, `lib/get-home-into.ts`, content type `home` | Verificada en código |
| Grilla de categorías y navegación | `components/Categories.tsx`, `components/Menu.tsx`, `lib/get-categories.ts` | Verificada en código |
| Listado de productos por slug de categoría | `app/categories/[categoryId]/page.tsx`, `lib/get-product.ts` | Verificada en código |
| Añadir al carrito y contador en el menú | `components/AddToCartButton.tsx`, `lib/cart-store.ts`, `components/Menu.tsx` | Verificada en código; condicionada por el bug de `id` |
| Carrito: cantidades, eliminar, vaciar, total | `app/cart/page.tsx`, `lib/cart-store.ts` | Verificada en código |
| Persistencia del carrito en `localStorage` | `persist(..., { name: "cart-storage" })` | Verificada en código |
| Subida de imágenes a Cloudinary | `config/plugins.ts`, provider instalado | Verificada en configuración |
| Resolución de URLs Cloudinary/legacy | `lib/image-url.ts` usada por los tres getters | Verificada en código |
| Panel de administración Strapi en español | `src/admin/app.ts` (`locales: ["es"]`) | Verificada en configuración |
| Content types de tienda y blog | `src/api/*/content-types/*/schema.json` | Verificada en código |
| CI que compila backend y frontend | `.github/workflows/ci.yml` | Verificada en configuración |

## 4. Funcionalidades parciales

| Elemento | Situación actual |
| --- | --- |
| Carrito | Funciona en el navegador, pero no identifica productos de forma estable ni conecta con backend |
| Listado de productos | Consulta y pinta productos, pero no filtra `isActive`, no pagina ni ordena de verdad y no enlaza a detalle |
| Categorías | Se muestran y navegan, pero la consulta se duplica en la home y no hay página de categoría inválida |
| Imágenes | Se resuelven URLs absolutas/relativas, pero se renderizan con `<img>` sin optimización |
| Paginación | Strapi devuelve `meta.pagination`, pero la UI no lo usa |
| Ordenamiento | Existe el control visual, no la lógica |
| Stock | El campo existe en el schema, pero no se muestra ni se valida |
| Descripción de producto | Se consulta y mapea, pero no se renderiza |
| Manejo de errores/loading | Solo hay fallbacks silenciosos; no hay estados de carga ni mensajes de error |
| SEO | Home define metadata propia; layout conserva metadata de `create-next-app`; no hay metadata por producto |

## 5. Interfaces sin comportamiento funcional

| Componente | Qué aparenta | Qué hace realmente |
| --- | --- | --- |
| `components/Pagination.tsx` | Botones “Anterior / Siguiente” | Nada: no acepta props, no tiene `onClick` ni estado |
| `components/SortBy.tsx` | Selector “Default / By price” | Nada: no acepta props, no tiene `onClick` ni estado |
| Tarjetas de producto (`CategoryPage`) | Enlaces a detalle | `href="#"`; no hay ruta de detalle |
| `Hero` | Botón “Show Categories” | Ancla a `#categories`; funciona solo si la sección existe en la home |

## 6. Deuda conocida (`AGENTS.md`) vs hallazgos nuevos

| Tema | Lo que dice `AGENTS.md` | Verificación actual | Clasificación |
| --- | --- | --- | --- |
| Script `dev` del frontend | `"dev": "nex dev"` no existe; usar `pnpm exec next dev` | Confirmado en `web/package.json` | Conocido, vigente |
| Lint | Falla en `Menu.tsx` por `react-hooks/set-state-in-effect` | Confirmado: 1 error y 9 warnings | Conocido, vigente |
| TypeScript | Errores previos por `any`, `Category`, props de `Pagination`, `image` nullable | Confirmado: 8 errores | Conocido, vigente |
| `Pagination` | No acepta props y sus botones no hacen nada | Confirmado | Conocido, vigente |
| `SortBy` | Sin manejadores | Confirmado | Conocido, vigente |
| `getProducts` sin `id` | El carrito usa `undefined` y puede fusionar productos | Confirmado; además `key={item.id}` queda `undefined` | Conocido, vigente |
| `getProducts` con `console.log` | Queda un log de datos | Confirmado | Conocido, vigente |
| `getCategories` duplicado | `layout.tsx` y `Categories.tsx` la llaman por separado | Confirmado | Conocido, vigente |
| pnpm/CI | CI fija pnpm 10; `web` declara pnpm 12.3.4 | Confirmado; el CI usa `pnpm/action-setup@v4` con `version: 10` | Conocido, vigente |
| `STRAPI_HOST` en CI | Fijo en el YAML; `STRAPI_TOKEN` desde secrets | Confirmado | Conocido, vigente |
| Cloudinary y entorno | Provider configurado; requiere `CLOUDINARY_*` | Confirmado; `.env.example` no las incluye | Conocido, vigente |
| Base de datos local | `.env` puede apuntar a PostgreSQL; default del código es SQLite | Confirmado | Conocido, vigente |
| `next/image` | Solo permite `res.cloudinary.com`; el catálogo usa `<img>` | Confirmado; agregar host de Render antes de migrar | Conocido, vigente |
| `get-home-into.ts` | Typo histórico | Confirmado | Conocido, vigente |
| Content types de blog | `about`, `article`, `author`, `category`, `global` sin uso en la tienda | Confirmado | Conocido, vigente |
| `next.config.ts` | Ignora errores de TypeScript | Confirmado | Conocido, vigente |
| Tests | No hay runner ni pruebas | Confirmado | Conocido, vigente |
| `query` sin `res.ok` | No documentado en `AGENTS.md` | `lib/strapi.ts` parsea cualquier respuesta como JSON | **Nuevo** |
| Slug sin codificar | No documentado | `get-product.ts` interpola `categoryId` directamente | **Nuevo** |
| Filtro `$contains` | No documentado | Puede coincidir con slugs parciales | **Nuevo** |
| `isActive` sin filtrar | No documentado | La consulta no excluye productos inactivos publicados | **Nuevo** |
| Categoría inválida | No documentado | No hay `notFound()`; se muestra “No se encontraron Productos” | **Nuevo** |
| `lang="en"` | No documentado | `layout.tsx` declara inglés con contenido en español | **Nuevo** |
| `CartItem.image` nullable | No documentado | `getImageUrl` puede devolver `null`; el tipo exige `string` | **Nuevo** |
| `key={index}` en categorías | No documentado | `Categories.tsx` usa el índice | **Nuevo** |
| CORS y rate limiting | No documentado | `strapi::cors` sin opciones; no hay rate limiting en el repo | **Nuevo** |
| Versiones Strapi/Cloudinary | No documentado | Core `5.52.3` vs provider `^5.60.0` | **Nuevo, a verificar** |
| `@strapi/plugin-cloud` | No documentado | Instalado en `backend/package.json`, sin referencia en `config/` | **Nuevo, a verificar** |

## 7. Problemas priorizados

### P0 — bloquean o rompen el flujo principal

| # | Problema | Evidencia | Impacto | Recomendación | Origen |
| --- | --- | --- | --- | --- | --- |
| 1 | El carrito identifica productos con `undefined` | `getProducts` devuelve `{name, slug, description, image, price}` sin `id`; `CategoryPage` pasa `product.id`; `cart-store` busca por `id` | Productos distintos pueden fusionarse en una línea; claves `undefined` en React | Incluir un identificador estable (`documentId` o `slug`) en el mapeo y usarlo como clave | Conocido |
| 2 | `pnpm dev` falla en el frontend | `web/package.json`: `"dev": "nex dev"`; no existe el binario `nex` | No se puede arrancar Next con el comando documentado | Cambiar a `"dev": "next dev"` y actualizar README/AGENTS | Conocido |

### P1 — calidad, seguridad y comportamiento engañoso

| # | Problema | Evidencia | Impacto | Recomendación | Origen |
| --- | --- | --- | --- | --- | --- |
| 3 | Baseline de tipos y lint roto | `pnpm lint`: 1 error y 9 warnings; `tsc --noEmit`: 8 errores | Regresiones no detectadas; CI no bloquea | Corregir errores y luego quitar `ignoreBuildErrors` y `continue-on-error` | Conocido |
| 4 | `query` no valida la respuesta HTTP | `lib/strapi.ts` hace `res.json()` sin `res.ok` | Un 401/500 se trata como datos; la UI muestra listas vacías sin explicación | Comprobar `res.ok`, tipar errores y propagar un estado de error | **Nuevo** |
| 5 | El slug se interpola sin codificar | `get-product.ts`: `` `...=${categoryId}&...` `` | Un valor con `&`/`?` puede alterar la query | Usar `encodeURIComponent` o `URLSearchParams` | **Nuevo** |
| 6 | `Pagination` y `SortBy` aparentan funcionalidad | Componentes sin handlers; `Pagination` ni siquiera acepta `pagination` | El usuario ve controles que no hacen nada; además hay error de TS | Implementarlos con `page`/`pageSize`/`sort` o retirarlos hasta que existan | Conocido |
| 7 | `getCategories` se ejecuta dos veces por request | `layout.tsx` y `Categories.tsx` la llaman | Trabajo duplicado contra Strapi | Usar `cache()` de React o pasar las categorías desde el layout | Conocido |
| 8 | Productos inactivos no se filtran | `product.isActive` existe, pero la query solo filtra por categoría | Un producto publicado pero inactivo sigue visible | Añadir `filters[isActive][$eq]=true` o regla de negocio equivalente | **Nuevo** |
| 9 | Filtro por slug con `$contains` | `get-product.ts` usa `slug][$contains]` | Slugs parciales pueden mezclar productos de otra categoría | Usar `$eq` si el parámetro es el slug exacto | **Nuevo** |

### P2 — deuda estructural y de producto

| # | Problema | Evidencia | Impacto | Recomendación | Origen |
| --- | --- | --- | --- | --- | --- |
| 10 | Content types de blog sin uso en la tienda | `about`, `article`, `author`, `category`, `global`, componentes `shared.*` | Superficie de API y admin innecesaria; confusión entre `category` y `product-category` | Decidir si se eliminan/archivan o se documentan como template | Conocido |
| 11 | Seed y catálogo no coinciden | `seed.js` siembra blog; no crea productos, categorías de producto ni home | Un entorno nuevo no queda con datos de tienda | Crear un seed de tienda o documentar que el catálogo se carga desde el admin | Conocido |
| 12 | `.env.example` desactualizado | Dice `PORT=1337`; no incluye DB ni Cloudinary | Facilita configuraciones incompletas | Actualizarlo con todas las variables y sin secretos reales | Conocido |
| 13 | README desactualizado | Instruye `pnpm run dev`, que falla; no menciona Cloudinary ni Postgres | Onboarding incorrecto | Reconciliar con el estado real | Conocido |
| 14 | Sin tipos de dominio en el frontend | `Menu.tsx` usa `Category` sin definir; múltiples `any` implícitos | Errores de TS y menor seguridad al cambiar la API | Definir `Category`, `Product`, `PaginationMeta` y tipar los getters | Conocido |
| 15 | Sin detalle de producto | No hay ruta `app/products/[slug]` ni equivalente | No se puede consultar un producto individual | Definir la ruta y su consulta por slug | **Nuevo** |
| 16 | Sin página 404 de categoría | No hay `notFound()` en `CategoryPage` | Slug inválido muestra listado vacío en vez de 404 | Validar la categoría o el resultado y llamar `notFound()` | **Nuevo** |
| 17 | Imágenes sin optimización | `<img>` en hero, categorías, productos y carrito | Peor LCP y ancho de banda | Migrar a `next/image` agregando el host de Render si aún se usan URLs relativas | Conocido |
| 18 | Metadata/SEO incompletos | Layout con `Create Next App`; sin metadata por producto | Mal SEO y títulos genéricos | Añadir `generateMetadata` por ruta | **Nuevo** |
| 19 | `lang="en"` con contenido en español | `app/layout.tsx` | Atributo incorrecto para accesibilidad/SEO | Cambiar a `lang="es"` | **Nuevo** |
| 20 | CORS y rate limiting sin configurar | `config/middlewares.ts` sin opciones de CORS; sin rate limit | Superficie de abuso si la API queda pública | Definir orígenes permitidos y evaluar rate limiting | **Nuevo** |
| 21 | Posible desalineación de versiones | Strapi core `5.52.3` vs provider Cloudinary `^5.60.0` | Riesgo de incompatibilidad al actualizar | Verificar compatibilidad antes de tocar dependencias | **Nuevo, a verificar** |

### P3 — mejoras menores

| # | Problema | Evidencia | Recomendación | Origen |
| --- | --- | --- | --- | --- |
| 22 | Nombre `get-home-into.ts` | Typo histórico; `Hero.tsx` importa `@/lib/get-home-into` | Renombrar junto con el import en una tarea controlada | Conocido |
| 23 | `console.log(data)` en producción | `get-product.ts` | Eliminar o condicionar a desarrollo | Conocido |
| 24 | Imports y assets sin uso | `Image`/`NavMenu` en `app/page.tsx`; SVGs de `create-next-app` | Limpiar cuando se toque cada archivo | Conocido |
| 25 | `key={index}` en categorías | `Categories.tsx` | Usar `category.slug` | **Nuevo** |
| 26 | `CartItem.image` no admite `null` | `cart-store.ts` declara `image: string`; el getter puede devolver `null` | Alinear tipos o usar placeholder | **Nuevo** |
| 27 | Carrito sin versionado de persistencia | `persist` solo con `name` | Añadir `version`/`migrate` si cambia el shape | Conocido |
| 28 | Accesibilidad | `href="#"`, `alt="product image"`, botones `+/-` sin `aria-label` | Mejorar etiquetas y navegación por teclado | **Nuevo** |
| 29 | `robots.txt` sin reglas | `backend/public/robots.txt` solo tiene comentarios | Definir reglas si el admin no debe indexarse | **Nuevo** |

## 8. Seguridad

Confirmado en el repositorio:

- Los secretos se leen de variables de entorno; `.env` y `.env.local` están ignorados por git y no se incluyen en este documento.
- El token de API se usa solo en el servidor (no hay `NEXT_PUBLIC_*`).
- El upload deniega SVG y ejecutables, y restringe tipos permitidos.
- El middleware de seguridad define CSP con Cloudinary para imágenes y media.
- El panel admin exige los secretos de Strapi.
- El CI usa `permissions: contents: read` y toma `STRAPI_TOKEN` de `secrets`.

Riesgos y verificaciones pendientes:

- El token Bearer de larga duración tiene un alcance que no puede verificarse desde el repo; conviene revisar y rotar periódicamente.
- No hay rate limiting explícito en la configuración del repo.
- `strapi::cors` no tiene orígenes configurados; hay que confirmar el default efectivo de la versión.
- No hay autenticación de clientes ni protección de rutas; el carrito es anónimo y local.
- No hay validación de entrada en el frontend para el slug de categoría.
- Los permisos públicos y del API token viven en la base de datos, no en el código.
- `robots.txt` no bloquea `/admin`; la seguridad real depende de la autenticación del panel, no del ocultamiento.

## 9. Deuda técnica transversal

- **Sin tipos compartidos ni contrato formal:** el frontend consume JSON sin interfaces; los cambios de schema pueden romper la UI sin aviso.
- **Sin tests:** no hay red de seguridad para getters, carrito ni flujos de páginas.
- **Sin migraciones propias:** el esquema depende de Strapi y de la base configurada.
- **Dos fuentes de verdad para entorno:** código vs `.env`/`.env.example`/README.
- **UI de catálogo incompleta:** controles inertes y ausencia de detalle.
- **CI que no bloquea calidad:** lint, tipos y warm-up externo condicionan la confiabilidad.
- **Template de blog acoplado:** content types y datos de ejemplo que no pertenecen a la tienda.

## 10. Recomendaciones para continuar

Orden sugerido, sin implementar aún:

1. **Cerrar P0:** corregir el identificador del carrito y el script `dev`.
2. **Recuperar un baseline limpio:** resolver errores de `tsc` y lint; después quitar `ignoreBuildErrors` y `continue-on-error` del CI.
3. **Endurecer el cliente HTTP:** `res.ok`, `encodeURIComponent`/`URLSearchParams`, timeouts y estados de error/loading.
4. **Tipar el dominio:** `Category`, `Product`, `PaginationMeta`, respuestas de Strapi y errores.
5. **Decidir alcance de catálogo:** implementar detalle de producto, orden y paginación reales, filtrar `isActive` y validar stock; o retirar la UI inerte.
6. **Definir compra:** si habrá checkout, decidir backend de órdenes, autenticación y validación de stock antes de construir UI.
7. **Limpiar el template:** archivar/eliminar content types de blog y crear un seed de tienda, o documentarlos explícitamente como no usados.
8. **Actualizar documentación operativa:** README y `.env.example`.
9. **Añadir pruebas y gates:** tests de los getters y del carrito, y lint/tipos bloqueantes en CI.
10. **Mejorar entrega:** `next/image`, metadata por ruta, `lang="es"` y accesibilidad.

## 11. Próximo paso recomendado

Antes de agregar funcionalidades nuevas, resolver los dos P0 y dejar el baseline de tipos limpio. Sin eso, cualquier feature de catálogo o carrito se construirá sobre identificadores inestables y errores que el CI no detecta. Después, el siguiente incremento con más valor es el **detalle de producto**, porque habilita descripción, stock, imágenes múltiples y el futuro checkout.

## 12. Limitaciones de este análisis

- No se ejecutaron Next.js ni Strapi, por lo que los flujos se infieren del código y la configuración, no de una prueba en vivo.
- No se inspeccionaron la base de datos, los permisos del rol público ni el alcance real del API token.
- No se verificó el comportamiento del deploy de Render ni el destino de despliegue del frontend, porque no están definidos en el repositorio.
- No se modificó lógica de negocio, configuración, dependencias ni variables de entorno durante esta fase.
- El estado del árbol de trabajo incluye un cambio local sin commit en `web/lib/get-categories.ts` (añade `console.error`), y `AGENTS.md`/`opencode.jsonc` sin trackear; la documentación refleja ese estado.
