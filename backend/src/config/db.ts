/* ============================================================
   DATABASE CONFIG
   Instancia única de Sequelize.
   - Test: SQLite en memoria para aislamiento total
   - Dev/Prod: PostgreSQL con SSL

   db.sync({ alter: true }) actualiza las columnas existentes
   sin destruir datos. Para producción real usar migraciones
   con sequelize-cli en lugar de sync.
   ============================================================ */

import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import colors from "colors";
import Category from "../models/Category.model.js";
import Product from "../models/Product.model.js";

dotenv.config();

const isTest = process.env.NODE_ENV === "test";

/* DATABASE INSTANCE */
export const db = isTest
  ? new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [Category, Product],
    })
  : new Sequelize(process.env.DATABASE_URL as string, {
      dialect: "postgres",
      logging: false,
      /*
       * Category debe ir antes de Product porque Product
       * tiene una FK que referencia a categories.id.
       * Sequelize respeta este orden al hacer sync.
       */
      models: [Category, Product],
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });

/* CONNECT */
export const connectDB = async (): Promise<void> => {
  try {
    await db.authenticate();
    console.log(colors.green.bold("✔ Database connected successfully"));

    /*
     * alter: true — añade columnas nuevas y modifica tipos
     * sin DROP TABLE. Seguro para desarrollo.
     * En producción: reemplazar con sequelize-cli migrations.
     */
    await db.sync({ alter: true });
    console.log(colors.cyan.bold("✔ Database synchronized"));
  } catch (error) {
    console.error(colors.red.bold("✖ Database connection error"));
    console.error(error);
    process.exit(1);
  }
};
