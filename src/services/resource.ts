import { supabase } from '../lib/supabase';

/**
 * Thin, typed wrappers around Supabase table operations.
 * Every admin CRUD page (programs, faculty, departments, subjects, notices,
 * events, gallery, downloads, statistics, highlights...) is driven through
 * these same functions plus a per-resource field config (see
 * src/services/resourceConfigs.ts) so the CRUD logic is written once and
 * reused everywhere, instead of duplicated per entity.
 */

export async function listAll<T>(
  table: string,
  opts?: { orderBy?: string; ascending?: boolean; select?: string }
): Promise<T[]> {
  let query = supabase.from(table).select(opts?.select ?? '*');
  if (opts?.orderBy) query = query.order(opts.orderBy, { ascending: opts?.ascending ?? true });
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as T[];
}

export async function getById<T>(table: string, id: string, select = '*'): Promise<T | null> {
  const { data, error } = await supabase.from(table).select(select).eq('id', id).maybeSingle();
  if (error) throw error;
  return data as T | null;
}

export async function getBySlug<T>(table: string, slug: string, select = '*'): Promise<T | null> {
  const { data, error } = await supabase.from(table).select(select).eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data as T | null;
}

export async function createRow<T extends Record<string, unknown>>(
  table: string,
  values: Partial<T>
): Promise<T> {
  const { data, error } = await supabase.from(table).insert(values as never).select().single();
  if (error) throw error;
  return data as T;
}

export async function updateRow<T extends Record<string, unknown>>(
  table: string,
  id: string,
  values: Partial<T>
): Promise<T> {
  const { data, error } = await supabase.from(table).update(values as never).eq('id', id).select().single();
  if (error) throw error;
  return data as T;
}

export async function deleteRow(table: string, id: string): Promise<void> {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
}

/** For singleton content rows (about, principal, site_settings, admissions, campus_life). */
export async function getSingleton<T>(table: string, select = '*'): Promise<T | null> {
  const { data, error } = await supabase.from(table).select(select).limit(1).maybeSingle();
  if (error) throw error;
  return data as T | null;
}

export async function upsertSingleton<T extends Record<string, unknown>>(
  table: string,
  id: string | undefined | null,
  values: Partial<T>
): Promise<T> {
  if (id) {
    const { data, error } = await supabase.from(table).update(values as never).eq('id', id).select().single();
    if (error) throw error;
    return data as T;
  }
  const { data, error } = await supabase.from(table).insert(values as never).select().single();
  if (error) throw error;
  return data as T;
}
