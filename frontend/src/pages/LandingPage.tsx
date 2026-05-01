/* ============================================================
   LANDING PAGE — /
   SEO: H1 con keyword principal, sin <br/> que fragmenta.
   Contraste: texto mínimo #94a3b8 sobre oscuro → reemplazado
   por colores que pasan WCAG AA (ratio ≥ 4.5:1).
   Datos: solo cifras verificables del propio código del proyecto.
   No hay métricas inventadas.
   ============================================================ */

import { Link } from "react-router-dom";
import {
  Package, BarChart3, Shield, Zap, ArrowRight,
  CheckCircle, ChevronRight, Database, Bell, Layers, Lock,
} from "lucide-react";

/* ============================================================
   DATOS — Solo lo que el código realmente implementa.
   Regla: si no puedes señalar la línea de código que lo respalda,
   no va en la landing.
   ============================================================ */

const FEATURES = [
  {
    icon: Shield,
    title: "JWT + httpOnly Cookies",
    desc: "Session tokens stored in httpOnly cookies — never exposed to JavaScript. Resistant to XSS token theft by design.",
    accent: "text-[#818cf8]",
    bg: "bg-[#1e1f3a]",
  },
  {
    icon: BarChart3,
    title: "Real-time Inventory Metrics",
    desc: "Dashboard computes total value, stock rates and availability ratios directly from the database on every load.",
    accent: "text-[#34d399]",
    bg: "bg-[#0d2b22]",
  },
  {
    icon: Zap,
    title: "Server-side Pagination & Search",
    desc: "Products endpoint supports ?page, ?limit and ?search with PostgreSQL ILIKE filtering. Handles large catalogs without frontend bloat.",
    accent: "text-[#fbbf24]",
    bg: "bg-[#2b1f0a]",
  },
  {
    icon: Database,
    title: "PostgreSQL + Sequelize ORM",
    desc: "DECIMAL(12,2) for prices — no floating point errors. Typed models with Sequelize-TypeScript decorators.",
    accent: "text-[#818cf8]",
    bg: "bg-[#1e1f3a]",
  },
  {
    icon: Bell,
    title: "Action Notification System",
    desc: "A CustomEvent bus bridges React Router actions (outside the React tree) with the NotificationsContext — no external state library needed.",
    accent: "text-[#f87171]",
    bg: "bg-[#2b0d0d]",
  },
  {
    icon: Layers,
    title: "Clean Architecture",
    desc: "Express 5 with native async error propagation — no try-catch in controllers. Every request flows Controller → Service → Model.",
    accent: "text-[#34d399]",
    bg: "bg-[#0d2b22]",
  },
];

const STACK = [
  "Node.js + Express 5",
  "TypeScript (strict: true)",
  "React 19 + Vite",
  "React Router 7",
  "Tailwind CSS 4",
  "PostgreSQL + Sequelize",
  "Zod validation",
  "JWT + httpOnly cookies",
  "Multer + Sharp",
  "Helmet + express-rate-limit",
  "Swagger / OpenAPI",
  "Sonner toasts",
];

const CHECKLIST = [
  "Controllers → Services → Models — no layer bypass",
  "JWT in httpOnly cookie — XSS safe, CSRF protected with SameSite=Strict",
  "Role-based access control (admin / viewer)",
  "Fully typed DTOs on backend and frontend",
  "Zod schema validation on all form inputs",
  "React Router 7 typed loaders and actions",
  "Centralized API client — no inline fetch() calls",
  "Global AppError class — no string error comparisons",
  "Rate limiting on auth routes (10 attempts / 15 min)",
  "Image compression via sharp — WebP output, max 800×800",
];

/* The three facts below are verifiable in the codebase:
   - bcrypt rounds: auth.service.ts const BCRYPT_ROUNDS = 12
   - Token expiry:  auth.service.ts const JWT_EXPIRES_IN = "7d"
   - Auth method:   auth.middleware.ts reads req.cookies?.token   */
const AUTH_FACTS = [
  { label: "Auth method",    val: "httpOnly cookie" },
  { label: "Token expiry",   val: "7 days" },
  { label: "Bcrypt rounds",  val: "12" },
];

/* ============================================================
   COMPONENTS
   ============================================================ */

function NavBar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: "rgba(8, 13, 24, 0.85)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 btn-gradient rounded-lg flex items-center justify-center shadow-lifted" aria-hidden="true">
            <Package size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-extrabold font-headline text-white">
            Streamline
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold transition-colors px-4 py-2 rounded-xl"
            style={{ color: "#c9d1d9" }}
          >
            Sign in
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 btn-gradient text-white text-sm font-bold rounded-xl shadow-card hover:shadow-lifted transition-all active:scale-95"
          >
            Get started <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{ background: "#080d18" }}
      aria-labelledby="hero-heading"
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#818cf8 1px, transparent 1px), linear-gradient(90deg, #818cf8 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />
      {/* Glow orbs */}
      <div
        className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl"
        style={{ background: "#818cf8", opacity: 0.07 }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl"
        style={{ background: "#34d399", opacity: 0.05 }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border"
          style={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#c9d1d9" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" aria-hidden="true" />
          Portfolio · Full-stack PERN project
        </div>

        {/*
          H1 SIN <br/> — los saltos de línea fragmentan la keyword
          para los crawlers. El gradiente es CSS puro, invisible
          para Google pero visible para el usuario.
        */}
        <h1
          id="hero-heading"
          className="text-6xl md:text-7xl font-extrabold font-headline leading-none tracking-tight"
          style={{ color: "#e6edf3" }}
        >
          Inventory management{" "}
          <span className="gradient-text">reimagined</span>
        </h1>

        <p
          className="text-xl max-w-2xl mx-auto leading-relaxed font-medium"
          style={{ color: "#c9d1d9" }}
        >
          A production-grade operational ledger built with Express 5, React 19
          and PostgreSQL. Clean architecture, real authentication, image
          processing and server-side pagination.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2.5 px-8 py-4 btn-gradient text-white font-bold rounded-2xl shadow-lifted text-base active:scale-95"
            aria-label="Launch the Streamline demo app"
          >
            Launch app <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <a
            href="https://github.com/DAlejandroCl/streamline-inventory"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 border text-white font-bold rounded-2xl transition-all text-base"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)" }}
            aria-label="View Streamline source code on GitHub"
          >
            View on GitHub <ChevronRight size={18} strokeWidth={2.5} />
          </a>
        </div>

        {/* Stack pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4" role="list" aria-label="Technology stack">
          {STACK.map((s) => (
            <span
              key={s}
              role="listitem"
              className="px-3 py-1.5 rounded-full text-xs font-semibold border"
              style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)", color: "#c9d1d9" }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section
      className="py-32 px-6"
      style={{ background: "#0d1117" }}
      aria-labelledby="features-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#818cf8" }}>
            What's implemented
          </p>
          <h2
            id="features-heading"
            className="text-4xl font-extrabold font-headline"
            style={{ color: "#e6edf3" }}
          >
            Every feature backed by code
          </h2>
          <p className="max-w-xl mx-auto text-lg leading-relaxed" style={{ color: "#c9d1d9" }}>
            No mock data, no placeholder metrics. Every card below describes a
            pattern you can trace to a specific file in the repository.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl p-6 border hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: "#161b27", borderColor: "rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.bg }}
                aria-hidden="true"
              >
                <f.icon size={20} className={f.accent} strokeWidth={2} />
              </div>
              <h3
                className="text-base font-bold font-headline mb-2"
                style={{ color: "#e6edf3" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#c9d1d9" }}>
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section
      className="py-32 px-6"
      style={{ background: "#161b27" }}
      aria-labelledby="arch-heading"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#818cf8" }}>
            Engineering decisions
          </p>
          <h2
            id="arch-heading"
            className="text-4xl font-extrabold font-headline leading-tight"
            style={{ color: "#e6edf3" }}
          >
            Patterns worth reading about
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "#c9d1d9" }}>
            Streamline applies patterns from production engineering — not
            because they are trendy, but because each one solves a specific
            problem that appears at scale.
          </p>

          <ul className="space-y-3" role="list">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle
                  size={16}
                  className="shrink-0 mt-0.5"
                  style={{ color: "#34d399" }}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span className="text-sm" style={{ color: "#c9d1d9" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Code card — verifiable facts only */}
        <div
          className="rounded-2xl p-8 font-mono text-sm space-y-3 shadow-lifted"
          style={{ background: "#080d18" }}
          aria-label="Code example: auth.middleware.ts"
        >
          <p className="text-xs mb-4" style={{ color: "#6e7681" }}>
            {/* The filename is a real file in this project */}
            {`// src/middlewares/auth.middleware.ts`}
          </p>
          <div>
            <span style={{ color: "#c678dd" }}>export async function </span>
            <span style={{ color: "#61afef" }}>requireAuth</span>
            <span style={{ color: "#abb2bf" }}>(req, res, next) {"{"}</span>
          </div>
          <div className="pl-4 space-y-1.5">
            <p>
              <span style={{ color: "#6e7681" }}>const </span>
              <span style={{ color: "#98c379" }}>token</span>
              <span style={{ color: "#abb2bf" }}> = req.cookies?.token;</span>
            </p>
            <p>
              <span style={{ color: "#c678dd" }}>if </span>
              <span style={{ color: "#abb2bf" }}>(!token) </span>
              <span style={{ color: "#6e7681" }}>throw </span>
              <span style={{ color: "#e06c75" }}>new AppError(401);</span>
            </p>
            <p>
              <span style={{ color: "#6e7681" }}>const </span>
              <span style={{ color: "#98c379" }}>payload</span>
              <span style={{ color: "#abb2bf" }}> = verifyToken(token);</span>
            </p>
            <p>
              <span style={{ color: "#61afef" }}>res.locals.user</span>
              <span style={{ color: "#abb2bf" }}> = payload;</span>
            </p>
            <p>
              <span style={{ color: "#61afef" }}>next</span>
              <span style={{ color: "#abb2bf" }}>();</span>
            </p>
          </div>
          <p style={{ color: "#abb2bf" }}>{"}"}</p>

          {/* Auth facts — each one traceable to a const in the codebase */}
          <div
            className="pt-4 border-t space-y-2"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs mb-3" style={{ color: "#6e7681" }}>
              {`// auth.service.ts — verified constants`}
            </p>
            {AUTH_FACTS.map((r) => (
              <div key={r.label} className="flex justify-between">
                <span className="text-xs" style={{ color: "#6e7681" }}>{r.label}</span>
                <span className="text-xs font-bold" style={{ color: "#98c379" }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section
      className="py-32 px-6 relative overflow-hidden"
      style={{ background: "#080d18" }}
      aria-labelledby="cta-heading"
    >
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#818cf8 1px, transparent 1px), linear-gradient(90deg, #818cf8 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-2xl mx-auto text-center space-y-8">
        <h2
          id="cta-heading"
          className="text-5xl font-extrabold font-headline leading-tight"
          style={{ color: "#e6edf3" }}
        >
          Explore the demo
        </h2>
        <p className="text-xl leading-relaxed" style={{ color: "#c9d1d9" }}>
          Sign in with the pre-filled demo credentials and walk through the full
          inventory workflow — create, edit, filter, search and delete products.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2.5 px-8 py-4 btn-gradient text-white font-bold rounded-2xl shadow-lifted text-base active:scale-95"
          >
            Launch app <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <a
            href="https://github.com/DAlejandroCl/streamline-inventory"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 border text-white font-bold rounded-2xl transition-all text-base"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.12)" }}
          >
            View source <ChevronRight size={18} strokeWidth={2.5} />
          </a>
        </div>
        <p className="text-xs" style={{ color: "#6e7681" }}>
          Demo credentials are pre-filled on the login page.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  const YEAR = new Date().getFullYear();
  return (
    <footer
      className="py-10 px-6 border-t"
      style={{ background: "#080d18", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 btn-gradient rounded-lg flex items-center justify-center" aria-hidden="true">
            <Package size={13} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-white font-headline">Streamline</span>
        </div>

        <p className="text-xs" style={{ color: "#8b949e" }}>
          © {YEAR} Streamline — Portfolio project by Diego Clavijo
        </p>

        <nav aria-label="Footer navigation">
          <div className="flex items-center gap-4 text-xs" style={{ color: "#8b949e" }}>
            <Link
              to="/login"
              className="hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <a
              href="https://github.com/DAlejandroCl/streamline-inventory"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <>
      {/*
        La LandingPage vive en "/" — fuera del AppLayout,
        sin el sidebar. El fondo oscuro es intencional:
        contrasta con el app (claro por defecto) y da identidad
        visual propia a la página pública.
      */}
      <div className="font-body">
        <NavBar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <ArchitectureSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
