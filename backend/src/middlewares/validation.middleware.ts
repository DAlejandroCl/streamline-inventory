/* ============================================================
   VALIDATION MIDDLEWARE
   Ejecuta después de las reglas de express-validator.
   Si hay errores de validación, responde 400 y cortocircuita
   la cadena — el controller nunca se ejecuta.
   ============================================================ */

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  next();
};
