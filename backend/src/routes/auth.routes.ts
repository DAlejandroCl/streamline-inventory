/* ============================================================
   AUTH ROUTES
   POST /api/auth/login   — exchange credentials for cookie
   POST /api/auth/logout  — clear the session cookie
   GET  /api/auth/me      — return the current user (protected)
   ============================================================ */

import { Router } from "express";
import * as authController from "../controllers/auth.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", requireAuth, authController.me);

export default authRouter;
