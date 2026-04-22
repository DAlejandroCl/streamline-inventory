import { type LucideIcon, Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  loading?: boolean;
};

const variants: Record<Variant, string> = {
  primary: "btn-gradient text-white font-semibold shadow-card hover:shadow-lifted",
  secondary: "bg-[var(--color-surface-low)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-high)] border border-[var(--color-border)]",
  ghost: "bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary-container)]",
  danger: "bg-[var(--color-error-container)] text-[var(--color-on-error-container)] hover:bg-[var(--color-error)] hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-5 py-3 text-sm rounded-xl gap-2",
};

const iconSizes: Record<Size, number> = { sm: 13, md: 15, lg: 16 };

export default function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  className = "",
  children,
  disabled,
  ...props
}: Props) {
  const sz = iconSizes[size];

  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center font-medium",
        "transition-all duration-200 select-none",
        "disabled:opacity-50 disabled:pointer-events-none",
        "active:scale-[0.97]",
        variants[variant],
        sizes[size],
        className,
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <Loader2 size={sz} className="animate-spin" />
      ) : Icon ? (
        <Icon size={sz} strokeWidth={2.2} />
      ) : null}
      {children}
      {!loading && IconRight && <IconRight size={sz} strokeWidth={2.2} />}
    </button>
  );
}
