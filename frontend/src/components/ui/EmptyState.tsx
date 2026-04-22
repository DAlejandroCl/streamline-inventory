import { type LucideIcon, Package } from "lucide-react";

type Props = {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
};

export default function EmptyState({ title, description, icon: Icon = Package, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-[var(--color-primary-container) rounded-2xl flex items-center justify-center mb-5 shadow-card">
        <Icon size={28} className="text-[var(--color-primary)" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-bold text-[var(--color-text-primary) font-headline mb-2">
        {title}
      </h2>
      <p className="text-sm text-[var(--color-text-secondary) max-w-xs leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
