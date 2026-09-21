import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', required, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={`w-full rounded-md border px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 ${
            error ? 'border-red-400' : 'border-ink-200'
          } ${className}`}
          {...props}
        />
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-1 text-xs text-ink-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
export default Input;
