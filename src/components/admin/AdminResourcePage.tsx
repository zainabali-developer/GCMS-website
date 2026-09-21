import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ResourceConfig, ResourceField, slugify } from '../../services/resourceTypes';
import { listAll, createRow, updateRow, deleteRow } from '../../services/resource';
import { useLookupOptions } from '../../hooks/useLookupOptions';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/errors';
import Button from '../ui/Button';
import Table, { Column } from '../ui/Table';
import Modal from '../ui/Modal';
import ConfirmDialog from '../ui/ConfirmDialog';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import ImageUploader from '../ui/ImageUploader';
import FileUploader from '../ui/FileUploader';
import SearchBar from '../ui/SearchBar';
import Pagination from '../ui/Pagination';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorState from '../ui/ErrorState';
import EmptyState from '../ui/EmptyState';
import Badge from '../ui/Badge';

type Row = Record<string, unknown> & { id: string };

const PAGE_SIZE = 10;

export default function AdminResourcePage({ config }: { config: ResourceConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [deleteTarget, setDeleteTarget] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listAll<Row>(config.table, { orderBy: config.orderBy, ascending: config.ascending ?? true });
      setRows(data);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.table]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const term = search.toLowerCase();
    const fields = config.searchFields ?? [];
    return rows.filter((row) => fields.some((f) => String(row[f] ?? '').toLowerCase().includes(term)));
  }, [rows, search, config.searchFields]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openCreate() {
    const defaults: Record<string, unknown> = {};
    config.fields.forEach((f) => {
      if (f.defaultValue !== undefined) defaults[f.name] = f.defaultValue;
      else if (f.type === 'boolean') defaults[f.name] = false;
      else defaults[f.name] = '';
    });
    setEditing(null);
    setFormValues(defaults);
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(row: Row) {
    setEditing(row);
    setFormValues({ ...row });
    setFormErrors({});
    setModalOpen(true);
  }

  function setField(name: string, value: unknown) {
    setFormValues((prev) => {
      const next = { ...prev, [name]: value };
      const slugField = config.fields.find((f) => f.type === 'slug' && f.slugSource === name);
      if (slugField) {
        const prevSourceVal = String(prev[name] ?? '');
        const currentSlug = String(prev[slugField.name] ?? '');
        if (!currentSlug || currentSlug === slugify(prevSourceVal)) {
          next[slugField.name] = slugify(String(value ?? ''));
        }
      }
      return next;
    });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    config.fields.forEach((f) => {
      if (f.required && !String(formValues[f.name] ?? '').trim()) {
        errs[f.name] = `${f.label} is required.`;
      }
    });
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      config.fields.forEach((f) => {
        let val = formValues[f.name];
        if (f.type === 'number') val = val === '' || val === null || val === undefined ? null : Number(val);
        if ((f.type === 'date' || f.type === 'time') && val === '') val = null;
        payload[f.name] = val;
      });
      if (editing) {
        await updateRow(config.table, editing.id, payload);
        showToast(`${config.entityLabel} updated successfully.`, 'success');
      } else {
        await createRow(config.table, payload);
        showToast(`${config.entityLabel} added successfully.`, 'success');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(friendlyError(err, `Unable to save this ${config.entityLabel.toLowerCase()}. Please try again.`), 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRow(config.table, deleteTarget.id);
      showToast(`${config.entityLabel} deleted.`, 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(friendlyError(err, `Unable to delete this ${config.entityLabel.toLowerCase()}.`), 'error');
    } finally {
      setDeleting(false);
    }
  }

  const titleFieldName = config.fields[0]?.name ?? 'id';
  const tableFields = config.fields.filter((f) => f.showInTable);
  const columns: Column<Row>[] = [
    ...tableFields.map((f) => ({
      header: f.label,
      cell: (row: Row) => renderCellValue(f, row[f.name]),
    })),
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row: Row) => (
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => openEdit(row)}
            aria-label={`Edit ${String(row[titleFieldName] ?? '')}`}
            className="rounded-md p-1.5 text-ink-500 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            aria-label={`Delete ${String(row[titleFieldName] ?? '')}`}
            className="rounded-md p-1.5 text-ink-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink-900">{config.entityLabelPlural}</h1>
          <p className="text-sm text-ink-500">{filtered.length} total</p>
        </div>
        <div className="flex gap-3">
          {config.searchFields && config.searchFields.length > 0 && (
            <SearchBar
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder={`Search ${config.entityLabelPlural.toLowerCase()}…`}
              className="w-56 sm:w-64"
            />
          )}
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={`No ${config.entityLabelPlural.toLowerCase()} yet`}
          description={`Click "Add" to create the first entry.`}
          action={
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" /> Add {config.entityLabel}
            </Button>
          }
        />
      ) : (
        <>
          <Table columns={columns} rows={pageRows} rowKey={(r) => r.id} />
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${config.entityLabel}` : `Add ${config.entityLabel}`}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {config.fields.map((field) => (
            <FieldInput
              key={field.name}
              field={field}
              value={formValues[field.name]}
              error={formErrors[field.name]}
              onChange={(v) => setField(field.name, v)}
            />
          ))}
          <div className="flex justify-end gap-3 border-t border-ink-100 pt-4">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Save changes' : `Add ${config.entityLabel}`}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${config.entityLabel}`}
        message={`Are you sure you want to delete "${deleteTarget ? String(deleteTarget[titleFieldName]) : ''}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function renderCellValue(field: ResourceField, value: unknown) {
  if (field.type === 'boolean') return value ? <Badge tone="emerald">Yes</Badge> : <Badge tone="ink">No</Badge>;
  if (field.type === 'image') {
    return value ? (
      <img src={String(value)} alt="" className="h-10 w-10 rounded object-cover" />
    ) : (
      <span className="text-ink-300">—</span>
    );
  }
  if (field.type === 'select' && field.options) {
    const opt = field.options.find((o) => o.value === value);
    if (field.name === 'status') {
      return <Badge tone={value === 'published' ? 'emerald' : 'ink'}>{opt?.label ?? String(value ?? '—')}</Badge>;
    }
    return opt?.label ?? (value ? String(value) : '—');
  }
  if (value === null || value === undefined || value === '') return <span className="text-ink-300">—</span>;
  const str = String(value);
  return str.length > 60 ? `${str.slice(0, 60)}…` : str;
}

export function FieldInput({
  field,
  value,
  error,
  onChange,
}: {
  field: ResourceField;
  value: unknown;
  error?: string;
  onChange: (v: unknown) => void;
}) {
  const { options: dynamicOptions, loading: optionsLoading } = useLookupOptions(field.optionsSource);

  switch (field.type) {
    case 'textarea':
      return (
        <Textarea
          label={field.label}
          required={field.required}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          placeholder={field.placeholder}
          hint={field.helpText}
        />
      );
    case 'number':
      return (
        <Input
          type="number"
          label={field.label}
          required={field.required}
          value={(value as string | number) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          placeholder={field.placeholder}
        />
      );
    case 'email':
      return (
        <Input
          type="email"
          label={field.label}
          required={field.required}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          placeholder={field.placeholder}
        />
      );
    case 'date':
      return (
        <Input
          type="date"
          label={field.label}
          required={field.required}
          value={(value as string)?.slice(0, 10) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
      );
    case 'time':
      return (
        <Input
          type="time"
          label={field.label}
          required={field.required}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
      );
    case 'boolean':
      return (
        <label className="flex items-center gap-2.5 text-sm font-medium text-ink-700">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-ink-300 text-emerald-700 focus:ring-emerald-600"
          />
          {field.label}
        </label>
      );
    case 'select': {
      const options = field.options ?? dynamicOptions;
      return (
        <Select
          label={field.label}
          required={field.required}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          options={options}
          error={error}
          placeholder={optionsLoading ? 'Loading…' : `Select ${field.label.toLowerCase()}`}
        />
      );
    }
    case 'image':
      return (
        <ImageUploader
          label={field.label}
          bucket={field.bucket!}
          folder={field.folder}
          value={(value as string) || null}
          onChange={(url) => onChange(url)}
          hint={field.helpText}
        />
      );
    case 'file':
      return (
        <FileUploader
          label={field.label}
          bucket={field.bucket!}
          folder={field.folder}
          value={(value as string) || null}
          onChange={(url) => onChange(url)}
          hint={field.helpText}
        />
      );
    case 'slug':
      return (
        <Input
          label={field.label}
          required={field.required}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          hint="Used in the page URL. Auto-filled, but you can edit it."
        />
      );
    default:
      return (
        <Input
          label={field.label}
          required={field.required}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          error={error}
          placeholder={field.placeholder}
        />
      );
  }
}
