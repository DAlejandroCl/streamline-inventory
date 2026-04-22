import { Link } from "react-router-dom";

type Breadcrumb = { label: string; to: string };

type Props = {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
};

export default function PageHeader({ title, description, breadcrumbs, action }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)] mb-2">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.to} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span className="material-symbols-outlined text-sm leading-none opacity-40">
                    chevron_right
                  </span>
                )}
                <Link
                  to={crumb.to}
                  className="hover:text-[var(--color-primary)] transition-colors font-medium"
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
            <span className="material-symbols-outlined text-sm leading-none opacity-40">chevron_right</span>
            <span className="text-[var(--color-on-surface)] font-semibold">{title}</span>
          </nav>
        )}
        <h1 className="text-4xl font-extrabold text-[var(--color-on-surface)] font-headline tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[var(--color-on-surface-variant)] mt-1.5 font-medium">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
