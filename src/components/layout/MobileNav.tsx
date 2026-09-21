import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { NAV_ITEMS, isNavGroup } from './navConfig';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings } = useSiteSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <div className="fixed inset-0 bg-ink-950/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className="fixed inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-white shadow-panel"
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <img src={settings.logo_url ?? undefined} alt="" className="h-9 w-9 object-contain" />
            <span className="font-serif text-sm font-semibold text-emerald-900">GCMS Abbottabad</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4" aria-label="Mobile primary">
          {NAV_ITEMS.map((item) =>
            isNavGroup(item) ? (
              <div key={item.label} className="mb-1">
                <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-ink-400">
                  {item.label}
                </p>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    onClick={onClose}
                    className="block rounded-md px-3 py-2.5 text-sm text-ink-700 hover:bg-emerald-50"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-ink-800 hover:bg-emerald-50"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="border-t border-ink-100 p-5">
          <button
            onClick={() => {
              onClose();
              navigate('/admissions');
            }}
            className="w-full rounded-md bg-gold-400 px-4 py-2.5 text-sm font-semibold text-ink-900 hover:bg-gold-500"
          >
            Admissions
          </button>
        </div>
      </div>
    </div>
  );
}
