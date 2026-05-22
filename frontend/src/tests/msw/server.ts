/* ============================================================
   MSW SERVER — Node.js (Vitest)
   Centraliza todos los handlers para el entorno de testing.
   Agregar nuevos handlers aquí a medida que crecen las features.
   ============================================================ */

import { setupServer } from "msw/node";
import { productsHandlers } from "./handlers/products.handlers";

export const server = setupServer(...productsHandlers);
