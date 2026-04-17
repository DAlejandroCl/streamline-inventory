type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition ${className}`}
    >
      {children}
    </div>
  );
}