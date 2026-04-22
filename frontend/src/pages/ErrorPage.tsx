import { isRouteErrorResponse, useRouteError, Link } from "react-router-dom";
import { SearchX, CloudOff, AlertOctagon, LayoutDashboard, Package } from "lucide-react";
import Button from "../components/ui/Button";

export default function ErrorPage() {
  const error = useRouteError();

  let status = 500;
  let title = "System Error";
  let description = "An unexpected error interrupted the ledger. Please try again.";
  let Icon = CloudOff;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (status === 404) {
      title = "Record Not Found";
      description = "The entry you're looking for doesn't exist in the ledger or has been removed.";
      Icon = SearchX;
    } else if (status === 400) {
      title = "Invalid Request";
      description = "The request could not be processed. Please check the data and try again.";
      Icon = AlertOctagon;
    }
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
              is404 ? "bg-[var(--color-primary-container)" : "bg-[var(--color-error-container)",
            ].join(" ")}
          >
            <Icon
              size={44}
              strokeWidth={1.5}
              className={is404 ? "text-[var(--color-primary)" : "text-[var(--color-error)"}
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="space-y-3">
          <p
            className={[
              "text-8xl font-extrabold font-headline tracking-tight",
              is404 ? "gradient-text" : "text-[var(--color-error)",
            ].join(" ")}
          >
            {status}
          </p>
          <h1 className="text-2xl font-bold font-headline text-[var(--color-text-primary)">
            {title}
          </h1>
          <p className="text-sm text-[var(--color-text-secondary) leading-relaxed max-w-xs mx-auto">
            {description}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="secondary" icon={LayoutDashboard}>Dashboard</Button>
          </Link>
          <Link to="/products">
            <Button icon={Package}>View Inventory</Button>
          </Link>
        </div>

        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)">
          Streamline — Operational Ledger
        </p>
      </div>
    </div>
  );
}
