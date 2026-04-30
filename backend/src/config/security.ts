/* ============================================================
   SECURITY CONFIG
   Centraliza toda la configuración de seguridad HTTP.

   HELMET: Sets security headers on every response.
   - contentSecurityPolicy: permite Swagger UI (self + cdn)
   - crossOriginResourcePolicy: "cross-origin" necesario para
     que las imágenes subidas sean accesibles desde el frontend
     (origen diferente en desarrollo: 5173 ≠ 3000)

   RATE LIMITER (global): 100 req / 15min por IP.
   Previene scraping y DDoS básico en todas las rutas.

   AUTH RATE LIMITER: 10 intentos / 15min por IP solo en login.
   Previene fuerza bruta de credenciales. Después de 10 intentos
   fallidos la IP queda bloqueada 15 minutos.
   El mensaje no revela si el email existe o no (evita user
   enumeration).
   ============================================================ */

import helmet      from "helmet";
import rateLimit   from "express-rate-limit";
import type { RequestHandler } from "express";

/* ---- HELMET ----------------------------------------------- */

export const helmetMiddleware: RequestHandler = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      styleSrc:    ["'self'", "'unsafe-inline'"],
      imgSrc:      ["'self'", "data:", "blob:"],
      connectSrc:  ["'self'"],
      fontSrc:     ["'self'"],
      objectSrc:   ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  /*
   * cross-origin: permite que el frontend (puerto 5173) cargue
   * imágenes servidas desde el backend (puerto 3000) sin CORB.
   */
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

/* ---- GLOBAL RATE LIMITER --------------------------------- */

export const globalRateLimiter: RequestHandler = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              100,
  standardHeaders:  true,
  legacyHeaders:    false,
  message:          { message: "Too many requests, please try again later." },
  skip: (req) => req.path === "/docs" || req.path === "/",
});

/* ---- AUTH RATE LIMITER (login only) ---------------------- */

export const authRateLimiter: RequestHandler = rateLimit({
  windowMs:         15 * 60 * 1000,
  max:              10,
  standardHeaders:  true,
  legacyHeaders:    false,
  /*
   * Mensaje genérico — no revela si el bloqueo es por email
   * inválido o por demasiados intentos (evita user enumeration).
   */
  message: {
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
  /*
   * skipSuccessfulRequests: true — un login exitoso no cuenta
   * para el límite. Solo los intentos fallidos (4xx, 5xx) cuentan.
   */
  skipSuccessfulRequests: true,
});
