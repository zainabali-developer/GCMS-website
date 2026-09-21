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

        <div className="relative mx-auto aspect-square w-full max-w-sm lg:max-w-none">
          <div className="absolute inset-0 rounded-2xl bg-emerald-900" />
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <radialGradient id="raysFade" cx="50%" cy="8%" r="60%">
                <stop offset="0%" stopColor="#c9a038" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#c9a038" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="400" height="400" fill="url(#raysFade)" />
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = -90 + (i - 9.5) * 7;
              const rad = (angle * Math.PI) / 180;
              const x2 = 200 + 260 * Math.cos(rad);
              const y2 = 20 + 260 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1="200"
                  y1="20"
                  x2={x2}
                  y2={y2}
                  stroke="#e6d190"
                  strokeOpacity="0.35"
                  strokeWidth="1.5"
                />
              );
            })}
            <circle cx="200" cy="60" r="26" fill="#c9a038" fillOpacity="0.9" />
            {/* Arch / bridge motif echoing the college crest */}
            <path
              d="M 90 300 L 90 230 Q 90 210 110 210 L 290 210 Q 310 210 310 230 L 310 300"
              fill="none"
              stroke="#eef6f1"
              strokeOpacity="0.85"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line x1="70" y1="300" x2="330" y2="300" stroke="#eef6f1" strokeOpacity="0.85" strokeWidth="6" strokeLinecap="round" />
            <line x1="130" y1="210" x2="130" y2="300" stroke="#eef6f1" strokeOpacity="0.4" strokeWidth="4" />
            <line x1="200" y1="210" x2="200" y2="300" stroke="#eef6f1" strokeOpacity="0.4" strokeWidth="4" />
            <line x1="270" y1="210" x2="270" y2="300" stroke="#eef6f1" strokeOpacity="0.4" strokeWidth="4" />
          </svg>
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
