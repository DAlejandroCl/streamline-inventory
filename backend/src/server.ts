/* ============================================================
   EXPRESS SERVER
   El orden del middleware es crítico:
   1. CORS
   2. Body parsing
   3. Static files
   4. Routes
   5. Swagger docs
   6. Global error handler — DEBE ir último
   ============================================================ */

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

/* ---- CORS ------------------------------------------------- */

server.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  })
);

/* ---- BODY PARSING ----------------------------------------- */

server.use(express.json());

/* ---- STATIC FILES ----------------------------------------- */

server.use("/public", express.static(path.join(__dirname, "public")));

/* ---- SWAGGER ---------------------------------------------- */

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { background-color: #0f172a; }
    .swagger-ui .topbar-wrapper img,
    .swagger-ui .topbar-wrapper svg { display: none !important; }
  `,
  customSiteTitle: "Streamline Inventory API",
};

/* ---- ROUTES ----------------------------------------------- */

server.get("/", (_req, res) => {
  res.json({
    message: "Streamline API is running",
    docs: "/docs",
    version: "1.0.0",
  });
});

server.use("/api/products", productRouter);
server.use("/api/categories", categoryRouter);
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

/* ---- GLOBAL ERROR HANDLER (debe ir último) ---------------- */

server.use(errorHandler);

export default server;
