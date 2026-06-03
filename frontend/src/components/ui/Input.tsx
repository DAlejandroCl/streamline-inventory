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
          className="block text-[11px] font-bold uppercase tracking-widest text-(--color-text-secondary)"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-primary">*</span>
          )}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            strokeWidth={2}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-text-muted) pointer-events-none"
          />
        )}
        <input
          id={id}
          className={[
            "w-full py-2.5 pr-4 text-sm text-(--color-text-primary)",
            "bg-(--color-surface-low) rounded-xl",
            "border transition-all duration-200",
            "placeholder:text-(--color-text-muted)",
            "focus:outline-none focus:ring-2",
            error
              ? "border-error/60 bg-error-container/20 focus:ring-error/20 focus:border-error"
              : "border-(--color-border) focus:ring-primary/15 focus:border-primary focus:bg-(--color-surface)",
            Icon ? "pl-10" : "pl-4",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-error font-medium">
          <AlertCircle size={12} strokeWidth={2.5} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-(--color-text-muted)">{hint}</p>
      )}
    </div>
  );
}
