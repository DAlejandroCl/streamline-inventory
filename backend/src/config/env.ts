/* ============================================================
   ENV VALIDATION
   Valida que todas las variables de entorno críticas existan
   ANTES de que el servidor arranque. Si falta alguna, el
   proceso termina con un mensaje claro en lugar de fallar
   silenciosamente en runtime.

   Por qué hacer esto en un módulo separado:
   - Se importa como primer import en index.ts
   - Fuerza el fallo temprano (fail-fast pattern)
   - Documenta explícitamente qué variables requiere el sistema
   - En producción, el deploy falla en boot si el secret manager
     no inyectó las variables — mucho mejor que fallar en la
     primera request de un usuario real.

   REQUIRED: variables sin las que el sistema no puede funcionar.
   OPTIONAL: variables con fallback razonable.
   ============================================================ */

type EnvVar = {
  key:         string;
  description: string;
  example:     string;
};

const REQUIRED_VARS: EnvVar[] = [
  {
    key:         "DATABASE_URL",
    description: "PostgreSQL connection string",
    example:     "postgresql://user:password@localhost:5432/streamline_db",
  },
  {
    key:         "JWT_SECRET",
    description: "JWT signing secret (min 32 chars recommended)",
    example:     "run: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
  },
];

const OPTIONAL_VARS: { key: string; default: string }[] = [
  { key: "PORT",        default: "3000" },
  { key: "NODE_ENV",    default: "development" },
  { key: "CORS_ORIGIN", default: "http://localhost:5173" },
];

export function validateEnv(): void {
  const missing: EnvVar[] = [];

  for (const v of REQUIRED_VARS) {
    if (!process.env[v.key] || process.env[v.key]!.trim() === "") {
      missing.push(v);
    }
  }

  if (missing.length > 0) {
    console.error("\n❌ MISSING REQUIRED ENVIRONMENT VARIABLES\n");
    console.error("The server cannot start without the following variables:");
    console.error("─".repeat(60));

    for (const v of missing) {
      console.error(`\n  ${v.key}`);
      console.error(`  Description: ${v.description}`);
      console.error(`  Example:     ${v.example}`);
    }

    console.error("\n─".repeat(60));
    console.error("\nCopy backend/.env.example to backend/.env and fill in the values.");
    console.error("See README.md for setup instructions.\n");

    process.exit(1);
  }

  /* Advertencia por JWT_SECRET débil */
  const jwtSecret = process.env.JWT_SECRET!;
  if (jwtSecret.length < 32) {
    console.warn(
      "⚠️  WARNING: JWT_SECRET is shorter than 32 characters. " +
      "Use a longer, random secret in production."
    );
  }

  /* Aplicar defaults para opcionales */
  for (const v of OPTIONAL_VARS) {
    if (!process.env[v.key]) {
      process.env[v.key] = v.default;
    }
  }
}
