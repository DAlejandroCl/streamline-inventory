/* ============================================================
   APP ERROR
   Error operacional tipado con status HTTP explícito.
   El global error handler lo detecta con instanceof para
   producir respuestas consistentes sin comparar strings.
   ============================================================ */

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
