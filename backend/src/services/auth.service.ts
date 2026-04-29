/* ============================================================
   AUTH SERVICE
   JWT_SECRET se lee dentro de cada función (no a nivel de
   módulo) para garantizar que dotenv ya cargó cuando se usa.
   Leer process.env en el top-level de un módulo ES es
   peligroso porque los módulos se evalúan antes del bootstrap.
   ============================================================ */

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { AppError } from "../types/AppError.js";
import type { LoginDto, JwtPayload, AuthUser } from "../types/auth.dto.js";

const JWT_EXPIRES_IN = "7d";
const BCRYPT_ROUNDS  = 12;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError("JWT secret is not configured", 500);
  return secret;
}

/* ---- SEED: create default admin if none exists ----------- */

export async function seedAdminUser(): Promise<void> {
  const existing = await User.findOne({
    where: { email: "admin@streamline.app" },
  });
  if (existing) return;

  const hashed = await bcrypt.hash("admin123", BCRYPT_ROUNDS);
  await User.create({
    name: "Admin User",
    email: "admin@streamline.app",
    password: hashed,
    role: "admin",
  });
}

/* ---- LOGIN ----------------------------------------------- */

export async function login(
  dto: LoginDto
): Promise<{ token: string; user: AuthUser }> {
  const user = await User.findOne({ where: { email: dto.email } });
  if (!user) throw new AppError("Invalid credentials", 401);

  const valid = await bcrypt.compare(dto.password, user.password);
  if (!valid) throw new AppError("Invalid credentials", 401);

  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

/* ---- VERIFY TOKEN ---------------------------------------- */

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, getJwtSecret()) as JwtPayload;
  } catch {
    throw new AppError("Invalid or expired session", 401);
  }
}

/* ---- GET USER BY ID -------------------------------------- */

export async function getUserById(id: number): Promise<AuthUser> {
  const user = await User.findByPk(id);
  if (!user) throw new AppError("User not found", 404);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

/* ---- HASH PASSWORD --------------------------------------- */

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}
