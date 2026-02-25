module.exports = {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentación generada automáticamente por Swagger.",
    },
    servers: [
      {
        url: "http://localhost:4000/api", // 🔹 Ajusta según la configuración de tu API
      },
    ],
    components: {
      // The important part: define securitySchemes
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // optional but clarifies it's a JWT
        },
      },
      // ... your other schemas (e.g., Area, ErrorResponse) ...
    },
  };
  