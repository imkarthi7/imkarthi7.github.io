# Karthik: Creative CV

A static site with no build step: `index.html`, `styles.css`, `main.js`, `content.js`, and `assets/`.
Open `index.html` directly in a browser, or serve the folder from anywhere (GitHub Pages included).

The page is five full-screen scenes, reached by normal scrolling, by each scene's button, or by the
step bar at the top:

1. **Aisle:** store photo, headline, the four shelf talkers. Button: "Walk in".
2. **Shelf:** the bottle glowing among blurred packs. Button: "Pick it up".
3. **Front:** the bottle front with labelled pins (About me, Fun facts, Passions, Brand I relate to,
   What beauty means). Button: "Turn it around".
4. **Back:** the back label with pins (Key Actives, Warnings, Directions for Use, Résumé). Button:
   "Check out".
5. **Fin:** photo, closing line, résumé download, email, LinkedIn, credits, "Back to the aisle".

Tapping a pin opens its text beside the bottle on screens 1024px and wider, or as a sheet over the
bottle on smaller screens (close it with ✕ or Esc). The sheet never covers the step bar or the scene's
button.

### The scroll camera (scenes 1–4)

On most screens, scenes 1–4 play as one pinned, scroll-driven "camera" move built with GSAP
ScrollTrigger (loaded from cdnjs, pinned to 3.15.0 with integrity hashes):

| Scroll (screen heights) | What happens |
|---|---|
| 0 – 1.2 | Camera pushes into the aisle; foreground packs slide out; shelf talkers fade in, then the card fades out |
| 1.2 – 2.5 | The bottle appears on the counter, glowing; the aisle blurs and fades while the bottle grows to full size |
| 2.5 – 3.5 | Front: holds; labels and panel appear |
| 3.5 – 4.1 | The bottle turns (squeeze and swap) to the back |
| 4.1 – 5.1 | Back: holds; labels appear. Then the page scrolls on into Fin normally |

The step bar jumps to each of those moments. While a label's panel is open the page doesn't scroll, so
nothing animates underneath it; close the panel (✕, Esc) to carry on.

It automatically falls back to five ordinary full-screen sections, with everything still readable and
clickable, when the visitor has **reduce motion** switched on, the screen is **under 360px** wide, or
GSAP **fails to load**. To preview the fallback, turn on "Reduce motion" in your OS accessibility
settings and reload.

## Editing content: `content.js` only

Every word, number, link and image path on the page lives in `content.js`. You never need to touch the
other files.

- Change only the text **between the quotes**. Keep commas, brackets and quote marks as they are.
- Any value that starts with `TODO:`, or is left empty (`""`), shows on the page inside a **dashed pink
  box**. When no pink boxes are left, the page is finished.
- If the page suddenly shows no content, a quote or comma is probably missing. Open the browser console
  (Chrome: View → Developer → JavaScript Console); it names the line in `content.js`.
- Apostrophes: either use a curly one (`’`), or keep straight ones inside double quotes (`"Karthik's"`).

What's where in `content.js`:

| Block | Controls |
|---|---|
| `meta` | Browser-tab title and search description |
| `steps` | The five labels in the step bar |
| `aisle` | Store photo, its size, alt text, blurred copy, foreground pack layers and the bottle's `spot`; headline, the four shelf talkers, "Walk in" |
| `shelf` | The one line above the shelf, "Pick it up" |
| `bottle` | Bottle image paths, alt text and pixel size, the brand name in the "Inspired by" circle, `debugHotspots` |
| `front`, `back` | Each bottle scene's heading, hint line and button |
| `panel` | The text panel's empty-state line and the close button's label (read aloud by screen readers) |
| `sections` | One entry per pin: its label, bottle part, pin position, tap area, title, text, list |
| `fin` | Photo or video, closing line, résumé link, email, LinkedIn, fine print, credits, "Back to the aisle" |

### Adjusting the pins and tap areas

Each entry in `sections` has two position settings, both in **percent of the bottle image**:

- `pin: { x, y, side }` is where the pin's dot sits, and whether its label goes to the `"left"` or
  `"right"` of the bottle. Keep dots off the printed words on the label.
- `hotspot: { x, y, w, h }` is the larger invisible area on the bottle itself that also opens the
  section (`x`/`y` is the top-left corner, `w`/`h` the size).

To see both, open the page with `?debug` on the end of the address (e.g. `index.html?debug`), or set
`debugHotspots: true`. Tap areas get a pink outline with their name, and pin dots turn pink. Nudge the
numbers, save, and reload.

## Swapping the photo (or switching to video)

The photo lives in the Fin scene: `fin.media` in `content.js`.

**Photo:** put your file in `assets/` (e.g. `assets/karthik.jpg`, about 800×1000px, portrait, under
300 KB). Then set:

```js
media: { type: "image", src: "assets/karthik.jpg", alt: "Portrait of Karthik", poster: "" },
```

The pink box disappears once `src` and `alt` are both filled in.

**Video:** put an `.mp4` in `assets/` (H.264, ideally under 8 MB and under 45 seconds). Optionally add a
still image for the poster. Then change the same line:

```js
media: { type: "video", src: "assets/karthik.mp4", alt: "Karthik introducing himself", poster: "assets/karthik-poster.jpg" },
```

The slot is the same size either way (4:5 portrait), so the layout doesn't change.

## Swapping the résumé

Replace `assets/resume.pdf` with your real résumé, **keeping the same file name**. If you use a
different name, update both `download.href` in the `resume` section and `fin.resume.href`.

## Replacing the aisle photo

Save the new image as `assets/aisle.png`, then run this from the project folder (needs Pillow:
`pip3 install pillow`):

```bash
python3 tools/prep-aisle.py
```

It writes `aisle.webp` / `aisle.jpg` (full size), `aisle-800.webp` / `aisle-800.jpg` (phones),
`aisle-blur.webp` (the depth-of-field copy) and `packs-left.webp` / `packs-right.webp` (foreground
layers), and prints the photo's size. Then, in `content.js` under `aisle.image`:

- set `width` and `height` to the printed size;
- set `spot` to where the bottle should stand, as fractions of the photo (`x: 0.5, y: 0.5` is the dead
  centre; measure the point where the bottle's base should touch the surface);
- adjust `spotHeight` (the bottle's height at that spot as a fraction of the photo height) until it looks
  in scale with the products around it.

Don't upload `aisle.png` itself.

## Re-cutting the bottle images (for example, a higher-resolution render)

The bottle images are exported at the source's **native resolution, never enlarged**. The page caps the
displayed bottle at half its pixel size, so it stays sharp on 2x screens. Right now the images are
354×852, so the bottle shows at most 177×426 CSS px. A 1400px-tall render would allow 700px.

To regenerate from a new side-by-side image (front on the left, back on the right, same composition):

1. Save it as `assets/bottle-pair.png`.
2. From the project folder, run:
   ```bash
   python3 tools/prep-bottle.py
   ```
   This needs Pillow, NumPy and SciPy (`pip3 install pillow numpy scipy`). It rewrites
   `assets/bottle-front/back.webp` and `.png`, and updates `bottle.width`/`height` in `content.js`.
3. Open the page with `?debug` and check that the pins and tap areas still line up.
4. Don't upload `bottle-pair.png` to GitHub; the site doesn't use it.

## Previewing locally

Double-clicking `index.html` works for a quick look. To preview the site as GitHub Pages will serve it,
run this from the project folder, then open http://localhost:8123 (press Ctrl+C to stop it):

```bash
python3 -m http.server 8123
```

## Deploying to GitHub Pages

1. Sign in at github.com and create a **new repository** (the "+" menu → New repository), for example
   `loreal-cv`. Make it **Public** (Pages on free accounts needs a public repo) and leave "Add a README"
   unticked.
2. Upload the site. The simplest way is in the browser: on the new repo's page, click
   **uploading an existing file**. Drag in `index.html`, `styles.css`, `main.js`, `content.js`,
   `README.md` and the `assets` folder, but leave out the source images `aisle.png` and
   `bottle-pair.png` (if present). Then click **Commit changes**. (The `tools` folder is optional.)
3. Open the repo's **Settings → Pages**. Under "Build and deployment", set **Source** to
   "Deploy from a branch", **Branch** to `main`, and **folder** to `/ (root)`. Click **Save**.
4. Wait about a minute and refresh that Settings page. It will show
   `https://<your-username>.github.io/loreal-cv/`. Open it and check the site on your phone too.
5. To update later, edit `content.js` locally, then upload it again the same way (**Add file →
   Upload files**, then commit). Pages redeploys within a minute or so.

Before sharing the link, search `content.js` for `TODO:` and make sure nothing is left.
