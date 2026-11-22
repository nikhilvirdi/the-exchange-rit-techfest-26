from pathlib import Path
from statistics import median

from PIL import Image, ImageChops, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src" / "assets" / "sprites" / "build.png"
TOLERANCE = 12

with Image.open(ROOT / "build.png") as source:
    sprite = source.convert("RGBA")

width, height = sprite.size
corners = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]
samples = [sprite.getpixel(corner)[:3] for corner in corners]
background = tuple(round(median(channel)) for channel in zip(*samples))

rgb = sprite.convert("RGB")
red, green, blue = ImageChops.difference(rgb, Image.new("RGB", sprite.size, background)).split()
distance = ImageChops.lighter(ImageChops.lighter(red, green), blue)
matches = distance.point(lambda value: 255 if value <= TOLERANCE else 0)

# Use exterior-connected matches to preserve light pixels in the laptop and character.
for corner in corners:
    if matches.getpixel(corner) == 255:
        ImageDraw.floodfill(matches, corner, 128)

alpha = sprite.getchannel("A")
background_mask = matches.point(lambda value: 0 if value == 128 else 255)
new_alpha = ImageChops.multiply(alpha, background_mask)
sprite.putalpha(new_alpha)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
sprite.save(OUTPUT)
removed = new_alpha.histogram()[0] - alpha.histogram()[0]
print(f"Background RGB {background}, tolerance {TOLERANCE}. Made {removed:,} pixels transparent.")
print(f"Saved {width} x {height} RGBA image to {OUTPUT.relative_to(ROOT)}")
