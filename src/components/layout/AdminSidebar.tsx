import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  UserSquare2,
  GraduationCap,
  Building2,
  Users,
  BookOpen,
  BarChart3,
  Sparkles,
  ClipboardList,
  Megaphone,
  CalendarDays,
  Mail,
  Image as ImageIcon,
  Download,
  Settings,
} from 'lucide-react';

interface AdminNavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface AdminNavGroup {
  label: string;
  items: AdminNavLink[];
}

const GROUPS: AdminNavGroup[] = [
  {
    label: 'Content',
    items: [
      { label: 'About', href: '/admin/about', icon: FileText },
      { label: 'Principal', href: '/admin/principal', icon: UserSquare2 },
      { label: 'Programs', href: '/admin/programs', icon: GraduationCap },
      { label: 'Departments', href: '/admin/departments', icon: Building2 },
      { label: 'Faculty', href: '/admin/faculty', icon: Users },
      { label: 'Subjects', href: '/admin/subjects', icon: BookOpen },
      { label: 'Statistics', href: '/admin/statistics', icon: BarChart3 },
      { label: 'Why Choose GCMS', href: '/admin/highlights', icon: Sparkles },
    ],
  },
  {
    label: 'Admissions',
    items: [{ label: 'Admissions', href: '/admin/admissions', icon: ClipboardList }],
  },
  {
    label: 'Communication',
    items: [
      { label: 'Notices', href: '/admin/notices', icon: Megaphone },
      { label: 'Events', href: '/admin/events', icon: CalendarDays },
      { label: 'Messages', href: '/admin/messages', icon: Mail },
    ],
  },
  {
    label: 'Media',
    items: [
      { label: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
      { label: 'Downloads', href: '/admin/downloads', icon: Download },
    ],
  },
  {
    label: 'Configuration',
    items: [{ label: 'Site Settings', href: '/admin/settings', icon: Settings }],
  },
];

function linkClass(isActive: boolean) {
  return `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-emerald-800 text-white' : 'text-emerald-100/80 hover:bg-emerald-800/60 hover:text-white'
  }`;
}

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-3 py-5" aria-label="Admin">
      <NavLink to="/admin" end onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </NavLink>

      {GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-emerald-100/50">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavLink key={item.href} to={item.href} onClick={onNavigate} className={({ isActive }) => linkClass(isActive)}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
