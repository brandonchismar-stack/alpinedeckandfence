
document.addEventListener("DOMContentLoaded", () => {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === current) link.classList.add("active");
  });
});


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-compare]").forEach(card => {
    const slider = card.querySelector(".compare-slider");
    const overlay = card.querySelector(".compare-overlay-wrap");
    if (!slider || !overlay) return;
    const setWidth = () => overlay.style.width = slider.value + "%";
    slider.addEventListener("input", setWidth);
    setWidth();
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector("[data-experience-collage]");
  if (!gallery) return;

  const pools = {
    concrete: [
      {src:"images/career-collage-concrete-step-forms.jpg", alt:"Detailed step and landing formwork", fit:"cover"},
      {src:"images/career-collage-concrete-corner-forms.jpg", alt:"Corner step and landing formwork detail", fit:"contain"},
      {src:"images/career-collage-concrete-footing-forms.jpg", alt:"Footing forms with reinforcing steel", fit:"cover"},
      {src:"images/career-collage-concrete-rebar-trench.jpg", alt:"Reinforcing steel in a commercial foundation trench", fit:"contain"},
      {src:"images/career-collage-concrete-sidewalk-finish.jpg", alt:"Freshly finished commercial concrete sidewalk", fit:"contain"},
      {src:"images/career-collage-concrete-wall-forms.jpg", alt:"Tall foundation wall forming system", fit:"contain"}
    ],
    framing: [
      {src:"images/career-collage-framing-wall-system.jpg", alt:"Large residential wall and floor framing system", fit:"cover"},
      {src:"images/career-collage-framing-floor-system.jpg", alt:"Floor joist system framed over a slab", fit:"cover"},
      {src:"images/career-collage-framing-roof-trusses.jpg", alt:"Roof trusses and structural roof framing", fit:"cover"},
      {src:"images/career-collage-framing-commercial-walls.jpg", alt:"Commercial wall framing above an existing structure", fit:"cover"},
      {src:"images/career-collage-framing-stair-stringers.jpg", alt:"Custom stair stringers laid out and cut", fit:"contain"},
      {src:"images/career-collage-framing-structural-steel.jpg", alt:"Structural steel and wood framing working together", fit:"contain"}
    ],
    masonry: [
      {src:"images/career-collage-masonry-outdoor-fireplace.jpg", alt:"Outdoor masonry fireplace under construction", fit:"contain"},
      {src:"images/career-collage-masonry-fireplace-rough.jpg", alt:"Block fireplace structure before finish masonry", fit:"cover"},
      {src:"images/career-collage-masonry-stone-veneer.jpg", alt:"Stone veneer installation in progress", fit:"cover"},
      {src:"images/career-collage-masonry-exterior-veneer.jpg", alt:"Exterior stone veneer installation", fit:"cover"},
      {src:"images/career-collage-masonry-chimney-detail.jpg", alt:"Stone chimney and roof flashing detail", fit:"cover"},
      {src:"images/career-collage-masonry-flagstone-patio.jpg", alt:"Large custom flagstone patio layout", fit:"cover"}
    ],
    openings: [
      {src:"images/career-collage-openings-sliding-door.jpg", alt:"Large sliding exterior door installation", fit:"cover"},
      {src:"images/career-collage-openings-four-panel-door.jpg", alt:"Four-panel exterior door system during installation", fit:"cover"},
      {src:"images/career-collage-openings-corner-windows.jpg", alt:"Corner window replacement and exterior integration", fit:"cover"},
      {src:"images/career-collage-openings-bay-window.jpg", alt:"Finished projecting bay window", fit:"contain"},
      {src:"images/career-collage-openings-bay-window-angle.jpg", alt:"Finished bay window from a second exterior angle", fit:"contain"},
      {src:"images/career-collage-finish-backsplash.jpg", alt:"Detailed glass tile backsplash finish work", fit:"cover"}
    ]
  };

  const desktopTiles = Array.from(gallery.querySelectorAll(".experience-tile[data-trade]"));
  const allTiles = Array.from(gallery.querySelectorAll(".experience-tile"));
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let nextTileIndex = 0;
  let timer = null;
  let paused = false;

  desktopTiles.forEach(tile => {
    tile.dataset.itemIndex = "0";
  });

  const rotateOne = () => {
    if (paused || mobileQuery.matches || reducedMotion.matches || !desktopTiles.length) return;

    const tile = desktopTiles[nextTileIndex % desktopTiles.length];
    const trade = tile.dataset.trade;
    const pool = pools[trade];
    if (!pool?.length) return;

    const nextItemIndex = (Number(tile.dataset.itemIndex || 0) + 1) % pool.length;
    const item = pool[nextItemIndex];

    tile.classList.add("is-changing");
    window.setTimeout(() => {
      const img = tile.querySelector("img");
      if (!img) return;
      img.src = item.src;
      img.alt = item.alt;
      tile.classList.toggle("is-contain", item.fit === "contain");
      tile.dataset.itemIndex = String(nextItemIndex);
      tile.classList.remove("is-changing");
    }, 260);

    nextTileIndex += 1;
  };

  const start = () => {
    window.clearInterval(timer);
    if (!mobileQuery.matches && !reducedMotion.matches) {
      timer = window.setInterval(rotateOne, 4600);
    }
  };
  const stop = () => window.clearInterval(timer);

  gallery.addEventListener("mouseenter", () => { paused = true; stop(); });
  gallery.addEventListener("mouseleave", () => { paused = false; start(); });
  gallery.addEventListener("focusin", () => { paused = true; stop(); });
  gallery.addEventListener("focusout", event => {
    if (!gallery.contains(event.relatedTarget)) {
      paused = false;
      start();
    }
  });
  mobileQuery.addEventListener?.("change", start);

  const dialog = document.querySelector("[data-experience-lightbox]");
  const dialogImg = dialog?.querySelector("img");
  const dialogCaption = dialog?.querySelector("p");
  const closeButton = dialog?.querySelector(".experience-lightbox-close");

  allTiles.forEach(tile => {
    tile.addEventListener("click", () => {
      if (!dialog || !dialogImg || !dialogCaption) return;
      const img = tile.querySelector("img");
      const label = tile.querySelector("span");
      if (!img || !label) return;
      dialogImg.src = img.src;
      dialogImg.alt = img.alt;
      dialogCaption.textContent = label.textContent;
      dialog.showModal();
    });
  });

  closeButton?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  start();
});
