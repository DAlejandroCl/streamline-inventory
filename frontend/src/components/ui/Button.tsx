type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export default function Button({
  variant = "primary",
  className = "",
  ...props
}: Props) {
  const base = "px-4 py-2 rounded-lg font-medium transition";

  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-200 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props} />
  );
}