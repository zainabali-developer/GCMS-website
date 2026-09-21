import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { SkeletonGrid } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { getPrograms } from '../../services/publicData';
import type { Program } from '../../types/database';
import { friendlyError } from '../../lib/errors';

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'regular' | 'short_course'>('regular');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setPrograms(await getPrograms());
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = programs.filter((p) => p.type === tab);

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Programs' }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Academic Programs</h1>
        <div className="rule-gold mt-4" />
        <p className="mt-5 text-ink-600">
          Degree, diploma and short-course programs offered at Government College of Management Sciences, Abbottabad.
        </p>
      </div>

      <div className="mt-8 inline-flex rounded-md border border-ink-200 bg-white p-1">
        <button
          onClick={() => setTab('regular')}
          className={`rounded px-4 py-2 text-sm font-medium ${tab === 'regular' ? 'bg-emerald-700 text-white' : 'text-ink-600 hover:bg-ink-50'}`}
        >
          Regular Programs
        </button>
        <button
          onClick={() => setTab('short_course')}
          className={`rounded px-4 py-2 text-sm font-medium ${tab === 'short_course' ? 'bg-emerald-700 text-white' : 'text-ink-600 hover:bg-ink-50'}`}
        >
          Short Courses
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No programs to show" description="Information will be updated by the college." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <Link key={p.id} to={`/programs/${p.slug}`}>
                <Card className="flex h-full flex-col transition-shadow hover:shadow-panel">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-serif text-lg font-semibold text-ink-900">{p.name}</h2>
                    {p.admission_open && <Badge tone="gold">Open</Badge>}
                  </div>
                  {p.department && <p className="mt-1 text-xs text-ink-500">{p.department.name}</p>}
                  {p.duration && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-600">
                      <Clock className="h-3.5 w-3.5" /> {p.duration}
                    </p>
                  )}
                  {p.description && <p className="mt-3 line-clamp-3 flex-1 text-sm text-ink-600">{p.description}</p>}
                  <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                    View details <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
