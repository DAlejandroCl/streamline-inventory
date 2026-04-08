import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import Product from "../models/product.js";

// ENV CONFIG
dotenv.config();

// DATABASE CONNECTION
export const db = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
  protocol: "postgres",

  logging: false,

  // MODELS REGISTRATION
  models: [Product],

  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});