import server from "./server.js";
import { connectDB } from "./config/db.js";
import colors from "colors";

// APP BOOTSTRAP
const startServer = async () => {
  try {
    // DATABASE
    await connectDB();

    // SERVER START
    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
      console.log(
        colors.yellow.bold("🚀 Server is running on: ") +
        colors.white(`http://localhost:${PORT}`)
      );

      console.log(
        colors.blue.bold("📄 Swagger docs: ") +
        colors.white(`http://localhost:${PORT}/docs`)
      );
    });

  } catch (error) {
    console.error(colors.red.bold("✖ Error starting server"));
    console.error(colors.red(error as string));
    process.exit(1);
  }
};

// INIT
startServer();