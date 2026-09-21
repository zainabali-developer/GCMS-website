import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  GraduationCap,
  Users,
  Megaphone,
  CalendarDays,
  Download,
  Phone,
} from 'lucide-react';

const items = [
  { label: 'Admissions', href: '/admissions', icon: ClipboardCheck },
  { label: 'Academic Programs', href: '/programs', icon: GraduationCap },
  { label: 'Faculty', href: '/faculty', icon: Users },
  { label: 'Notices', href: '/notices', icon: Megaphone },
  { label: 'Events', href: '/events', icon: CalendarDays },
  { label: 'Downloads', href: '/downloads', icon: Download },
  { label: 'Contact Us', href: '/contact', icon: Phone },
];

export default function QuickAccess() {
  return (
    <section className="border-y border-ink-100 bg-white">
      <div className="container-page py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {items.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group flex flex-col items-center gap-2.5 rounded-lg border border-ink-100 px-3 py-5 text-center transition-colors hover:border-emerald-300 hover:bg-emerald-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white">
                <item.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium text-ink-700">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
