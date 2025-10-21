# Frontend - Panel Admin (React + Vite)

Frontend desarrollado con React y Vite. Interfaz para administrar cotizaciones, clientes, tarifas y usuarios.

Resumen
- SPA creada con React (Vite) que consume la API en el backend.

Tecnologías principales
- React 19 + Vite
- Axios para llamadas HTTP
- React Router para navegación
- Bootstrap para estilos
- SweetAlert2 para alertas

Variables de entorno
- `VITE_API_URL` - URL base para las llamadas a la API (ej: `http://localhost:4000/api`). Se define en `frontend/.env`.

Comandos
1. Instalar dependencias:

   npm install

2. Ejecutar en desarrollo:

   npm run dev



Notas
- Asegúrate de que `VITE_API_URL` apunte a la API levantada (por defecto el `.env` contiene `http://localhost:3000/api`).
- Si tienes CORS en el backend, habilita el origen del frontend o usa un proxy durante el desarrollo.
