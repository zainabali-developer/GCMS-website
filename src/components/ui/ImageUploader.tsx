import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { uploadFile, deleteFile, pathFromPublicUrl } from '../../services/storage';
import { BucketName } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/errors';

interface ImageUploaderProps {
  label?: string;
  bucket: BucketName;
  folder?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  hint?: string;
}

export default function ImageUploader({ label, bucket, folder, value, onChange, hint }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file.', 'error');
      return;
    }
    setUploading(true);
    try {
      const { publicUrl } = await uploadFile(bucket, file, folder);
      onChange(publicUrl);
    } catch (err) {
      showToast(friendlyError(err, 'Image upload failed. Please try again.'), 'error');
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    const path = pathFromPublicUrl(bucket, value);
    onChange(null);
    if (path) {
      try {
        await deleteFile(bucket, path);
      } catch {
        // Non-fatal — the reference is already cleared from the form.
      }
    }
  }

  return (
    <div>
      {label && <p className="mb-1.5 block text-sm font-medium text-ink-700">{label}</p>}
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border border-ink-200 bg-ink-50">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-6 w-6 text-ink-300" aria-hidden="true" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-md border border-ink-200 px-3 py-1.5 text-sm font-medium text-ink-700 hover:bg-ink-50 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {value ? 'Replace image' : 'Upload image'}
          </button>
          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          )}
        </div>
      </div>
      {hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}
