/* ============================================================
   LANDING PAGE — /
   Página pública e informacional, completamente separada de /app.

   PRINCIPIOS DE DISEÑO:
   - Usa tokens CSS del design system (--color-*) en lugar de
     colores hardcoded → el ThemeToggle funciona correctamente.
   - ThemeProvider envuelve toda la app en main.tsx, por lo que
     el toggle afecta tanto la Landing como la App.
   - La Landing es independiente: no usa Sidebar, no requiere
     auth, no tiene acceso a AuthContext ni SettingsContext.
   - Identidad visual propia: hero oscuro vía --color-sidebar-bg
     (token que el design system define en ambos temas),
     fondo de secciones alterna entre --color-background y
     --color-surface.

   SEO:
   - H1 continuo sin <br/> — los crawlers leen el texto completo.
   - Aria labels en CTAs y navegación.
   - Datos solo verificables en el codebase.
   ============================================================ */

import { Link } from "react-router-dom";
import {
  Package, BarChart3, Shield, Zap, ArrowRight,
  CheckCircle, ChevronRight, Database, Bell, Layers,
} from "lucide-react";
import ThemeToggle from "../components/ui/ThemeToggle";

/* ============================================================
   DATA — Solo lo que el código realmente implementa.
   Regla: si no puedes señalar la línea de código, no va aquí.
   ============================================================ */

const FEATURES = [
  {
    icon: Shield,
    title: "JWT + httpOnly Cookies",
    desc: "Session tokens stored in httpOnly cookies — never exposed to JavaScript. XSS-resistant by design, CSRF-protected with SameSite=Strict.",
  },
  {
    icon: BarChart3,
    title: "Real-time Inventory Metrics",
    desc: "Dashboard computes total value, stock rates and availability ratios from the database on every load. No cached or mocked numbers.",
  },
  {
    icon: Zap,
    title: "Server-side Pagination & Search",
    desc: "The /api/products endpoint supports ?page, ?limit and ?search with PostgreSQL ILIKE. The frontend reads these from URL searchParams.",
  },
  {
    icon: Database,
    title: "PostgreSQL + Sequelize ORM",
    desc: "DECIMAL(12,2) for prices — no floating point rounding errors. Typed Sequelize-TypeScript models with decorator syntax.",
  },
  {
    icon: Bell,
    title: "Notification Event Bus",
    desc: "React Router actions run outside the React tree and cannot use hooks. A CustomEvent bridge connects them to NotificationsContext.",
  },
  {
    icon: Layers,
    title: "Clean Architecture",
    desc: "Express 5 with native async error propagation — no try/catch in controllers. Every request flows Controller → Service → Model.",
  },
];

const STACK = [
  "Node.js + Express 5", "TypeScript (strict)", "React 19 + Vite",
  "React Router 7", "Tailwind CSS 4", "PostgreSQL + Sequelize",
  "Zod validation", "JWT + httpOnly cookies", "Multer + Sharp",
  "Helmet + rate-limit", "Swagger / OpenAPI",
];

const CHECKLIST = [
  "Controllers → Services → Models — no layer bypass",
  "JWT in httpOnly cookie — XSS safe, SameSite=Strict for CSRF",
  "Role-based access: admin / viewer",
  "Fully typed DTOs on both backend and frontend",
  "Zod schema validation on all form inputs",
  "React Router 7 typed loaders and actions",
  "Centralized API client — no inline fetch() calls anywhere",
  "Global AppError class — no string error comparisons",
  "Rate limiting on login route: 10 attempts / 15 min",
  "Image compression via sharp: WebP output, max 800×800px",
];

/* Constantes verificables en el codebase:
   BCRYPT_ROUNDS = 12        → auth.service.ts línea 9
   JWT_EXPIRES_IN = "7d"     → auth.service.ts línea 10
   req.cookies?.token        → auth.middleware.ts línea 18   */
const AUTH_FACTS = [
  { label: "Auth method",   val: "httpOnly cookie" },
  { label: "Token expiry",  val: "7 days" },
  { label: "Bcrypt rounds", val: "12" },
];

/* ============================================================
   NAVBAR — usa ThemeToggle para que el modo oscuro/claro
   funcione también desde la Landing.
   ============================================================ */

function NavBar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 glass shadow-navbar"
      aria-label="Main navigation"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 btn-gradient rounded-lg flex items-center justify-center shadow-lifted"
            aria-hidden="true"
          >
            <Package size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-extrabold font-headline text-[var(--color-text-primary)]">
            Streamline
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* ThemeToggle funciona porque ThemeProvider está en main.tsx */}
          <ThemeToggle variant="icon" />

          <Link
            to="/login"
            className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors px-4 py-2 rounded-xl hover:bg-[var(--color-primary-container)]"
          >
            Sign in
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 btn-gradient text-white text-sm font-bold rounded-xl shadow-card hover:shadow-lifted transition-all active:scale-95"
            aria-label="Get started with Streamline"
          >
            Get started <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ============================================================
   HERO — fondo usa --color-sidebar-bg que el design system
   define correctamente en ambos temas (light y dark).
   Los textos usan tokens para garantizar contraste en ambos.
   ============================================================ */

function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{ background: "var(--color-sidebar-bg)" }}
      aria-labelledby="hero-heading"
    >
      {/* Grid decorativo — usa el token de color primary */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />
      {/* Glow orbs */}
      <div
        className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: "var(--color-primary)" }}
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-white/10 bg-white/5"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" aria-hidden="true" />
          Portfolio · Full-stack PERN project
        </div>

        {/*
          H1 SIN <br/> — el salto fragmenta la keyword para crawlers.
          gradient-text aplica un gradiente CSS definido en index.css.
        */}
        <h1
          id="hero-heading"
          className="text-6xl md:text-7xl font-extrabold font-headline leading-none tracking-tight text-white"
        >
          Inventory management{" "}
          <span className="gradient-text">reimagined</span>
        </h1>

        <p className="text-xl max-w-2xl mx-auto leading-relaxed font-medium text-white/80">
          A production-grade operational ledger built with Express 5, React 19
          and PostgreSQL. Clean architecture, real authentication, image
          processing and server-side pagination.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2.5 px-8 py-4 btn-gradient text-white font-bold rounded-2xl shadow-lifted text-base active:scale-95"
            aria-label="Launch the Streamline demo application"
          >
            Launch app <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <a
            href="https://github.com/DAlejandroCl/streamline-inventory"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/[0.06] border border-white/10 text-white font-bold rounded-2xl hover:bg-white/[0.10] transition-all text-base"
          >
            View on GitHub <ChevronRight size={18} strokeWidth={2.5} />
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-4" role="list" aria-label="Technology stack">
          {STACK.map((s) => (
            <span
              key={s}
              role="listitem"
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-white/70"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FEATURES — usa tokens del design system → respeta el tema.
   ============================================================ */

function FeaturesSection() {
  return (
    <section
      className="py-32 px-6 bg-[var(--color-background)]"
      aria-labelledby="features-heading"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
            What's implemented
          </p>
          <h2
            id="features-heading"
            className="text-4xl font-extrabold font-headline text-[var(--color-text-primary)]"
          >
            Every feature backed by code
          </h2>
          <p className="max-w-xl mx-auto text-lg leading-relaxed text-[var(--color-text-secondary)]">
            No mock data, no placeholder metrics. Every card below describes a
            pattern traceable to a specific file in the repository.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-card border border-[var(--color-border)]/40 hover:shadow-lifted hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-[var(--color-primary-container)] flex items-center justify-center mb-4" aria-hidden="true">
                <f.icon size={20} className="text-[var(--color-primary)]" strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold font-headline text-[var(--color-text-primary)] mb-2">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   ARCHITECTURE — alterna fondo para ritmo visual.
   ============================================================ */

function ArchitectureSection() {
  return (
    <section
      className="py-32 px-6 bg-[var(--color-surface)]"
      aria-labelledby="arch-heading"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
            Engineering decisions
          </p>
          <h2
            id="arch-heading"
            className="text-4xl font-extrabold font-headline text-[var(--color-text-primary)] leading-tight"
          >
            Patterns worth reading about
          </h2>
          <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">
            Streamline applies patterns from production engineering — not
            because they are trendy, but because each one solves a specific
            problem that appears at scale.
          </p>

          <ul className="space-y-3" role="list">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle
                  size={16}
                  className="text-[var(--color-secondary)] shrink-0 mt-0.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span className="text-sm text-[var(--color-text-secondary)]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Code card — colores de sintaxis hardcoded (son colores de código,
            no de la UI) pero el fondo usa --color-sidebar-bg para coherencia */}
        <div
          className="rounded-2xl p-8 font-mono text-sm space-y-3 shadow-lifted"
          style={{ background: "var(--color-sidebar-bg)" }}
          aria-label="Code example from auth.middleware.ts"
          role="img"
        >
          <p className="text-[10px] mb-4 text-white/30">
            {`// src/middlewares/auth.middleware.ts`}
          </p>
          <div>
            <span className="text-purple-400">export async function </span>
            <span className="text-blue-400">requireAuth</span>
            <span className="text-white/70">(req, res, next) {"{"}</span>
          </div>
          <div className="pl-4 space-y-1.5 text-white/70">
            <p><span className="text-white/40">const </span><span className="text-green-400">token</span> = req.cookies?.token;</p>
            <p><span className="text-purple-400">if </span>(!token) <span className="text-white/40">throw </span><span className="text-red-400">new AppError(401);</span></p>
            <p><span className="text-white/40">const </span><span className="text-green-400">payload</span> = verifyToken(token);</p>
            <p><span className="text-blue-400">res.locals.user</span> = payload;</p>
            <p><span className="text-blue-400">next</span>();</p>
          </div>
          <p className="text-white/70">{"}"}</p>

          <div className="pt-4 border-t border-white/[0.07] space-y-2">
            <p className="text-[10px] text-white/30 mb-3">
              {`// Verified constants in auth.service.ts`}
            </p>
            {AUTH_FACTS.map((r) => (
              <div key={r.label} className="flex justify-between">
                <span className="text-xs text-white/40">{r.label}</span>
                <span className="text-xs font-bold text-green-400">{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CTA — hero oscuro de cierre, espejo del inicio.
   ============================================================ */

function CTASection() {
  return (
    <section
      className="py-32 px-6 relative overflow-hidden"
      style={{ background: "var(--color-sidebar-bg)" }}
      aria-labelledby="cta-heading"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-2xl mx-auto text-center space-y-8">
        <h2
          id="cta-heading"
          className="text-5xl font-extrabold font-headline text-white leading-tight"
        >
          Explore the demo
        </h2>
        <p className="text-xl leading-relaxed text-white/80">
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
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/[0.06] border border-white/10 text-white font-bold rounded-2xl hover:bg-white/[0.10] transition-all text-base"
          >
            View source <ChevronRight size={18} strokeWidth={2.5} />
          </a>
        </div>
        <p className="text-xs text-white/40">
          Demo credentials are pre-filled on the login page.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  return (
    <footer
      className="py-10 px-6 border-t"
      style={{ background: "var(--color-sidebar-bg)", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 btn-gradient rounded-lg flex items-center justify-center" aria-hidden="true">
            <Package size={13} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-white font-headline">Streamline</span>
        </div>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} Streamline — Portfolio project by Diego Clavijo
        </p>

        <nav aria-label="Footer navigation">
          <div className="flex items-center gap-4 text-xs text-white/50">
            <Link to="/login" className="hover:text-white transition-colors">
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

/* ============================================================
   PAGE EXPORT
   ============================================================ */

export default function LandingPage() {
  return (
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
  );
}
