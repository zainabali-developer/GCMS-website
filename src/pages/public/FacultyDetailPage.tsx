import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, MapPin, GraduationCap, Award } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import { getFacultyBySlug } from '../../services/publicData';
import type { Faculty } from '../../types/database';
import { friendlyError } from '../../lib/errors';
import NotFoundPage from './NotFoundPage';

export default function FacultyDetailPage() {
  const { slug = '' } = useParams();
  const [faculty, setFaculty] = useState<Faculty | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setFaculty(undefined);
    try {
      setFaculty(await getFacultyBySlug(slug));
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
  if (faculty === undefined) {
    return (
      <div className="container-page py-10">
        <LoadingSpinner />
      </div>
    );
  }
  if (faculty === null) return <NotFoundPage />;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Faculty', href: '/faculty' }, { label: faculty.name }]} />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-lg shadow-panel">
            <img src={faculty.photo_url || undefined} alt={faculty.name} className="h-full w-full bg-ink-100 object-cover" />
          </div>
          <div className="mt-5 space-y-2.5 rounded-lg border border-ink-100 bg-white p-5 text-sm">
            {faculty.email && (
              <a href={`mailto:${faculty.email}`} className="flex items-center gap-2.5 text-ink-700 hover:text-emerald-700">
                <Mail className="h-4 w-4 shrink-0 text-emerald-700" /> {faculty.email}
              </a>
            )}
            {faculty.phone && (
              <a href={`tel:${faculty.phone}`} className="flex items-center gap-2.5 text-ink-700 hover:text-emerald-700">
                <Phone className="h-4 w-4 shrink-0 text-emerald-700" /> {faculty.phone}
              </a>
            )}
            {faculty.office && (
              <p className="flex items-center gap-2.5 text-ink-700">
                <MapPin className="h-4 w-4 shrink-0 text-emerald-700" /> {faculty.office}
              </p>
            )}
            {faculty.experience && (
              <p className="flex items-center gap-2.5 text-ink-700">
                <Award className="h-4 w-4 shrink-0 text-emerald-700" /> {faculty.experience}
              </p>
            )}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{faculty.name}</h1>
          <p className="mt-1 text-emerald-700">{faculty.designation}</p>
          {(faculty.department || faculty.qualification) && (
            <p className="mt-1 text-sm text-ink-500">
              {[faculty.department?.name, faculty.qualification].filter(Boolean).join(' · ')}
            </p>
          )}
          <div className="rule-gold mt-4" />

          {faculty.bio && (
            <div className="mt-6">
              <h2 className="font-serif text-lg font-semibold text-ink-900">Biography</h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-600">{faculty.bio}</p>
            </div>
          )}

          {faculty.specialization && (
            <div className="mt-6">
              <h2 className="font-serif text-lg font-semibold text-ink-900">Specialization</h2>
              <p className="mt-2 text-ink-600">{faculty.specialization}</p>
            </div>
          )}

          {faculty.subjects && faculty.subjects.length > 0 && (
            <div className="mt-6">
              <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink-900">
                <GraduationCap className="h-5 w-5 text-emerald-700" /> Subjects Taught
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {faculty.subjects.map((s) => (
                  <li key={s.id} className="rounded-full border border-ink-200 bg-white px-3 py-1.5 text-sm text-ink-700">
                    {s.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
