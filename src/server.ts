import express from 'express';
import colors from 'colors';
import productRoutes from './routes/product.routes.js';
import { db } from './config/db.js';
import { errorHandler } from './middlewares/error.js';

// SERVER SETUP
const server = express();

// MIDDLEWARES
server.use(express.json());

// DATABASE CONNECTION
async function connectDB() {
  try {
    await db.authenticate();
    console.log(colors.green.bold('Database connected successfully'));

    await db.sync({ alter: true });
    console.log(colors.yellow.bold('Database synchronized'));

  } catch (error) {
    console.error(colors.red.bold('Database connection error:'), error);
  }
}

connectDB();

// ROUTES
server.use('/api/products', productRoutes);

// ERROR HANDLER (ALWAYS LAST)
server.use(errorHandler);

export default server;