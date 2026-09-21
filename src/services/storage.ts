import { supabase, BucketName } from '../lib/supabase';

export interface UploadResult {
  path: string;
  publicUrl: string;
}

function safeRandomId(): string {
  if ('randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function uploadFile(bucket: BucketName, file: File, folder = ''): Promise<UploadResult> {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
  const filename = `${folder ? `${folder}/` : ''}${safeRandomId()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return { path: filename, publicUrl: data.publicUrl };
}

export async function deleteFile(bucket: BucketName, path: string): Promise<void> {
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

/** Extract the storage path from a public URL so it can be removed later. */
export function pathFromPublicUrl(bucket: BucketName, publicUrl: string | null | undefined): string | null {
  if (!publicUrl) return null;
  const marker = `/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}
