/* ============================================================
   DATABASE CONFIG
   Single Sequelize instance shared across the app.
   - Test: SQLite in-memory for full isolation
   - Dev/Prod: PostgreSQL with SSL

   Model registration order matters: Category before Product
   (FK dependency), User is independent.
   ============================================================ */

import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import colors from "colors";
import Category from "../models/Category.model.js";
import Product from "../models/Product.model.js";
import User from "../models/User.model.js";

dotenv.config();

const isTest = process.env.NODE_ENV === "test";

export const db = isTest
  ? new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [Category, Product, User],
    })
  : new Sequelize(process.env.DATABASE_URL as string, {
      dialect: "postgres",
      logging: false,
      models: [Category, Product, User],
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });

export const connectDB = async (): Promise<void> => {
  try {
    await db.authenticate();
    console.log(colors.green.bold("✔ Database connected successfully"));
    await db.sync({ alter: true });
    console.log(colors.cyan.bold("✔ Database synchronized"));
  } catch (error) {
    console.error(colors.red.bold("✖ Database connection error"));
    console.error(error);
    process.exit(1);
  }
};
