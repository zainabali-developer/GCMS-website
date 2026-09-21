import { useEffect, useState } from 'react';
import { FileDown, FileText } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { getDownloads } from '../../services/publicData';
import type { DownloadFile } from '../../types/database';
import { DOWNLOAD_CATEGORIES } from '../../types/database';
import { friendlyError } from '../../lib/errors';

export default function DownloadsPage() {
  const [files, setFiles] = useState<DownloadFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('All');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setFiles(await getDownloads());
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = category === 'All' ? files : files.filter((f) => f.category === category);

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Downloads' }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Downloads</h1>
        <div className="rule-gold mt-4" />
        <p className="mt-5 text-ink-600">Admission forms, prospectus, timetables, syllabus and other official documents.</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {['All', ...DOWNLOAD_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              category === cat ? 'bg-emerald-700 text-white' : 'border border-ink-200 text-ink-600 hover:bg-ink-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No documents yet" description="Documents will appear here once uploaded by the college." />
        ) : (
          <ul className="divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
            {filtered.map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-4 px-4 py-4">
                <div className="flex min-w-0 items-start gap-3">
                  <FileText className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-800">{f.title}</p>
                    <p className="text-xs text-ink-500">
                      {f.category}
                      {f.description ? ` · ${f.description}` : ''}
                    </p>
                  </div>
                </div>
                <a
                  href={f.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex shrink-0 items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                >
                  <FileDown className="h-3.5 w-3.5" /> Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
