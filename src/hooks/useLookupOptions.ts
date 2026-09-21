import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useLookupOptions(source?: { table: string; valueField: string; labelField: string }) {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(Boolean(source));

  useEffect(() => {
    if (!source) return;
    let active = true;
    setLoading(true);
    supabase
      .from(source.table)
      .select(`${source.valueField},${source.labelField}`)
      .order(source.labelField, { ascending: true })
      .then(({ data }) => {
        if (!active) return;
        const rows = (data ?? []) as unknown as Record<string, unknown>[];
        setOptions(
          rows.map((row) => ({
            value: String(row[source.valueField]),
            label: String(row[source.labelField]),
          }))
        );
        setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source?.table, source?.valueField, source?.labelField]);

  return { options, loading };
}
