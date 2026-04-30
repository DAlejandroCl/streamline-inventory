/* ============================================================
   MULTER + SHARP — Image upload con compresión automática
   Pipeline:
   1. Multer recibe el archivo → lo guarda en /tmp/ como buffer
   2. sharp procesa el buffer:
      - Redimensiona a max 800x800 (mantiene aspect ratio)
      - Convierte a WebP con calidad 80 (80% menor que el original)
      - Guarda en /public/uploads/products/uuid.webp
   3. El archivo temporal de /tmp/ se elimina automáticamente

   Por qué memoryStorage en lugar de diskStorage:
   - Con diskStorage, el archivo se escribe al disco ANTES de
     poder procesarlo. Con memoryStorage lo tenemos en RAM y
     podemos pasarlo directamente a sharp sin lectura extra.
   - Para archivos de hasta 5MB en RAM es perfectamente seguro.

   En producción: reemplazar el guardado local por un upload
   a S3/Cloudinary con el mismo pipeline de sharp.
   ============================================================ */

import multer, { type FileFilterCallback, memoryStorage } from "multer";
import sharp  from "sharp";
import path   from "path";
import { fileURLToPath } from "url";
import fs     from "fs";
import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../../public/uploads/products");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, png, webp, gif)"));
  }
}

/* Multer con memoryStorage — el archivo queda en req.file.buffer */
const multerInstance = multer({
  storage:    memoryStorage(),
  fileFilter,
  limits:     { fileSize: 5 * 1024 * 1024 },
});

/* ============================================================
   SHARP PROCESSOR MIDDLEWARE
   Se aplica DESPUÉS de multer en la cadena de middleware.
   Si no hay archivo (req.file undefined), pasa directamente.
   ============================================================ */

export async function processImage(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.file) {
    next();
    return;
  }

  try {
    const filename = `${crypto.randomUUID()}.webp`;
    const destPath = path.join(UPLOAD_DIR, filename);

    await sharp(req.file.buffer)
      .resize(800, 800, {
        fit:               "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(destPath);

    /*
     * Sobreescribir req.file.filename para que el controller
     * pueda construir image_url de la misma forma que antes:
     * `/public/uploads/products/${req.file.filename}`
     */
    req.file.filename = filename;

    next();
  } catch (err) {
    next(err);
  }
}

/* Exportar como objeto con ambos middlewares para aplicar en secuencia */
export const upload = {
  single: (fieldName: string) => [
    multerInstance.single(fieldName),
    processImage,
  ],
};
