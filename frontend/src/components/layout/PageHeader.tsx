import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type Breadcrumb = { label: string; to: string };

type Props = {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
};

export default function PageHeader({ title, description, breadcrumbs, action }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-[var(--color-text-muted) mb-2.5 flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.to} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={11} strokeWidth={2.5} className="opacity-50" />}
                <Link
                  to={crumb.to}
                  className="font-semibold hover:text-[var(--color-primary) transition-colors"
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
            <ChevronRight size={11} strokeWidth={2.5} className="opacity-50" />
            <span className="font-bold text-[var(--color-text-secondary)">{title}</span>
          </nav>
        )}
        <h1 className="text-4xl font-extrabold font-headline text-[var(--color-text-primary) tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[var(--color-text-secondary) mt-2 font-medium text-sm leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
