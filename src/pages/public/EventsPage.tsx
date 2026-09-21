import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Card from '../../components/ui/Card';
import { SkeletonGrid } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { getEvents } from '../../services/publicData';
import type { EventItem } from '../../types/database';
import { friendlyError } from '../../lib/errors';

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setEvents(await getEvents());
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const today = useMemo(() => new Date(new Date().toDateString()), []);
  const upcoming = events.filter((e) => new Date(e.event_date) >= today);
  const past = events.filter((e) => new Date(e.event_date) < today).reverse();
  const list = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Events' }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Events</h1>
        <div className="rule-gold mt-4" />
      </div>

      <div className="mt-8 inline-flex rounded-md border border-ink-200 bg-white p-1">
        <button
          onClick={() => setTab('upcoming')}
          className={`rounded px-4 py-2 text-sm font-medium ${tab === 'upcoming' ? 'bg-emerald-700 text-white' : 'text-ink-600 hover:bg-ink-50'}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setTab('past')}
          className={`rounded px-4 py-2 text-sm font-medium ${tab === 'past' ? 'bg-emerald-700 text-white' : 'text-ink-600 hover:bg-ink-50'}`}
        >
          Past
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : list.length === 0 ? (
          <EmptyState title={`No ${tab} events`} description="Check back soon for updates." />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => (
              <Link key={e.id} to={`/events/${e.slug}`}>
                <Card className="flex h-full flex-col overflow-hidden !p-0 transition-shadow hover:shadow-panel">
                  {e.image_url ? (
                    <img src={e.image_url} alt={e.title} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-emerald-50">
                      <CalendarDays className="h-10 w-10 text-emerald-300" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      {new Date(e.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h3 className="mt-1.5 font-serif text-base font-semibold text-ink-900">{e.title}</h3>
                    {e.location && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-500">
                        <MapPin className="h-3.5 w-3.5" /> {e.location}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
