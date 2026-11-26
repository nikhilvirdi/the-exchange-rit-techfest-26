import { useId, useState } from 'react'
import { problemTracks } from '../../data/problemStatements.js'

function Disclosure({ title, description, illustration, children }) {
  const id = useId()
  const [expanded, setExpanded] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const Heading = description ? 'h3' : 'h4'
  const headingSize = description ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'

  return (
    <div>
      <Heading>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={`${id}-panel`}
          aria-describedby={description ? `${id}-description` : undefined}
          onClick={() => {
            setExpanded(open => !open)
            if (illustration) setHasOpened(true)
          }}
          className={`flex min-h-11 w-full cursor-pointer items-start justify-between gap-3 py-3 text-left font-bold leading-tight text-brand-white hover:text-brand-lime focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-lime aria-expanded:text-brand-lime motion-safe:transition-colors ${headingSize}`}
        >
          <span>{title}</span>
          <span aria-hidden="true" className="w-6 shrink-0 text-center text-brand-lime">
            {expanded ? '−' : '+'}
          </span>
        </button>
      </Heading>
      {description && (
        <p id={`${id}-description`} className="max-w-3xl pb-4 pr-3 font-['Geologica',sans-serif] text-sm leading-relaxed text-brand-white/90 sm:text-base">
          {description}
        </p>
      )}
      <div
        id={`${id}-panel`}
        inert={!expanded}
        aria-hidden={!expanded}
        className={`grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300 motion-safe:ease-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 min-w-0 overflow-hidden">
          {illustration ? (
            <div className="grid items-start gap-4 pb-4 pr-3 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-6">
              {children}
              {hasOpened && (
                <img
                  src={illustration.src}
                  alt={illustration.alt}
                  decoding="async"
                  className="aspect-video w-full object-contain [image-rendering:pixelated]"
                />
              )}
            </div>
          ) : children}
        </div>
      </div>
    </div>
  )
}

export default function ProblemStatementsSection() {
  return (
    <section id="problem-statements" aria-labelledby="problem-statements-heading" className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <h2 id="problem-statements-heading" className="text-2xl font-bold tracking-wider text-brand-lime uppercase sm:text-3xl md:text-4xl">
          Problem Statements
        </h2>
        <div className="mt-6 divide-y divide-brand-white/20 border-y border-brand-white/20">
          {problemTracks.map(track => (
            <Disclosure key={track.title} title={track.title} description={track.description}>
              <div className="mb-5 divide-y divide-brand-white/15 border-l border-brand-lime/50 pl-3 sm:pl-6">
                {track.statements.map(({ title, description, illustration }) => (
                  <Disclosure key={title} title={title} illustration={illustration}>
                    <p className={`max-w-3xl font-['Geologica',sans-serif] text-sm leading-relaxed text-brand-white/90 sm:text-base [overflow-wrap:anywhere] ${illustration ? '' : 'pb-4 pr-3'}`}>
                      {description.split(/`([^`]+)`/g).map((part, index) => (
                        index % 2 === 0 ? part : <code key={index} className="text-brand-lime">{part}</code>
                      ))}
                    </p>
                  </Disclosure>
                ))}
              </div>
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  )
}
