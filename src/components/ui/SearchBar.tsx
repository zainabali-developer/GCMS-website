import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search…', className = '' }: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-md border border-ink-200 bg-white py-2.5 pl-9 pr-9 text-sm text-ink-900 placeholder:text-ink-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
