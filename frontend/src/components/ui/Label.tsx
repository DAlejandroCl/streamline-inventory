type Props = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export default function Label({ children, required, className = "", ...props }: Props) {
  return (
    <label
      className={[
        "block text-[11px] font-bold uppercase tracking-widest",
        "text-[var(--color-text-secondary) mb-1.5",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-[var(--color-primary)" aria-hidden="true">*</span>}
    </label>
  );
}
