/* ============================================================
   AUTH DTOs
   Typed shapes for auth request bodies and service returns.
   Used by controllers, services, and the JWT middleware.
   ============================================================ */

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type JwtPayload = {
  id: number;
  email: string;
  role: string;
};
