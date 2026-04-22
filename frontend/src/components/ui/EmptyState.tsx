type Props = {
  title: string;
  description: string;
  icon?: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  title,
  description,
  icon = "inventory_2",
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-[var(--color-primary-fixed)]/40 rounded-full flex items-center justify-center mb-5">
        <span className="material-symbols-outlined text-3xl text-[var(--color-primary)]">
          {icon}
        </span>
      </div>
      <h2 className="text-xl font-bold text-[var(--color-on-surface)] font-headline mb-2">
        {title}
      </h2>
      <p className="text-sm text-[var(--color-on-surface-variant)] max-w-xs leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
