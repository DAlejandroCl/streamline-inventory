/* ============================================================
   APP BOOTSTRAP
   dotenv.config() debe ser la primera línea ejecutable,
   antes de cualquier import que lea process.env.
   
   El problema original: auth.service.ts lee JWT_SECRET a
   nivel de módulo (const JWT_SECRET = process.env.JWT_SECRET)
   — si dotenv no cargó primero, JWT_SECRET es undefined.
   ============================================================ */

import "dotenv/config";

import server from "./server.js";
import { connectDB } from "./config/db.js";
import { seedAdminUser } from "./services/auth.service.js";
import colors from "colors";

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    await seedAdminUser();
    console.log(colors.green.bold("✔ Admin user seeded"));

    const PORT = process.env.PORT ?? 3000;

    server.listen(PORT, () => {
      console.log(
        colors.yellow.bold("🚀 Server running on: ") +
        colors.white(`http://localhost:${PORT}`)
      );
      console.log(
        colors.blue.bold("📄 Swagger docs: ") +
        colors.white(`http://localhost:${PORT}/docs`)
      );
    });
  } catch (error) {
    console.error(colors.red.bold("✖ Error starting server"));
    console.error(colors.red(String(error)));
    process.exit(1);
  }
};

startServer();
