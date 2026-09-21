import { FormEvent, useEffect, useState } from 'react';
import { getSingleton, upsertSingleton } from '../../services/resource';
import type { ResourceField } from '../../services/resourceTypes';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/errors';
import Button from '../ui/Button';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorState from '../ui/ErrorState';
import Card from '../ui/Card';
import { FieldInput } from './AdminResourcePage';

export interface SingletonConfig {
  table: string;
  title: string;
  description?: string;
  fields: ResourceField[];
}

type Row = Record<string, unknown> & { id?: string };

export default function AdminSingletonPage({ config }: { config: SingletonConfig }) {
  const [row, setRow] = useState<Row | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await getSingleton<Row>(config.table);
      setRow(data);
      const initial: Record<string, unknown> = {};
      config.fields.forEach((f) => {
        initial[f.name] = data?.[f.name] ?? f.defaultValue ?? '';
      });
      setValues(initial);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.table]);

  function setField(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      config.fields.forEach((f) => {
        let val = values[f.name];
        if (f.type === 'number') val = val === '' || val === null || val === undefined ? null : Number(val);
        payload[f.name] = val === '' ? null : val;
      });
      const saved = await upsertSingleton<Row>(config.table, row?.id, payload);
      setRow(saved);
      showToast(`${config.title} updated successfully.`, 'success');
    } catch (err) {
      showToast(friendlyError(err, `Unable to save ${config.title.toLowerCase()}. Please try again.`), 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-semibold text-ink-900">{config.title}</h1>
        {config.description && <p className="mt-1 text-sm text-ink-500">{config.description}</p>}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {config.fields.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={(v) => setField(field.name, v)}
              />
            ))}
            <div className="flex justify-end border-t border-ink-100 pt-4">
              <Button type="submit" loading={saving}>
                Save changes
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
