type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: string;
  loading?: boolean;
};

const variants: Record<Variant, string> = {
  primary: [
    "btn-primary-gradient text-white font-semibold",
    "shadow-[rgba(36,56,156,0.25)_0px_4px_16px]",
    "hover:scale-[1.02] hover:shadow-[rgba(36,56,156,0.35)_0px_8px_24px]",
    "active:scale-[0.97]",
  ].join(" "),
  secondary: [
    "bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)]",
    "hover:bg-[var(--color-surface-container-high)]",
    "active:scale-[0.97]",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--color-primary)]",
    "hover:bg-[var(--color-primary-fixed)]/30",
    "active:scale-[0.97]",
  ].join(" "),
  danger: [
    "bg-[var(--color-error-container)] text-[var(--color-on-error-container)]",
    "hover:bg-[var(--color-error)] hover:text-white",
    "active:scale-[0.97]",
  ].join(" "),
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-5 py-2.5 text-sm rounded-lg gap-2",
  lg: "px-6 py-3 text-sm rounded-lg gap-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center font-medium transition-all duration-200",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <span className="material-symbols-outlined animate-spin text-base leading-none">
          progress_activity
        </span>
      ) : icon ? (
        <span className="material-symbols-outlined text-base leading-none">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
