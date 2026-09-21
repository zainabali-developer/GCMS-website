import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, ArrowRight } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SearchBar from '../../components/ui/SearchBar';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { globalSearch, SearchResult } from '../../services/publicData';
import { friendlyError } from '../../lib/errors';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get('q') ?? '';
  const [term, setTerm] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch(q: string) {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setResults(await globalSearch(q));
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setParams(term.trim() ? { q: term.trim() } : {});
  }

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Search' }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Search</h1>
        <div className="rule-gold mt-4" />
        <p className="mt-5 text-ink-600">
          Search across programs, faculty, departments, notices, events and downloads.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-xl">
        <SearchBar value={term} onChange={setTerm} placeholder="Search the site…" />
      </form>

      <div className="mt-8">
        {!initialQuery.trim() ? (
          <EmptyState
            icon={<SearchIcon className="h-6 w-6" />}
            title="Start typing to search"
            description="Try a program name, a faculty member, or a keyword from a notice."
          />
        ) : loading ? (
          <LoadingSpinner label={`Searching for "${initialQuery}"…`} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => runSearch(initialQuery)} />
        ) : !results || results.length === 0 ? (
          <EmptyState
            icon={<SearchIcon className="h-6 w-6" />}
            title={`No results for "${initialQuery}"`}
            description="Try a different search term."
          />
        ) : (
          <>
            <p className="mb-4 text-sm text-ink-500">
              {results.length} result{results.length === 1 ? '' : 's'} for "{initialQuery}"
            </p>
            <ul className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
              {results.map((r) => (
                <li key={`${r.type}-${r.id}`}>
                  <Link to={r.href} className="flex items-start justify-between gap-3 px-4 py-4 hover:bg-ink-50">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="sky">{r.type}</Badge>
                        <p className="truncate text-sm font-medium text-ink-800">{r.title}</p>
                      </div>
                      {r.snippet && <p className="mt-1 line-clamp-1 text-xs text-ink-500">{r.snippet}</p>}
                    </div>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
