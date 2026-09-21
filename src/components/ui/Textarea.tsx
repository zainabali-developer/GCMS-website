import { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = '', required, rows = 4, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          required={required}
          aria-invalid={Boolean(error)}
          className={`w-full rounded-md border px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 ${
            error ? 'border-red-400' : 'border-ink-200'
          } ${className}`}
          {...props}
        />
        {hint && !error && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
export default Textarea;
