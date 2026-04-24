/* ============================================================
   GLOBAL ERROR HANDLER
   Debe registrarse ÚLTIMO en server.ts, después de todas
   las rutas. Express lo identifica por la firma de 4 params.

   Flujo:
   - AppError (operacional): responde con statusCode y message
   - Cualquier otro error (bug): responde 500 sin exponer internos
   ============================================================ */

import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/AppError.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: "Internal server error" });
};
