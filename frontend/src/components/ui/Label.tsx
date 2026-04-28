/* ============================================================
   LABEL — Form field label primitive
   ============================================================ */

type Props = {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function Label({ htmlFor, required, children, className = "" }: Props) {
  return (
    <label
      htmlFor={htmlFor}
      className={[
        "block text-xs font-bold uppercase tracking-widest",
        "text-[var(--color-text-secondary)] mb-1.5",
        className,
      ].join(" ")}
    >
      {children}
      {required && <span className="ml-1 text-[var(--color-primary)]" aria-hidden="true">*</span>}
    </label>
  );
}
