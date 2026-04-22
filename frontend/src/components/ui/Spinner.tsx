type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes: Record<string, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

export default function Spinner({ size = "md", className = "" }: Props) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={[
        "material-symbols-outlined animate-spin text-[var(--color-primary)] leading-none",
        sizes[size],
        className,
      ].join(" ")}
    >
      progress_activity
    </span>
  );
}
