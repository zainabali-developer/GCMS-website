import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-500 shadow-card">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-ink-800">We couldn't load this content</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-500">
        {message || 'Something went wrong while fetching data from the server.'}
      </p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
