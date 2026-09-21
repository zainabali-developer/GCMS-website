import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { getSiteSettings } from '../services/publicData';
import type { SiteSettings } from '../types/database';
import logo from '../assets/gcms-logo.png';
import { SiteSettingsContext } from './siteSettingsStore';

const FALLBACK_SETTINGS: SiteSettings = {
  id: '',
  college_name: 'Government College of Management Sciences, Abbottabad',
  short_name: 'GCMS Abbottabad',
  logo_url: logo,
  address: '56QR+73P Govt College of Management Sciences, Jinnahabad Habibullah Colony, Abbottabad, 22010, Pakistan',
  phone: null,
  email: null,
  office_hours: null,
  facebook_url: null,
  twitter_url: null,
  instagram_url: null,
  youtube_url: null,
  linkedin_url: null,
  footer_text: null,
  hero_title: 'Government College of Management Sciences, Abbottabad',
  hero_subtitle: 'Empowering Students Through Quality Education, Professional Skills & Innovation',
  established_year: null,
  map_embed_url: null,
  updated_at: '',
};

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK_SETTINGS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getSiteSettings()
      .then((data) => {
        if (data) {
          // Merge so any field the admin hasn't filled in yet still falls back gracefully.
          setSettings({
            ...FALLBACK_SETTINGS,
            ...data,
            logo_url: data.logo_url || FALLBACK_SETTINGS.logo_url,
            college_name: data.college_name || FALLBACK_SETTINGS.college_name,
          });
        }
      })
      .catch(() => {
        // Keep fallback settings — public pages should never blank out on a network hiccup.
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
