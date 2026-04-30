/* ============================================================
   AUTH ROUTES
   authRateLimiter se aplica SOLO en /login:
   - 10 intentos fallidos / 15min por IP
   - skipSuccessfulRequests: true (login OK no penaliza)
   - Mensaje genérico para evitar user enumeration
   ============================================================ */

import { Router } from "express";
import * as authController  from "../controllers/auth.controllers.js";
import { requireAuth }      from "../middlewares/auth.middleware.js";
import { authRateLimiter }  from "../config/security.js";

const authRouter = Router();

authRouter.post("/login",  authRateLimiter, authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me",      requireAuth, authController.me);

export default authRouter;
