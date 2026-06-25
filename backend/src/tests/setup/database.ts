/* ============================================================
   TEST DATABASE SETUP
   Ciclo de vida completo para tests de integración.
   - Usa SQLite in-memory para aislamiento total
   - sync({ force: true }) → tabla limpia antes de cada suite
   - destroy({ where: {}, force: true }) → limpieza entre tests
   - db.close() → cierra la conexión al finalizar
   ============================================================ */

import { db } from "../../config/db.js";

export const setupDatabase = async (): Promise<void> => {
  await db.authenticate();
  await db.sync({ force: true });
};

export const cleanDatabase = async (): Promise<void> => {
  const models = Object.values(db.models);
  // Orden inverso para respetar foreign keys
  for (const model of models.reverse()) {
    await model.destroy({ where: {}, force: true });
  }
};

export const teardownDatabase = async (): Promise<void> => {
  // No cerrar la conexión en SQLite :memory: — al cerrar y reabrir
  // se crea una nueva DB vacía perdiendo las tablas sincronizadas.
  // El proceso Node termina igual al finalizar los tests.
  if (process.env.NODE_ENV !== "test") {
    await db.close();
  }
};
