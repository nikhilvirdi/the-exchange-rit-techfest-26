import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils.js'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const defaultMotion = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 3 },
}

export function HyperText({ text, duration = 800, framerProps = defaultMotion, className, animateOnLoad = true }) {
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [displayText, setDisplayText] = useState(() => text.split(''))
  const [trigger, setTrigger] = useState(false)
  const iterations = useRef(0)
  const firstRender = useRef(true)

  function triggerAnimation() {
    iterations.current = 0
    setTrigger(true)
  }

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setReduceMotion(preference.matches)

    syncPreference()
    preference.addEventListener('change', syncPreference)
    return () => preference.removeEventListener('change', syncPreference)
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    const interval = setInterval(() => {
      if (!animateOnLoad && firstRender.current) {
        firstRender.current = false
        clearInterval(interval)
        return
      }
      const progress = iterations.current
      if (progress < text.length) {
        setDisplayText(text.split('').map((letter, index) => {
          if (letter === ' ' || index <= progress) return letter
          return alphabet[Math.floor(Math.random() * alphabet.length)]
        }))
        iterations.current += 0.1
      } else {
        clearInterval(interval)
        setTrigger(false)
      }
    }, duration / (text.length * 10))
    return () => clearInterval(interval)
  }, [text, duration, trigger, animateOnLoad, reduceMotion])

  const letters = reduceMotion ? text.split('') : displayText
  const Glyph = reduceMotion ? 'span' : motion.span

  return (
    <span className="flex scale-100 cursor-default overflow-hidden" onMouseEnter={reduceMotion ? undefined : triggerAnimation}>
      {letters.map((letter, index) => (
        <AnimatePresence key={index} mode="wait">
          <Glyph
            key={index}
            data-glyph={text[index]}
            className={cn('relative before:invisible before:content-[attr(data-glyph)]', letter === ' ' && 'w-3', className)}
            {...(!reduceMotion && framerProps)}
          >
            <span className="absolute inset-y-0 left-0">{letter.toUpperCase()}</span>
          </Glyph>
        </AnimatePresence>
      ))}
    </span>
  )
}
