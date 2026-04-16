type Props = {
  children: React.ReactNode;
  variant?: "success" | "danger";
};

export default function Badge({ children, variant = "success" }: Props) {
  const styles = {
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700"
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${styles[variant]}`}>
      {children}
    </span>
  );
}