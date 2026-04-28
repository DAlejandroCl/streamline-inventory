/* ============================================================
   EXPRESS SERVER
   Middleware order is critical:
   1. Morgan (request logging)
   2. CORS — must allow credentials for cookie auth
   3. cookie-parser — must come before routes that read cookies
   4. Body parsing
   5. Static files
   6. Routes
   7. Swagger docs
   8. Global error handler — MUST be last
   ============================================================ */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import authRouter from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

/* ---- LOGGING ---------------------------------------------- */

if (process.env.NODE_ENV !== "test") {
  server.use(morgan("dev"));
}

/* ---- CORS ------------------------------------------------- */

/*
 * credentials: true is required for the browser to send
 * httpOnly cookies on cross-origin requests.
 * origin must be explicit (not "*") when credentials are used.
 */
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

/* ---- STATIC FILES ---------------------------------------- */

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

server.use("/api/auth", authRouter);
server.use("/api/products", productRouter);
server.use("/api/categories", categoryRouter);
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

/* ---- GLOBAL ERROR HANDLER (must be last) ----------------- */

server.use(errorHandler);

export default server;
