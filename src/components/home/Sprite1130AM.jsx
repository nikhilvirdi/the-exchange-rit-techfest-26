import useSpriteAnimation from '../../hooks/useSpriteAnimation.js'

const sprite = { frameCount: 4, columns: 2, frameWidth: 627, frameHeight: 627, fps: 2.5 }
const rows = sprite.frameCount / sprite.columns
const maxX = (sprite.columns - 1) * sprite.frameWidth
const maxY = (rows - 1) * sprite.frameHeight

export default function Sprite1130AM() {
  const { x, y } = useSpriteAnimation(sprite)
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none aspect-square w-full bg-[url('/src/assets/sprites/1130AM.png')] bg-no-repeat [image-rendering:pixelated]"
      style={{
        backgroundSize: `${sprite.columns * 100}% ${rows * 100}%`,
        backgroundPosition: `${(x / maxX) * 100}% ${(y / maxY) * 100}%`,
      }}
    />
  )
}
