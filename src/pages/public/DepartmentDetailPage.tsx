import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import SectionHeading from '../../components/ui/SectionHeading';
import { getDepartmentBySlug, getProgramsByDepartment, getFacultyByDepartment } from '../../services/publicData';
import type { Department, Program, Faculty } from '../../types/database';
import { friendlyError } from '../../lib/errors';
import NotFoundPage from './NotFoundPage';

export default function DepartmentDetailPage() {
  const { slug = '' } = useParams();
  const [department, setDepartment] = useState<Department | null | undefined>(undefined);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setDepartment(undefined);
    try {
      const d = await getDepartmentBySlug(slug);
      setDepartment(d);
      if (d) {
        const [p, f] = await Promise.all([getProgramsByDepartment(d.id), getFacultyByDepartment(d.id)]);
        setPrograms(p);
        setFaculty(f);
      }
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
  if (department === undefined) {
    return (
      <div className="container-page py-10">
        <LoadingSpinner />
      </div>
    );
  }
  if (department === null) return <NotFoundPage />;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Departments', href: '/departments' }, { label: department.name }]} />

      <div className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{department.name}</h1>
        {department.head_name && <p className="mt-2 text-ink-500">Department Head: {department.head_name}</p>}
        <div className="rule-gold mt-4" />
        <p className="mt-5 leading-relaxed text-ink-600">
          {department.description || 'Information will be updated by the college.'}
        </p>
      </div>

      {programs.length > 0 && (
        <section className="mt-14">
          <SectionHeading title="Programs in this Department" />
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <Link key={p.id} to={`/programs/${p.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-panel">
                  <h3 className="font-serif text-base font-semibold text-ink-900">{p.name}</h3>
                  {p.duration && <p className="mt-1 text-sm text-ink-500">{p.duration}</p>}
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {faculty.length > 0 && (
        <section className="mt-14">
          <SectionHeading title="Faculty" />
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {faculty.map((f) => (
              <Link key={f.id} to={`/faculty/${f.slug}`} className="text-center">
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-white shadow-card">
                  <img src={f.photo_url || undefined} alt={f.name} className="h-full w-full bg-ink-100 object-cover" />
                </div>
                <p className="mt-3 text-sm font-semibold text-ink-900">{f.name}</p>
                {f.designation && <p className="text-xs text-ink-500">{f.designation}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
