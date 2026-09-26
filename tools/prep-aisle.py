"""Build every image the aisle scene loads from assets/aisle.png.

Usage (from the project folder):  python3 tools/prep-aisle.py
Writes:
  aisle.webp / aisle.jpg            full width (max 1536px), never enlarged
  aisle-800.webp / aisle-800.jpg    for phones
  aisle-blur.webp                   small, heavily blurred copy for the depth crossfade
  packs-left.webp / packs-right.webp  blurred foreground pack silhouettes (parallax layers)
Needs Pillow.
"""
import os
from PIL import Image, ImageDraw, ImageFilter

ASSETS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets")
im = Image.open(os.path.join(ASSETS, "aisle.png")).convert("RGB")

for width, suffix in ((1536, ""), (800, "-800")):
    w = min(width, im.width)
    out = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    out.save(os.path.join(ASSETS, f"aisle{suffix}.webp"), quality=78, method=6)
    out.save(os.path.join(ASSETS, f"aisle{suffix}.jpg"), quality=78, optimize=True, progressive=True)
    print(f"aisle{suffix}: {out.width}x{out.height}")

# Blurred copy: detail doesn't matter once blurred, so keep it small.
small = im.resize((768, round(im.height * 768 / im.width)), Image.LANCZOS)
small.filter(ImageFilter.GaussianBlur(9)).save(os.path.join(ASSETS, "aisle-blur.webp"), quality=70, method=6)
print("aisle-blur: 768px")

# Foreground packs: plain, unbranded shapes in the aisle's cream/white/bamboo tones,
# drawn large and blurred as if very close to the camera. Right = mirror of left.
W, H = 520, 1000
layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(layer)
# Slightly deeper than the lit aisle: close objects sit in front of the light.
cream, white, bamboo, gold, glass = (222, 205, 180, 255), (236, 228, 215, 255), (176, 134, 84, 255), (184, 142, 82, 255), (214, 180, 110, 255)
d.rectangle((0, 760, W, 800), fill=(206, 188, 160, 255))           # shelf top
d.rectangle((0, 800, W, 1000), fill=(190, 160, 118, 255))           # shelf edge
d.rounded_rectangle((-60, 330, 150, 762), 40, fill=white)          # tall pump bottle
d.rectangle((25, 250, 70, 335), fill=gold)
d.rounded_rectangle((170, 560, 380, 762), 30, fill=cream)          # jar
d.rounded_rectangle((160, 515, 390, 565), 16, fill=bamboo)
d.rounded_rectangle((395, 470, 515, 762), 34, fill=glass)          # dropper bottle
d.rectangle((420, 395, 490, 472), fill=bamboo)
d.rounded_rectangle((433, 330, 477, 398), 20, fill=white)
layer = layer.filter(ImageFilter.GaussianBlur(11))
layer.save(os.path.join(ASSETS, "packs-left.webp"), quality=72, method=6)
layer.transpose(Image.FLIP_LEFT_RIGHT).save(os.path.join(ASSETS, "packs-right.webp"), quality=72, method=6)
print("packs-left/right: %dx%d" % (W, H))
