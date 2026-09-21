import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:outline-emerald-700 disabled:bg-emerald-300',
  secondary: 'bg-gold-400 text-ink-900 hover:bg-gold-500 focus-visible:outline-gold-500 disabled:bg-gold-200',
  outline: 'border border-emerald-700 text-emerald-800 hover:bg-emerald-50 disabled:border-ink-200 disabled:text-ink-300',
  ghost: 'text-ink-700 hover:bg-ink-100 disabled:text-ink-300',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
};

const sizes: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-6 py-3 gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className = '', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
export default Button;
