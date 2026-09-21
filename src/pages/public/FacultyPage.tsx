import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Card from '../../components/ui/Card';
import SearchBar from '../../components/ui/SearchBar';
import Select from '../../components/ui/Select';
import { SkeletonGrid } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { getFaculty, getDepartments } from '../../services/publicData';
import type { Faculty, Department } from '../../types/database';
import { friendlyError } from '../../lib/errors';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [designationFilter, setDesignationFilter] = useState('');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [f, d] = await Promise.all([getFaculty(), getDepartments()]);
      setFaculty(f);
      setDepartments(d);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const designations = useMemo(
    () => Array.from(new Set(faculty.map((f) => f.designation).filter(Boolean))) as string[],
    [faculty]
  );

  const filtered = faculty.filter((f) => {
    const matchesSearch =
      !search.trim() ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.specialization ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = !departmentFilter || f.department_id === departmentFilter;
    const matchesDesignation = !designationFilter || f.designation === designationFilter;
    return matchesSearch && matchesDept && matchesDesignation;
  });

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Faculty' }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Faculty</h1>
        <div className="rule-gold mt-4" />
        <p className="mt-5 text-ink-600">Meet the teaching faculty of Government College of Management Sciences, Abbottabad.</p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or specialization…" className="sm:max-w-xs" />
        <Select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
          placeholder="All departments"
          className="sm:max-w-xs"
        />
        <Select
          value={designationFilter}
          onChange={(e) => setDesignationFilter(e.target.value)}
          options={designations.map((d) => ({ value: d, label: d }))}
          placeholder="All designations"
          className="sm:max-w-xs"
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <SkeletonGrid count={8} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No faculty found" description="Try adjusting your search or filters." />
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((f) => (
              <Link key={f.id} to={`/faculty/${f.slug}`}>
                <Card className="h-full text-center transition-shadow hover:shadow-panel">
                  <div className="mx-auto h-24 w-24 overflow-hidden rounded-full">
                    <img src={f.photo_url || undefined} alt={f.name} className="h-full w-full bg-ink-100 object-cover" />
                  </div>
                  <h3 className="mt-3 font-serif text-sm font-semibold text-ink-900">{f.name}</h3>
                  {f.designation && <p className="text-xs text-ink-500">{f.designation}</p>}
                  {f.department && <p className="text-xs text-ink-400">{f.department.name}</p>}
                  {f.email && (
                    <p className="mt-2 flex items-center justify-center gap-1 text-xs text-emerald-700">
                      <Mail className="h-3 w-3" /> <span className="truncate">{f.email}</span>
                    </p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
