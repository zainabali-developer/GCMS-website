import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Card from '../../components/ui/Card';
import { SkeletonGrid } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { getDepartments } from '../../services/publicData';
import type { Department } from '../../types/database';
import { friendlyError } from '../../lib/errors';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setDepartments(await getDepartments());
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Departments' }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Departments</h1>
        <div className="rule-gold mt-4" />
      </div>

      <div className="mt-8">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : departments.length === 0 ? (
          <EmptyState title="No departments yet" description="Departments will appear here once added by the college." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((d) => (
              <Link key={d.id} to={`/departments/${d.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-panel">
                  {d.image_url && (
                    <img src={d.image_url} alt="" className="mb-4 h-36 w-full rounded-md object-cover" />
                  )}
                  <h2 className="font-serif text-lg font-semibold text-ink-900">{d.name}</h2>
                  {d.head_name && <p className="mt-1 text-xs text-ink-500">Head: {d.head_name}</p>}
                  {d.description && <p className="mt-3 line-clamp-3 text-sm text-ink-600">{d.description}</p>}
                  <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                    View department <ArrowRight className="h-3.5 w-3.5" />
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
