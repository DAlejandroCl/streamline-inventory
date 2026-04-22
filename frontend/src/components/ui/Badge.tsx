type Variant = "success" | "danger" | "warning" | "neutral" | "primary";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  dot?: boolean;
  className?: string;
};

const styles: Record<Variant, { wrap: string; dot: string }> = {
  success: {
    wrap: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
    dot:  "bg-[var(--color-secondary)]",
  },
  danger: {
    wrap: "bg-[var(--color-error-container)] text-[var(--color-on-error-container)]",
    dot:  "bg-[var(--color-error)]",
  },
  warning: {
    wrap: "bg-[var(--color-warning-container)] text-[var(--color-on-warning-container)]",
    dot:  "bg-[var(--color-warning)]",
  },
  neutral: {
    wrap: "bg-[var(--color-surface-high)] text-[var(--color-text-secondary)]",
    dot:  "bg-[var(--color-text-muted)]",
  },
  primary: {
    wrap: "bg-[var(--color-primary-container)] text-[var(--color-primary)]",
    dot:  "bg-[var(--color-primary)]",
  },
};

export default function Badge({ children, variant = "neutral", dot = true, className = "" }: Props) {
  const s = styles[variant];
  return (
    <span className={["inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide", s.wrap, className].join(" ")}>
      {dot && <span className={["w-1.5 h-1.5 rounded-full shrink-0", s.dot].join(" ")} />}
      {children}
    </span>
  );
}
