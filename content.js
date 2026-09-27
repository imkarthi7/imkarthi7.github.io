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
    title: "Karthik wants to say something",
    description: "Creative CV",
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
    brandStamp: "L'Oréal Paris",
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
      pin: { x: 67, y: 77.6, side: "right" },
      hotspot: { x: 34, y: 71, w: 32, h: 13.5 },
      title: "L'Oréal Paris",
      // Optional photo at the top of the panel (made with tools/prep-gallery.py).
      media: {
        src: "assets/gallery/loreal-products.webp",
        thumb: "assets/gallery/loreal-products-480.webp",
        width: 1024,
        height: 768,
        alt: "My own L'Oréal Paris products: Hyaluron Pure shampoo, Extraordinary Oil serum, Hyaluron Moisture conditioner",
      },
      paragraphs: [
        "My entry into L'Oréal Paris was the Extraordinary Oil serum. A friend let me try it, and I liked it instantly: my hair felt smooth, never heavy.",
        "It simply delivered. The quality was great, it did exactly what it promised, and it felt worth every rupee. That made me curious, and slowly one bottle became a shelf of them.",
        "That's why I relate to it. It earned my trust by delivering, not by claiming, and that's how I'd like to earn yours. It's also why my own bottle carries an \"Inspired by\" stamp.",
      ],
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
      src: "assets/karthik.jpg",
      alt: "How you'll find me always",
      poster: "",
    },
    closingLine: "TODO: Closing line",
    resume: { href: "assets/resume.pdf", text: "Download résumé (PDF)" },
    emailLabel: "Email",
    email: "imkarthi7@gmail.com",
    linkedinLabel: "LinkedIn",
    linkedin: "https://www.linkedin.com/in/karthik-jeyakumar/",
    fineprint: "Batch MICA-26",
    credits: "Photos: friends and family",
    backToAisle: "Back to the aisle",

    /*
     * Photo wall: every photo here fills the Fin page around the content (on
     * phones, a grid below it). Order runs left to right, top to bottom.
     * Make each photo with tools/prep-gallery.py, which strips location data and
     * prints the line to paste here. `caption` is optional (a few words, shown on
     * the polaroid's bottom edge).
     */
    galleryLabel: "Photos",
    // Phones show only the first few photos of the list (a 3-column grid, so
    // multiples of 3 look tidiest). Tablets and desktops show them all.
    galleryPhoneCount: 9,
    gallery: [
      { src: "assets/gallery/285818b6-6593-444a-ba24.webp", thumb: "assets/gallery/285818b6-6593-444a-ba24-480.webp", width: 1200, height: 675, alt: "Selfie in a stockroom stacked with cartons and sacks" },
      { src: "assets/gallery/01e66c5e-a9a9-4d03-94d4.webp", thumb: "assets/gallery/01e66c5e-a9a9-4d03-94d4-480.webp", width: 1200, height: 900, alt: "In a red stole with a friend at an evening graduation" },
      { src: "assets/gallery/img-9411.webp", thumb: "assets/gallery/img-9411-480.webp", width: 1200, height: 900, alt: "With two friends beside the Cricket World Cup trophy at its trophy-tour stop" },
      { src: "assets/gallery/20180410162611-img-5119.webp", thumb: "assets/gallery/20180410162611-img-5119-480.webp", width: 1200, height: 800, alt: "A row of classmates in matching shirts on a campus lawn" },
      { src: "assets/gallery/img-2953.webp", thumb: "assets/gallery/img-2953-480.webp", width: 900, height: 1200, alt: "Friends lying on the grass in a circle, heads together" },
      { src: "assets/gallery/img-5595.webp", thumb: "assets/gallery/img-5595-480.webp", width: 1200, height: 800, alt: "Chatting with a man in a woollen cap on a street corner" },
      { src: "assets/gallery/52d50981-a085-4b00-ac35.webp", thumb: "assets/gallery/52d50981-a085-4b00-ac35-480.webp", width: 1200, height: 900, alt: "A big group of friends crowded onto a sofa" },
      { src: "assets/gallery/5c769503-3cf2-44d9-86a4.webp", thumb: "assets/gallery/5c769503-3cf2-44d9-86a4-480.webp", width: 1200, height: 900, alt: "Standing by a wall painted with the words 'What if it all works out'" },
      { src: "assets/gallery/99fb6e7a-c619-47ee-8654.webp", thumb: "assets/gallery/99fb6e7a-c619-47ee-8654-480.webp", width: 1200, height: 900, alt: "A cricket team photo on a floodlit turf, bats in hand" },
      { src: "assets/gallery/img-9691.webp", thumb: "assets/gallery/img-9691-480.webp", width: 1200, height: 900, alt: "Sitting on stone steps by the river, next to sleeping dogs and a cow" },
      { src: "assets/gallery/img-5377.webp", thumb: "assets/gallery/img-5377-480.webp", width: 900, height: 1200, alt: "With family outside a building" },
      { src: "assets/gallery/20190928163936-img-0284.webp", thumb: "assets/gallery/20190928163936-img-0284-480.webp", width: 1200, height: 800, alt: "In a cap and striped T-shirt, hand to mouth, outdoors" },
      { src: "assets/gallery/dez-2684.webp", thumb: "assets/gallery/dez-2684-480.webp", width: 1200, height: 800, alt: "Friends in red and white dancing in a hall" },
      { src: "assets/gallery/img-0959.webp", thumb: "assets/gallery/img-0959-480.webp", width: 1200, height: 900, alt: "Standing by a lake in a white shirt" },
      { src: "assets/gallery/img-0749.webp", thumb: "assets/gallery/img-0749-480.webp", width: 900, height: 1200, alt: "Friends dressed in black under a big tree" },
      { src: "assets/gallery/20240505-150300.webp", thumb: "assets/gallery/20240505-150300-480.webp", width: 1200, height: 675, alt: "Four friends sitting on a stone ledge under an old archway" },
      { src: "assets/gallery/img-0070.webp", thumb: "assets/gallery/img-0070-480.webp", width: 1200, height: 900, alt: "A group selfie outdoors" },
      { src: "assets/gallery/6a7c570b-36d1-4e2c-b56a.webp", thumb: "assets/gallery/6a7c570b-36d1-4e2c-b56a-480.webp", width: 1200, height: 800, alt: "Friends in festive clothes in front of a painted brick mural" },
      { src: "assets/gallery/img-9272.webp", thumb: "assets/gallery/img-9272-480.webp", width: 900, height: 1200, alt: "With a friend in yellow against a brick wall" },
      { src: "assets/gallery/2026-06-28-09.webp", thumb: "assets/gallery/2026-06-28-09-480.webp", width: 1200, height: 696, alt: "Two cricketers in India kit, one wearing a helmet" },
      { src: "assets/gallery/img-3358.webp", thumb: "assets/gallery/img-3358-480.webp", width: 1200, height: 800, alt: "A group at a hilltop viewpoint with hills behind" },
      { src: "assets/gallery/img-7008.webp", thumb: "assets/gallery/img-7008-480.webp", width: 1200, height: 900, alt: "Friends laughing together in a hallway" },
      { src: "assets/gallery/30364e22-2562-4167-9fb3.webp", thumb: "assets/gallery/30364e22-2562-4167-9fb3-480.webp", width: 1200, height: 899, alt: "Sitting on the front steps of a house in a white shirt and mundu" },
      { src: "assets/gallery/img-1223.webp", thumb: "assets/gallery/img-1223-480.webp", width: 1169, height: 553, alt: "Friends posing in a misty forest" },
      { src: "assets/gallery/img-0017.webp", thumb: "assets/gallery/img-0017-480.webp", width: 1200, height: 900, alt: "Selfie with a friend" },
      { src: "assets/gallery/img-9934.webp", thumb: "assets/gallery/img-9934-480.webp", width: 900, height: 1200, alt: "Selfie in a police-style cap at a fair" },
    ],
  },
};
