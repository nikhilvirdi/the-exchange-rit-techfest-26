import { useEffect, useRef, useState } from 'react'
import star from '../../assets/decor/golden_star.svg'

const prizes = [
  { id: 'left', amount: '3K', starCount: 2 },
  { id: 'center', amount: '5K', starCount: 3 },
  { id: 'right', amount: '2K', starCount: 1 },
]

const riseTransition = 'motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out'

export default function PrizesSection() {
  const podiumRef = useRef(null)
  const [raised, setRaised] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio < 0.2) return

      setRaised(true)
      observer.disconnect()
    }, { threshold: 0.2 })

    observer.observe(podiumRef.current)
    return () => observer.disconnect()
  }, [])

  const reveal = `motion-safe:transition-opacity motion-safe:duration-200 motion-reduce:opacity-100 ${
    raised ? 'opacity-100 motion-safe:delay-700' : 'opacity-0'
  }`

  return (
    <section id="prizes" className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <h2 className="text-2xl font-bold tracking-wider text-brand-lime uppercase sm:text-3xl md:text-4xl">
          Prizes
        </h2>
        <ul
          ref={podiumRef}
          role="list"
          aria-label="Prize amounts"
          className="mx-auto mt-12 grid h-[clamp(10rem,24vw,18rem)] max-w-2xl grid-cols-3 items-end gap-2 sm:mt-16 sm:gap-4"
        >
          {prizes.map(({ id, amount, starCount }) => {
            const isCenter = id === 'center'
            const rise = `${riseTransition} ${isCenter ? 'motion-safe:delay-100' : ''}`

            return (
              <li key={id} className={`relative ${isCenter ? 'h-full' : 'h-3/5'}`}>
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 origin-bottom [clip-path:polygon(0_8px,8px_8px,8px_0,calc(100%-8px)_0,calc(100%-8px)_8px,100%_8px,100%_100%,0_100%)] ${rise} motion-reduce:scale-y-100 ${
                    raised ? 'scale-y-100' : 'scale-y-[0.06]'
                  } ${isCenter ? 'bg-brand-lime' : 'bg-brand-lime/85'}`}
                >
                  <div className="absolute inset-x-2 top-0 h-2 bg-brand-white/25" />
                  <div className="absolute inset-y-2 right-0 w-2 bg-brand-blue/20" />
                  <div className="absolute inset-x-0 bottom-0 h-2 bg-brand-blue/30" />
                </div>
                {/* The 6% baseline puts the top edge 94% below its final position. */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 ${rise} motion-reduce:translate-y-0 ${
                    raised ? 'translate-y-0' : 'translate-y-[94%]'
                  }`}
                >
                  <div className={`absolute inset-x-0 bottom-full mb-2 flex justify-center gap-1 sm:gap-2 ${reveal}`}>
                    {Array.from({ length: starCount }, (_, index) => (
                      <img key={index} src={star} alt="" className="size-[min(1.5rem,7vw)] sm:size-9" />
                    ))}
                  </div>
                </div>
                <div className={`absolute inset-0 grid place-items-center font-['Poster_Handjet'] text-4xl leading-none font-bold text-brand-blue sm:text-6xl ${reveal}`}>
                  <span>{amount}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
