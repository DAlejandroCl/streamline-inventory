type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="text-center py-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-500 mt-2">{description}</p>
    </div>
  );
}