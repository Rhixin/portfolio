export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] p-4 sm:p-8">
      {/* Header bar */}
      <div className="skeleton h-10 w-48 rounded-xl mb-8" />

      {/* Card grid placeholder */}
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        {/* Top card */}
        <div className="skeleton rounded-2xl h-64 w-full" />

        {/* Middle row */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="skeleton rounded-2xl h-48 flex-1" />
          <div className="skeleton rounded-2xl h-48 flex-1" />
        </div>

        {/* Bottom cards */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="skeleton w-12 h-12 rounded-full flex-shrink-0" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="skeleton h-4 w-48 rounded" />
                <div className="skeleton h-4 w-64 rounded" />
              </div>
              <div className="skeleton h-4 w-32 rounded hidden sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
