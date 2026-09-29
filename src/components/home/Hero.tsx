import { Link } from 'react-router-dom';
import { GraduationCap, ClipboardCheck, Compass } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Hero() {
  const { settings } = useSiteSettings();

  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="container-page grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
        <div className="max-w-xl">
          <p className="font-medium text-emerald-700">Government College of Management Sciences, Abbottabad</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.1] text-ink-900 sm:text-5xl">
            {settings.hero_title || 'Empowering Students Through Quality Education, Professional Skills & Innovation'}
          </h1>
          <div className="rule-gold mt-5" />
          <p className="mt-5 text-lg leading-relaxed text-ink-600">
            {settings.hero_subtitle ||
              'A public-sector institution offering career-oriented degree programs, diplomas and short courses in commerce, management and information technology.'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              <GraduationCap className="h-4 w-4" /> View Programs
            </Link>
            <Link
              to="/admissions"
              className="inline-flex items-center gap-2 rounded-md bg-gold-400 px-5 py-3 text-sm font-semibold text-ink-900 hover:bg-gold-500"
            >
              <ClipboardCheck className="h-4 w-4" /> Admissions
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-md border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              <Compass className="h-4 w-4" /> Explore College
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-xl lg:max-w-none">
          <div className="absolute inset-0 overflow-hidden rounded-2xl border border-emerald-900/10 shadow-lg shadow-emerald-950/10">
            <img
              src="/college-campus.svg"
              alt="Government College of Management Sciences Abbottabad campus"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-emerald-950/70 px-6 py-4 backdrop-blur-sm">
            <p className="font-serif text-sm text-emerald-50">
              {settings.short_name || 'GCMS Abbottabad'}
              <span className="block text-xs font-normal text-emerald-200/80">
                Also known as Commerce College Mandian
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
