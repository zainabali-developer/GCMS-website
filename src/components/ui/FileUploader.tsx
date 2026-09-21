import { useRef, useState } from 'react';
import { FileUp, Loader2, FileText, X } from 'lucide-react';
import { uploadFile, deleteFile, pathFromPublicUrl } from '../../services/storage';
import { BucketName } from '../../lib/supabase';
import { useToast } from '../../hooks/useToast';
import { friendlyError } from '../../lib/errors';

interface FileUploaderProps {
  label?: string;
  bucket: BucketName;
  folder?: string;
  value: string | null;
  fileName?: string | null;
  onChange: (url: string | null, fileName: string | null) => void;
  accept?: string;
  hint?: string;
}

export default function FileUploader({
  label,
  bucket,
  folder,
  value,
  fileName,
  onChange,
  accept = '.pdf,.doc,.docx,.xls,.xlsx',
  hint,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      const { publicUrl } = await uploadFile(bucket, file, folder);
      onChange(publicUrl, file.name);
    } catch (err) {
      showToast(friendlyError(err, 'File upload failed. Please try again.'), 'error');
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    const path = pathFromPublicUrl(bucket, value);
    onChange(null, null);
    if (path) {
      try {
        await deleteFile(bucket, path);
      } catch {
        // Non-fatal
      }
    }
  }

  return (
    <div>
      {label && <p className="mb-1.5 block text-sm font-medium text-ink-700">{label}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {value ? (
        <div className="flex items-center justify-between rounded-md border border-ink-200 bg-ink-50 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="h-4 w-4 shrink-0 text-emerald-700" />
            <span className="truncate text-sm text-ink-700">{fileName || 'Uploaded file'}</span>
          </div>
          <button type="button" onClick={handleRemove} aria-label="Remove file" className="text-ink-400 hover:text-red-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-ink-300 px-3 py-4 text-sm font-medium text-ink-600 hover:bg-ink-50 disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
          {uploading ? 'Uploading…' : 'Upload file'}
        </button>
      )}
      {hint && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
    </div>
  );
}
