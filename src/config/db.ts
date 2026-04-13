import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import colors from "colors";

dotenv.config();

// ESM __dirname FIX
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DATABASE INSTANCE
export const db = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: "postgres",
  logging: false,

  // LOAD MODELS
  models: [path.join(__dirname, "../models")],

  // SSL FOR RENDER
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// DATABASE CONNECTION HELPER
export const connectDB = async () => {
  try {
    await db.authenticate();
    console.log(colors.green.bold("✔ Database connected successfully"));

    await db.sync();
    console.log(colors.cyan.bold("✔ Database synchronized"));

  } catch (error) {
    console.error(colors.red.bold("✖ Database connection error"));
    console.error(colors.red(error));
    process.exit(1);
  }
};