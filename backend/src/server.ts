/* ============================================================
   EXPRESS SERVER
   Middleware order matters:
   1. CORS and body parsing
   2. Static assets
   3. Application routes
   4. API documentation
   5. Global error handler (MUST be last)
   ============================================================ */

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import router from "./routes/product.routes.js";
import { errorHandler } from "./middlewares/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

/* ---- CORS ------------------------------------------------- */

server.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:5173" }));

/* ---- BODY PARSING ----------------------------------------- */

server.use(express.json());

/* ---- STATIC FILES ----------------------------------------- */

server.use("/public", express.static(path.join(__dirname, "public")));

/* ---- SWAGGER CONFIGURATION -------------------------------- */

const swaggerOptions = {
  customCss: `
    .swagger-ui .topbar { background-color: #0f172a; }
    .swagger-ui .topbar-wrapper { display: flex; align-items: center; }
    .swagger-ui .topbar-wrapper img,
    .swagger-ui .topbar-wrapper svg { display: none !important; }
    .swagger-ui .topbar-wrapper::before {
      content: '';
      display: block;
      width: 220px;
      height: 60px;
      background-image: url('/public/logo.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: left center;
    }
  `,
  customSiteTitle: "Streamline Inventory API",
};

/* ---- ROUTES ----------------------------------------------- */

server.get("/", (_req, res) => {
  res.json({ message: "API is running", docs: "/docs" });
});

server.use("/api/products", router);

server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

/* ---- GLOBAL ERROR HANDLER (must be last) ------------------ */

server.use(errorHandler);

export default server;