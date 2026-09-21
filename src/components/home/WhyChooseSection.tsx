import type { Highlight } from '../../types/database';
import { resolveIcon } from '../../lib/iconMap';
import SectionHeading from '../ui/SectionHeading';

export default function WhyChooseSection({ highlights }: { highlights: Highlight[] }) {
  if (highlights.length === 0) return null;
  return (
    <section className="container-page py-16">
      <SectionHeading title="Why Choose GCMS" align="center" />
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((item) => {
          const Icon = resolveIcon(item.icon);
          return (
            <div key={item.id} className="rounded-lg border border-ink-100 bg-white p-6 shadow-card">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-serif text-base font-semibold text-ink-900">{item.title}</h3>
              {item.description && <p className="mt-1.5 text-sm text-ink-600">{item.description}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
