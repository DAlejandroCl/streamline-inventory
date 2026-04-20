type Props = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export default function Label({ children, required, className = "", ...props }: Props) {
  return (
    <label
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-1 text-red-500" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
