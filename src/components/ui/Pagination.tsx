import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="px-3 text-sm text-ink-600">
        Page {page} of {pageCount}
      </span>
      <button
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
