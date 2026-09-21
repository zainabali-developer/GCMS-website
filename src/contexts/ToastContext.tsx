import { useCallback, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { ToastContext, type ToastKind } from './toastStore';

interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, kind, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-panel bg-white animate-in ${
              t.kind === 'success'
                ? 'border-emerald-200'
                : t.kind === 'error'
                  ? 'border-red-200'
                  : 'border-sky-200'
            }`}
          >
            {t.kind === 'success' && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />}
            {t.kind === 'error' && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />}
            {t.kind === 'info' && <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />}
            <p className="flex-1 text-sm text-ink-800">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="text-ink-400 hover:text-ink-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
