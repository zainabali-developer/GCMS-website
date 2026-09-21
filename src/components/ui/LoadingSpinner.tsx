import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-500">
      <Loader2 className="h-7 w-7 animate-spin text-emerald-700" aria-hidden="true" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
