export function SkeletonRows({ count = 6 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-12 animate-pulse rounded-lg bg-mist" />
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-mist/50 p-6 text-center">
      <p className="text-sm text-ink-soft">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-deep"
      >
        Retry
      </button>
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-ink/20 p-6 text-center text-sm text-ink-soft">
      {message}
    </div>
  );
}
