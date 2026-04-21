type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  hint?: string;
};

export default function Input({ error, hint, className = "", ...props }: Props) {
  return (
    <div className="w-full">
      <input
        {...props}
        className={`
          w-full border rounded-lg px-3 py-2
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          transition
          ${error ? "border-red-400 bg-red-50 focus:ring-red-400" : "border-gray-300"}
          ${className}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
}
