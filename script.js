
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
