/* ============================================================
   APP BOOTSTRAP
   Conecta la base de datos antes de iniciar el servidor HTTP.
   Si la conexión falla, el proceso termina con exit code 1.
   ============================================================ */

import server from "./server.js";
import { connectDB } from "./config/db.js";
import colors from "colors";

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

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
