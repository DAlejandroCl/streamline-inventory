/* ============================================================
   PAGE LOADER
   Suspense fallback para lazy routes.
   Usa los tokens del design system — funciona en dark y light.
   El spinner es CSS puro, sin dependencias externas.
   ============================================================ */

export default function PageLoader() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-5"
      style={{ background: "var(--color-background)" }}
    >
      {/* Spinner */}
      <div className="relative w-12 h-12">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: "var(--color-primary)",
            borderRightColor: "var(--color-primary)",
            animationDuration: "600ms",
          }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: "var(--color-secondary)",
            borderRightColor: "transparent",
            animationDuration: "900ms",
            animationDirection: "reverse",
          }}
        />
      </div>

      <div className="text-center space-y-1">
        <p
          className="text-sm font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Streamline
        </p>
        <p
          className="text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          Loading...
        </p>
      </div>
    </div>
  );
}
