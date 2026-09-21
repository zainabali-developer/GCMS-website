import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Building2,
  Megaphone,
  CalendarDays,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Notice, ContactMessage, EventItem } from '../../types/database';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Counts {
  programs: number;
  faculty: number;
  departments: number;
  notices: number;
  events: number;
  messages: number;
}

async function countRows(table: string): Promise<number> {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) return 0;
  return count ?? 0;
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [programs, faculty, departments, notices, events, messages] = await Promise.all([
        countRows('programs'),
        countRows('faculty'),
        countRows('departments'),
        countRows('notices'),
        countRows('events'),
        countRows('contact_messages'),
      ]);
      setCounts({ programs, faculty, departments, notices, events, messages });

      const [{ data: noticesData }, { data: messagesData }, { data: eventsData }] = await Promise.all([
        supabase.from('notices').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
        supabase
          .from('events')
          .select('*')
          .gte('event_date', new Date().toISOString().slice(0, 10))
          .order('event_date', { ascending: true })
          .limit(5),
      ]);
      setRecentNotices((noticesData ?? []) as Notice[]);
      setRecentMessages((messagesData ?? []) as ContactMessage[]);
      setUpcomingEvents((eventsData ?? []) as EventItem[]);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = counts
    ? [
        { label: 'Programs', value: counts.programs, icon: GraduationCap, href: '/admin/programs' },
        { label: 'Faculty', value: counts.faculty, icon: Users, href: '/admin/faculty' },
        { label: 'Departments', value: counts.departments, icon: Building2, href: '/admin/departments' },
        { label: 'Notices', value: counts.notices, icon: Megaphone, href: '/admin/notices' },
        { label: 'Events', value: counts.events, icon: CalendarDays, href: '/admin/events' },
        { label: 'Messages', value: counts.messages, icon: Mail, href: '/admin/messages' },
      ]
    : [];

  if (loading) return <LoadingSpinner label="Loading dashboard…" />;

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-ink-900">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">An overview of the public website's content.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map((card) => (
          <Link key={card.label} to={card.href}>
            <Card className="transition-shadow hover:shadow-panel">
              <card.icon className="h-5 w-5 text-emerald-700" />
              <p className="mt-3 text-2xl font-semibold text-ink-900">{card.value}</p>
              <p className="text-xs text-ink-500">{card.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-base font-semibold text-ink-900">Recent Notices</h2>
            <Link to="/admin/notices" className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentNotices.length === 0 ? (
            <p className="text-sm text-ink-400">No notices yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentNotices.map((n) => (
                <li key={n.id} className="flex items-start justify-between gap-2 text-sm">
                  <span className="text-ink-700">{n.title}</span>
                  {n.is_pinned && <Badge tone="gold">Pinned</Badge>}
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-base font-semibold text-ink-900">Recent Messages</h2>
            <Link to="/admin/messages" className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-ink-400">No messages yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentMessages.map((m) => (
                <li key={m.id} className="text-sm">
                  <p className="font-medium text-ink-700">{m.full_name}</p>
                  <p className="truncate text-xs text-ink-500">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-base font-semibold text-ink-900">Upcoming Events</h2>
            <Link to="/admin/events" className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-ink-400">No upcoming events.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="flex items-center justify-between text-sm">
                  <span className="text-ink-700">{e.title}</span>
                  <span className="text-xs text-ink-500">{new Date(e.event_date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
