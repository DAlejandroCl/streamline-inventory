/* ============================================================
   ERROR PAGE — Route-level error boundary

   useNavigate() NO funciona dentro de errorElement porque
   React Router pone el router en estado de error y el contexto
   de navegación no está disponible.

   Solución: usar <a href> nativo en lugar de <Link> o navigate()
   para garantizar que la navegación funcione siempre,
   independientemente del estado del router.

   Botones:
   - "Back to home"  → / (landing page, siempre disponible)
   - "Go to app"     → /app (intenta entrar a la app)
     Si /app falla de nuevo (sesión expirada), authLoader
     redirige automáticamente a /login.
   ============================================================ */

import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { SearchX, CloudOff, AlertOctagon, Home, LayoutDashboard } from "lucide-react";

export default function ErrorPage() {
  const error = useRouteError();

  let status      = 500;
  let title       = "System Error";
  let description = "An unexpected error interrupted the ledger. Please try again.";
  let Icon        = CloudOff;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (status === 404) {
      title       = "Record Not Found";
      description = "The entry you're looking for doesn't exist or has been removed.";
      Icon        = SearchX;
    } else if (status === 400) {
      title       = "Invalid Request";
      description = "The request could not be processed. Please check the data and try again.";
      Icon        = AlertOctagon;
    }
  }

  if (import.meta.env.DEV) {
    console.error("[ErrorPage]", error);
  }

  const is404 = status === 404;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--color-background)" }}
    >
      <div className="max-w-md w-full text-center space-y-8">

        {/* ICON */}
        <div className="flex justify-center">
          <div
            className={[
              "w-24 h-24 rounded-3xl flex items-center justify-center shadow-card",
              is404
                ? "bg-[var(--color-primary-container)]"
                : "bg-[var(--color-error-container)]",
            ].join(" ")}
          >
            <Icon
              size={44}
              strokeWidth={1.5}
              className={is404 ? "text-[var(--color-primary)]" : "text-[var(--color-error)]"}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-3">
          <p
            className={[
              "text-8xl font-extrabold font-headline tracking-tight",
              is404 ? "gradient-text" : "text-[var(--color-error)]",
            ].join(" ")}
          >
            {status}
          </p>
          <h1 className="text-2xl font-bold font-headline text-[var(--color-text-primary)]">
            {title}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        </div>

        {/* ACTIONS
            Usamos <a href> nativo — useNavigate() y <Link> no
            funcionan dentro de errorElement cuando el router
            está en estado de error.
        */}
        <div className="flex items-center justify-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-low)] transition-all"
          >
            <Home size={15} strokeWidth={2} />
            Back to home
          </a>
          <a
            href="/app"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl btn-gradient text-white shadow-card hover:shadow-lifted transition-all active:scale-95"
          >
            <LayoutDashboard size={15} strokeWidth={2} />
            Go to app
          </a>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
          Streamline — Operational Ledger
        </p>
      </div>
    </div>
  );
}
