type Props = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export default function Label({ children, required, className = "", ...props }: Props) {
  return (
    <label
      className={[
        "block text-xs font-semibold uppercase tracking-wider",
        "text-[var(--color-on-surface-variant)] mb-2 font-label",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-[var(--color-primary)]" aria-hidden="true">*</span>
      )}
    </label>
  );
}
