"""Cut the front and back bottle views out of one side-by-side studio image.

Usage (from the project folder):
    python3 tools/prep-bottle.py                  # uses assets/bottle-pair.png
    python3 tools/prep-bottle.py path/to/pair.png

Writes assets/bottle-front.{webp,png} and assets/bottle-back.{webp,png} at the
source's native resolution (never enlarged) on identical, bottom-aligned canvases,
then updates bottle.width/height in content.js to match.

Needs Python 3 with Pillow, NumPy and SciPy. All positions below are fractions of
the image size, so a higher-resolution render of the same composition works as is.
"""
import os
import re
import sys

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ASSETS, "bottle-pair.png")
if not os.path.exists(SRC):
    sys.exit(f"Source image not found: {SRC}")

img = np.array(Image.open(SRC).convert("RGB")).astype(np.float64)
H, W, _ = img.shape
S = H / 1024  # scale of pixel-sized parameters, tuned on a 1024px-tall source
yy, xx = np.mgrid[0:H, 0:W]
xn, yn = xx / W, yy / H
print(f"source {W}x{H}")

# --- background: cubic surface fitted to the backdrop well away from the bottles
bg_mask = (xn < 0.228) | ((xn > 0.4655) & (xn < 0.534)) | (xn > 0.7715)
def feats(x, y):
    return np.stack([x**i * y**j for i in range(4) for j in range(4 - i)], -1)
F = feats(xn[bg_mask], yn[bg_mask])
Fall = feats(xn, yn).reshape(-1, F.shape[1])
bg = np.zeros_like(img)
for c in range(3):
    coef, *_ = np.linalg.lstsq(F, img[..., c][bg_mask], rcond=None)
    bg[..., c] = (Fall @ coef).reshape(H, W)
dist = np.abs(img - bg).max(-1)

def rows(a, b):
    return range(int(a * H), int(b * H))

def raw_profile(x0, x1, thr=32):
    band = (xn >= x0) & (xn < x1)
    m = (dist > thr) & band
    m = ndi.binary_opening(m, iterations=max(1, round(2 * S)))
    lab, n = ndi.label(m)
    m = lab == (np.argmax(ndi.sum(m, lab, range(1, n + 1))) + 1)
    # Axis from the bamboo collar, which has strong contrast on both sides.
    cx = np.median([(np.where(m[y])[0].min() + np.where(m[y])[0].max()) / 2
                    for y in rows(0.273, 0.371) if m[y].any()])
    # The bottle is symmetric and convex along every row: keep the larger
    # half-width, which recovers the low-contrast (lit) side from the other one.
    half = np.zeros(H)
    for y in range(H):
        r = np.where(m[y])[0]
        if len(r):
            half[y] = max(cx - r.min(), r.max() - cx)
    return cx, ndi.median_filter(half, size=int(9 * S) | 1)

fcx, fhalf = raw_profile(0.231, 0.462)
bcx, bhalf = raw_profile(0.535, 0.768)

# Clean the front profile (the better-lit view): nothing wider than the body, and
# the base ends where the glass ends, not where the floor glare does.
body = np.median(fhalf[int(0.508 * H):int(0.742 * H)])
fhalf = np.minimum(fhalf, body)
base = np.where(fhalf > 0.9 * body)[0].max()
fhalf[base + 1:] = 0
fhalf = ndi.gaussian_filter1d(fhalf, 1.5 * S)
base -= round(0.0186 * H)
rise = round(0.0215 * H)

# Same bottle in both views: reuse the front outline for the back, shifted
# vertically to line up the collar.
span = rows(0.244, 0.41)
lim = round(0.015 * H)
dy = min(range(-lim, lim + 1), key=lambda d: np.abs(np.roll(fhalf, d)[span] - bhalf[span]).sum())
print(f"front axis {fcx:.0f}, back axis {bcx:.0f}, back offset {dy}px")

def mask_from(cx, half, base):
    out = np.zeros((H, W), bool)
    for y in np.where(half > 2)[0]:
        out[y, int(round(cx - half[y])):int(round(cx + half[y])) + 1] = True
    # The glass base is a cylinder seen slightly from above: its bottom edge is a
    # half-ellipse, lowest at the centre and rising to the corners.
    u = np.clip(np.abs(xx - cx) / (half.max() + 1), 0, 1)
    return out & (yy <= (base - rise) + rise * np.sqrt(1 - u**2))

masks = {"front": mask_from(fcx, fhalf, base), "back": mask_from(bcx, np.roll(fhalf, dy), base + dy)}

crops = {}
for name, m in masks.items():
    a = np.array(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2 * S))) / 255
    a[~ndi.binary_dilation(m, iterations=max(1, round(3 * S)))] = 0
    rgba = np.dstack([img, a * 255]).clip(0, 255).astype(np.uint8)
    ys, xs = np.where(a > 0)
    crops[name] = Image.fromarray(rgba).crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))

pad = round(24 * S)
CW = max(c.width for c in crops.values()) + 2 * pad
CH = max(c.height for c in crops.values()) + 2 * pad
for name, c in crops.items():
    canvas = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
    canvas.paste(c, ((CW - c.width) // 2, CH - pad - c.height), c)
    canvas.save(os.path.join(ASSETS, f"bottle-{name}.webp"), quality=90, method=6)
    canvas.save(os.path.join(ASSETS, f"bottle-{name}.png"), optimize=True)
print(f"wrote bottle-front/back .webp + .png at {CW}x{CH} (native, not enlarged)")

# "Lit from within" version of the front, baked so the page only cross-fades two
# images (cheap) instead of blending, masking and filtering live (expensive on phones).
# Light = the bottle screened with a brighter, warmer copy of itself, concentrated on
# the liquid above and below the label.
front = np.array(Image.open(os.path.join(ASSETS, "bottle-front.png")).convert("RGBA")).astype(np.float64) / 255
rgb, alpha = front[..., :3], front[..., 3:]
grey = rgb.mean(-1, keepdims=True)
bright = np.clip((grey + (rgb - grey) * 1.35) * 1.08, 0, 1)            # saturate + brighten
screen = 1 - (1 - rgb) * (1 - bright)
yy2, xx2 = np.mgrid[0:CH, 0:CW]
def ellipse(cx, cy, rx, ry, inner, peak):
    d = np.sqrt(((xx2 / CW - cx) / rx) ** 2 + ((yy2 / CH - cy) / ry) ** 2)
    return peak * np.clip((1 - d) / (1 - inner), 0, 1)
m = np.zeros((CH, CW))
for layer in (ellipse(0.5, 0.425, 0.48, 0.06, 0.3, 1), ellipse(0.5, 0.925, 0.48, 0.05, 0.3, 1), ellipse(0.5, 0.66, 0.30, 0.22, 0, 0.35)):
    m = m + layer * (1 - m)
m = (m * 0.85)[..., None]
lit = np.concatenate([rgb * (1 - m) + screen * m, alpha], -1)
Image.fromarray((lit * 255).round().astype(np.uint8)).save(os.path.join(ASSETS, "bottle-front-lit.webp"), quality=90, method=6)
print("wrote bottle-front-lit.webp")

# Keep content.js in step: the page sizes and caps the bottle from these numbers.
cpath = os.path.join(ROOT, "content.js")
src = open(cpath, encoding="utf-8").read()
# Only the bottle's size: anchored to its comment so other width/height lines
# (e.g. the aisle photo's) are never touched.
new = re.sub(r"(Pixel size of the two images above[^\n]*\n\s*width: )\d+(,\n\s*height: )\d+",
             rf"\g<1>{CW}\g<2>{CH}", src, count=1)
if new != src:
    open(cpath, "w", encoding="utf-8").write(new)
    print(f"updated content.js bottle size to {CW}x{CH}")
