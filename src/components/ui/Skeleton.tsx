export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-ink-100 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-5 shadow-card">
      <SkeletonLine className="mb-3 h-32 w-full rounded-md" />
      <SkeletonLine className="mb-2 h-4 w-3/4" />
      <SkeletonLine className="h-3 w-1/2" />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
