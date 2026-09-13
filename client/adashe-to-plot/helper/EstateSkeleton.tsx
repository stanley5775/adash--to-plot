export function EstateSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-navy-800/10 bg-white">
      {/* Image */}
      <div className="h-56 w-full animate-pulse bg-navy-100" />

      {/* Content */}
      <div className="p-5">
        {/* Estate name */}
        <div className="h-6 w-3/5 animate-pulse rounded-md bg-navy-100" />

        {/* Location */}
        <div className="mt-3 h-4 w-2/5 animate-pulse rounded-md bg-navy-100" />

        {/* Description */}
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-navy-100" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-navy-100" />
        </div>

        {/* Price */}
        <div className="mt-5 h-5 w-2/5 animate-pulse rounded-md bg-navy-100" />

        {/* Bottom */}
        <div className="mt-4 flex justify-between">
          <div className="h-4 w-1/4 animate-pulse rounded bg-navy-100" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-navy-100" />
        </div>
      </div>
    </div>
  );
}
