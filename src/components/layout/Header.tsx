import { useEffect, useRef, useState } from 'react';
import { Link, NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { Phone, Mail, Menu, ChevronDown, Search } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { NAV_ITEMS, isNavGroup } from './navConfig';
import MobileNav from './MobileNav';

function NavDropdown({ label, children }: { label: string; children: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-ink-700 hover:bg-emerald-50 hover:text-emerald-800"
      >
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-20 mt-1 w-52 rounded-md border border-ink-100 bg-white py-1.5 shadow-panel"
        >
          {children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-ink-700 hover:bg-emerald-50 hover:text-emerald-800"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const { settings } = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-emerald-800 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      {/* Top utility bar */}
      <div className="hidden bg-emerald-900 text-emerald-50 sm:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <p className="truncate">Official Government College &middot; Abbottabad, Khyber Pakhtunkhwa</p>
          <div className="flex items-center gap-4">
            {settings.phone && (
              <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 hover:text-white">
                <Phone className="h-3 w-3" /> {settings.phone}
              </a>
            )}
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center gap-1.5 hover:text-white">
                <Mail className="h-3 w-3" /> {settings.email}
              </a>
            )}
            <Link to="/admin/login" className="hover:text-white">
              Admin Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow ${
          scrolled ? 'shadow-panel' : 'border-b border-ink-100'
        }`}
      >
        <div className="container-page flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img src={settings.logo_url ?? undefined} alt={`${settings.short_name ?? settings.college_name} crest`} className="h-14 w-14 shrink-0 object-contain" />
            <span className="hidden min-w-0 flex-col leading-tight sm:flex">
              <span className="truncate font-serif text-base font-semibold text-emerald-900 lg:text-lg">
                Government College of Management Sciences
              </span>
              <span className="text-xs text-ink-500">Abbottabad</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) =>
              isNavGroup(item) ? (
                <NavDropdown key={item.label} label={item.label} children={item.children} />
              ) : (
                <RouterNavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium ${
                      isActive ? 'text-emerald-800' : 'text-ink-700 hover:bg-emerald-50 hover:text-emerald-800'
                    }`
                  }
                >
                  {item.label}
                </RouterNavLink>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    autoFocus
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onBlur={() => !searchTerm && setSearchOpen(false)}
                    placeholder="Search the site…"
                    aria-label="Search the site"
                    className="w-48 rounded-md border border-ink-200 px-3 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 lg:w-64"
                  />
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Open search"
                  className="flex h-9 w-9 items-center justify-center rounded-md text-ink-600 hover:bg-ink-100"
                >
                  <Search className="h-4 w-4" />
                </button>
              )}
            </div>

            <Link
              to="/admissions"
              className="hidden rounded-md bg-gold-400 px-4 py-2 text-sm font-semibold text-ink-900 hover:bg-gold-500 sm:inline-block"
            >
              Admissions
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-md text-ink-700 hover:bg-ink-100 xl:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
