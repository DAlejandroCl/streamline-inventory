/* ============================================================
   DATABASE CONFIG
   Instancia única de Sequelize. En test usa SQLite en memoria
   para aislamiento total. En producción usa PostgreSQL con SSL.
   ============================================================ */

import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import colors from "colors";
import Product from "../models/Product.model.js";

dotenv.config();

const isTest = process.env.NODE_ENV === "test";

/* DATABASE INSTANCE */
export const db = isTest
  ? new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [Product],
    })
  : new Sequelize(process.env.DATABASE_URL as string, {
      dialect: "postgres",
      logging: false,
      models: [Product],
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

    await db.sync();
    console.log(colors.cyan.bold("✔ Database synchronized"));
  } catch (error) {
    console.error(colors.red.bold("✖ Database connection error"));
    console.error(error);
    process.exit(1);
  }
};
