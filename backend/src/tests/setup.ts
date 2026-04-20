/* ============================================================
   TEST SETUP
   Helpers para el ciclo de vida de los tests de integración.
   setup()   → autentica y sincroniza el schema en SQLite.
   cleanup() → destruye todos los registros entre suites.
   teardown()→ cierra la conexión al finalizar.
   ============================================================ */

import { db } from "../config/db.js";

export const setup = async (): Promise<void> => {
  await db.authenticate();
  await db.sync({ force: true });
};

export const cleanup = async (): Promise<void> => {
  const models = Object.values(db.models);

  for (const model of models) {
    await model.destroy({ where: {}, force: true });
  }
};

export const teardown = async (): Promise<void> => {
  await db.close();
};
