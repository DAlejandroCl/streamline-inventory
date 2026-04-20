import { Link } from "react-router-dom";

type Breadcrumb = {
  label: string;
  to: string;
};

type Props = {
  title: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
};

export default function PageHeader({ title, breadcrumbs, action }: Props) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-gray-500 mb-1">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.to} className="flex items-center gap-1">
                {index > 0 && <span aria-hidden="true">/</span>}
                <Link
                  to={crumb.to}
                  className="hover:text-indigo-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
            <span aria-hidden="true">/</span>
            <span className="text-gray-800 font-medium">{title}</span>
          </nav>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
