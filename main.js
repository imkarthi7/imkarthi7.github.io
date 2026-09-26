/* Renders content.js into the five scenes and runs the interactions. No copy lives here. */
(function () {
  "use strict";

  var C = window.CONTENT;
  if (!C) {
    console.error("content.js did not load, or has a syntax error. Check the console for its line number.");
    return;
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sideBySide = window.matchMedia("(min-width: 1024px)");
  var debug = C.bottle.debugHotspots || /[?&]debug\b/.test(location.search);
  var SCENES = ["aisle", "shelf", "front", "back", "fin"];

  // Scroll camera for scenes 1–4: on unless the visitor prefers reduced motion or
  // the screen is under 360px wide, and only if GSAP loads (checked in start()).
  // The class goes on now so the first paint already matches the camera layout.
  var cine = !reduceMotion && window.innerWidth >= 360;
  if (cine) document.documentElement.classList.add("is-cine");
  var cineApi = null; // set by initCine(): { scrollFor(id) }

  /* ---------- helpers ---------- */

  function get(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, C);
  }

  function isTodo(v) {
    return v == null || String(v).trim() === "" || /^TODO:/i.test(String(v).trim());
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) fill(n, text);
    return n;
  }

  // Writes text into a node; unfinished values get the dashed pink box.
  function fill(node, value, path) {
    if (isTodo(value)) {
      node.classList.add("todo");
      node.textContent = value && String(value).trim() ? value : "Empty: " + (path || "value");
    } else {
      node.classList.remove("todo");
      node.textContent = value;
    }
    return node;
  }

  // A link whose address is still a TODO renders as plain marked text, not a dead link.
  function link(label, href, cls) {
    if (isTodo(href)) {
      var span = el("span", cls);
      span.appendChild(document.createTextNode(label + " "));
      span.appendChild(fill(el("span"), href));
      return span;
    }
    var a = el("a", cls, label);
    a.href = href;
    return a;
  }

  function picture(face, alt) {
    var p = document.createElement("picture");
    var s = document.createElement("source");
    s.srcset = face.webp;
    s.type = "image/webp";
    var img = document.createElement("img");
    img.src = face.png;
    img.alt = alt;
    img.width = C.bottle.width;
    img.height = C.bottle.height;
    img.decoding = "async";
    p.appendChild(s);
    p.appendChild(img);
    return p;
  }

  function goTo(id) {
    var target = document.getElementById(id);
    if (!target) return;
    closeAllPanels(false);
    if (cineApi) {
      // Scenes 1–4 share one pinned timeline: scroll to that scene's moment in it,
      // then move focus once the scene is on screen (hidden elements can't take focus).
      window.scrollTo({ top: cineApi.scrollFor(id), behavior: "smooth" });
      var done = false;
      var land = function () {
        if (done) return;
        done = true;
        target.focus({ preventScroll: true });
      };
      window.addEventListener("scrollend", land, { once: true });
      setTimeout(land, 1500);
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      target.focus({ preventScroll: true });
    }
    if (history.replaceState) history.replaceState(null, "", "#" + id);
  }

  // While a panel is open in the scroll version, the page doesn't scroll, so no
  // scroll animation can run underneath it.
  function lockScroll(on) {
    document.documentElement.classList.toggle("is-locked", on);
  }
  document.addEventListener("touchmove", function (e) {
    if (document.documentElement.classList.contains("is-locked") && !e.target.closest(".panel")) e.preventDefault();
  }, { passive: false });

  /* ---------- page text ---------- */

  document.title = C.meta.title;
  if (!isTodo(C.meta.description)) {
    document.querySelector('meta[name="description"]').content = C.meta.description;
  }
  document.querySelectorAll("[data-text]").forEach(function (n) {
    var path = n.getAttribute("data-text");
    fill(n, get(path), path);
  });

  /* ---------- step bar ---------- */

  var stepsNav = document.querySelector("[data-steps]");
  stepsNav.setAttribute("aria-label", C.steps.label);
  var stepList = el("ol", "steps__list");
  var stepLinks = {};
  SCENES.forEach(function (id) {
    var li = el("li");
    var a = el("a", "steps__link", C.steps[id]);
    a.href = "#" + id;
    li.appendChild(a);
    stepList.appendChild(li);
    stepLinks[id] = a;
  });
  stepsNav.appendChild(stepList);

  // Every in-page link (step bar, "next" buttons) scrolls smoothly and moves
  // keyboard focus to the scene it lands on.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute("href").slice(1);
    if (SCENES.indexOf(id) === -1) return;
    e.preventDefault();
    goTo(id);
  });

  var currentStep = null;
  function setCurrent(id) {
    if (id === currentStep) return; // runs on every scroll event: only touch the DOM on change
    currentStep = id;
    SCENES.forEach(function (k) {
      if (k === id) stepLinks[k].setAttribute("aria-current", "step");
      else stepLinks[k].removeAttribute("aria-current");
    });
  }
  setCurrent("aisle");

  /* ---------- scene 1: aisle ---------- */

  var aisleImg = C.aisle.image;
  var aislePic = document.querySelector("[data-aisle-image]");
  var aisleSrc = document.createElement("source");
  aisleSrc.type = "image/webp";
  aisleSrc.srcset = aisleImg.webpSmall + " 800w, " + aisleImg.webp + " 1536w";
  aisleSrc.sizes = "100vw";
  var aisleEl = document.createElement("img");
  aisleEl.src = aisleImg.jpg;
  aisleEl.alt = aisleImg.alt;
  aisleEl.setAttribute("fetchpriority", "high");
  aislePic.appendChild(aisleSrc);
  aislePic.appendChild(aisleEl);

  var talkerList = document.querySelector("[data-talkers]");
  C.aisle.talkers.forEach(function (t) {
    var li = el("li", "talker");
    li.appendChild(fill(el("span", "talker__label"), t.label));
    li.appendChild(fill(el("span", "talker__value"), t.value));
    talkerList.appendChild(li);
  });

  /* ---------- bottles ---------- */

  // Size tokens: aspect ratio, and a cap at half the native pixel size so the
  // bottle is never shown softer than a 2x screen can resolve.
  function sizeBottle(node) {
    node.style.setProperty("--ratio", C.bottle.width + " / " + C.bottle.height);
    node.style.setProperty("--ar", String(C.bottle.width / C.bottle.height));
    node.style.setProperty("--max-w", C.bottle.width / 2 + "px");
    node.style.setProperty("--max-h", C.bottle.height / 2 + "px");
  }

  // The pre-rendered "lit from within" copy, faded in over the bottle.
  function litBottle(cls) {
    var img = document.createElement("img");
    img.className = cls;
    img.src = C.bottle.front.lit;
    img.alt = "";
    img.decoding = "async";
    img.setAttribute("aria-hidden", "true");
    return img;
  }

  function stamp() {
    var s = el("span", "bottle__stamp");
    s.setAttribute("aria-hidden", "true");
    s.appendChild(fill(el("span", "bottle__stamp-text"), C.bottle.brandStamp, "bottle.brandStamp"));
    return s;
  }

  // Scene 2: front face with the inner-light layer.
  var shelfBottle = document.querySelector('[data-bottle="shelf"]');
  sizeBottle(shelfBottle);
  shelfBottle.appendChild(picture(C.bottle.front, C.bottle.front.alt));
  shelfBottle.appendChild(litBottle("bottle__light"));
  shelfBottle.appendChild(stamp());

  /* ---------- scenes 3 and 4: pinned bottles + panel ---------- */

  var scenes = {};

  ["front", "back"].forEach(function (side) {
    var bottle = document.querySelector('[data-bottle="' + side + '"]');
    var panel = document.querySelector('[data-panel="' + side + '"]');
    panel.id = "panel-" + side;
    sizeBottle(bottle);
    if (debug) bottle.classList.add("is-debug");
    bottle.appendChild(picture(C.bottle[side], C.bottle[side].alt));
    if (side === "front") bottle.appendChild(stamp());

    var state = { panel: panel, pins: {}, areas: {}, current: null, opener: null };
    scenes[side] = state;

    C.sections.filter(function (s) { return s.side === side; }).forEach(function (sec) {
      // The tappable area on the bottle itself: a mouse/touch convenience that
      // duplicates the pin, so it stays out of the tab order and the a11y tree.
      var h = sec.hotspot;
      var area = el("button", "hotspot");
      area.type = "button";
      area.tabIndex = -1;
      area.setAttribute("aria-hidden", "true");
      area.style.left = h.x + "%";
      area.style.top = h.y + "%";
      area.style.width = h.w + "%";
      area.style.height = h.h + "%";
      if (debug) area.appendChild(el("span", "hotspot__name", sec.part));
      area.addEventListener("click", function () { select(side, sec.id, area); });
      bottle.appendChild(area);
      state.areas[sec.id] = area;
    });

    // Pins after the areas so they sit on top; keyboard order follows content.js.
    C.sections.filter(function (s) { return s.side === side; }).forEach(function (sec) {
      var p = sec.pin;
      var pin = el("button", "pin pin--" + (p.side === "right" ? "right" : "left"));
      pin.type = "button";
      pin.style.setProperty("--x", p.x);
      pin.style.setProperty("--y", p.y);
      pin.setAttribute("aria-controls", panel.id);
      pin.setAttribute("aria-pressed", "false");
      pin.appendChild(fill(el("span", "pin__label"), sec.label));
      var line = el("span", "pin__line");
      line.setAttribute("aria-hidden", "true");
      pin.appendChild(line);
      var dot = el("span", "pin__dot");
      dot.setAttribute("aria-hidden", "true");
      pin.appendChild(dot);
      pin.addEventListener("click", function () { select(side, sec.id, pin); });
      bottle.appendChild(pin);
      state.pins[sec.id] = pin;
    });

    renderEmpty(side);
  });

  function renderEmpty(side) {
    var panel = scenes[side].panel;
    panel.textContent = "";
    panel.classList.remove("is-open");
    panel.appendChild(fill(el("p", "panel__empty"), C.panel.empty));
  }

  function renderPanel(side, sec) {
    var panel = scenes[side].panel;
    panel.textContent = "";

    var close = el("button", "panel__close");
    close.type = "button";
    close.setAttribute("aria-label", C.panel.close);
    close.addEventListener("click", function () { closeSheet(side); });
    panel.appendChild(close);

    panel.appendChild(fill(el("p", "panel__part"), sec.part));
    var title = fill(el("h3", "panel__title"), sec.title);
    title.tabIndex = -1;
    panel.appendChild(title);

    (sec.paragraphs || []).forEach(function (t) {
      panel.appendChild(fill(el("p", "panel__text"), t));
    });
    if (sec.list && sec.list.length) {
      var ul = el("ul", "panel__list");
      sec.list.forEach(function (t) { ul.appendChild(fill(el("li"), t)); });
      panel.appendChild(ul);
    }
    if (sec.download) {
      var a = link(sec.download.text, sec.download.href, "button panel__download");
      if (a.tagName === "A") a.setAttribute("download", "");
      panel.appendChild(a);
    }
    return title;
  }

  function select(side, id, opener) {
    var state = scenes[side];
    var sec = C.sections.filter(function (s) { return s.id === id; })[0];
    if (!sec) return;
    state.current = id;
    state.opener = opener;
    Object.keys(state.pins).forEach(function (k) {
      state.pins[k].setAttribute("aria-pressed", String(k === id));
      state.pins[k].classList.toggle("is-active", k === id);
    });
    var title = renderPanel(side, sec);
    state.panel.classList.add("is-open");
    if (cineApi) lockScroll(true);
    // Bottom sheet (narrow screens): move focus into it so keyboard and screen
    // reader users land on the text. Side panel: aria-live announces it.
    if (!sideBySide.matches) title.focus({ preventScroll: true });
  }

  function closeSheet(side, refocus) {
    var state = scenes[side];
    Object.keys(state.pins).forEach(function (k) {
      state.pins[k].setAttribute("aria-pressed", "false");
      state.pins[k].classList.remove("is-active");
    });
    renderEmpty(side);
    lockScroll(false);
    var back = state.opener && state.opener.classList.contains("pin") ? state.opener : state.pins[Object.keys(state.pins)[0]];
    state.current = null;
    if (back && refocus !== false) back.focus({ preventScroll: true });
  }

  function closeAllPanels(refocus) {
    ["front", "back"].forEach(function (side) {
      if (scenes[side].panel.classList.contains("is-open")) closeSheet(side, refocus);
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || (sideBySide.matches && !cineApi)) return;
    closeAllPanels();
  });

  /* ---------- scene 5: fin ---------- */

  var f = C.fin;
  var fig = document.querySelector("[data-fin-media]");
  var m = f.media;
  var node = null;
  if (m.type === "video" && !isTodo(m.src)) {
    node = document.createElement("video");
    node.src = m.src;
    if (m.poster) node.poster = m.poster;
    node.controls = true;
    node.playsInline = true;
    node.preload = "metadata";
    node.setAttribute("aria-label", m.alt);
  } else if (!isTodo(m.src)) {
    node = document.createElement("img");
    node.src = m.src;
    node.alt = m.alt;
    node.loading = "lazy";
  }
  if (node) fig.appendChild(node);
  if (!node || isTodo(m.alt)) {
    fig.classList.add("todo");
    fig.appendChild(fill(el("figcaption"), isTodo(m.src) ? m.src : m.alt, "fin.media"));
  }

  var resumeSlot = document.querySelector("[data-fin-resume]");
  var resume = link(f.resume.text, f.resume.href, "button");
  if (resume.tagName === "A") resume.setAttribute("download", "");
  resumeSlot.replaceWith(resume);

  var links = document.querySelector("[data-fin-links]");
  [
    [f.emailLabel, isTodo(f.email) ? f.email : "mailto:" + f.email, f.email],
    [f.linkedinLabel, f.linkedin],
  ].forEach(function (row) {
    var li = el("li");
    var n = link(row[0], row[1]);
    if (row[2] && n.tagName === "A") n.textContent = row[2];
    li.appendChild(n);
    links.appendChild(li);
  });

  /* ---------- observers: current step + one fade-in per scene ---------- */

  var sceneEls = SCENES.map(function (id) { return document.getElementById(id); });

  function startSceneSteps() {
    if (!("IntersectionObserver" in window)) return;
    // The scene crossing the middle of the screen is the current one.
    var stepIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setCurrent(en.target.id); });
    }, { rootMargin: "-50% 0px -50% 0px" });
    sceneEls.forEach(function (s) { stepIO.observe(s); });
  }

  // Progressive enhancement: scenes are visible by default and only hidden once we
  // know we can reveal them again. A scroll check backs up the observer.
  // Runs after load, once the browser has jumped to a #scene link or restored the
  // scroll position on reload, so only scenes still below the screen are hidden.
  function setUpReveal(targets) {
    try {
      if (!reduceMotion && "IntersectionObserver" in window) {
        var waiting = targets.filter(function (s) {
          return s.getBoundingClientRect().top >= window.innerHeight - 1;
        });
        var reveal = function (s) {
          s.classList.add("is-in");
          revealIO.unobserve(s);
          waiting = waiting.filter(function (w) { return w !== s; });
          if (!waiting.length) window.removeEventListener("scroll", onScroll);
        };
        var onScroll = function () {
          waiting.slice().forEach(function (s) {
            if (s.getBoundingClientRect().top < window.innerHeight * 0.9) reveal(s);
          });
        };
        var revealIO = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) reveal(en.target); });
        }, { rootMargin: "0px 0px -10% 0px" });
        waiting.forEach(function (s) {
          s.classList.add("is-waiting");
          revealIO.observe(s);
        });
        if (waiting.length) window.addEventListener("scroll", onScroll, { passive: true });
      }
    } catch (e) {
      targets.forEach(function (s) { s.classList.remove("is-waiting"); });
    }
  }
  function revealAfterLoad(targets) {
    var go = function () { requestAnimationFrame(function () { setUpReveal(targets); }); };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go);
  }

  /* ---------- scroll camera (scenes 1–4) ----------
   * One pinned ScrollTrigger timeline. Only transform and opacity are
   * animated. Timeline units ≈ screen heights of scrolling:
   *   0.0–1.2  Aisle: camera pushes toward the spot, packs slide out, talkers in/out
   *   1.2–2.5  Shelf: bottle appears on the spot glowing, aisle blurs and fades,
   *            bottle grows to full size
   *   2.5–3.5  Front: hold; labels and panel appear
   *   3.5–4.1  Turn: squeeze to a sliver, swap to the back
   *   4.1–5.1  Back: hold; labels appear. Then the pin releases into Fin.
   */
  function initCine() {
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);
    // Don't re-measure when a mobile toolbar shows/hides (iOS/Android address bar):
    // that resize would otherwise make the pinned timeline jump.
    ST.config({ ignoreMobileResize: true });

    var journey = document.getElementById("journey");
    var aisle = document.getElementById("aisle");
    var shelf = document.getElementById("shelf");
    var front = document.getElementById("front");
    var back = document.getElementById("back");
    var fin = document.getElementById("fin");
    var A = C.aisle.image;
    // Anything missing here would only fail mid-scroll, so check up front and let
    // start() fall back to plain sections instead.
    ["width", "height", "spotHeight", "blur", "packsLeft", "packsRight"].forEach(function (k) {
      if (!A[k]) throw new Error("content.js aisle.image." + k + " is missing");
    });
    if (!A.spot || typeof A.spot.x !== "number" || typeof A.spot.y !== "number") {
      throw new Error("content.js aisle.image.spot needs numeric x and y");
    }

    var camera = aisle.querySelector(".aisle__camera");
    var blur = document.createElement("img");
    blur.className = "aisle__blur";
    blur.src = A.blur;
    blur.alt = "";
    blur.decoding = "async";
    camera.appendChild(blur);

    var card = aisle.querySelector(".aisle__card");
    function packs(src, side) {
      var img = document.createElement("img");
      img.className = "cine-packs cine-packs--" + side;
      img.src = src;
      img.alt = "";
      img.decoding = "async";
      aisle.insertBefore(img, card);
      return img;
    }
    var packsL = packs(A.packsLeft, "left");
    var packsR = packs(A.packsRight, "right");

    var talkers = card.querySelectorAll(".talker");
    var fb = front.querySelector(".bottle");
    var bb = back.querySelector(".bottle");

    var glow = el("div", "cine-glow");
    glow.setAttribute("aria-hidden", "true");
    fb.insertBefore(glow, fb.firstChild);
    var light = litBottle("bottle__light cine-light");
    fb.insertBefore(light, fb.querySelector(".bottle__stamp"));

    function ui(scene) {
      return scene.querySelectorAll(".bottle-scene__head, .pin, .hotspot, .panel, .scene--bottle > .next");
    }

    // --- geometry (re-measured on every refresh/resize) ---

    // Where the spot in the photo lands on screen, given object-fit: cover and
    // object-position 50% 45% on a layer as big as the camera.
    function spot() {
      var w = camera.clientWidth;
      var h = camera.clientHeight;
      var ar = A.width / A.height;
      var iw = Math.max(w, h * ar);
      var ih = iw / ar;
      return {
        x: (w - iw) * 0.5 + A.spot.x * iw,
        y: (h - ih) * 0.45 + A.spot.y * ih,
        imgH: ih,
      };
    }

    // The bottle's untransformed box inside the journey (offsets ignore transforms).
    function box(node) {
      var x = 0, y = 0, n = node;
      while (n && n !== journey) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      return { x: x, y: y, w: node.offsetWidth, h: node.offsetHeight };
    }

    var PUSH = 1.45; // camera zoom by the end of the aisle segment
    function start() {
      var s = spot();
      var b = box(fb);
      return {
        // Base of the glass (transform-origin 50% 97.2%) onto the spot.
        x: s.x - (b.x + b.w / 2),
        y: s.y - (b.y + b.h * 0.972),
        scale: (A.spotHeight * s.imgH * PUSH) / b.h,
      };
    }

    gsap.set([packsL], { xPercent: -38, x: 0 });
    gsap.set([packsR], { xPercent: 38, x: 0 });
    gsap.set([fb, bb], { transformOrigin: "50% 97.2%" });

    var TOTAL = 5.1;
    var tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: journey,
        start: "top top",
        end: function () { return "+=" + Math.round(window.innerHeight * TOTAL); },
        pin: true,
        // Follow the scroll directly: any smoothing here reads as lag, and native
        // scrolling (trackpad, touch, Chrome/Safari wheel) is already smooth.
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // 1. Aisle
    tl.addLabel("aisle", 0);
    tl.fromTo(camera,
      { scale: 1, transformOrigin: function () { var s = spot(); return s.x + "px " + s.y + "px"; } },
      { scale: PUSH, duration: 1.2 }, 0);
    tl.fromTo(packsL, { x: 0, scale: 1 }, { x: function () { return -window.innerWidth * 0.45; }, scale: 1.25, duration: 1.2 }, 0);
    tl.fromTo(packsR, { x: 0, scale: 1 }, { x: function () { return window.innerWidth * 0.45; }, scale: 1.25, duration: 1.2 }, 0);
    tl.from(talkers, { autoAlpha: 0, y: 14, stagger: 0.06, duration: 0.2 }, 0.05);
    tl.to(card, { autoAlpha: 0, y: -24, duration: 0.3 }, 0.85);

    // 2. Shelf
    tl.to(camera, { scale: 2.4, duration: 1.3 }, 1.2);
    tl.fromTo(blur, { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.3);
    tl.to(camera, { opacity: 0.35, duration: 0.7 }, 1.8);
    tl.set(front, { autoAlpha: 1 }, 1.2);
    tl.fromTo(fb, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 1.2);
    // Promote the bottle to its own layer only while it grows: kept on, the browser
    // would keep the small first rasterisation and the full-size bottle would be soft.
    tl.set(fb, { willChange: "transform" }, 1.19);
    tl.fromTo(fb,
      { x: function () { return start().x; }, y: function () { return start().y; }, scale: function () { return start().scale; } },
      { x: 0, y: 0, scale: 1, duration: 1.1, ease: "power2.inOut" }, 1.4);
    tl.set(fb, { willChange: "auto" }, 2.5);
    tl.fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.2);
    tl.to(glow, { opacity: 0.45, duration: 0.4 }, 2.1);
    tl.fromTo(light, { opacity: 0 }, { opacity: 0.9, duration: 0.3 }, 1.2);
    tl.to(light, { opacity: 0, duration: 0.4 }, 2.1);
    tl.fromTo(shelf, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 1.35);
    tl.to(shelf, { autoAlpha: 0, duration: 0.25 }, 2.1);
    tl.addLabel("shelf", 1.6);

    // 3. Front (hold)
    tl.fromTo(ui(front), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, stagger: 0.015 }, 2.5);
    tl.addLabel("front", 2.9);

    // 4. Turn, then Back (hold)
    tl.to(ui(front), { autoAlpha: 0, duration: 0.15 }, 3.5);
    tl.to(glow, { opacity: 0, duration: 0.15 }, 3.5);
    tl.fromTo(fb, { scaleX: 1 }, { scaleX: 0.04, duration: 0.2, ease: "power2.in", immediateRender: false }, 3.65);
    tl.set(front, { autoAlpha: 0 }, 3.85);
    tl.set(back, { autoAlpha: 1 }, 3.85);
    tl.fromTo(bb, { scaleX: 0.04 }, { scaleX: 1, duration: 0.2, ease: "power2.out" }, 3.85);
    tl.fromTo(ui(back), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, stagger: 0.015 }, 4.05);
    tl.addLabel("back", 4.45);
    tl.to({}, { duration: TOTAL - 4.3 }, 4.3); // hold on the back, then release

    var st = tl.scrollTrigger;

    function scrollFor(id) {
      if (id === "fin") return fin.getBoundingClientRect().top + window.scrollY;
      var t = tl.labels[id] || 0;
      return st.start + (st.end - st.start) * (t / tl.duration());
    }

    // Step bar: which segment the playhead is in (Fin once it fills half the screen).
    // Uses numbers measured on refresh, so scrolling never forces a layout.
    var finTop = 0;
    ST.addEventListener("refresh", function () {
      finTop = fin.getBoundingClientRect().top + window.scrollY;
      updateStep();
    });
    function updateStep() {
      var y = window.scrollY;
      if (finTop && y > finTop - window.innerHeight * 0.5) return setCurrent("fin");
      var t = st.progress * tl.duration();
      setCurrent(t < 1.2 ? "aisle" : t < 2.5 ? "shelf" : t < 3.75 ? "front" : "back");
    }
    window.addEventListener("scroll", updateStep, { passive: true });
    finTop = fin.getBoundingClientRect().top + window.scrollY;

    // Images load after layout: re-measure once they have.
    window.addEventListener("load", function () { ST.refresh(); });

    cineApi = { scrollFor: scrollFor };
    updateStep();
  }

  /* ---------- start: scroll camera, or plain sections ---------- */

  function startStatic() {
    document.documentElement.classList.remove("is-cine");
    startSceneSteps();
    revealAfterLoad(sceneEls);
  }

  // Runs after the deferred GSAP scripts have executed (or failed to load).
  function start() {
    if (!cine) return startStatic();
    if (!window.gsap || !window.ScrollTrigger) {
      console.warn("GSAP did not load: showing the scenes as plain sections.");
      return startStatic();
    }
    try {
      initCine();
      revealAfterLoad([document.getElementById("fin")]);
    } catch (err) {
      console.error(err);
      window.ScrollTrigger.getAll().forEach(function (t) { t.kill(true); });
      window.gsap.set(".journey, .journey *", { clearProps: "transform,opacity,visibility,filter" });
      cineApi = null;
      startStatic();
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
