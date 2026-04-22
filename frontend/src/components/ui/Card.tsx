type Props = {
  children: React.ReactNode;
  className?: string;
  accent?: "primary" | "error" | "secondary" | "tertiary" | "none";
};

const accents: Record<string, string> = {
  primary:   "border-b-2 border-[var(--color-primary)]",
  error:     "border-b-2 border-[var(--color-error)]",
  secondary: "border-b-2 border-[var(--color-secondary)]",
  tertiary:  "border-b-2 border-[var(--color-tertiary)]",
  none:      "",
};

export default function Card({ children, className = "", accent = "none" }: Props) {
  return (
    <div
      className={[
        "bg-[var(--color-surface-container-lowest)] rounded-xl p-6",
        "shadow-ambient transition-shadow duration-200",
        accents[accent],
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
