/* ============================================================
   HTTP REQUEST HELPER
   Centraliza la configuración de supertest para todos los tests.
   Incluye autenticación automática via cookie JWT para las
   rutas protegidas con requireAuth.

   Uso:
     const api = await createAuthApi(server);
     const res = await api.get("/api/products");
     const res = await api.post("/api/products").send(payload);
   ============================================================ */

import request, { type Test } from "supertest";
import type { Express } from "express";
import { seedAdminUser } from "../../services/auth.service.js";

export type ApiHelper = {
  get:    (url: string) => Test;
  post:   (url: string) => Test;
  put:    (url: string) => Test;
  patch:  (url: string) => Test;
  delete: (url: string) => Test;
  cookie: string;
};

/* ---- Obtiene un token JWT haciendo login real con admin seed */
export const getAuthCookie = async (app: Express): Promise<string> => {
  await seedAdminUser();

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@streamline.app", password: "admin123" });

  if (res.status !== 200) {
    throw new Error(`Login failed: ${res.status} — ${JSON.stringify(res.body)}`);
  }

  const cookieHeader = res.headers["set-cookie"] as string[] | string | undefined;
  if (!cookieHeader) throw new Error("No cookie returned from login");

  const cookies = Array.isArray(cookieHeader) ? cookieHeader : [cookieHeader];
  const tokenCookie = cookies.find((c: string) => c.startsWith("token="));
  if (!tokenCookie) throw new Error("No token cookie found");

  return tokenCookie.split(";")[0]; // "token=<value>"
};

/* ---- Crea un API helper autenticado ----------------------- */
export const createAuthApi = async (app: Express): Promise<ApiHelper> => {
  const cookie = await getAuthCookie(app);

  return {
    cookie,
    get:    (url) => request(app).get(url).set("Cookie", cookie),
    post:   (url) => request(app).post(url).set("Cookie", cookie),
    put:    (url) => request(app).put(url).set("Cookie", cookie),
    patch:  (url) => request(app).patch(url).set("Cookie", cookie),
    delete: (url) => request(app).delete(url).set("Cookie", cookie),
  };
};

/* ---- API sin auth — para tests de rutas públicas ---------- */
export const createApi = (app: Express) => ({
  get:    (url: string) => request(app).get(url),
  post:   (url: string) => request(app).post(url),
  put:    (url: string) => request(app).put(url),
  patch:  (url: string) => request(app).patch(url),
  delete: (url: string) => request(app).delete(url),
});

/* ---- Response assertion helpers --------------------------- */

export const assertPaginatedResponse = (body: unknown): void => {
  const b = body as Record<string, unknown>;
  if (!Array.isArray(b.data)) throw new Error("data must be an array");
  if (typeof b.total !== "number") throw new Error("Missing total field");
  if (typeof b.page !== "number") throw new Error("Missing page field");
  if (typeof b.totalPages !== "number") throw new Error("Missing totalPages field");
  if (typeof b.hasNext !== "boolean") throw new Error("Missing hasNext field");
  if (typeof b.hasPrev !== "boolean") throw new Error("Missing hasPrev field");
};

export const assertProductShape = (product: unknown): void => {
  const p = product as Record<string, unknown>;
  if (typeof p.id === "undefined") throw new Error("Missing id");
  if (typeof p.name !== "string") throw new Error("name must be a string");
  if (typeof p.price === "undefined") throw new Error("Missing price");
  if (typeof p.stock === "undefined") throw new Error("Missing stock");
  if (typeof p.availability !== "boolean") throw new Error("availability must be boolean");
};
