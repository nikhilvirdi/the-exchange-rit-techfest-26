const judgingPhases = [
  {
    title: 'Phase 1: Build',
    criteria: [
      'Turn a problem statement into a functional, interactive prototype within the given time.',
      'Demonstrate creativity and innovation through original ideas, interesting mechanics, and unique approaches.',
      'Create a visually appealing UI/UX with smooth interactions, intuitive controls, and engaging design.',
      'Ensure functional completeness by implementing the required features and core mechanics.',
      'Show productivity and effective execution by making the most of your time, tools, and resources.',
    ],
  },
  {
    title: 'Phase 2: Break & Fix',
    criteria: [
      'Quickly adapt to an unfamiliar codebase and understand its structure, logic, and functionality.',
      'Discover and analyze bugs, edge cases, logical flaws, vulnerabilities, and unexpected behavior.',
      'Identify missing implementations, hardcoded shortcuts, and incomplete functionality.',
      'Debug, fix, refine, and optimize the existing project without breaking working features.',
      'Extend the project with meaningful new features, creative additions, and improvements beyond the original requirements.',
    ],
  },
]

export default function JudgingSection() {
  return (
    <section id="judging" className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <h2 className="text-2xl font-bold tracking-wider text-brand-lime uppercase sm:text-3xl md:text-4xl">
          Judging
        </h2>
        <p className="mt-4 max-w-3xl font-['Geologica',sans-serif] text-sm leading-relaxed text-brand-white/90 sm:text-base">
          The Exchange evaluates not just how well you build, but also how effectively you understand, debug, and improve someone else&apos;s work. Both phases carry equal weight.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-2 lg:gap-14">
          {judgingPhases.map(({ title, criteria }) => (
            <div key={title}>
              <h3 className="text-2xl font-bold leading-tight text-brand-white sm:text-3xl">
                {title}
              </h3>
              <ul className="mt-3 list-disc space-y-3 pl-5 font-['Geologica',sans-serif] text-sm leading-relaxed text-brand-white/90 marker:text-brand-lime sm:text-base">
                {criteria.map(criterion => <li key={criterion}>{criterion}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
