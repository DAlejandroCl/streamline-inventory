type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-8 w-8 border-[3px]",
};

export default function Spinner({ size = "md", className = "" }: Props) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full border-gray-300 border-t-indigo-600 animate-spin ${sizes[size]} ${className}`}
    />
  );
}
