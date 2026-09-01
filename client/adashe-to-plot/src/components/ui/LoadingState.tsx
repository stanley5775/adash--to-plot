export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-600 border-t-transparent" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-navy-800/10 bg-white">
      <div className="h-48 bg-navy-100" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 rounded bg-navy-100" />
        <div className="h-3 w-1/2 rounded bg-navy-100" />
        <div className="h-3 w-1/3 rounded bg-navy-100" />
      </div>
    </div>
  );
}
