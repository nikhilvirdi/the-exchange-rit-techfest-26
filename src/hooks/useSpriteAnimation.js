import { useEffect, useState } from 'react'

export default function useSpriteAnimation({ frameCount, columns, frameWidth, frameHeight, fps }) {
  const [frameIndex, setFrameIndex] = useState(0)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let interval

    function updatePlayback() {
      window.clearInterval(interval)
      setFrameIndex(0)

      if (!motion.matches) {
        interval = window.setInterval(() => {
          setFrameIndex((previousFrame) => (previousFrame + 1) % frameCount)
        }, 1000 / fps)
      }
    }

    updatePlayback()
    motion.addEventListener('change', updatePlayback)

    return () => {
      window.clearInterval(interval)
      motion.removeEventListener('change', updatePlayback)
    }
  }, [frameCount, columns, frameWidth, frameHeight, fps])

  return {
    frameIndex,
    x: (frameIndex % columns) * frameWidth,
    y: Math.floor(frameIndex / columns) * frameHeight,
  }
}
