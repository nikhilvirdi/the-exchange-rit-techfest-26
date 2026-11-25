const ruleGroups = [
  {
    title: 'General Rules',
    start: 1,
    rules: [
      <>Teams must have <strong>2-3 members</strong>. Team changes are not allowed once the event begins.</>,
      <><strong>AI coding agents, IDE assistants, documentation, and open-source libraries</strong> are allowed. Teams can use any programming language or framework.</>,
      'All projects must run locally without paid APIs, external datasets, or complicated setup.',
      <>All projects must be built during the event. <strong>Copying projects from the internet, using pre-built solutions, or submitting someone else&apos;s work as your own will result in immediate disqualification.</strong> All submissions will be thoroughly reviewed.</>,
    ],
  },
  {
    title: 'Phase 1: Build',
    start: 5,
    rules: [
      <>Teams can choose any problem statement from the provided list and have <strong>90 minutes</strong> to implement its core requirements.</>,
      <>Projects must be saved and ready for handover before the deadline. <strong>No changes to the original submission are allowed afterward.</strong></>,
    ],
  },
  {
    title: 'Phase 2: Break & Fix',
    start: 7,
    rules: [
      <>Projects will be <strong>randomly exchanged</strong> between teams. Each team gets <strong>90 minutes</strong> to investigate, fix, refine, and extend the project they receive.</>,
      <>The project&apos;s original purpose and core functionality must be preserved. <strong>Replacing it with an unrelated project is not allowed.</strong></>,
      <><strong>Intentionally planting bugs, sabotaging code, deleting functionality to harm another team, or manipulating submissions for an unfair advantage will result in immediate disqualification.</strong> Both original and modified codebases will be reviewed.</>,
      'Teams must document the bugs discovered, fixes made, and features added. The coordinators will explain the reporting format during Phase 2.',
    ],
  },
  {
    title: 'Submission & Judging',
    start: 11,
    rules: [
      <>Teams will give a short presentation <strong>at their desks between the two phases</strong>. All submissions must be completed on time. <strong>Late modifications will not be accepted.</strong></>,
      <>Judges may run projects, inspect code, verify reported bugs, and test improvements. Only working implementations and verifiable findings will count. <strong>The judges&apos; decisions will be final.</strong></>,
    ],
  },
]

const ruleColumns = [ruleGroups.slice(0, 2), ruleGroups.slice(2)]

export default function RulesSection() {
  return (
    <section id="rules" aria-labelledby="rules-heading" className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <h2 id="rules-heading" className="text-2xl font-bold tracking-wider text-brand-lime uppercase sm:text-3xl md:text-4xl">
          Rules
        </h2>
        <div className="mt-8 grid items-start gap-x-10 gap-y-9 md:grid-cols-2 lg:gap-x-14">
          {ruleColumns.map(groups => (
            <div key={groups[0].title} className="flex min-w-0 flex-col gap-9 lg:gap-12">
              {groups.map(({ title, start, rules }) => (
                <div key={title} className="min-w-0">
                  <h3 className="text-2xl font-bold leading-tight text-brand-white sm:text-3xl">{title}</h3>
                  <ol start={start} className="mt-3 list-decimal space-y-3 pl-8 font-['Geologica',sans-serif] text-sm leading-relaxed text-brand-white/90 marker:font-semibold marker:text-brand-lime sm:text-base [&_strong]:font-semibold [&_strong]:text-brand-lime">
                    {rules.map((rule, index) => <li key={start + index} className="pl-1">{rule}</li>)}
                  </ol>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
