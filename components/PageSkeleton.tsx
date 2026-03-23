export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] overflow-hidden">

      {/* Navbar skeleton */}
      <div className="fixed top-4 sm:top-6 left-0 right-0 z-50 px-4 sm:px-12 lg:px-16 xl:px-24">
        <div className="skeleton h-12 rounded-full w-full max-w-4xl mx-auto opacity-60" />
      </div>

      {/* ── Hero Section ── */}
      <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-16 gap-12">
        {/* Left: text */}
        <div className="flex flex-col gap-4 flex-1 max-w-xl">
          {/* "Hello I'm" */}
          <div className="skeleton h-4 w-32 rounded-full" />
          {/* Name */}
          <div className="skeleton h-16 w-full rounded-xl" />
          <div className="skeleton h-16 w-3/4 rounded-xl" />
          {/* Animated title */}
          <div className="skeleton h-8 w-56 rounded-lg" />
          {/* Paragraphs */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-4/5 rounded" />
          </div>
          {/* CTA buttons */}
          <div className="flex gap-4 mt-4">
            <div className="skeleton h-12 w-36 rounded-full" />
            <div className="skeleton h-12 w-36 rounded-full" />
          </div>
        </div>

        {/* Right: profile image circle */}
        <div className="flex-shrink-0">
          <div className="skeleton rounded-full w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80" />
        </div>
      </section>

      {/* ── Skills Section ── */}
      <section className="py-20 px-8 overflow-hidden">
        <div className="skeleton h-12 w-48 rounded-xl mx-auto mb-12" />
        {/* Three diagonal rows */}
        {[0, 1, 2].map((row) => (
          <div key={row} className="flex gap-3 mb-4 overflow-hidden">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="skeleton h-10 rounded-full flex-shrink-0"
                style={{ width: `${80 + Math.random() * 60}px` }}
              />
            ))}
          </div>
        ))}
      </section>

      {/* ── Experience Section ── */}
      <section className="min-h-screen bg-[#0f1419] py-20 px-8">
        {/* EXP bar */}
        <div className="flex items-center gap-4 mb-12 max-w-xl">
          <div className="skeleton rounded-full w-16 h-16" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-6 w-full rounded-full" />
          </div>
        </div>
        {/* RPG scene placeholder */}
        <div className="skeleton w-full max-w-4xl mx-auto h-[60vh] rounded-2xl" />
      </section>

      {/* ── Phone Project Section ── */}
      <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-8 gap-16 py-20">
        {/* Phone model */}
        <div className="skeleton w-[280px] h-[520px] rounded-[40px] flex-shrink-0" />
        {/* Project info */}
        <div className="flex flex-col gap-4 max-w-lg w-full">
          <div className="skeleton h-10 w-48 rounded-lg" />
          <div className="flex flex-col gap-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-4/5 rounded" />
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {["React Native", "TypeScript", "Firebase", "Redux"].map((t) => (
              <div key={t} className="skeleton h-9 w-28 rounded-lg" />
            ))}
          </div>
          <div className="skeleton h-12 w-36 rounded-lg mt-2" />
        </div>
      </section>

      {/* ── Laptop Projects Section ── */}
      <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-8 gap-8 py-20">
        {/* Laptop model */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="skeleton w-[320px] h-[200px] sm:w-[480px] sm:h-[300px] rounded-lg" />
          <div className="skeleton w-[360px] h-[14px] sm:w-[540px] rounded-full opacity-50" />
        </div>
        {/* Project info */}
        <div className="flex flex-col gap-4 max-w-lg w-full">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="skeleton h-10 w-56 rounded-lg" />
          <div className="flex flex-col gap-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-5/6 rounded" />
            <div className="skeleton h-4 w-full rounded" />
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-9 w-24 rounded-lg" />
            ))}
          </div>
          <div className="flex gap-3">
            <div className="skeleton h-12 w-32 rounded-lg" />
            <div className="skeleton h-12 w-32 rounded-lg" />
          </div>
        </div>
      </section>

      {/* ── Console / Games Section ── */}
      <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-8 gap-8 py-20">
        {/* Description left */}
        <div className="flex flex-col gap-4 max-w-lg w-full">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="skeleton h-10 w-48 rounded-lg" />
          <div className="flex flex-col gap-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-4/5 rounded" />
          </div>
          <div className="flex gap-3 mt-2 flex-wrap">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-9 w-24 rounded-lg" />
            ))}
          </div>
          <div className="flex gap-3">
            <div className="skeleton h-12 w-32 rounded-lg" />
            <div className="skeleton h-12 w-32 rounded-lg" />
          </div>
        </div>
        {/* Console model */}
        <div className="skeleton w-[300px] h-[210px] sm:w-[460px] sm:h-[320px] rounded-2xl flex-shrink-0" />
      </section>

      {/* ── Certifications Section ── */}
      <section className="py-20 px-8 md:px-16">
        <div className="skeleton h-12 w-64 rounded-xl mb-12" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-64" />
          ))}
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section className="py-20 px-8 md:px-16">
        <div className="skeleton h-12 w-48 rounded-xl mb-12" />
        <div className="flex flex-col lg:flex-row gap-12 max-w-5xl mx-auto">
          {/* Left info */}
          <div className="flex flex-col gap-6 flex-1">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-4/5 rounded" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton w-12 h-12 rounded-full flex-shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="skeleton h-4 w-24 rounded" />
                  <div className="skeleton h-4 w-40 rounded" />
                </div>
              </div>
            ))}
            {/* Social icons */}
            <div className="flex gap-3 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton w-14 h-14 rounded-full" />
              ))}
            </div>
          </div>
          {/* Right form */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-36 w-full rounded-xl" />
            <div className="skeleton h-12 w-36 rounded-full" />
          </div>
        </div>
      </section>

    </div>
  );
}
