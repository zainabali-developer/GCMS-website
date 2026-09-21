import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, MapPin, Phone, Mail } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const quickLinks = [
  { label: 'About GCMS', href: '/about' },
  { label: 'Campus Life', href: '/campus-life' },
  { label: 'Notices', href: '/notices' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact Us', href: '/contact' },
];

const academicLinks = [
  { label: 'Programs', href: '/programs' },
  { label: 'Departments', href: '/departments' },
  { label: 'Faculty', href: '/faculty' },
  { label: 'Subjects', href: '/subjects' },
];

const admissionLinks = [
  { label: 'Admissions Overview', href: '/admissions' },
  { label: 'Eligibility', href: '/admissions#eligibility' },
  { label: 'Fee Information', href: '/admissions#fees' },
  { label: 'Downloads & Forms', href: '/downloads' },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-serif text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link to={link.href} className="text-sm text-emerald-100/80 hover:text-gold-300">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { settings } = useSiteSettings();
  const year = new Date().getFullYear();

  const socialLinks = [
    { url: settings.facebook_url, icon: Facebook, label: 'Facebook' },
    { url: settings.twitter_url, icon: Twitter, label: 'Twitter' },
    { url: settings.instagram_url, icon: Instagram, label: 'Instagram' },
    { url: settings.youtube_url, icon: Youtube, label: 'YouTube' },
    { url: settings.linkedin_url, icon: Linkedin, label: 'LinkedIn' },
  ].filter((s) => Boolean(s.url));

  return (
    <footer className="bg-emerald-950 text-emerald-50">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <img src={settings.logo_url ?? undefined} alt="" className="h-12 w-12 object-contain" />
            <span className="font-serif text-sm font-semibold leading-tight text-white">
              Government College of<br />Management Sciences
            </span>
          </div>
          <p className="mt-4 text-sm text-emerald-100/70">
            A public-sector institution of higher education serving Abbottabad through professional, career-oriented
            programs.
          </p>
          {socialLinks.length > 0 && (
            <div className="mt-5 flex gap-3">
              {socialLinks.map(({ url, icon: Icon, label }) => (
                <a
                  key={label}
                  href={url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-900 text-emerald-100 hover:bg-gold-400 hover:text-ink-900"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <FooterColumn title="Quick Links" links={quickLinks} />
        <FooterColumn title="Academics" links={academicLinks} />
        <FooterColumn title="Admissions" links={admissionLinks} />

        <div>
          <h3 className="font-serif text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-emerald-100/80">
            {settings.address && (
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                <span>{settings.address}</span>
              </li>
            )}
            {settings.phone && (
              <li className="flex gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                <a href={`tel:${settings.phone}`} className="hover:text-gold-300">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold-300">
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-emerald-900">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-emerald-100/60 sm:flex-row">
          <p>
            &copy; {year} Government College of Management Sciences, Abbottabad. All Rights Reserved.
          </p>
          {settings.footer_text && <p>{settings.footer_text}</p>}
        </div>
      </div>
    </footer>
  );
}
