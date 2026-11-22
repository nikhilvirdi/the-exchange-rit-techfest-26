from argparse import ArgumentParser
from pathlib import Path

from PIL import Image


parser = ArgumentParser(description="Clean and pad one of the laptop sprite sheets.")
parser.add_argument("sprite", nargs="?", choices=("laptopwork", "laptopbreak"), default="laptopwork")
name = parser.parse_args().sprite
path = Path(__file__).resolve().parents[1] / "src" / "assets" / "sprites" / f"{name}.png"
target_size = (1985, 794)

with Image.open(path) as source:
    sprite = source.convert("RGBA")

width, height = sprite.size
if sprite.size not in ((1983, 793), target_size):
    raise ValueError(f"Unexpected {name} sheet dimensions: {sprite.size}")

alpha = sprite.getchannel("A")
corners = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]
column_seam, row_seam = width // 5, height // 2
gutters = [(column_seam - 2, 0, column_seam + 2, height), (0, row_seam - 4, width, row_seam + 4)]
samples = [alpha.getpixel(corner) for corner in corners]
samples.extend(alpha.crop(gutter).getextrema()[1] for gutter in gutters)
background_max = max(samples)
if background_max > 16:
    raise ValueError(f"Background samples unexpectedly include artwork: alpha {background_max}")

# The sampled remnants vary in RGB, so classify them by opacity and retain mid-alpha edges.
background_limit = max(8, background_max + 2)
clean_alpha = alpha.point([
    0 if value <= background_limit else 255 if value >= 252 else value
    for value in range(256)
])
sprite.putalpha(clean_alpha)

output = Image.new("RGBA", target_size)
left = (target_size[0] - width) // 2
top = (target_size[1] - height) // 2
output.paste(sprite, (left, top))
output.save(path)

removed = clean_alpha.histogram()[0] - alpha.histogram()[0]
print(f"Cleared {removed:,} residual background pixels at alpha <= {background_limit}.")
print(f"Saved {output.width} x {output.height} RGBA sheet, 5 x 2 frames of 397 x 397 pixels.")
