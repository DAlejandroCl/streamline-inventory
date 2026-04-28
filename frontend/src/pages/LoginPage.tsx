/* ============================================================
   LOGIN PAGE
   Public route — accessible without authentication.
   Uses React Router 7 Form + action pattern.
   The action handles credentials, backend sets httpOnly cookie.
   ============================================================ */

import { Form, useActionData, useNavigation, Link } from "react-router-dom";
import { Package, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

type ActionData = { error?: string } | undefined;

export default function LoginPage() {
  const actionData = useActionData() as ActionData;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-background)" }}>

      {/* ---- LEFT PANEL — branding ---- */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 p-12"
        style={{ background: "var(--color-sidebar-bg)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center shadow-lifted shrink-0">
            <Package size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white font-headline leading-tight">
              Streamline
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Operational Ledger</p>
          </div>
        </div>

        {/* Quote */}
        <div className="space-y-6">
          <blockquote className="text-2xl font-bold text-white font-headline leading-snug">
            "Precision inventory management for modern operations."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 btn-gradient rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-white">Admin User</p>
              <p className="text-xs text-slate-500">Full Access · Streamline</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-slate-600">
          © {new Date().getFullYear()} Streamline. All rights reserved.
        </p>
      </div>

      {/* ---- RIGHT PANEL — form ---- */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">

          {/* Header */}
          <div>
            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 mb-8 lg:hidden">
              <div className="w-9 h-9 btn-gradient rounded-xl flex items-center justify-center shadow-lifted">
                <Package size={17} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-extrabold font-headline" style={{ color: "var(--color-text-primary)" }}>
                Streamline
              </span>
            </div>

            <h2
              className="text-3xl font-extrabold font-headline tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              Welcome back
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Sign in to access the operational ledger.
            </p>
          </div>

          {/* Error banner */}
          {actionData?.error && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
              style={{
                background: "var(--color-error-container)",
                color: "var(--color-on-error-container)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--color-error)" }} />
              {actionData.error}
            </div>
          )}

          {/* Form */}
          <Form method="post" className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  strokeWidth={2}
                  style={{ color: "var(--color-text-muted)" }}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  defaultValue="admin@streamline.app"
                  placeholder="admin@streamline.app"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl transition-all"
                  style={{
                    background: "var(--color-surface-low)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-primary)";
                    e.target.style.boxShadow = "0 0 0 3px var(--color-primary-container)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  strokeWidth={2}
                  style={{ color: "var(--color-text-muted)" }}
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  defaultValue="admin123"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 text-sm rounded-xl transition-all"
                  style={{
                    background: "var(--color-surface-low)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-primary)",
                    outline: "none",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-primary)";
                    e.target.style.boxShadow = "0 0 0 3px var(--color-primary-container)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl btn-gradient text-white shadow-card hover:shadow-lifted transition-all active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <><Loader2 size={15} className="animate-spin" /> Signing in...</>
              ) : (
                <>Sign in <ArrowRight size={15} strokeWidth={2.5} /></>
              )}
            </button>
          </Form>

          {/* Demo hint */}
          <div
            className="p-4 rounded-xl border text-center"
            style={{
              background: "var(--color-primary-container)",
              borderColor: "var(--color-primary-muted)",
            }}
          >
            <p className="text-xs font-semibold" style={{ color: "var(--color-on-primary-container)" }}>
              Demo credentials are pre-filled above.
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-primary)" }}>
              admin@streamline.app · admin123
            </p>
          </div>

          {/* Back to landing */}
          <p className="text-center text-xs" style={{ color: "var(--color-text-muted)" }}>
            <Link to="/" className="hover:underline font-semibold" style={{ color: "var(--color-primary)" }}>
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
