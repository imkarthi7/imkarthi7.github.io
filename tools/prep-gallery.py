"""Make web copies of gallery photos for the Fin collage.

Usage (from the project folder):
    python3 tools/prep-gallery.py assets/photos/IMG_5595.JPG assets/photos/IMG_0017.heic ...

For each photo it writes, into assets/gallery/:
    <name>.webp        max 1200px on the long side
    <name>-480.webp    max 480px (what the collage actually shows; ~150px on screen at 2x-3x)
Both are rotated upright and saved WITHOUT any metadata (no EXIF, no GPS location).
HEIC files are converted first with macOS's built-in `sips`.

It then prints a ready-to-paste `gallery` entry for content.js (write a real alt text).
The originals in assets/photos/ are never published (see .gitignore).
Needs Pillow.
"""
import os
import re
import subprocess
import sys
import tempfile

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "gallery")
os.makedirs(OUT, exist_ok=True)

if len(sys.argv) < 2:
    sys.exit(__doc__)

for src in sys.argv[1:]:
    path = src
    if src.lower().endswith(".heic"):
        path = os.path.join(tempfile.mkdtemp(), "photo.jpg")
        subprocess.run(["sips", "-s", "format", "jpeg", src, "--out", path], check=True, capture_output=True)
    # Short, stable, URL-safe name from the original file name.
    stem = os.path.splitext(os.path.basename(src))[0].split(".")[0]
    name = re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-")[:24].strip("-") or "photo"

    im = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
    for limit, suffix in ((1200, ""), (480, "-480")):
        copy = im.copy()
        copy.thumbnail((limit, limit), Image.LANCZOS)
        # No exif= argument: nothing from the original metadata is written.
        copy.save(os.path.join(OUT, f"{name}{suffix}.webp"), quality=80, method=6)
    big = Image.open(os.path.join(OUT, f"{name}.webp"))
    print(f'      {{ src: "assets/gallery/{name}.webp", thumb: "assets/gallery/{name}-480.webp", '
          f'width: {big.width}, height: {big.height}, alt: "TODO: describe this photo" }},')
