document.addEventListener("DOMContentLoaded", () => {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(link => {
    if (link.getAttribute("href") === current) link.classList.add("active");
  });

  document.querySelectorAll("[data-compare]").forEach(card => {
    const slider = card.querySelector(".compare-slider");
    const overlay = card.querySelector(".compare-overlay-wrap");
    if (!slider || !overlay) return;
    const setWidth = () => { overlay.style.width = `${slider.value}%`; };
    slider.addEventListener("input", setWidth, {passive:true});
    setWidth();
  });

  const gallery = document.querySelector("[data-experience-collage]");
  if (!gallery) return;

  const pools = {
    concrete: [
      {src:"images/career-collage-concrete-step-forms.webp", alt:"Detailed step and landing formwork", fit:"cover"},
      {src:"images/career-collage-concrete-corner-forms.webp", alt:"Corner step and landing formwork detail", fit:"contain"},
      {src:"images/career-collage-concrete-footing-forms.webp", alt:"Footing forms with reinforcing steel", fit:"cover"},
      {src:"images/career-collage-concrete-rebar-trench.webp", alt:"Reinforcing steel in a commercial foundation trench", fit:"contain"},
      {src:"images/career-collage-concrete-sidewalk-finish.webp", alt:"Freshly finished commercial concrete sidewalk", fit:"contain"},
      {src:"images/career-collage-concrete-wall-forms.webp", alt:"Tall foundation wall forming system", fit:"contain"}
    ],
    framing: [
      {src:"images/career-collage-framing-wall-system.webp", alt:"Large residential wall and floor framing system", fit:"cover"},
      {src:"images/career-collage-framing-floor-system.webp", alt:"Floor joist system framed over a slab", fit:"cover"},
      {src:"images/career-collage-framing-roof-trusses.webp", alt:"Roof trusses and structural roof framing", fit:"cover"},
      {src:"images/career-collage-framing-commercial-walls.webp", alt:"Commercial wall framing above an existing structure", fit:"cover"},
      {src:"images/career-collage-framing-stair-stringers.webp", alt:"Custom stair stringers laid out and cut", fit:"contain"},
      {src:"images/career-collage-framing-structural-steel.webp", alt:"Structural steel and wood framing working together", fit:"contain"}
    ],
    masonry: [
      {src:"images/career-collage-masonry-outdoor-fireplace.webp", alt:"Outdoor masonry fireplace under construction", fit:"contain"},
      {src:"images/career-collage-masonry-fireplace-rough.webp", alt:"Block fireplace structure before finish masonry", fit:"cover"},
      {src:"images/career-collage-masonry-stone-veneer.webp", alt:"Stone veneer installation in progress", fit:"cover"},
      {src:"images/career-collage-masonry-exterior-veneer.webp", alt:"Exterior stone veneer installation", fit:"cover"},
      {src:"images/career-collage-masonry-chimney-detail.webp", alt:"Stone chimney and roof flashing detail", fit:"cover"},
      {src:"images/career-collage-masonry-flagstone-patio.webp", alt:"Large custom flagstone patio layout", fit:"cover"}
    ],
    openings: [
      {src:"images/career-collage-openings-sliding-door.webp", alt:"Large sliding exterior door installation", fit:"cover"},
      {src:"images/career-collage-openings-four-panel-door.webp", alt:"Four-panel exterior door system during installation", fit:"cover"},
      {src:"images/career-collage-openings-corner-windows.webp", alt:"Corner window replacement and exterior integration", fit:"cover"},
      {src:"images/career-collage-openings-bay-window.webp", alt:"Finished projecting bay window", fit:"contain"},
      {src:"images/career-collage-openings-bay-window-angle.webp", alt:"Finished bay window from a second exterior angle", fit:"contain"},
      {src:"images/career-collage-finish-backsplash.webp", alt:"Detailed glass tile backsplash finish work", fit:"cover"}
    ]
  };

  const desktopTiles = [...gallery.querySelectorAll(".experience-tile[data-trade]")];
  const allTiles = [...gallery.querySelectorAll(".experience-tile")];
  const mobileImages = [...gallery.querySelectorAll(".experience-tile-mobile img[data-src]")];
  const mobileQuery = window.matchMedia("(max-width: 760px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let nextTileIndex = 0;
  let timer = null;
  let paused = false;
  let galleryInView = false;
  let mobileObserver = null;

  desktopTiles.forEach(tile => { tile.dataset.itemIndex = "0"; });

  const hydrateImage = img => {
    if (!img?.dataset.src) return;
    img.src = img.dataset.src;
    delete img.dataset.src;
  };

  const setupMobileImages = () => {
    mobileObserver?.disconnect();
    mobileObserver = null;
    if (!mobileQuery.matches) return;
    if (!("IntersectionObserver" in window)) {
      mobileImages.forEach(hydrateImage);
      return;
    }
    mobileObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        hydrateImage(entry.target);
        mobileObserver?.unobserve(entry.target);
      });
    }, {root: gallery, rootMargin:"0px 220px", threshold:0.01});
    mobileImages.forEach(img => {
      if (img.dataset.src) mobileObserver.observe(img);
    });
  };

  const rotateOne = () => {
    if (paused || !galleryInView || document.hidden || mobileQuery.matches || reducedMotion.matches || !desktopTiles.length) return;
    const tile = desktopTiles[nextTileIndex % desktopTiles.length];
    const pool = pools[tile.dataset.trade];
    if (!pool?.length) return;
    const nextItemIndex = (Number(tile.dataset.itemIndex || 0) + 1) % pool.length;
    const item = pool[nextItemIndex];
    const preload = new Image();
    preload.decoding = "async";
    preload.src = item.src;
    preload.onload = () => {
      tile.classList.add("is-changing");
      window.setTimeout(() => {
        const img = tile.querySelector("img");
        if (!img) return;
        img.src = item.src;
        img.alt = item.alt;
        tile.classList.toggle("is-contain", item.fit === "contain");
        tile.dataset.itemIndex = String(nextItemIndex);
        tile.classList.remove("is-changing");
      }, 180);
    };
    nextTileIndex += 1;
  };

  const stop = () => {
    window.clearInterval(timer);
    timer = null;
  };
  const start = () => {
    stop();
    if (galleryInView && !document.hidden && !mobileQuery.matches && !reducedMotion.matches) {
      timer = window.setInterval(rotateOne, 5200);
    }
  };

  gallery.addEventListener("mouseenter", () => { paused = true; stop(); });
  gallery.addEventListener("mouseleave", () => { paused = false; start(); });
  gallery.addEventListener("focusin", () => { paused = true; stop(); });
  gallery.addEventListener("focusout", event => {
    if (!gallery.contains(event.relatedTarget)) { paused = false; start(); }
  });

  const handleModeChange = () => {
    setupMobileImages();
    start();
  };
  mobileQuery.addEventListener?.("change", handleModeChange);
  document.addEventListener("visibilitychange", start);

  if ("IntersectionObserver" in window) {
    const galleryObserver = new IntersectionObserver(entries => {
      galleryInView = entries.some(entry => entry.isIntersecting);
      start();
    }, {rootMargin:"180px 0px", threshold:0.01});
    galleryObserver.observe(gallery);
  } else {
    galleryInView = true;
  }

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
      hydrateImage(img);
      dialogImg.src = img.currentSrc || img.src;
      dialogImg.alt = img.alt;
      dialogCaption.textContent = label.textContent;
      dialog.showModal();
    });
  });

  closeButton?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });

  setupMobileImages();
  start();
});
