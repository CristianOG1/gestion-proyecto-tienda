# Tienda Web - Proyecto

## Proyecto Tienda
E-commerce funcional con panel de administración para gestionar productos y categorías, carrito persistente, pagos con Stripe Checkout en modo prueba e imágenes alojadas en Cloudinary.

## Integrantes
* Kevin David Gonzalez Franco
* Isaac Hernandez Perez
* Leslie Denise Mata Luevano
* Cristian Olmos Gonzalez
* Mauricio Yahir Roa Sanchez

## Tecnologías utilizadas
**Frontend:**
* Next.js, React y TypeScript
* Zustand (estado del carrito)
* Vitest (pruebas unitarias)
* Stripe Checkout (modo prueba)

**Backend y Datos:**
* Strapi v5
* PostgreSQL / SQLite
* Cloudinary (almacenamiento de imágenes)

**Infraestructura y CI/CD:**
* Docker y Docker Compose
* GitHub Actions

## Arquitectura y microservicios
1. **Frontend (`web/`, puerto `3000`):** interfaz en Next.js App Router, carrito en cliente y API route `/api/checkout` para Stripe.
2. **Backend (`backend/`, puerto `8888`):** Strapi v5 con API REST, panel de administración y gestión de medios en Cloudinary.

## Requisitos e instalación
Necesitas [Node.js 20](https://nodejs.org/) y `pnpm` (v10) — o Docker + Docker Compose.

1. Clona el repositorio:
```bash
git clone https://github.com/CristianOG1/gestion-proyecto-tienda.git
cd gestion-proyecto-tienda
```

2. Instala dependencias en cada proyecto (no hay workspace en la raíz):
```bash
cd backend && pnpm install
cd ../web && pnpm install
```

3. Configura las variables de entorno copiando los archivos de ejemplo:
- `web/.env.local` (desde `web/.env.example`):
  - `STRAPI_HOST`: URL del backend (ej. `http://localhost:8888`)
  - `STRAPI_TOKEN`: API token de lectura de Strapi
  - `STRIPE_SECRET_KEY`: clave secreta de prueba de Stripe (`sk_test_...`)
- `backend/.env` (desde `backend/.env.example`):
  - `PORT`: `8888`
  - `DATABASE_CLIENT`: `sqlite` o `postgres` (más `DATABASE_FILENAME` o `DATABASE_URL` / credenciales)
  - `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`
  - Claves de seguridad de Strapi (`APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY`)

## Ejecución en desarrollo local
Levanta ambos servicios en terminales separadas:

**Backend (Strapi — http://localhost:8888):**
```bash
cd backend
pnpm develop
```

**Frontend (Next.js — http://localhost:3000):**
```bash
cd web
pnpm dev
```

## Ejecución con Docker Compose
Con `web/.env.local`, `backend/.env` y `STRAPI_TOKEN` exportado en tu entorno:

```bash
docker compose up --build -d
docker compose ps
docker compose down
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8888`

## Pruebas y calidad del código
Desde la carpeta `web/`:

```bash
pnpm test    # pruebas unitarias con Vitest
pnpm lint    # revisión de código con ESLint
pnpm build   # compilación de producción
```

## Flujo de trabajo con Git
1. Actualiza `main`: `git pull origin main`.
2. Crea una rama con prefijo según el tipo de cambio: `feature/`, `fix/` o `docs/` (ej. `feature/carrito-compras-zustand`).
3. Haz commits pequeños con mensajes claros (ej. `fix(web): corregir idioma del layout`).
4. Sube la rama con `git push -u origin nombre-de-la-rama` y abre un Pull Request hacia `main`.
