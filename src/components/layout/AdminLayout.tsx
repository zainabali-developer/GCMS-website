import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, ExternalLink, LogOut } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/gcms-logo.png';

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 bg-emerald-950 lg:block">
        <div className="flex h-16 items-center gap-2.5 border-b border-emerald-900 px-4">
          <img src={logo} alt="" className="h-9 w-9 object-contain" />
          <span className="font-serif text-sm font-semibold text-white">GCMS Admin</span>
        </div>
        <AdminSidebar />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-ink-950/50" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <div className="fixed inset-y-0 left-0 w-64 bg-emerald-950 shadow-panel">
            <div className="flex h-16 items-center justify-between border-b border-emerald-900 px-4">
              <div className="flex items-center gap-2.5">
                <img src={logo} alt="" className="h-9 w-9 object-contain" />
                <span className="font-serif text-sm font-semibold text-white">GCMS Admin</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-emerald-100 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-ink-200 bg-white px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink-600 hover:bg-ink-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="hidden items-center gap-1.5 text-sm text-ink-500 hover:text-emerald-700 sm:flex"
            >
              View site <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <span className="hidden text-sm text-ink-500 sm:inline">
              {profile?.full_name || user?.email}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 rounded-md border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
