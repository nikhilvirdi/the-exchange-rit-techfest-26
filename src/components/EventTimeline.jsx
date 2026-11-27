import { useLayoutEffect, useRef, useState } from 'react'
import { preload } from 'react-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import sheet900AM from '../assets/sprites/900AM.png'
import sheet910AM from '../assets/sprites/910AM.png'
import sheet930AM from '../assets/sprites/930AM.png'
import sheet1100AM from '../assets/sprites/1100AM.png'
import sheet1105AM from '../assets/sprites/1105AM.png'
import sheet1130AM from '../assets/sprites/1130AM.png'
import sheet100AND115PM from '../assets/sprites/100AND115PM.png'
import sheet200PM from '../assets/sprites/200PM.png'
import Sprite900AM from './home/Sprite900AM.jsx'
import Sprite910AM from './home/Sprite910AM.jsx'
import Sprite930AM from './home/Sprite930AM.jsx'
import Sprite1100AM from './home/Sprite1100AM.jsx'
import Sprite1105AM from './home/Sprite1105AM.jsx'
import Sprite1130AM from './home/Sprite1130AM.jsx'
import Sprite100AND115PM from './home/Sprite100AND115PM.jsx'
import Sprite200PM from './home/Sprite200PM.jsx'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

const eventTimelineData = [
  { id: 'step-1', time: '10:00 AM', content: 'Event Kickoff' },
  { id: 'step-2', time: '10:15 AM', content: 'Problem Statements Released' },
  { id: 'step-3', time: '10:30 AM', content: 'Phase 01: Build It Begins' },
  { id: 'step-4', time: '11:30 AM', content: 'Evaluation 01 Begins' },
  { id: 'step-5', time: '12:00 PM', content: 'Phase 01 Ends; Coordinators Exchange Repositories' },
  { id: 'step-6', time: '1:30 PM', content: 'Phase 02: Break It Begins' },
  { id: 'step-7', time: '2:30 PM', content: 'Evaluation 02 Begins' },
  { id: 'step-8', time: '3:00 PM', content: 'Phase 02 Ends' },
  { id: 'step-9', time: '3:10 PM', content: 'Evaluation 03 Begins for the Top 6 Teams' },
  { id: 'step-10', time: '3:45 PM', content: 'Winners Announced' },
  { id: 'step-11', time: '4:00 PM', content: 'Event Concludes' },
]

const stageSprites = {
  'step-1': { component: Sprite900AM, sheet: sheet900AM },
  'step-2': { component: Sprite910AM, sheet: sheet910AM },
  'step-3': { component: Sprite930AM, sheet: sheet930AM },
  'step-4': { component: Sprite1100AM, sheet: sheet1100AM },
  'step-5': { component: Sprite1105AM, sheet: sheet1105AM },
  'step-6': { component: Sprite1130AM, sheet: sheet1130AM },
  'step-7': { component: Sprite930AM, sheet: sheet930AM },
  'step-8': { component: Sprite100AND115PM, sheet: sheet100AND115PM },
  'step-9': { component: Sprite910AM, sheet: sheet910AM },
  'step-10': { component: Sprite200PM, sheet: sheet200PM },
  'step-11': { component: Sprite100AND115PM, sheet: sheet100AND115PM },
}
const lastSpriteIndex = eventTimelineData.findLastIndex(({ id }) => Boolean(stageSprites[id]))

export default function EventTimeline({ title = 'The Timeline', periodLabel = '26 NOV 2026', duration = 1.2 }) {
  const stageRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const lineRef = useRef(null)
  const spritePanelRef = useRef(null)
  const [spriteStage, setSpriteStage] = useState(null)
  const StageSprite = stageSprites[spriteStage]?.component
  const stageIndex = eventTimelineData.findIndex(({ id }) => id === spriteStage)

  // Start with two sheets and fetch upcoming stages as the visitor scrolls.
  for (const { id } of eventTimelineData.slice(Math.max(0, stageIndex - 1), stageIndex + 3)) {
    const sheet = stageSprites[id]?.sheet
    if (sheet) preload(sheet, { as: 'image' })
  }

  useLayoutEffect(() => {
    const stage = stageRef.current
    const section = stage.parentElement
    const viewport = viewportRef.current
    const track = trackRef.current
    const line = lineRef.current
    const spritePanel = spritePanelRef.current
    const revealDuration = Math.max(0.2, duration)
    const media = gsap.matchMedia()
    const entries = Array.from(track.querySelectorAll('[data-stage]'))
    const spriteEntries = entries.slice(0, lastSpriteIndex + 1)

    function watchSpriteStages({ trigger, start, stageEnd }) {
      function syncSprite(self) {
        if (!self.isActive) {
          setSpriteStage(null)
          return
        }
        const scrollPosition = self.scroll()
        const activeEntry = spriteEntries.find((_, index) => scrollPosition < stageEnd(index))
        setSpriteStage(activeEntry?.dataset.stage ?? null)
      }

      ScrollTrigger.create({
        trigger,
        start,
        end: () => stageEnd(lastSpriteIndex),
        onUpdate: syncSprite,
        onToggle: syncSprite,
        onRefresh: syncSprite,
      })
    }

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const splits = []
      const lastEntry = entries.at(-1)
      const centerOffset = entry => entry.offsetLeft + (entry.offsetWidth - viewport.clientWidth) / 2
      const distance = () => Math.max(0, Math.ceil(centerOffset(lastEntry)))
      // Keep the final card centered for a scroll interval before releasing the pin.
      const pin = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: () => `+=${distance() + Math.max(lastEntry.offsetWidth, stage.clientHeight / 2)}`,
        pin: true,
      })
      const slide = gsap.timeline({
        defaults: { ease: 'none', duration: 1 },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      })

      slide.to(track, { x: () => -distance() }, 0)
      slide.fromTo(line, { scaleX: () => Math.min(viewport.clientWidth / line.offsetWidth, 1) }, { scaleX: 1 }, 0)

      const viewportRight = () => viewport.getBoundingClientRect().right

      for (const entry of entries) {
        const dot = entry.querySelector('[data-dot]')
        const connector = entry.querySelector('[data-connector]')
        const time = SplitText.create(entry.querySelector('h3'), { type: 'chars' })
        const description = SplitText.create(entry.querySelector('p'), { type: 'words' })
        splits.push(time, description)

        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: entry,
            containerAnimation: slide,
            start: () => `left ${viewportRight()}px`,
            end: () => `left ${viewportRight() - 140}px`,
            scrub: true,
          },
        })

        reveal
          .from(dot, { scale: 0, duration: revealDuration * 0.4 })
          .from(connector, { scaleY: 0, duration: revealDuration * 0.4 }, '<')
          .from(time.chars, { opacity: 0, y: 14, stagger: 0.035, duration: revealDuration, ease: 'power2.out' })
          .from(description.words, { opacity: 0, y: 14, stagger: 0.035, duration: revealDuration, ease: 'power2.out' }, '<')
      }

      // Hand off when the next entry's center reaches the timeline viewport's center.
      function stageEnd(index) {
        const nextEntry = entries[index + 1]
        if (!nextEntry) {
          return pin.end + spritePanel.getBoundingClientRect().bottom - stage.getBoundingClientRect().top
        }
        return slide.scrollTrigger.start + centerOffset(nextEntry)
      }
      watchSpriteStages({
        trigger: stage,
        start: 'top 65%',
        stageEnd,
      })

      return () => {
        setSpriteStage(null)
        splits.forEach(split => split.revert())
      }
    })

    media.add('(prefers-reduced-motion: reduce)', () => {
      const bottomQuarter = entry => entry.getBoundingClientRect().bottom + window.scrollY - window.innerHeight / 4
      watchSpriteStages({
        trigger: entries[0],
        start: 'top 75%',
        stageEnd: index => bottomQuarter(entries[index]),
      })

      return () => setSpriteStage(null)
    })

    return () => media.revert()
  }, [duration])

  return (
    <section id="timeline" aria-labelledby="event-timeline-title" className="w-full text-brand-white font-['Poster_Handjet',Handjet,sans-serif]">
      <div ref={stageRef} className="motion-safe:flex motion-safe:min-h-svh motion-safe:items-center">
        <div className="mx-auto grid w-full min-w-0 max-w-7xl px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,13fr)_minmax(0,7fr)] md:items-center md:gap-8 lg:px-8">
          <div className="min-w-0 max-md:motion-reduce:contents">
            <h2 id="event-timeline-title" className="text-5xl font-bold leading-none uppercase text-brand-lime sm:text-7xl lg:text-8xl">
              {title}
            </h2>
            <p className="mt-2 text-xl font-semibold tracking-widest text-brand-white/80 sm:text-2xl">{periodLabel}</p>

            <div ref={viewportRef} className="mt-10 motion-safe:overflow-hidden max-md:motion-reduce:order-last sm:mt-14">
              <div ref={trackRef} className="relative motion-safe:w-max [--step-width:min(78vw,23rem)]">
                <div ref={lineRef} aria-hidden="true" className="absolute top-1.5 right-[calc(var(--step-width)-0.375rem)] left-1.5 hidden h-px origin-left bg-brand-lime/80 motion-safe:block" />
                <ol className="grid gap-8 motion-safe:flex">
                  {eventTimelineData.map(({ id, time, content }) => (
                    <li key={id} data-stage={id} className="group relative shrink-0 motion-safe:w-[var(--step-width)] motion-safe:pt-9 motion-reduce:pl-6">
                      <span data-dot aria-hidden="true" className="absolute top-0 left-0 z-10 size-3 rounded-full bg-brand-lime" />
                      <span data-connector aria-hidden="true" className="absolute top-3 left-1.5 h-5 w-px origin-top -translate-x-1/2 bg-brand-lime/80 motion-reduce:h-[calc(100%+2rem)] motion-reduce:group-last:hidden" />
                      <h3 className="text-3xl font-bold leading-none sm:text-4xl">{time}</h3>
                      <p className="mt-2 text-xl leading-snug tracking-wide text-brand-white/85 sm:text-2xl">{content}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div aria-hidden="true" className="mt-6 flex justify-center motion-reduce:self-start md:mt-0">
            <div ref={spritePanelRef} className="grid aspect-square w-full max-w-36 place-items-center md:max-w-80">
              {StageSprite && <StageSprite />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
