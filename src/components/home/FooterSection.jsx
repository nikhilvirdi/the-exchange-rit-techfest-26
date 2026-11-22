export default function FooterSection() {
  return (
    <section id="footer" className="w-full border-b-4 border-brand-lime">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <h2 className="text-2xl font-bold tracking-wider text-brand-lime uppercase sm:text-3xl md:text-4xl">
          Footer
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
          {[1, 2, 3, 4].map((block) => (
            <div
              key={block}
              className="flex h-24 items-center justify-center border-2 border-dashed border-brand-white/40 bg-brand-white/10 p-4 text-center text-sm text-brand-white/60 sm:text-base"
            >
              Block placeholder
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
