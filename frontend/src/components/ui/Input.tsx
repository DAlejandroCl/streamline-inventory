type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  icon?: string;
};

export default function Input({
  label,
  error,
  hint,
  icon,
  id,
  className = "",
  ...props
}: Props) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-2 font-label"
        >
          {label}
          {props.required && (
            <span className="ml-1 text-[var(--color-primary)]">*</span>
          )}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-lg pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={[
            "w-full px-4 py-3 text-sm text-[var(--color-on-surface)]",
            "bg-[var(--color-surface-container-lowest)] rounded-lg",
            "border border-[var(--color-outline-variant)]/30",
            "focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10",
            "placeholder:text-[var(--color-outline)] transition-all duration-200",
            error ? "border-[var(--color-error)]/50 bg-[var(--color-error-container)]/10" : "",
            icon ? "pl-10" : "",
            className,
          ].join(" ")}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-[var(--color-error)] flex items-center gap-1">
          <span className="material-symbols-outlined text-sm leading-none">error</span>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-[var(--color-outline)]">{hint}</p>
      )}
    </div>
  );
}
