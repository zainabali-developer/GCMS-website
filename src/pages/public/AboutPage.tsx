import { useEffect, useState } from 'react';
import { Target, Eye, Gem } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import { getAbout, getPrincipal } from '../../services/publicData';
import type { AboutInfo, PrincipalInfo } from '../../types/database';
import { friendlyError } from '../../lib/errors';
import principalPhoto from '../../assets/principal-photo.jpg';

export default function AboutPage() {
  const [about, setAbout] = useState<AboutInfo | null>(null);
  const [principal, setPrincipal] = useState<PrincipalInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [a, p] = await Promise.all([getAbout(), getPrincipal()]);
      setAbout(a);
      setPrincipal(p);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const coreValues = (about?.core_values ?? '')
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean);

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'About' }]} />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <>
          <div className="mt-6 max-w-3xl">
            <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">
              {about?.title || 'About Government College of Management Sciences, Abbottabad'}
            </h1>
            <div className="rule-gold mt-4" />
            <p className="mt-6 text-lg leading-relaxed text-ink-600">
              {about?.description ||
                'Government College of Management Sciences (GCMS), Abbottabad, also known as Commerce College Mandian, Abbottabad, is a public-sector educational institution located in Abbottabad.'}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card>
              <Target className="h-6 w-6 text-emerald-700" />
              <h2 className="mt-3 font-serif text-lg font-semibold text-ink-900">Mission</h2>
              <p className="mt-2 text-sm text-ink-600">{about?.mission || 'Information will be updated by the college.'}</p>
            </Card>
            <Card>
              <Eye className="h-6 w-6 text-emerald-700" />
              <h2 className="mt-3 font-serif text-lg font-semibold text-ink-900">Vision</h2>
              <p className="mt-2 text-sm text-ink-600">{about?.vision || 'Information will be updated by the college.'}</p>
            </Card>
            <Card>
              <Gem className="h-6 w-6 text-emerald-700" />
              <h2 className="mt-3 font-serif text-lg font-semibold text-ink-900">Core Values</h2>
              {coreValues.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm text-ink-600">
                  {coreValues.map((v, i) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-ink-600">Information will be updated by the college.</p>
              )}
            </Card>
          </div>

          <section className="mt-16 rounded-xl bg-emerald-50/60 p-6 sm:p-10">
            <SectionHeading title="Message from the Principal" />
            <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div className="mx-auto w-full max-w-xs overflow-hidden rounded-lg shadow-panel lg:mx-0">
                <img
                  src={principal?.photo_url || principalPhoto}
                  alt={principal?.name || 'Principal, GCMS Abbottabad'}
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div>
                <p className="leading-relaxed text-ink-600">
                  {principal?.message || 'A welcome message from the Principal will be published here shortly.'}
                </p>
                <p className="mt-5 font-serif text-lg font-semibold text-ink-900">{principal?.name || 'Principal'}</p>
                <p className="text-sm text-ink-500">
                  {principal?.designation || 'Government College of Management Sciences, Abbottabad'}
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
