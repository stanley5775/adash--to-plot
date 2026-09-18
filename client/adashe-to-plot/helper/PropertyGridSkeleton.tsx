export function PropertyGridSkeleton() {
  return (
    <section className="animate-pulse">
      {/* Estate skeleton */}
      <div className="mb-12 max-w-3xl overflow-hidden rounded-3xl border border-navy-800/10 bg-white">
        {/* Image */}
        <div className="h-64 w-full bg-navy-100 sm:h-80" />

        {/* Estate info */}
        <div className="p-6 sm:p-8">
          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-navy-100" />
            <div className="h-3 w-5/6 rounded bg-navy-100" />
            <div className="h-3 w-2/3 rounded bg-navy-100" />
          </div>

          {/* Stats */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="h-14 w-36 rounded-xl bg-navy-50" />
            <div className="h-14 w-40 rounded-xl bg-navy-50" />
            <div className="h-14 w-36 rounded-xl bg-navy-50" />
          </div>
        </div>
      </div>

      {/* Properties heading */}
      <div className="mx-4 max-w-3xl">
        <div className="mb-6">
          <div className="h-7 w-56 rounded bg-navy-100" />
          <div className="mt-2 h-4 w-80 max-w-full rounded bg-navy-100" />
        </div>

        {/* Property cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-2xl border border-navy-800/10 bg-white">
              {/* Image */}
              <div className="h-48 w-full bg-navy-100" />

              {/* Card content */}
              <div className="space-y-4 p-5">
                <div className="h-3 w-32 rounded bg-navy-100" />

                <div className="h-4 w-24 rounded bg-navy-100" />

                <div className="h-3 w-28 rounded bg-navy-100" />

                <div className="border-t border-navy-800/10 pt-4">
                  <div className="h-2.5 w-12 rounded bg-navy-100" />
                  <div className="mt-2 h-6 w-28 rounded bg-navy-100" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
