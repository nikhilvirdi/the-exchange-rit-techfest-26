import TeamLanyardRail from './TeamLanyardRail.jsx'

const team = [
  { name: 'Nikhil Virdi', year: 'III year' },
  { name: 'Kaustubh Nadiger', year: 'III year' },
  { name: 'Kritagya Tak', year: 'III year' },
  { name: 'Harsh Raj', year: 'III year' },
  { name: 'Preksha Raj', year: 'II year' },
  { name: 'Ruhaan Narang', year: 'II year' },
  { name: 'Ruchitha Prakash', year: 'II year' },
]

export default function TeamSection() {
  return (
    <section id="team" className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8" aria-labelledby="team-heading">
      <h2 id="team-heading" className="mx-auto mb-7 max-w-4xl text-balance text-center font-['Poster_Handjet'] text-4xl font-bold leading-none tracking-wide text-brand-lime sm:mb-10 sm:text-6xl lg:text-7xl">
        MEET THE PEOPLE BEHIND THE EXCHANGE
      </h2>
      <TeamLanyardRail items={team} label="The Exchange team" />
    </section>
  )
}
