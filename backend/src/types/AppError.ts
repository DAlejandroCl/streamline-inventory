/* ============================================================
   APP ERROR
   Clase de error operacional con status HTTP explícito.
   El global error handler la detecta con instanceof y produce
   respuestas tipadas sin comparaciones de strings frágiles.
   ============================================================ */

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;

    /*
     * Restaura la cadena de prototipos correcta al extender
     * clases nativas de JavaScript con TypeScript.
     */
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
