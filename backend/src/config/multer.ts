/* ============================================================
   MULTER CONFIG — Image upload middleware
   Estrategia: diskStorage en /public/uploads/products/
   - Filename: UUID + extensión original para evitar colisiones
   - Filter: solo imágenes (jpeg, png, webp, gif)
   - Limit: 5MB por archivo

   En producción esto se reemplaza por un storage adapter
   a S3 o Cloudinary. La interfaz del servicio no cambia.
   ============================================================ */

import multer, { type FileFilterCallback } from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import crypto from "crypto";
import type { Request } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../../public/uploads/products");

/* Ensure the upload directory exists on startup */
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uuid = crypto.randomUUID();
    const ext  = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuid}${ext}`);
  },
});

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (ALLOWED.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, webp, gif)"));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
