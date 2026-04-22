import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function ErrorPage() {
  const error = useRouteError();

  let status = 500;
  let title = "System Error";
  let description = "An unexpected error interrupted the ledger. Please try again.";
  let icon = "cloud_off";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (status === 404) {
      title = "Record Not Found";
      description = "The entry you're looking for doesn't exist in the ledger or has been removed.";
      icon = "search_off";
    } else if (status === 400) {
      title = "Invalid Request";
      description = "The request could not be processed. Please check the data and try again.";
      icon = "error_outline";
    }
  }

  const is404 = status === 404;

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* ICON */}
        <div className="flex justify-center">
          <div
            className={[
              "w-24 h-24 rounded-2xl flex items-center justify-center",
              "glass-nav shadow-ambient",
              is404
                ? "bg-[var(--color-primary-fixed)]/30"
                : "bg-[var(--color-error-container)]/30",
            ].join(" ")}
          >
            <span
              className={[
                "material-symbols-outlined text-5xl leading-none",
                is404 ? "text-[var(--color-primary)]" : "text-[var(--color-error)]",
              ].join(" ")}
            >
              {icon}
            </span>
          </div>
        </div>

        {/* STATUS CODE */}
        <div className="space-y-2">
          <p
            className={[
              "text-7xl font-extrabold font-headline tracking-tight",
              is404 ? "text-[var(--color-primary)]" : "text-[var(--color-error)]",
            ].join(" ")}
          >
            {status}
          </p>
          <h1 className="text-2xl font-bold text-[var(--color-on-surface)] font-headline">
            {title}
          </h1>
          <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="secondary" icon="dashboard">
              Dashboard
            </Button>
          </Link>
          <Link to="/products">
            <Button icon="inventory_2">View Inventory</Button>
          </Link>
        </div>

        {/* BRAND */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-outline)] font-label">
          Streamline — Operational Ledger
        </p>
      </div>
    </div>
  );
}
