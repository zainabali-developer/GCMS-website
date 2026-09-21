import { ReactNode } from 'react';

type Tone = 'emerald' | 'gold' | 'sky' | 'ink' | 'red';

const tones: Record<Tone, string> = {
  emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  gold: 'bg-gold-50 text-gold-800 border-gold-200',
  sky: 'bg-sky-50 text-sky-800 border-sky-200',
  ink: 'bg-ink-100 text-ink-700 border-ink-200',
  red: 'bg-red-50 text-red-700 border-red-200',
};

export default function Badge({ children, tone = 'emerald' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
