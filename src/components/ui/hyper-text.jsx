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
  const [displayText, setDisplayText] = useState(() => text.split(''))
  const [trigger, setTrigger] = useState(false)
  const iterations = useRef(0)
  const firstRender = useRef(true)

  function triggerAnimation() {
    iterations.current = 0
    setTrigger(true)
  }

  useEffect(() => {
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
  }, [text, duration, trigger, animateOnLoad])

  return (
    <span className="flex scale-100 cursor-default overflow-hidden" onMouseEnter={triggerAnimation}>
      {displayText.map((letter, index) => (
        <AnimatePresence key={index} mode="wait">
          <motion.span
            key={index}
            data-glyph={text[index]}
            className={cn('relative before:invisible before:content-[attr(data-glyph)]', letter === ' ' && 'w-3', className)}
            {...framerProps}
          >
            <span className="absolute inset-y-0 left-0">{letter.toUpperCase()}</span>
          </motion.span>
        </AnimatePresence>
      ))}
    </span>
  )
}
