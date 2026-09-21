import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { getSubjects, getPrograms } from '../../services/publicData';
import type { Subject, Program } from '../../types/database';
import { friendlyError } from '../../lib/errors';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programFilter, setProgramFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [s, p] = await Promise.all([getSubjects(), getPrograms()]);
      setSubjects(s);
      setPrograms(p);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = programFilter ? subjects.filter((s) => s.program_id === programFilter) : subjects;

  const grouped = filtered.reduce<Record<string, Subject[]>>((acc, s) => {
    const key = s.program?.name || 'Other';
    acc[key] = acc[key] ? [...acc[key], s] : [s];
    return acc;
  }, {});

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Subjects' }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Subjects</h1>
        <div className="rule-gold mt-4" />
      </div>

      <div className="mt-8 max-w-xs">
        <Select
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          options={programs.map((p) => ({ value: p.id, label: p.name }))}
          placeholder="All programs"
        />
      </div>

      <div className="mt-8">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No subjects to show" description="Subjects will be listed here once added by the college." />
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([programName, subs]) => (
              <div key={programName}>
                <h2 className="font-serif text-lg font-semibold text-ink-900">{programName}</h2>
                <div className="mt-3 overflow-x-auto rounded-lg border border-ink-100">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="bg-ink-50 text-xs uppercase text-ink-500">
                      <tr>
                        <th className="px-4 py-2.5">Subject</th>
                        <th className="px-4 py-2.5">Code</th>
                        <th className="px-4 py-2.5">Semester</th>
                        <th className="px-4 py-2.5">Credit Hours</th>
                        <th className="px-4 py-2.5">Teacher</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100 bg-white">
                      {subs.map((s) => (
                        <tr key={s.id}>
                          <td className="px-4 py-2.5 font-medium text-ink-800">{s.name}</td>
                          <td className="px-4 py-2.5 text-ink-500">{s.code || '—'}</td>
                          <td className="px-4 py-2.5 text-ink-500">{s.semester || '—'}</td>
                          <td className="px-4 py-2.5 text-ink-500">{s.credit_hours ?? '—'}</td>
                          <td className="px-4 py-2.5 text-ink-500">{s.teacher?.name || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
