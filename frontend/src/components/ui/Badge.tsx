type Variant = "success" | "danger" | "warning" | "neutral" | "primary";

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
};

const styles: Record<Variant, string> = {
  success: "bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]",
  danger:  "bg-[var(--color-error-container)] text-[var(--color-on-error-container)]",
  warning: "bg-[var(--color-tertiary-fixed)] text-[var(--color-on-tertiary-fixed)]",
  neutral: "bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)]",
  primary: "bg-[var(--color-primary-fixed)] text-[var(--color-primary)]",
};

export default function Badge({ children, variant = "neutral", className = "" }: Props) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-full",
        "text-xs font-semibold tracking-wide",
        styles[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
