/* ============================================================
   APP ERROR
   Custom error class that carries an HTTP status code.
   Allows the global error handler to produce typed, structured
   responses without relying on fragile string comparisons.
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