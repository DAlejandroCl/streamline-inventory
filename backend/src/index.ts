/* ============================================================
   APP BOOTSTRAP
   Connects the database, seeds the default admin account,
   then starts the HTTP server.
   If any step fails, the process exits with code 1.
   ============================================================ */

import server from "./server.js";
import { connectDB } from "./config/db.js";
import { seedAdminUser } from "./services/auth.service.js";
import colors from "colors";

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    /*
     * Seed a default admin on first run so the app is
     * immediately usable after deployment.
     * Credentials: admin@streamline.app / admin123
     * (Change via Settings → Security in production)
     */
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
