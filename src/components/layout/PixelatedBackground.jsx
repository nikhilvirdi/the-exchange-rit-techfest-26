import { useEffect, useRef } from 'react'

const frameInterval = 1000 / 30
const turn = 2 * Math.PI
const navy = [32, 25, 143]
const blue = [43, 36, 182]
const highlight = [65, 58, 213]
const dither = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

const palette = Array.from({ length: 64 }, (_, index) => {
  const level = index / 63 * 2
  const [from, to, fraction] = level < 1 ? [navy, blue, level] : [blue, highlight, level - 1]
  return from.map((channel, i) => Math.round(channel + (to[i] - channel) * fraction))
})

function noise(seed) {
  const value = Math.sin(seed * 91.7) * 43758.5
  return value - Math.floor(value)
}

const particles = Array.from({ length: 36 }, (_, index) => ({
  x: noise(index * 3 + 1),
  y: noise(index * 3 + 2),
  phase: noise(index * 3 + 3) * turn,
}))

// The curved, dithered light band and CRT texture are inspired by Gradient pixelated by Jordan.
function drawFrame(context, frame, phase) {
  const { data, width, height } = frame

  for (let row = 0; row < height; row++) {
    const y = (row + 0.5) / height
    const center = 0.53 - y * 0.27 + Math.sin(phase + y * 2.5) * 0.09
    const spread = 0.055 + y * 0.025 + Math.cos(phase - y * 2) * 0.012
    const brightness = 0.76 + Math.cos(phase + y * 4) * 0.1

    for (let column = 0; column < width; column++) {
      const distance = (column + 0.5) / width - center
      const grain = (dither[(row % 4) * 4 + column % 4] - 7.5) / 320
      const level = 0.14 + Math.exp(-distance * distance / spread) * brightness + grain
      const color = palette[Math.max(0, Math.min(63, Math.round(level * 63)))]
      const offset = (row * width + column) * 4
      data[offset] = color[0]
      data[offset + 1] = color[1]
      data[offset + 2] = color[2]
      data[offset + 3] = 255
    }
  }

  const count = Math.min(particles.length, Math.ceil(width * height / 55))
  for (let index = 0; index < count; index++) {
    const particle = particles[index]
    const angle = phase + particle.phase
    const x = (particle.x + Math.sin(angle) * 0.04) * width
    const y = (particle.y + Math.cos(angle) * 0.08) * height
    const strength = 0.37 + Math.sin(angle * 2) * 0.11

    // Blend into neighboring tiles as squares drift from one cell to the next.
    for (let row = Math.floor(y); row <= Math.ceil(y); row++) {
      for (let column = Math.floor(x); column <= Math.ceil(x); column++) {
        if (row < 0 || row >= height || column < 0 || column >= width) continue

        const amount = strength * (1 - Math.abs(column - x)) * (1 - Math.abs(row - y))
        const offset = (row * width + column) * 4
        for (let channel = 0; channel < 3; channel++) {
          data[offset + channel] += (highlight[channel] - data[offset + channel]) * amount
        }
      }
    }
  }

  context.putImageData(frame, 0, 0)
}

export default function PixelatedBackground({ cellSize = 18, cycleSeconds = 12 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d', { alpha: false })
    if (!context) return

    const layer = canvas.parentElement
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const cycle = Math.max(1, cycleSeconds) * 1000
    let frame
    let request = 0
    let lastTime = 0
    let elapsed = 0

    function resize() {
      // Keep the backing grid small regardless of viewport size and device pixel ratio.
      const size = Math.max(8, cellSize, canvas.clientWidth / 100, canvas.clientHeight / 100)
      const width = Math.max(1, Math.ceil(canvas.clientWidth / size))
      const height = Math.max(1, Math.ceil(canvas.clientHeight / size))
      if (frame?.width !== width || frame?.height !== height) {
        canvas.width = width
        canvas.height = height
        frame = context.createImageData(width, height)
      }

      drawFrame(context, frame, elapsed / cycle * turn)
      layer.setAttribute('data-painted', '')
    }

    function tick(time) {
      const delta = lastTime ? time - lastTime : frameInterval
      if (delta >= frameInterval - 1) {
        elapsed = (elapsed + Math.min(delta, 100)) % cycle
        lastTime = time
        drawFrame(context, frame, elapsed / cycle * turn)
      }
      request = window.requestAnimationFrame(tick)
    }

    function stop() {
      window.cancelAnimationFrame(request)
      request = 0
      lastTime = 0
    }

    function fallback() {
      stop()
      layer.removeAttribute('data-painted')
    }

    function syncPlayback() {
      stop()
      if (motion.matches || context.isContextLost?.()) {
        fallback()
      } else if (!document.hidden) {
        resize()
        request = window.requestAnimationFrame(tick)
      }
    }

    const observer = new ResizeObserver(() => {
      if (request) resize()
    })
    observer.observe(canvas)
    motion.addEventListener('change', syncPlayback)
    document.addEventListener('visibilitychange', syncPlayback)
    canvas.addEventListener('contextlost', fallback)
    canvas.addEventListener('contextrestored', syncPlayback)
    syncPlayback()

    return () => {
      fallback()
      observer.disconnect()
      motion.removeEventListener('change', syncPlayback)
      document.removeEventListener('visibilitychange', syncPlayback)
      canvas.removeEventListener('contextlost', fallback)
      canvas.removeEventListener('contextrestored', syncPlayback)
    }
  }, [cellSize, cycleSeconds])

  return (
    <div aria-hidden="true" className="group pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-brand-blue after:absolute after:inset-0 after:hidden after:bg-[repeating-linear-gradient(to_bottom,transparent_0_2px,#18126524_2px_3px,transparent_3px_4px)] data-[painted]:after:block">
      <canvas ref={canvasRef} className="invisible size-full [image-rendering:pixelated] group-data-[painted]:visible" />
    </div>
  )
}
