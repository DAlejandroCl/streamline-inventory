type Accent = "primary" | "error" | "secondary" | "warning" | "none";

type Props = {
  children: React.ReactNode;
  className?: string;
  accent?: Accent;
  hover?: boolean;
};

const accents: Record<Accent, string> = {
  primary:   "border-b-2 border-[var(--color-primary)]",
  error:     "border-b-2 border-[var(--color-error)]",
  secondary: "border-b-2 border-[var(--color-secondary)]",
  warning:   "border-b-2 border-[var(--color-warning)]",
  none:      "",
};

export default function Card({ children, className = "", accent = "none", hover = false }: Props) {
  return (
    <div
      className={[
        "bg-[var(--color-surface) rounded-2xl p-6 shadow-card",
        "border border-[var(--color-border)/40",
        hover && "transition-all duration-200 hover:shadow-lifted hover:-translate-y-0.5 cursor-pointer",
        accents[accent],
        className,
      ].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}
