import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileDown, CalendarDays } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import { getNoticeBySlug } from '../../services/publicData';
import type { Notice } from '../../types/database';
import { friendlyError } from '../../lib/errors';
import NotFoundPage from './NotFoundPage';

export default function NoticeDetailPage() {
  const { slug = '' } = useParams();
  const [notice, setNotice] = useState<Notice | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setNotice(undefined);
    try {
      setNotice(await getNoticeBySlug(slug));
    } catch (err) {
      setError(friendlyError(err));
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (error) {
    return (
      <div className="container-page py-10">
        <ErrorState message={error} onRetry={load} />
      </div>
    );
  }
  if (notice === undefined) {
    return (
      <div className="container-page py-10">
        <LoadingSpinner />
      </div>
    );
  }
  if (notice === null) return <NotFoundPage />;

  return (
    <div className="container-page max-w-3xl py-10">
      <Breadcrumb items={[{ label: 'Notices', href: '/notices' }, { label: notice.title }]} />

      <div className="mt-6">
        {notice.category && <Badge tone="sky">{notice.category}</Badge>}
        <h1 className="mt-3 text-2xl font-semibold text-ink-900 sm:text-3xl">{notice.title}</h1>
        {notice.published_at && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
            <CalendarDays className="h-4 w-4" /> Published {new Date(notice.published_at).toLocaleDateString()}
          </p>
        )}
        <div className="rule-gold mt-4" />
        <p className="mt-6 whitespace-pre-line leading-relaxed text-ink-700">{notice.content}</p>

        {notice.pdf_url && (
          <a
            href={notice.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-100"
          >
            <FileDown className="h-4 w-4" /> Download attached PDF
          </a>
        )}
      </div>
    </div>
  );
}
