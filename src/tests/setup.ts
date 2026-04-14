import { db } from "../config/db.js";

// GLOBAL HOOKS
export const setup = async () => {
  await db.sync();
};

export const cleanup = async () => {
  const models = Object.values(db.models);

  for (const model of models) {
    await model.destroy({
      where: {},
      force: true
    });
  }
};

export const teardown = async () => {
  await db.close();
};