/* ============================================================
   APP BOOTSTRAP
   Orden de inicialización crítico:
   1. dotenv/config   — carga .env en process.env
   2. validateEnv()   — falla inmediatamente si faltan vars
   3. connectDB()     — conecta a Postgres
   4. seedAdminUser() — crea admin por defecto si no existe
   5. server.listen() — acepta conexiones

   Si cualquier paso falla, process.exit(1) detiene el boot.
   Esto garantiza que NUNCA arranca un servidor mal configurado.
   ============================================================ */

import "dotenv/config";

import { validateEnv }    from "./config/env.js";
import server             from "./server.js";
import { connectDB }      from "./config/db.js";
import { seedAdminUser }  from "./services/auth.service.js";
import colors             from "colors";

validateEnv();

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
