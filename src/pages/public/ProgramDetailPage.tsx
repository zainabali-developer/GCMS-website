import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clock, Building2, CheckCircle2, ClipboardCheck, Briefcase, Wallet } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import Button from '../../components/ui/Button';
import { getProgramBySlug, getSubjects } from '../../services/publicData';
import type { Program, Subject } from '../../types/database';
import { friendlyError } from '../../lib/errors';
import NotFoundPage from './NotFoundPage';

function InfoBlock({ icon: Icon, title, content }: { icon: React.ComponentType<{ className?: string }>; title: string; content: string | null }) {
  return (
    <div className="border-t border-ink-100 py-6 first:border-t-0 first:pt-0">
      <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-ink-900">
        <Icon className="h-5 w-5 text-emerald-700" /> {title}
      </h2>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-600">
        {content || 'Information will be updated by the college.'}
      </p>
    </div>
  );
}

export default function ProgramDetailPage() {
  const { slug = '' } = useParams();
  const [program, setProgram] = useState<Program | null | undefined>(undefined);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setProgram(undefined);
    try {
      const p = await getProgramBySlug(slug);
      setProgram(p);
      if (p) setSubjects(await getSubjects(p.id));
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

  if (program === undefined) {
    return (
      <div className="container-page py-10">
        <LoadingSpinner />
      </div>
    );
  }

  if (program === null) return <NotFoundPage />;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Programs', href: '/programs' }, { label: program.name }]} />

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">{program.name}</h1>
            {program.admission_open && <Badge tone="gold">Admission Open</Badge>}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-500">
            {program.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {program.duration}
              </span>
            )}
            {program.department && (
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" /> {program.department.name}
              </span>
            )}
          </div>
        </div>
        <Link to="/admissions">
          <Button size="lg">Apply Now</Button>
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <InfoBlock icon={CheckCircle2} title="Program Overview" content={program.description} />
          <InfoBlock icon={ClipboardCheck} title="Eligibility" content={program.eligibility} />
          <InfoBlock icon={ClipboardCheck} title="Admission Requirements" content={program.admission_requirements} />
          <InfoBlock icon={Briefcase} title="Career Opportunities" content={program.career_opportunities} />
          <InfoBlock icon={Wallet} title="Fee Information" content={program.fee_info} />

          {subjects.length > 0 && (
            <div className="border-t border-ink-100 py-6">
              <h2 className="font-serif text-lg font-semibold text-ink-900">Subjects</h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="text-xs uppercase text-ink-400">
                    <tr>
                      <th className="py-2 pr-4">Subject</th>
                      <th className="py-2 pr-4">Semester</th>
                      <th className="py-2">Credit Hours</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {subjects.map((s) => (
                      <tr key={s.id}>
                        <td className="py-2 pr-4 text-ink-700">{s.name}</td>
                        <td className="py-2 pr-4 text-ink-500">{s.semester || '—'}</td>
                        <td className="py-2 text-ink-500">{s.credit_hours ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {subjects.length === 0 && program.subjects_overview && (
            <InfoBlock icon={CheckCircle2} title="Subjects Overview" content={program.subjects_overview} />
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          {program.image_url && (
            <img src={program.image_url} alt={program.name} className="w-full rounded-lg object-cover shadow-card" />
          )}
          <div className="mt-6 rounded-lg border border-ink-100 bg-white p-5 shadow-card">
            <h3 className="font-serif text-base font-semibold text-ink-900">Interested in this program?</h3>
            <p className="mt-2 text-sm text-ink-600">
              Visit the Admissions page for eligibility, required documents and important dates.
            </p>
            <Link to="/admissions" className="mt-4 block">
              <Button className="w-full">Go to Admissions</Button>
            </Link>
            <Link to="/contact" className="mt-2 block">
              <Button variant="outline" className="w-full">
                Contact the College
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
