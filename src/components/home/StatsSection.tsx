import type { Statistic } from '../../types/database';
import { resolveIcon } from '../../lib/iconMap';

export default function StatsSection({ statistics }: { statistics: Statistic[] }) {
  if (statistics.length === 0) return null;
  return (
    <section className="bg-emerald-900">
      <div className="container-page grid grid-cols-2 gap-6 py-12 sm:grid-cols-3 lg:grid-cols-6">
        {statistics.map((stat) => {
          const Icon = resolveIcon(stat.icon);
          return (
            <div key={stat.id} className="text-center text-emerald-50">
              <Icon className="mx-auto h-6 w-6 text-gold-300" />
              <p className="mt-2 font-serif text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-xs text-emerald-100/80">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
