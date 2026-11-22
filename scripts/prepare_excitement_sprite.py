from argparse import ArgumentParser
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


parser = ArgumentParser(description="Clear background specks from a timeline sprite sheet.")
parser.add_argument(
    "sprite", nargs="?",
    choices=("900AM", "910AM", "930AM", "1100AM", "1105AM", "1130AM", "100AND115PM", "200PM"),
    default="900AM",
)
name = parser.parse_args().sprite
path = Path(__file__).resolve().parents[1] / "src" / "assets" / "sprites" / f"{name}.png"
with Image.open(path) as source:
    sprite = source.convert("RGBA")

width, height = sprite.size
alpha = sprite.getchannel("A")
corners = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]
# The laptop reaches the lower strip, so sample the clear left and right edges.
edges = [(0, 0, 24, height), (width - 24, 0, width, height)]
samples = [alpha.getpixel(corner) for corner in corners]
samples.extend(alpha.crop(edge).getextrema()[1] for edge in edges)
background_limit = max(samples) + 2

# Protect antialiased edges around the character while clearing low-alpha background specks.
artwork = alpha.point(lambda value: 255 if value >= 64 else 0)
artwork_edges = Image.new("L", alpha.size)
frame_width, frame_height = width // 2, height // 2
for y in (0, frame_height):
    for x in (0, frame_width):
        frame = artwork.crop((x, y, x + frame_width, y + frame_height))
        artwork_edges.paste(frame.filter(ImageFilter.MaxFilter(13)), (x, y))
above_background = alpha.point(lambda value: 255 if value > background_limit else 0)
clean_alpha = ImageChops.multiply(alpha, ImageChops.lighter(artwork_edges, above_background))
sprite.putalpha(clean_alpha)
sprite.save(path)

removed = clean_alpha.histogram()[0] - alpha.histogram()[0]
print(f"Cleared {removed:,} residual background pixels at alpha <= {background_limit}.")
print(f"Saved {width} x {height}; corner alpha: {[clean_alpha.getpixel(corner) for corner in corners]}.")
