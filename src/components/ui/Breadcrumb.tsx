import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="flex items-center gap-1.5">
          <Link to="/" className="flex items-center gap-1 hover:text-emerald-700">
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-ink-300" aria-hidden="true" />
            {item.href ? (
              <Link to={item.href} className="hover:text-emerald-700">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-ink-700" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
