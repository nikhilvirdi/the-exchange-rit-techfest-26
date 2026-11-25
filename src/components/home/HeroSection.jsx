import BreakItSprite from './BreakItSprite.jsx'
import BuildItSprite from './BuildItSprite.jsx'

export default function HeroSection() {
  return (
    <section id="hero" className="flex min-h-[calc(100vh-4rem)] w-full flex-col justify-center">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <h1 className="text-6xl font-bold uppercase tracking-wide leading-none sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]">
          <span className="block text-brand-lime">THE</span>
          <span className="block text-brand-white">EXCHANGE</span>
        </h1>
        <p className="mt-2 font-['Geologica',sans-serif] text-xs font-semibold uppercase tracking-wider text-brand-white whitespace-nowrap sm:mt-3 sm:text-base md:text-lg lg:mt-4 lg:text-xl">
          WHAT YOU BUILD, WON&apos;T STAY YOURS
        </p>
        <div className="mt-4 grid w-full auto-rows-fr grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:mt-7 lg:gap-8">
          <div className="flex w-full flex-col items-center rounded-2xl border-2 border-dotted border-brand-lime p-4 sm:flex-row sm:p-5 md:p-6 gap-4 sm:gap-5">
            <div className="flex w-full sm:w-[35%] shrink-0 items-center justify-center self-stretch">
              <BuildItSprite />
            </div>
            <div className="flex w-full sm:w-[65%] flex-col justify-center">
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-3xl font-bold text-brand-lime sm:text-4xl md:text-5xl">
                  01
                </span>
                <span className="text-xl font-bold text-brand-white sm:text-2xl md:text-3xl">
                  Build It
                </span>
              </div>
              <p className="mt-2 font-['Geologica',sans-serif] text-xs leading-relaxed text-brand-white sm:mt-3 sm:text-sm md:text-base">
                Get a fun, creative problem statement and turn it into a working project in just 90 minutes. Use your skills, creativity, and AI agents to build something functional, interactive, and visually impressive.
              </p>
            </div>
          </div>

          <div className="grid w-full grid-cols-[minmax(0,65fr)_minmax(0,35fr)] items-center gap-4 rounded-2xl border-2 border-dotted border-brand-lime p-4 sm:gap-5 sm:p-5 md:p-6">
            <div>
              <div className="flex items-baseline gap-2 sm:gap-3">
                <span className="text-3xl font-bold text-brand-lime sm:text-4xl md:text-5xl">
                  02
                </span>
                <span className="text-xl font-bold text-brand-white sm:text-2xl md:text-3xl">
                  Break It
                </span>
              </div>
              <p className="mt-2 font-['Geologica',sans-serif] text-xs leading-relaxed text-brand-white sm:mt-3 sm:text-sm md:text-base">
                Your code is now someone else&apos;s problem, and theirs is yours. Hunt down bugs, uncover missing features, fix broken logic, and refine what you inherit. Then take it further with creative additions of your own.
              </p>
            </div>
            <div className="flex justify-center">
              <BreakItSprite />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
