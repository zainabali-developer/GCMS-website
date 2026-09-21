import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Do not throw during build/prerender — surface a clear runtime message instead
  // so the public site can still render with empty states instead of a white screen.
  console.error(
    'Missing Supabase environment variables. Copy .env.example to .env and set ' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

const clientUrl = supabaseUrl || 'https://placeholder.supabase.co';
const clientAnonKey = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(clientUrl, clientAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Storage bucket names — must match supabase/schema.sql */
export const BUCKETS = {
  facultyImages: 'faculty-images',
  gallery: 'gallery',
  programImages: 'program-images',
  eventImages: 'event-images',
  documents: 'documents',
  principal: 'principal',
  siteAssets: 'site-assets',
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

export function publicStorageUrl(bucket: BucketName, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
