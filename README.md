# Sistema de Cotizaciones - Monorepo (Logística)

Monorepo que contiene una API backend y una aplicación frontend para gestionar cotizaciones de servicios logísticos.

Resumen
- Propósito: Generar, listar y administrar cotizaciones, clientes, tarifas y reglas de cargo.
- Frontend: React + Vite (SPA)
- Backend: Node.js + Express + Sequelize + PostgreSQL

Estructura principal
- `backend/` - API REST, Dockerfile y `docker-compose.yml` para levantar API y Postgres.
- `frontend/` - Cliente React creado con Vite.

Iniciar localmente (desarrollo)
1. Backend

   cd backend
   cp .env.example .env   # ajustar valores
   npm install
   npm run dev

2. Frontend

   cd frontend
   npm install
   npm run dev

Levantar backend + Postgres con Docker

1. Ajusta `.env` en `backend/` y luego:

   docker-compose up --build

