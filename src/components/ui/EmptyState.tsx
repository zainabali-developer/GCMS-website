import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-ink-200 bg-ink-50/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-400 shadow-card">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden="true" />}
      </div>
      <h3 className="font-serif text-lg font-semibold text-ink-800">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
