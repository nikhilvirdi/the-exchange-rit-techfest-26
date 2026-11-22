import useSpriteAnimation from '../../hooks/useSpriteAnimation.js'

const sprite = { frameCount: 10, columns: 5, frameWidth: 397, frameHeight: 397, fps: 2.5 }
const rows = Math.ceil(sprite.frameCount / sprite.columns)
const maxX = (sprite.columns - 1) * sprite.frameWidth
const maxY = (rows - 1) * sprite.frameHeight

export default function BuildItSprite() {
  const { x, y } = useSpriteAnimation(sprite)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none size-24 shrink-0 bg-[url('/src/assets/sprites/laptopwork.png')] bg-no-repeat [image-rendering:pixelated] sm:size-20 md:size-24 lg:size-32 xl:size-36"
      style={{
        backgroundSize: `${sprite.columns * 100}% ${rows * 100}%`,
        backgroundPosition: `${(x / maxX) * 100}% ${(y / maxY) * 100}%`,
      }}
    />
  )
}
