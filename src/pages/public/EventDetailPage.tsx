import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, User, ExternalLink } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import { getEventBySlug } from '../../services/publicData';
import type { EventItem } from '../../types/database';
import { friendlyError } from '../../lib/errors';
import NotFoundPage from './NotFoundPage';

export default function EventDetailPage() {
  const { slug = '' } = useParams();
  const [event, setEvent] = useState<EventItem | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    setEvent(undefined);
    try {
      setEvent(await getEventBySlug(slug));
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
  if (event === undefined) {
    return (
      <div className="container-page py-10">
        <LoadingSpinner />
      </div>
    );
  }
  if (event === null) return <NotFoundPage />;

  return (
    <div className="container-page max-w-3xl py-10">
      <Breadcrumb items={[{ label: 'Events', href: '/events' }, { label: event.title }]} />

      {event.image_url && (
        <img src={event.image_url} alt={event.title} className="mt-6 h-64 w-full rounded-lg object-cover shadow-card sm:h-80" />
      )}

      <h1 className="mt-6 text-2xl font-semibold text-ink-900 sm:text-3xl">{event.title}</h1>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-600">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-emerald-700" />
          {new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
        {event.event_time && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-emerald-700" /> {event.event_time}
          </span>
        )}
        {event.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-emerald-700" /> {event.location}
          </span>
        )}
        {event.organizer && (
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-emerald-700" /> {event.organizer}
          </span>
        )}
      </div>

      <div className="rule-gold mt-5" />

      <p className="mt-6 whitespace-pre-line leading-relaxed text-ink-700">
        {event.description || 'More details about this event will be shared soon.'}
      </p>

      {event.registration_link && (
        <a href={event.registration_link} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block">
          <Button size="lg">
            Register <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
      )}
    </div>
  );
}
