/* ============================================================
   IMAGE UPLOAD
   Componente de carga de imágenes con:
   - Drag & drop o click para seleccionar
   - Preview inmediato via FileReader (sin subir al servidor)
   - Imagen actual del producto si ya tiene una (modo edición)
   - Botón para eliminar la imagen seleccionada
   - Validación de tipo y tamaño en el cliente (5MB max)

   El input file se llama "image" — Multer en el backend
   busca exactamente ese field name con upload.single("image").
   ============================================================ */

import { useRef, useState, useCallback } from "react";
import { ImageIcon, Upload, X, AlertCircle } from "lucide-react";

type Props = {
  currentImageUrl?: string | null;
  name?: string;
};

const MAX_SIZE_MB  = 5;
const MAX_SIZE_B   = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const API_BASE     = import.meta.env.VITE_API_URL;

export default function ImageUpload({ currentImageUrl, name = "image" }: Props) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    setError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG, WebP, or GIF images are allowed.");
      return;
    }

    if (file.size > MAX_SIZE_B) {
      setError(`Image must be smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  /* Construir URL completa para imagen existente */
  const existingUrl = currentImageUrl
    ? `${API_BASE}${currentImageUrl}`
    : null;

  const displayImage = preview ?? existingUrl;

  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-secondary)]">
        Product Image
        <span className="ml-1.5 font-normal normal-case tracking-normal text-[var(--color-text-muted)]">
          (optional · max {MAX_SIZE_MB}MB)
        </span>
      </p>

      {displayImage ? (
        /* ---- PREVIEW STATE ---- */
        <div className="relative group rounded-2xl overflow-hidden border border-[var(--color-border)]/40 shadow-card aspect-video bg-[var(--color-surface-low)]">
          <img
            src={displayImage}
            alt="Product preview"
            className="w-full h-full object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <Upload size={13} strokeWidth={2.5} />
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-bold rounded-xl backdrop-blur-sm hover:bg-red-500/30 transition-colors"
            >
              <X size={13} strokeWidth={2.5} />
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* ---- DROP ZONE ---- */
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          className={[
            "flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200",
            isDragging
              ? "border-[var(--color-primary)] bg-[var(--color-primary-container)]"
              : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-low)] bg-transparent",
          ].join(" ")}
        >
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary-container)] flex items-center justify-center">
            <ImageIcon size={22} className="text-[var(--color-primary)]" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">
              {isDragging ? "Drop to upload" : "Click or drag image here"}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              JPEG, PNG, WebP, GIF · max {MAX_SIZE_MB}MB
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-error)]">
          <AlertCircle size={13} strokeWidth={2.5} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Hidden file input — Multer reads field name "image" */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
        className="sr-only"
      />
    </div>
  );
}
