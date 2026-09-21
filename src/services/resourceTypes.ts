import type { BucketName } from '../lib/supabase';

export type FieldType =
  | 'text'
  | 'email'
  | 'textarea'
  | 'number'
  | 'select'
  | 'boolean'
  | 'date'
  | 'time'
  | 'image'
  | 'file'
  | 'slug';

export interface StaticOption {
  value: string;
  label: string;
}

export interface ResourceField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: StaticOption[];
  /** For select fields whose options come from another table, e.g. departments. */
  optionsSource?: { table: string; valueField: string; labelField: string };
  bucket?: BucketName;
  folder?: string;
  helpText?: string;
  placeholder?: string;
  /** Column shown in the admin list table. Defaults to true for the first few fields. */
  showInTable?: boolean;
  /** For 'slug' fields: which other field to auto-generate the slug from. */
  slugSource?: string;
  defaultValue?: unknown;
}

export interface ResourceConfig {
  table: string;
  entityLabel: string;
  entityLabelPlural: string;
  fields: ResourceField[];
  orderBy?: string;
  ascending?: boolean;
  searchFields?: string[];
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}
