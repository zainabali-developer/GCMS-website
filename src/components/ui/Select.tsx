import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, id, className = '', required, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink-700">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            required={required}
            aria-invalid={Boolean(error)}
            className={`w-full appearance-none rounded-md border bg-white px-3 py-2 pr-9 text-sm text-ink-900 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 ${
              error ? 'border-red-400' : 'border-ink-200'
            } ${className}`}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden="true"
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
export default Select;
