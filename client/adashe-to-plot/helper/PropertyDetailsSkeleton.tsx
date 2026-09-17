export function PropertyDetailsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 h-4 w-40 rounded bg-navy-100" />

      {/* Main property section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="h-[420px] rounded-3xl bg-navy-100 sm:h-[500px]" />

        {/* Property information */}
        <div className="flex flex-col">
          {/* Estate name */}
          <div className="h-4 w-32 rounded bg-navy-100" />

          <div className="mt-3 h-9 w-3/4 rounded-lg bg-navy-100" />

          {/* Location */}
          <div className="mt-4 h-4 w-1/2 rounded bg-navy-100" />

          {/* Description */}
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded bg-navy-100" />
            <div className="h-4 w-full rounded bg-navy-100" />
            <div className="h-4 w-4/5 rounded bg-navy-100" />
          </div>

          {/* Price */}
          <div className="mt-8 rounded-2xl border border-navy-800/10 p-5">
            <div className="h-3 w-24 rounded bg-navy-100" />
            <div className="mt-3 h-8 w-40 rounded-lg bg-navy-100" />
          </div>

          {/* Property details */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-navy-800/10 p-4">
              <div className="h-3 w-20 rounded bg-navy-100" />
              <div className="mt-3 h-5 w-28 rounded bg-navy-100" />
            </div>

            <div className="rounded-2xl border border-navy-800/10 p-4">
              <div className="h-3 w-20 rounded bg-navy-100" />
              <div className="mt-3 h-5 w-28 rounded bg-navy-100" />
            </div>
          </div>

          {/* Button */}
          <div className="mt-6 h-12 w-full rounded-full bg-navy-100" />
        </div>
      </div>

      {/* Payment plans */}
      <div className="mt-12">
        <div className="h-7 w-48 rounded-lg bg-navy-100" />

        <div className="mt-3 h-4 w-80 max-w-full rounded bg-navy-100" />

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-navy-800/10 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="h-5 w-28 rounded bg-navy-100" />
                <div className="h-6 w-20 rounded-full bg-navy-100" />
              </div>

              <div className="mt-6 h-8 w-36 rounded-lg bg-navy-100" />

              <div className="mt-4 h-4 w-24 rounded bg-navy-100" />

              <div className="mt-3 h-6 w-32 rounded bg-navy-100" />

              <div className="mt-6 border-t border-navy-800/10 pt-4">
                <div className="h-4 w-full rounded bg-navy-100" />
              </div>

              <div className="mt-5 h-11 w-full rounded-full bg-navy-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
