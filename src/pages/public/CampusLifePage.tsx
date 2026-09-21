import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Presentation, Users2, Sparkles } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import { SkeletonGrid } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import { getCampusLife, getEvents, getGalleryImages } from '../../services/publicData';
import type { CampusLifeInfo, EventItem, GalleryImage } from '../../types/database';
import { friendlyError } from '../../lib/errors';

const THEMES = [
  { label: 'Student Activities & Clubs', category: 'Academic Activities', icon: Users2 },
  { label: 'Sports', category: 'Sports', icon: Trophy },
  { label: 'Seminars & Workshops', category: 'Seminars', icon: Presentation },
  { label: 'Campus Moments', category: 'Campus', icon: Sparkles },
];

export default function CampusLifePage() {
  const [intro, setIntro] = useState<CampusLifeInfo | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [i, e, g] = await Promise.all([getCampusLife(), getEvents(), getGalleryImages()]);
      setIntro(i);
      setEvents(e.filter((ev) => new Date(ev.event_date) >= new Date(new Date().toDateString())).slice(0, 4));
      setGallery(g);
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
      <Breadcrumb items={[{ label: 'Campus Life' }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Campus Life</h1>
        <div className="rule-gold mt-4" />
        <p className="mt-5 leading-relaxed text-ink-600">
          {intro?.intro ||
            'Life at GCMS Abbottabad extends beyond the classroom through student activities, sports, seminars and workshops throughout the academic year.'}
        </p>
      </div>

      {loading ? (
        <div className="mt-10">
          <SkeletonGrid count={4} />
        </div>
      ) : error ? (
        <div className="mt-10">
          <ErrorState message={error} onRetry={load} />
        </div>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {THEMES.map((theme) => {
              const count = gallery.filter((g) => g.category === theme.category).length;
              return (
                <Link key={theme.label} to={`/gallery`}>
                  <Card className="h-full text-center transition-shadow hover:shadow-panel">
                    <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <theme.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-serif text-sm font-semibold text-ink-900">{theme.label}</h3>
                    <p className="mt-1 text-xs text-ink-500">
                      {count > 0 ? `${count} photo${count === 1 ? '' : 's'} in the gallery` : 'Photos coming soon'}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>

          {events.length > 0 && (
            <section className="mt-14">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading title="Upcoming on Campus" />
                <Link to="/events" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                  All events <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {events.map((e) => (
                  <Link key={e.id} to={`/events/${e.slug}`}>
                    <Card className="h-full transition-shadow hover:shadow-panel">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                        {new Date(e.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                      <h3 className="mt-2 font-serif text-base font-semibold text-ink-900">{e.title}</h3>
                      {e.location && <p className="mt-1 text-xs text-ink-500">{e.location}</p>}
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {gallery.length > 0 && (
            <section className="mt-14">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading title="Gallery Highlights" />
                <Link to="/gallery" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                  Full gallery <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {gallery.slice(0, 12).map((img) => (
                  <div key={img.id} className="aspect-square overflow-hidden rounded-md bg-ink-100">
                    <img src={img.image_url} alt={img.title || ''} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
