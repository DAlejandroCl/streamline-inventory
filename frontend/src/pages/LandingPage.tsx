/* ============================================================
   LANDING PAGE
   Public marketing page at "/".
   Uses the design system tokens but with dramatic editorial
   layout: dark hero, grid lines, feature cards, CTA.
   No auth required — this is the first thing anyone sees.
   ============================================================ */

import { Link } from "react-router-dom";
import {
  Package, BarChart3, Shield, Zap, ArrowRight,
  CheckCircle, TrendingUp, Bell, Globe, ChevronRight,
  Database, Lock, Layers,
} from "lucide-react";

/* ---- Feature data ---------------------------------------- */

const FEATURES = [
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    desc: "Live inventory metrics, stock trends, and value calculations updated on every action.",
    color: "text-[var(--color-primary)]",
    bg: "bg-[var(--color-primary-container)]",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    desc: "JWT authentication via httpOnly cookies. No tokens in localStorage — XSS safe.",
    color: "text-[var(--color-secondary)]",
    bg: "bg-[var(--color-secondary-container)]",
  },
  {
    icon: Zap,
    title: "Instant Operations",
    desc: "Create, update, and delete products with optimistic UI and zero-latency feedback.",
    color: "text-[var(--color-warning)]",
    bg: "bg-[var(--color-warning-container)]",
  },
  {
    icon: Database,
    title: "PostgreSQL Backed",
    desc: "Production-grade relational database with Sequelize ORM, typed models, and decimal precision.",
    color: "text-[var(--color-primary)]",
    bg: "bg-[var(--color-primary-container)]",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Toast feedback on every operation. Stock warnings, out-of-stock alerts, and system events.",
    color: "text-[var(--color-error)]",
    bg: "bg-[var(--color-error-container)]",
  },
  {
    icon: Layers,
    title: "Clean Architecture",
    desc: "Express 5 + React 19. Controllers → Services → Models. No shortcuts, no spaghetti.",
    color: "text-[var(--color-secondary)]",
    bg: "bg-[var(--color-secondary-container)]",
  },
];

const STACK = [
  "Node.js + Express 5", "TypeScript 6 (strict)", "React 19 + Vite",
  "React Router 7", "Tailwind CSS 4", "PostgreSQL + Sequelize",
  "Zod validation", "JWT + httpOnly cookies", "Swagger / OpenAPI",
];

const CHECKLIST = [
  "Clean Architecture — Controllers → Services → Models",
  "JWT authentication with httpOnly cookie strategy",
  "Role-based access (admin / viewer)",
  "Fully typed DTOs on backend and frontend",
  "Zod validation with English-only error messages",
  "React Router 7 loaders, actions, and typed data",
  "Centralized API client — no inline fetch calls",
  "Production-ready error handling with AppError class",
];

/* ---- Components ------------------------------------------ */

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass shadow-navbar">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 btn-gradient rounded-lg flex items-center justify-center shadow-lifted">
            <Package size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[15px] font-extrabold font-headline text-[var(--color-text-primary)]">
            Streamline
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors px-4 py-2 rounded-xl hover:bg-[var(--color-primary-container)]"
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
      style={{ background: "var(--color-sidebar-bg)" }}
    >
      {/* Grid lines background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "var(--color-primary)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl"
        style={{ background: "var(--color-secondary)" }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-white/10 bg-white/5 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" />
          Portfolio · Production-grade PERN stack
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-7xl font-extrabold font-headline text-white leading-none tracking-tight">
          Inventory
          <br />
          <span className="gradient-text">reimagined.</span>
        </h1>

        {/* Sub */}
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          A production-grade operational ledger built with Express 5, React 19,
          and TypeScript 6. Clean architecture. Real auth. Zero compromises.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2.5 px-8 py-4 btn-gradient text-white font-bold rounded-2xl shadow-lifted hover:shadow-lifted transition-all text-base active:scale-95"
          >
            Launch app <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <a
            href="http://localhost:3000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/[0.06] border border-white/10 text-white font-bold rounded-2xl hover:bg-white/[0.10] transition-all text-base"
          >
            View API docs <ChevronRight size={18} strokeWidth={2.5} />
          </a>
        </div>

        {/* Stack pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {STACK.map((s) => (
            <span
              key={s}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/[0.08] text-slate-400"
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
    <section className="py-32 px-6 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
            Capabilities
          </p>
          <h2 className="text-4xl font-extrabold font-headline text-[var(--color-text-primary)]">
            Built for engineers,
            <br />
            <span className="gradient-text">designed for users.</span>
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto text-lg leading-relaxed">
            Every feature is intentional. Every decision is documented.
            This is what production-ready looks like.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-card border border-[var(--color-border)]/40 hover:shadow-lifted hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div className={["w-11 h-11 rounded-xl flex items-center justify-center mb-4", f.bg].join(" ")}>
                <f.icon size={20} className={f.color} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-[var(--color-text-primary)] font-headline mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {f.desc}
              </p>
            </div>
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
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
            Engineering standards
          </p>
          <h2 className="text-4xl font-extrabold font-headline text-[var(--color-text-primary)] leading-tight">
            No shortcuts.
            <br />No excuses.
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
            Streamline enforces architecture rules at every layer.
            The backend uses Express 5's native async error propagation —
            no try-catch in controllers. The frontend uses typed React Router
            loaders with a centralized API client.
          </p>

          <ul className="space-y-3">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle
                  size={16}
                  className="text-[var(--color-secondary)] shrink-0 mt-0.5"
                  strokeWidth={2.5}
                />
                <span className="text-sm text-[var(--color-text-secondary)]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — code-like card */}
        <div
          className="rounded-2xl p-8 font-mono text-sm space-y-3 shadow-lifted"
          style={{ background: "var(--color-sidebar-bg)" }}
        >
          <p className="text-slate-500 text-xs mb-4">// auth.middleware.ts</p>
          {[
            { c: "text-purple-400", t: "export async function " },
            { c: "text-blue-400",   t: "requireAuth" },
            { c: "text-slate-300",  t: "(req, res, next) {" },
          ].map((l, i) => (
            <span key={i} className={l.c}>{l.t}</span>
          ))}
          <div className="space-y-2 pl-4">
            <p><span className="text-slate-500">const </span><span className="text-green-400">token</span><span className="text-slate-400"> = req.cookies?.token;</span></p>
            <p><span className="text-purple-400">if </span><span className="text-slate-300">(!token)</span><span className="text-slate-500"> throw </span><span className="text-red-400">new AppError(401);</span></p>
            <p><span className="text-slate-500">const </span><span className="text-green-400">payload</span><span className="text-slate-400"> = verifyToken(token);</span></p>
            <p><span className="text-blue-400">res.locals.user </span><span className="text-slate-400">= payload;</span></p>
            <p><span className="text-blue-400">next</span><span className="text-slate-400">();</span></p>
          </div>
          <p className="text-slate-300">{"}"}</p>
          <div className="pt-4 border-t border-white/[0.06] space-y-2">
            {[
              { label: "Auth method", val: "httpOnly cookie" },
              { label: "Token expiry", val: "7 days" },
              { label: "Hashing", val: "bcrypt · 12 rounds" },
            ].map((r) => (
              <div key={r.label} className="flex justify-between">
                <span className="text-slate-500 text-xs">{r.label}</span>
                <span className="text-green-400 text-xs font-bold">{r.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricsSection() {
  const METRICS = [
    { icon: TrendingUp, value: "< 50ms", label: "Avg API response", color: "text-[var(--color-primary)]", bg: "bg-[var(--color-primary-container)]" },
    { icon: Lock,       value: "100%",   label: "Routes protected", color: "text-[var(--color-secondary)]", bg: "bg-[var(--color-secondary-container)]" },
    { icon: Globe,      value: "REST",   label: "API standard",     color: "text-[var(--color-warning)]",   bg: "bg-[var(--color-warning-container)]" },
    { icon: Database,   value: "∞",      label: "Products capacity",color: "text-[var(--color-primary)]",   bg: "bg-[var(--color-primary-container)]" },
  ];

  return (
    <section className="py-24 px-6 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-card border border-[var(--color-border)]/40 text-center"
            >
              <div className={["w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4", m.bg].join(" ")}>
                <m.icon size={22} className={m.color} strokeWidth={2} />
              </div>
              <p className={["text-3xl font-extrabold font-headline tabular", m.color].join(" ")}>
                {m.value}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] font-medium mt-1.5 uppercase tracking-widest">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section
      className="py-32 px-6 relative overflow-hidden"
      style={{ background: "var(--color-sidebar-bg)" }}
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative max-w-2xl mx-auto text-center space-y-8">
        <h2 className="text-5xl font-extrabold font-headline text-white leading-tight">
          Ready to explore?
        </h2>
        <p className="text-xl text-slate-400 leading-relaxed">
          Sign in with the demo credentials and take Streamline for a spin.
          No setup required.
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
            View on GitHub <ChevronRight size={18} strokeWidth={2.5} />
          </a>
        </div>
        <p className="text-slate-600 text-xs">
          Demo: admin@streamline.app · admin123
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="py-10 px-6 border-t"
      style={{
        background: "var(--color-sidebar-bg)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 btn-gradient rounded-lg flex items-center justify-center">
            <Package size={13} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold text-white font-headline">Streamline</span>
        </div>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Streamline — Portfolio Project by Diego Clavijo
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <Link to="/login" className="hover:text-slate-400 transition-colors">Sign in</Link>
          <a href="http://localhost:3000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">API Docs</a>
          <a href="https://github.com/DAlejandroCl/streamline-inventory" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}

/* ---- Page export ----------------------------------------- */

export default function LandingPage() {
  return (
    <div className="font-body">
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <ArchitectureSection />
      <MetricsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
