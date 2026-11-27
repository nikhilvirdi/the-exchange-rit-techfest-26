import { useEffect, useRef, useState } from 'react'

const winners = [
  { id: 'left', rank: '2nd', height: 'h-4/5', teamName: 'Childrenofkhan.Com', members: ['Syed Afnan', 'Shishir Patil', 'Shreesha K S'] },
  { id: 'center', rank: '1st', height: 'h-full', teamName: 'Oregano', members: ['Amulya Vishesh', 'Hargun Madan'] },
  { id: 'right', rank: '3rd', height: 'h-3/5', teamName: 'Notyet', members: ['Tanmay Kapoor', 'Syed Syedain'] },
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

  // The header uses 44px link targets, 1.5rem of vertical padding, and a 1px border.
  return (
    <section id="prizes" aria-labelledby="winners-heading" className="grid min-h-[calc(100dvh-1.5rem-45px)] w-full content-center">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <h2 id="winners-heading" className="mx-auto max-w-4xl text-balance text-center font-['Poster_Handjet'] text-4xl font-bold leading-none tracking-wide text-brand-lime sm:text-6xl lg:text-7xl">
          MEET OUR WINNERS
        </h2>
        <ul role="list" aria-label="Winners podium" className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-2 sm:gap-4">
          {winners.map(({ id, rank, height, teamName, members }) => {
            const isCenter = id === 'center'
            const rise = `${riseTransition} ${isCenter ? 'motion-safe:delay-100' : ''}`

            return (
              <li key={id} className="min-w-0">
                <div ref={isCenter ? podiumRef : null} className="flex h-[clamp(10rem,24vw,18rem)] items-end">
                  <div className={`relative w-full ${height}`}>
                    <ul role="list" className={`absolute inset-x-0 bottom-full mb-3 space-y-1 text-center font-['Geologica',sans-serif] text-[clamp(0.6875rem,3.3vw,0.875rem)] leading-snug font-medium text-brand-white ${reveal}`}>
                      {members.map(member => <li key={member} className="text-balance">{member}</li>)}
                    </ul>
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
                    <div className={`absolute inset-0 grid place-items-center font-['Poster_Handjet'] text-4xl leading-none font-bold text-brand-blue sm:text-6xl ${reveal}`}>
                      <span>{rank}</span>
                    </div>
                  </div>
                </div>
                <p className={`mt-4 text-center font-['Poster_Handjet'] text-[clamp(0.75rem,3.7vw,1.25rem)] leading-tight font-bold text-brand-lime [overflow-wrap:anywhere] ${reveal}`}>
                  {teamName}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
