import { db } from "../config/db.js";

// SETUP
export const setup = async () => {
  await db.authenticate();
  await db.sync({ force: true });
};

// CLEAN BETWEEN TESTS
export const cleanup = async () => {
  const models = Object.values(db.models);

  for (const model of models) {
    await model.destroy({
      where: {},
      force: true
    });
  }
};

// CLOSE CONNECTION
export const teardown = async () => {
  await db.close();
};