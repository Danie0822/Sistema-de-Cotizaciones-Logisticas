# Backend - API de Cotizaciones (Logística)

Proyecto backend desarrollado con Node.js, Express y Sequelize conectado a PostgreSQL.

Resumen
- API REST para gestión de cotizaciones, clientes, tarifas, reglas de cargo y usuarios.

Tecnologías principales
- Node.js (v18+)
- Express (framework HTTP)
- Sequelize (ORM) con PostgreSQL
- JWT para autenticación
- Docker / docker-compose para despliegue local
- Documentacion de cada ruta mendiante Swagger

Archivos importantes
- `src/server.js` - punto de entrada del servidor
- `src/app.js` - configuración de middlewares y rutas
- `src/models` - modelos Sequelize
- `docker-compose.yml` / `Dockerfile` - contenedores para API y Postgres

Variables de entorno (usar `.env` o `.env.example`)
- API_CONTAINER_NAME - nombre del contenedor API (opcional)
- API_PORT - puerto donde corre la API (ej: 4000)
- DB_USER, DB_PASSWORD, DB_NAME
- DB_EXTERNAL_PORT / DB_INTERNAL_PORT - puerto de Postgres
- JWT_SECRET_ADMIN / JWT_SECRET_USER
- NODE_ENV

Comandos (local sin Docker)
1. Instalar dependencias:

   npm install

2. Ejecutar migraciones (si usas `sequelize-cli`):

   npm run migrate

3. Ejecutar en modo desarrollo (con nodemon):

   npm run dev


Ejecutar con Docker (recomendado para entorno local aislado)
1. Copia/ajusta el archivo `.env` en el directorio `backend/` con las variables necesarias.
2. Construir y levantar los servicios:

   docker-compose up --build

Esto levantará dos contenedores: `api` y `db` (Postgres). Asegúrate de que los puertos en `.env` no choquen con otros servicios.

