import { createContext } from 'react';
import type { SiteSettings } from '../types/database';

export interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => void;
}

export const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);
