import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pin, FileText, ChevronRight } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { getNotices } from '../../services/publicData';
import type { Notice } from '../../types/database';
import { friendlyError } from '../../lib/errors';
import { NOTICE_CATEGORIES } from '../../types/database';

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setNotices(await getNotices());
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const pinned = useMemo(() => notices.filter((n) => n.is_pinned), [notices]);

  const filtered = notices.filter((n) => {
    const matchesSearch = !search.trim() || n.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || n.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Notices' }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Notices &amp; Announcements</h1>
        <div className="rule-gold mt-4" />
      </div>

      {pinned.length > 0 && (
        <div className="mt-8 space-y-3">
          {pinned.map((n) => (
            <Link
              key={n.id}
              to={`/notices/${n.slug}`}
              className="flex items-start gap-3 rounded-lg border border-gold-300 bg-gold-50 px-4 py-3.5 hover:bg-gold-100"
            >
              <Pin className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink-800">{n.title}</p>
                {n.published_at && <p className="text-xs text-ink-500">{new Date(n.published_at).toLocaleDateString()}</p>}
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-ink-400" />
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search notices…" className="sm:max-w-xs" />
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={NOTICE_CATEGORIES.map((c) => ({ value: c, label: c }))}
          placeholder="All categories"
          className="sm:max-w-xs"
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No notices found" description="Try a different search term or category." />
        ) : (
          <ul className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
            {filtered.map((n) => (
              <li key={n.id}>
                <Link to={`/notices/${n.slug}`} className="flex items-start gap-3 px-4 py-4 hover:bg-ink-50">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-ink-800">{n.title}</p>
                      {n.category && <Badge tone="sky">{n.category}</Badge>}
                    </div>
                    {n.published_at && (
                      <p className="mt-1 text-xs text-ink-400">{new Date(n.published_at).toLocaleDateString()}</p>
                    )}
                  </div>
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
