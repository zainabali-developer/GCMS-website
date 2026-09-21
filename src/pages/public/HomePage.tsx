import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Pin, CalendarDays, Clock, Download as DownloadIcon } from 'lucide-react';
import Hero from '../../components/home/Hero';
import QuickAccess from '../../components/home/QuickAccess';
import StatsSection from '../../components/home/StatsSection';
import WhyChooseSection from '../../components/home/WhyChooseSection';
import SectionHeading from '../../components/ui/SectionHeading';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { SkeletonGrid } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import {
  getAbout,
  getPrincipal,
  getPrograms,
  getDepartments,
  getFaculty,
  getNotices,
  getEvents,
  getGalleryImages,
  getDownloads,
  getStatistics,
  getHighlights,
} from '../../services/publicData';
import type {
  AboutInfo,
  PrincipalInfo,
  Program,
  Department,
  Faculty,
  Notice,
  EventItem,
  GalleryImage,
  DownloadFile,
  Statistic,
  Highlight,
} from '../../types/database';
import { friendlyError } from '../../lib/errors';
import principalPhoto from '../../assets/principal-photo.jpg';

interface HomeData {
  about: AboutInfo | null;
  principal: PrincipalInfo | null;
  programs: Program[];
  shortCourses: Program[];
  departments: Department[];
  faculty: Faculty[];
  notices: Notice[];
  events: EventItem[];
  gallery: GalleryImage[];
  downloads: DownloadFile[];
  statistics: Statistic[];
  highlights: Highlight[];
}

export default function HomePage() {
  const { settings } = useSiteSettings();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [
        about,
        principal,
        programs,
        shortCourses,
        departments,
        faculty,
        notices,
        events,
        gallery,
        downloads,
        statistics,
        highlights,
      ] = await Promise.all([
        getAbout(),
        getPrincipal(),
        getPrograms('regular'),
        getPrograms('short_course'),
        getDepartments(),
        getFaculty(),
        getNotices(),
        getEvents(),
        getGalleryImages(),
        getDownloads(),
        getStatistics(),
        getHighlights(),
      ]);
      setData({
        about,
        principal,
        programs: programs.slice(0, 6),
        shortCourses: shortCourses.slice(0, 8),
        departments: departments.slice(0, 4),
        faculty: faculty.slice(0, 4),
        notices: notices.slice(0, 5),
        events: events.filter((e) => new Date(e.event_date) >= new Date(new Date().toDateString())).slice(0, 3),
        gallery: gallery.slice(0, 6),
        downloads: downloads.slice(0, 4),
        statistics,
        highlights,
      });
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
    <div>
      <Hero />
      <QuickAccess />

      {loading ? (
        <div className="container-page py-16">
          <SkeletonGrid count={6} />
        </div>
      ) : error ? (
        <div className="container-page py-16">
          <ErrorState message={error} onRetry={load} />
        </div>
      ) : (
        data && (
          <>
            {/* About preview */}
            <section className="container-page py-16">
              <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
                <div>
                  <SectionHeading title={data.about?.title || 'About Government College of Management Sciences'} />
                  <p className="mt-5 leading-relaxed text-ink-600">
                    {data.about?.description ||
                      'Government College of Management Sciences (GCMS), Abbottabad, also known as Commerce College Mandian, Abbottabad, is a public-sector educational institution located in Abbottabad.'}
                  </p>
                  <Link
                    to="/about"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    Read more about the college <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Card>
                    <h3 className="font-serif text-base font-semibold text-ink-900">Mission</h3>
                    <p className="mt-2 text-sm text-ink-600">
                      {data.about?.mission || 'Information will be updated by the college.'}
                    </p>
                  </Card>
                  <Card>
                    <h3 className="font-serif text-base font-semibold text-ink-900">Vision</h3>
                    <p className="mt-2 text-sm text-ink-600">
                      {data.about?.vision || 'Information will be updated by the college.'}
                    </p>
                  </Card>
                </div>
              </div>
            </section>

            {/* Principal message */}
            <section className="bg-emerald-50/60 py-16">
              <div className="container-page grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="mx-auto w-full max-w-xs overflow-hidden rounded-lg shadow-panel lg:mx-0">
                  <img
                    src={data.principal?.photo_url || principalPhoto}
                    alt={data.principal?.name || 'Principal, GCMS Abbottabad'}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>
                <div>
                  <SectionHeading title="Message from the Principal" />
                  <p className="mt-5 leading-relaxed text-ink-600">
                    {data.principal?.message ||
                      'A welcome message from the Principal will be published here shortly.'}
                  </p>
                  <p className="mt-5 font-serif text-lg font-semibold text-ink-900">
                    {data.principal?.name || 'Principal'}
                  </p>
                  <p className="text-sm text-ink-500">
                    {data.principal?.designation || 'Government College of Management Sciences, Abbottabad'}
                  </p>
                </div>
              </div>
            </section>

            <StatsSection statistics={data.statistics} />

            {/* Programs preview */}
            <section className="container-page py-16">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading title="Academic Programs" description="Degree and diploma programs offered at GCMS Abbottabad." />
                <Link to="/programs" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                  View all programs <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {data.programs.length === 0 ? (
                <p className="mt-8 text-sm text-ink-500">Program information will be updated by the college.</p>
              ) : (
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {data.programs.map((p) => (
                    <Link key={p.id} to={`/programs/${p.slug}`}>
                      <Card className="h-full transition-shadow hover:shadow-panel">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-base font-semibold text-ink-900">{p.name}</h3>
                          {p.admission_open && <Badge tone="gold">Admission Open</Badge>}
                        </div>
                        {p.duration && <p className="mt-1 text-sm text-ink-500">{p.duration}</p>}
                        {p.description && <p className="mt-3 line-clamp-2 text-sm text-ink-600">{p.description}</p>}
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Short courses preview */}
            {data.shortCourses.length > 0 && (
              <section className="bg-ink-50 py-16">
                <div className="container-page">
                  <SectionHeading title="Short Courses" description="Skill-focused short courses for working professionals and students." />
                  <div className="mt-8 flex flex-wrap gap-3">
                    {data.shortCourses.map((c) => (
                      <Link
                        key={c.id}
                        to={`/programs/${c.slug}`}
                        className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:border-emerald-300 hover:text-emerald-800"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Departments preview */}
            {data.departments.length > 0 && (
              <section className="container-page py-16">
                <SectionHeading title="Departments" />
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {data.departments.map((d) => (
                    <Link key={d.id} to={`/departments/${d.slug}`}>
                      <Card className="h-full text-center transition-shadow hover:shadow-panel">
                        <h3 className="font-serif text-base font-semibold text-ink-900">{d.name}</h3>
                        {d.head_name && <p className="mt-1 text-xs text-ink-500">Head: {d.head_name}</p>}
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Faculty preview */}
            {data.faculty.length > 0 && (
              <section className="bg-ink-50 py-16">
                <div className="container-page">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <SectionHeading title="Our Faculty" />
                    <Link to="/faculty" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                      Meet the faculty <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
                    {data.faculty.map((f) => (
                      <Link key={f.id} to={`/faculty/${f.slug}`} className="text-center">
                        <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-white shadow-card sm:h-28 sm:w-28">
                          <img
                            src={f.photo_url || undefined}
                            alt={f.name}
                            className="h-full w-full object-cover bg-ink-100"
                          />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-ink-900">{f.name}</p>
                        {f.designation && <p className="text-xs text-ink-500">{f.designation}</p>}
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Notices + Events */}
            <section className="container-page py-16">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                <div>
                  <div className="flex items-end justify-between gap-4">
                    <SectionHeading title="Latest Notices" />
                    <Link to="/notices" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                      All notices <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  {data.notices.length === 0 ? (
                    <p className="mt-6 text-sm text-ink-500">No notices have been published yet.</p>
                  ) : (
                    <ul className="mt-6 divide-y divide-ink-100 rounded-lg border border-ink-100 bg-white">
                      {data.notices.map((n) => (
                        <li key={n.id}>
                          <Link to={`/notices/${n.slug}`} className="flex items-start gap-3 px-4 py-3.5 hover:bg-ink-50">
                            {n.is_pinned && <Pin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-ink-800">{n.title}</p>
                              {n.published_at && (
                                <p className="text-xs text-ink-400">{new Date(n.published_at).toLocaleDateString()}</p>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <div className="flex items-end justify-between gap-4">
                    <SectionHeading title="Upcoming Events" />
                    <Link to="/events" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                      All events <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  {data.events.length === 0 ? (
                    <p className="mt-6 text-sm text-ink-500">No upcoming events at this time.</p>
                  ) : (
                    <ul className="mt-6 space-y-3">
                      {data.events.map((e) => (
                        <li key={e.id}>
                          <Link to={`/events/${e.slug}`}>
                            <Card className="flex items-center gap-4 hover:shadow-panel">
                              <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-emerald-700 text-white">
                                <CalendarDays className="h-4 w-4" />
                                <span className="text-xs font-semibold">
                                  {new Date(e.event_date).getDate()}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-ink-800">{e.title}</p>
                                <p className="flex items-center gap-1 text-xs text-ink-500">
                                  <Clock className="h-3 w-3" />
                                  {new Date(e.event_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                            </Card>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>

            {/* Gallery preview */}
            {data.gallery.length > 0 && (
              <section className="bg-ink-50 py-16">
                <div className="container-page">
                  <div className="flex items-end justify-between gap-4">
                    <SectionHeading title="Campus Life & Gallery" />
                    <Link to="/gallery" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                      View gallery <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {data.gallery.map((img) => (
                      <div key={img.id} className="aspect-square overflow-hidden rounded-md bg-ink-100">
                        <img src={img.image_url} alt={img.title || ''} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <WhyChooseSection highlights={data.highlights} />

            {/* Downloads preview */}
            {data.downloads.length > 0 && (
              <section className="container-page py-16">
                <SectionHeading title="Important Downloads" />
                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {data.downloads.map((d) => (
                    <a
                      key={d.id}
                      href={d.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-ink-100 bg-white p-4 hover:border-emerald-300 hover:shadow-card"
                    >
                      <DownloadIcon className="h-5 w-5 shrink-0 text-emerald-700" />
                      <span className="truncate text-sm font-medium text-ink-800">{d.title}</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Contact / location */}
            <section className="bg-emerald-950 py-16 text-emerald-50">
              <div className="container-page flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-serif text-2xl font-semibold">Visit or Get in Touch</h2>
                  {settings.address && (
                    <p className="mt-2 flex items-start gap-2 text-sm text-emerald-100/80">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {settings.address}
                    </p>
                  )}
                </div>
                <Link to="/contact">
                  <Button variant="secondary" size="lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </section>
          </>
        )
      )}
    </div>
  );
}
