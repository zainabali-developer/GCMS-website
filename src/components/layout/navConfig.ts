export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  label: string;
  children: NavLink[];
}

export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return 'children' in item;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Academics',
    children: [
      { label: 'Programs', href: '/programs' },
      { label: 'Departments', href: '/departments' },
      { label: 'Faculty', href: '/faculty' },
      { label: 'Subjects', href: '/subjects' },
    ],
  },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Notices', href: '/notices' },
  { label: 'Events', href: '/events' },
  {
    label: 'Campus Life',
    children: [
      { label: 'Campus Life', href: '/campus-life' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Downloads', href: '/downloads' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];
