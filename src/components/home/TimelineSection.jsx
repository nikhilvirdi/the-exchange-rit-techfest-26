export default function TimelineSection() {
  return (
    <section id="timeline" className="w-full border-b-4 border-brand-lime">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <h2 className="text-2xl font-bold tracking-wider text-brand-lime uppercase sm:text-3xl md:text-4xl">
          Timeline
        </h2>
        <div className="mt-6 space-y-4">
          {[1, 2, 3, 4, 5].map((slot) => (
            <div
              key={slot}
              className="flex flex-col gap-3 border-2 border-dashed border-brand-white/40 bg-brand-white/10 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
            >
              <div className="flex h-12 w-full items-center justify-center border border-dashed border-brand-white/30 bg-brand-white/5 px-4 text-center text-sm text-brand-white/80 sm:w-44 sm:shrink-0 sm:text-base">
                Time placeholder
              </div>
              <div className="flex h-12 w-full flex-1 items-center justify-center border border-dashed border-brand-white/30 bg-brand-white/5 px-4 text-center text-sm text-brand-white/80 sm:text-base">
                Description placeholder
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
