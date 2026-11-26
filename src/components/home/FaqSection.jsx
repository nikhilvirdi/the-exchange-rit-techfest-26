import { useId, useState } from 'react'

const faqs = [
  {
    question: 'Do I need a team to participate?',
    answer: 'Yes! Teams must have 2-3 members.',
  },
  {
    question: 'Can we use AI coding tools?',
    answer: 'Absolutely! You can use ChatGPT, GitHub Copilot, Cursor, Claude, or any other AI coding agent during both phases.',
  },
  {
    question: 'Can we choose our own problem statement?',
    answer: 'Yes! You can choose any problem statement from the list provided for the event.',
  },
  {
    question: 'Can we use any programming language or framework?',
    answer: "Yes! You're free to use any language, framework, or tech stack. Just make sure your project runs locally without paid APIs or complicated setup. Copying someone else's project or ready-made solution from the internet is strictly prohibited and will lead to disqualification. All submissions will be thoroughly reviewed.",
  },
  {
    question: 'What exactly happens during the exchange?',
    answer: "After Phase 1, your project will be randomly assigned to another team, and you'll receive theirs. You'll have 90 minutes to understand their code, find bugs, fix issues, and add your own improvements.",
  },
  {
    question: 'What if the project we receive is already working perfectly?',
    answer: "There's always room for improvement! Look for hidden edge cases, missing requirements, inefficient code, or opportunities to introduce useful new features. You're judged on the quality of your work, not just the number of bugs you find.",
  },
  {
    question: 'What if we receive a poorly built or incomplete project? Will it affect our score?',
    answer: 'Not at all! In fact, that could be a goldmine for your team. A project full of bugs, missing features, and messy code gives you plenty of opportunities to show what you can do. Your Phase 2 score depends on how well you identify problems, fix them, refine the code, and add meaningful improvements, not how good the project was when you received it.',
  },
  {
    question: 'How do we report the bugs and improvements we make?',
    answer: 'The coordinators will explain the required reporting format and submission process during Phase 2.',
  },
  {
    question: 'How will the winners be decided?',
    answer: 'Both phases carry equal weight, with 50 points each. Phase 1 focuses on functionality, UI/UX, creativity, and rapid prototyping. Phase 2 focuses on finding issues, fixing and refining code, and adding meaningful features. Judges will evaluate both the original and modified projects.',
  },
]

function FaqItem({ number, question, answer }) {
  const panelId = useId()
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <h3>
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => setExpanded(open => !open)}
          className="flex min-h-11 w-full cursor-pointer items-start justify-between gap-3 py-3 text-left text-xl font-bold leading-tight text-brand-white hover:text-brand-lime focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-lime aria-expanded:text-brand-lime motion-safe:transition-colors sm:py-4 sm:text-2xl"
        >
          <span className="flex min-w-0 gap-2">
            <span className="shrink-0 tabular-nums">{number}.</span>
            <span>{question}</span>
          </span>
          <span aria-hidden="true" className="w-6 shrink-0 text-center text-brand-lime">
            {expanded ? '−' : '+'}
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        inert={!expanded}
        aria-hidden={!expanded}
        className={`grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300 motion-safe:ease-out ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="min-h-0 min-w-0 overflow-hidden">
          <p className="max-w-3xl pb-4 pr-3 font-['Geologica',sans-serif] text-sm leading-relaxed text-brand-white/90 sm:text-base">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FaqSection() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <h2 id="faq-heading" className="text-2xl font-bold tracking-wider text-brand-lime uppercase sm:text-3xl md:text-4xl">
          FAQ
        </h2>
        <div className="mt-6 divide-y divide-brand-white/20 border-y border-brand-white/20">
          {faqs.map(({ question, answer }, index) => (
            <FaqItem key={question} number={index + 1} question={question} answer={answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
