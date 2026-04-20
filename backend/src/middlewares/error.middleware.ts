/* ============================================================
   GLOBAL ERROR HANDLER
   Debe registrarse ÚLTIMO en server.ts, después de todas
   las rutas. Express lo identifica como error handler por
   la firma de 4 parámetros (err, req, res, next).

   Flujo:
   - AppError (errores operacionales): responde con el status
     y mensaje definidos al lanzar el error.
   - Cualquier otro error (bugs, excepciones inesperadas):
     responde 500 sin exponer detalles internos al cliente.
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

  /* ERRORES OPERACIONALES — conocidos y esperados */
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  /* ERRORES NO CONTROLADOS — bugs, fallos de BD, etc. */
  res.status(500).json({ message: "Internal server error" });
};
