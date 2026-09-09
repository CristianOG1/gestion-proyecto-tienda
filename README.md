# Tienda Web

## Proyecto Tienda
Este es un proyecto de tienda online donde se desarrollo un e-commerce funcional con su propio panel de administración para administrar productos y categorías. Todo está conectado a la nube para que la información y las fotos de los productos se mantengan de forma persistente y segura.

## Integrantes
* Kevin David Gonzalez Franco
* Isaac Hernandez Perez
* Leslie Denise Mata Luevano
* Cristian Olmos Gonzalez
* Mauricio Yahir Roa Sanchez

## Tecnologías utilizadas
**Frontend:**
* Next.js y React
* TypeScript

**Backend y Datos:**
* Strapi v5
* SQLite para la base de datos local de imagenes y datos

## Arquitectura y microservicios
El proyecto funciona bajo una arquitectura separada:
1. **Frontend (Next.js):** Se encarga de la interfaz visual y la experiencia del usuario. Consume los datos haciendo peticiones a la API.
2. **Backend (Strapi):** Gestiona la lógica de negocio, la seguridad (tokens) y el panel de administrador.

## Requisitos e instalación
Para correr este proyecto en tu computadora necesitas tener instalado [Node.js](https://nodejs.org/) y el gestor de paquetes `pnpm`.

1. Clona este repositorio:
`
git clone https://github.com/CristianOG1/proyecto-tienda.git
`

2. Instala las dependencias en las carpetas correspondientes:
`Entra al frontend y backend para instalar
pnpm install
`

3. Crea tus archivos `.env` locales para conectar tu propia base de datos.

## Instrucciones de ejecución
Para trabajar en modo desarrollo, necesitas tener ambas partes del proyecto en terminales separadas:

**Levantar el Backend (Strapi):**
\```bash
cd backend
pnpm run develop
\```

**Levantar el Frontend (Next.js):**
\```bash
cd web
pnpm run dev
\```
