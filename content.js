/*
 * content.js: every word, number, link and file path on the site lives here.
 *
 * Editing rules:
 *   - Change only the text between the quotes.
 *   - Anything starting with "TODO:" (or left as "") shows on the page inside a
 *     dashed pink box, so you can see what is still unfinished.
 *   - Keep the commas and brackets as they are. If the page goes blank, a comma or
 *     quote is probably missing: open the browser console to see the line number.
 *
 * The site is five scenes: Aisle → Shelf → Front → Back → Fin.
 */
window.CONTENT = {
  meta: {
    title: "TODO: Page title (shown in the browser tab)",
    description: "TODO: One-line description for search results and link previews",
  },

  /* The small bar at the top that shows where you are and jumps between scenes. */
  steps: {
    label: "Scenes",
    aisle: "Aisle",
    shelf: "Shelf",
    front: "Front",
    back: "Back",
    fin: "Fin",
  },

  /* ---------- Scene 1: Aisle ---------- */
  aisle: {
    image: {
      webp: "assets/aisle.webp",
      webpSmall: "assets/aisle-800.webp",
      jpg: "assets/aisle.jpg",
      // Pixel size of the photo (tools/prep-aisle.py prints it).
      width: 1536,
      height: 1024,
      alt: "A softly lit beauty store aisle, with shelves of skincare bottles and jars on both sides",
      // Scroll version only: a blurred copy (depth of field) and two foreground
      // pack layers that slide out to the sides as the camera moves in.
      blur: "assets/aisle-blur.webp",
      packsLeft: "assets/packs-left.webp",
      packsRight: "assets/packs-right.webp",
      // Where the bottle stands in the photo, as fractions of its width and height
      // (0.5, 0.5 = dead centre). Currently the front edge of the round counter.
      spot: { x: 0.501, y: 0.459 },
      // How tall the bottle looks at that spot, as a fraction of the photo height.
      spotHeight: 0.085,
    },
    headline: "Karthik. Who?",
    subline: "Scroll to find out.",
    next: "Walk in",
  },

  /* ---------- Scene 2: Shelf ---------- */
  shelf: {
    line: "TODO: One line for the shelf scene",
    next: "Pick it up",
  },

  /* ---------- The bottle artwork (scenes 2–4) ---------- */
  bottle: {
    front: {
      webp: "assets/bottle-front.webp",
      png: "assets/bottle-front.png",
      // Same bottle "lit from within" (made by tools/prep-bottle.py); the page fades it in.
      lit: "assets/bottle-front-lit.webp",
      alt: "Karthik General Management Serum: a glass dropper bottle of pale golden serum with a bamboo collar and a white bulb",
    },
    back: {
      webp: "assets/bottle-back.webp",
      png: "assets/bottle-back.png",
      alt: "Back label of the bottle, listing Key Actives, Warnings and Directions for Use, with a barcode",
    },
    // Pixel size of the two images above. tools/prep-bottle.py updates these.
    width: 354,
    height: 852,
    // Text printed inside the "Inspired by" circle (shown on screens 768px and wider).
    brandStamp: "TODO: Brand name",
    // Set to true (or add ?debug to the page address) to outline every tappable
    // area and pin anchor on the bottle, so you can adjust the numbers below.
    debugHotspots: false,
  },

  /* ---------- Scenes 3 and 4: Front and Back ---------- */
  front: {
    heading: "TODO: Front scene heading",
    hint: "Tap a label to read it.",
    next: "Turn it around",
  },
  back: {
    heading: "TODO: Back scene heading",
    hint: "Tap a label to read it.",
    next: "Check out",
  },
  panel: {
    empty: "Choose a label on the bottle to read it here.",
    close: "Close",
  },

  /*
   * One entry per pin. Order here = keyboard order within each scene.
   *   side:    "front" or "back" of the bottle
   *   label:   the pin's visible label
   *   part:    the bottle part, shown above the section text
   *   pin:     where the pin's dot sits on the bottle (% of the image), and which
   *            side of the bottle its label goes ("left" or "right")
   *   hotspot: the larger tappable area on the bottle itself (% of the image;
   *            x, y = top-left corner; w, h = width, height)
   *   paragraphs / list: the section text; either can be left out
   */
  sections: [
    {
      id: "about",
      side: "front",
      label: "About me",
      part: "Dropper bulb",
      pin: { x: 42, y: 10, side: "left" },
      hotspot: { x: 35, y: 3, w: 30, h: 16.5 },
      title: "TODO: About me headline",
      paragraphs: ["TODO: A short paragraph about you"],
      list: [
        "EEE engineer",
        "TCS",
        "Synnefx Health Technologies",
        "MBA, MICA Ahmedabad (2024–26)",
        "Brand Manager at RSPL",
      ],
    },
    {
      id: "facts",
      side: "front",
      label: "Fun facts",
      part: "Bamboo collar",
      pin: { x: 72, y: 28, side: "right" },
      hotspot: { x: 22, y: 19.5, w: 56, h: 18 },
      title: "TODO: Fun facts headline",
      list: [
        "Manufactured in Thiruvananthapuram",
        "Batch MICA-26",
        "TODO: Fun fact",
      ],
    },
    {
      id: "passions",
      side: "front",
      label: "Passions",
      part: "The serum inside",
      pin: { x: 20, y: 44, side: "left" },
      hotspot: { x: 8, y: 38.5, w: 84, h: 8.5 },
      title: "TODO: Passions headline",
      paragraphs: ["TODO: Your passions"],
    },
    {
      id: "brand",
      side: "front",
      label: "Brand I relate to",
      part: "Inspired by",
      pin: { x: 63.5, y: 77.6, side: "right" },
      hotspot: { x: 34, y: 71, w: 32, h: 13.5 },
      title: "TODO: The L’Oréal brand I relate to, headline",
      paragraphs: ["TODO: Why this brand"],
    },
    {
      id: "beauty",
      side: "front",
      label: "What beauty means",
      part: "Glass",
      pin: { x: 20, y: 94, side: "left" },
      hotspot: { x: 8, y: 89, w: 84, h: 8 },
      title: "TODO: What beauty means to me, headline",
      paragraphs: ["TODO: What beauty means to you"],
    },
    {
      id: "strengths",
      side: "back",
      label: "Key Actives",
      part: "Key Actives: strengths",
      pin: { x: 11, y: 52.5, side: "left" },
      hotspot: { x: 8, y: 48.5, w: 73, h: 11.5 },
      title: "TODO: Strengths headline",
      list: ["TODO: Strength", "TODO: Strength", "TODO: Strength"],
    },
    {
      id: "weaknesses",
      side: "back",
      label: "Warnings",
      part: "Warnings: weaknesses",
      pin: { x: 11, y: 65, side: "left" },
      hotspot: { x: 8, y: 60.5, w: 73, h: 11.5 },
      title: "TODO: Weaknesses headline",
      list: ["TODO: Weakness, and what you do about it"],
    },
    {
      id: "directions",
      side: "back",
      label: "Directions for Use",
      part: "Directions for Use",
      pin: { x: 11, y: 79.5, side: "left" },
      hotspot: { x: 8, y: 72.5, w: 73, h: 11.5 },
      title: "TODO: Directions headline",
      paragraphs: ["TODO: How to get the best out of you"],
    },
    {
      id: "resume",
      side: "back",
      label: "Résumé (PDF)",
      part: "Barcode",
      pin: { x: 86.5, y: 49.5, side: "right" },
      hotspot: { x: 81, y: 51, w: 11, h: 34 },
      title: "TODO: Résumé headline",
      paragraphs: ["TODO: One line before the download link"],
      download: { href: "assets/resume.pdf", text: "Download résumé (PDF)" },
    },
  ],

  /* ---------- Scene 5: Fin ---------- */
  fin: {
    // Photo or video. To switch to a video, change type to "video", point src at
    // the .mp4 file, and (optionally) set poster to a still image.
    media: {
      type: "image",
      src: "assets/photo-placeholder.jpg",
      alt: "TODO: Describe your photo in one sentence",
      poster: "",
    },
    closingLine: "TODO: Closing line",
    resume: { href: "assets/resume.pdf", text: "Download résumé (PDF)" },
    emailLabel: "Email",
    email: "TODO: you@example.com",
    linkedinLabel: "LinkedIn",
    linkedin: "TODO: https://www.linkedin.com/in/your-handle",
    fineprint: "Manufactured in Thiruvananthapuram · Batch MICA-26",
    credits: "TODO: Credits",
    backToAisle: "Back to the aisle",
  },
};
