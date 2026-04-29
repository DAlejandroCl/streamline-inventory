/* ============================================================
   EXPRESS SERVER
   Orden de middleware crítico:
   1. Morgan (logging)
   2. CORS con credentials — necesario para cookies cross-origin
   3. cookie-parser — antes de cualquier ruta que lea cookies
   4. Body parsing (JSON para rutas no-multipart)
   5. Static files — /public sirve /public/uploads/products/
   6. Rutas
   7. Swagger
   8. Error handler — siempre último
   ============================================================ */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import productRouter  from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import authRouter     from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const server = express();

/* ---- LOGGING ---------------------------------------------- */
if (process.env.NODE_ENV !== "test") {
  server.use(morgan("dev"));
}

/* ---- CORS ------------------------------------------------- */
server.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  })
);

/* ---- COOKIE PARSER --------------------------------------- */
server.use(cookieParser());

/* ---- BODY PARSING ---------------------------------------- */
server.use(express.json());

/* ---- STATIC FILES ----------------------------------------
   Archivos subidos: GET /public/uploads/products/filename.jpg
   El controller guarda image_url = /public/uploads/products/filename
   El frontend construye: VITE_API_URL + image_url
   ---------------------------------------------------------- */
server.use("/public", express.static(path.join(__dirname, "../public")));

/* ---- SWAGGER ---------------------------------------------- */
const swaggerOptions = {
  customCss: `.swagger-ui .topbar { background-color: #0f172a; }`,
  customSiteTitle: "Streamline Inventory API",
};

/* ---- ROUTES ----------------------------------------------- */
server.get("/", (_req, res) => {
  res.json({ message: "Streamline API is running", docs: "/docs", version: "1.0.0" });
});

server.use("/api/auth",       authRouter);
server.use("/api/products",   productRouter);
server.use("/api/categories", categoryRouter);
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

/* ---- GLOBAL ERROR HANDLER (debe ser último) -------------- */
server.use(errorHandler);

export default server;
