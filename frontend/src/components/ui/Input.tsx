import { type LucideIcon, AlertCircle } from "lucide-react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  icon?: LucideIcon;
};

export default function Input({
  label,
  error,
  hint,
  icon: Icon,
  id,
  className = "",
  ...props
}: Props) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-secondary)]"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-[var(--color-primary)]">*</span>
          )}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            strokeWidth={2}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
          />
        )}
        <input
          id={id}
          className={[
            "w-full py-2.5 pr-4 text-sm text-[var(--color-text-primary)]",
            "bg-[var(--color-surface-low)] rounded-xl",
            "border transition-all duration-200",
            "placeholder:text-[var(--color-text-muted)]",
            "focus:outline-none focus:ring-2",
            error
              ? "border-[var(--color-error)]/60 bg-[var(--color-error-container)]/20 focus:ring-[var(--color-error)]/20 focus:border-[var(--color-error)]"
              : "border-[var(--color-border)] focus:ring-[var(--color-primary)]/15 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)]",
            Icon ? "pl-10" : "pl-4",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-[var(--color-error)] font-medium">
          <AlertCircle size={12} strokeWidth={2.5} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>
      )}
    </div>
  );
}
