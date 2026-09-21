import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { SkeletonGrid } from '../../components/ui/Skeleton';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { getGalleryImages } from '../../services/publicData';
import type { GalleryImage } from '../../types/database';
import { GALLERY_CATEGORIES } from '../../types/database';
import { friendlyError } from '../../lib/errors';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setImages(await getGalleryImages());
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex((i) => (i !== null ? Math.min(i + 1, filtered.length - 1) : i));
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i !== null ? Math.max(i - 1, 0) : i));
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex]);

  const filtered = category === 'All' ? images : images.filter((img) => img.category === category);
  const activeImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: 'Gallery' }]} />
      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl font-semibold text-ink-900 sm:text-4xl">Gallery</h1>
        <div className="rule-gold mt-4" />
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {['All', ...GALLERY_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              category === cat ? 'bg-emerald-700 text-white' : 'border border-ink-200 text-ink-600 hover:bg-ink-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {loading ? (
          <SkeletonGrid count={9} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No photos yet" description="Photos will appear here once added by the college." />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxIndex(i)}
                className="group aspect-square overflow-hidden rounded-md bg-ink-100"
                aria-label={`View ${img.title || 'photo'} full size`}
              >
                <img
                  src={img.image_url}
                  alt={img.title || ''}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {activeImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close"
            className="absolute right-4 top-4 text-white/80 hover:text-white"
          >
            <X className="h-7 w-7" />
          </button>
          {lightboxIndex! > 0 && (
            <button
              onClick={() => setLightboxIndex((i) => (i !== null ? i - 1 : i))}
              aria-label="Previous image"
              className="absolute left-2 sm:left-6 text-white/70 hover:text-white"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}
          {lightboxIndex! < filtered.length - 1 && (
            <button
              onClick={() => setLightboxIndex((i) => (i !== null ? i + 1 : i))}
              aria-label="Next image"
              className="absolute right-2 sm:right-6 text-white/70 hover:text-white"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
          <figure className="max-h-[85vh] max-w-4xl">
            <img src={activeImage.image_url} alt={activeImage.title || ''} className="max-h-[75vh] w-full rounded-md object-contain" />
            {(activeImage.title || activeImage.description) && (
              <figcaption className="mt-3 text-center text-sm text-white/80">
                {activeImage.title}
                {activeImage.description && <span className="block text-xs text-white/60">{activeImage.description}</span>}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </div>
  );
}
