/* ============================================================
   EXPRESS SERVER
   Orden de middleware — crítico, no reordenar:

   1.  Helmet          — security headers en TODA respuesta
   2.  Global rate limiter — 100 req/15min por IP (no /docs)
   3.  Morgan          — logging de requests
   4.  CORS            — credentials:true para cookies
   5.  cookie-parser   — antes de rutas que lean cookies
   6.  Body parsing    — JSON para rutas no-multipart
   7.  Static files    — /public sirve uploads
   8.  Routes          — auth, products, categories
   9.  Swagger         — /docs (skippeado del rate limiter)
   10. Error handler   — SIEMPRE último (firma de 4 params)
   ============================================================ */

import express        from "express";
import cors           from "cors";
import cookieParser   from "cookie-parser";
import morgan         from "morgan";
import path           from "path";
import { fileURLToPath } from "url";
import swaggerUi      from "swagger-ui-express";
import swaggerSpec    from "./config/swagger.js";
import { helmetMiddleware, globalRateLimiter } from "./config/security.js";
import productRouter  from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import authRouter     from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const server = express();

/* ---- 1. SECURITY HEADERS (helmet) ------------------------ */
server.use(helmetMiddleware);

/* ---- 2. GLOBAL RATE LIMITER ------------------------------ */
server.use(globalRateLimiter);

/* ---- 3. LOGGING ------------------------------------------ */
if (process.env.NODE_ENV !== "test") {
  server.use(morgan("dev"));
}

/* ---- 4. CORS --------------------------------------------- */
server.use(
  cors({
    origin:      process.env.CORS_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  })
);

/* ---- 5. COOKIE PARSER ------------------------------------ */
server.use(cookieParser());

/* ---- 6. BODY PARSING ------------------------------------- */
server.use(express.json());

/* ---- 7. STATIC FILES ------------------------------------- */
server.use("/public", express.static(path.join(__dirname, "../public")));

/* ---- 8. ROUTES ------------------------------------------- */
server.get("/", (_req, res) => {
  res.json({ message: "Streamline API is running", docs: "/docs", version: "1.0.0" });
});

server.use("/api/auth",       authRouter);
server.use("/api/products",   productRouter);
server.use("/api/categories", categoryRouter);

/* ---- 9. SWAGGER (excluido del rate limiter via skip) ----- */
const swaggerOptions = {
  customCss:       `.swagger-ui .topbar { background-color: #0f172a; }`,
  customSiteTitle: "Streamline Inventory API",
};
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

/* ---- 10. GLOBAL ERROR HANDLER (debe ser último) ---------- */
server.use(errorHandler);

export default server;
