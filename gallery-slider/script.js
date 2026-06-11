const slides = document.querySelectorAll(".slide");
const thumbs = document.querySelectorAll(".thumb");
const btnPrev = document.querySelector(".slider__btn--prev");
const btnNext = document.querySelector(".slider__btn--next");
const progressBar = document.querySelector(".slider__progress-bar");
const counterCurrent = document.querySelector(".counter__current");
const counterTotal = document.querySelector(".counter__total");

let current = 0;
const total = slides.length;
const AUTOPLAY_MS = 6000;
let autoplayId = null;
let progressStart = null;
let progressRAF = null;

counterTotal.textContent = String(total).padStart(2, "0");

function goTo(index) {
  current = (index + total) % total;
  slides.forEach((s, i) => s.classList.toggle("slide--active", i === current));
  thumbs.forEach((t, i) => t.classList.toggle("thumb--active", i === current));
  counterCurrent.textContent = String(current + 1).padStart(2, "0");
  restartAutoplay();
}

function next() {
  goTo(current + 1);
}
function prev() {
  goTo(current - 1);
}

function tickProgress(ts) {
  if (!progressStart) progressStart = ts;
  const elapsed = ts - progressStart;
  const pct = Math.min((elapsed / AUTOPLAY_MS) * 100, 100);
  progressBar.style.width = pct + "%";
  if (elapsed < AUTOPLAY_MS) {
    progressRAF = requestAnimationFrame(tickProgress);
  }
}

function restartAutoplay() {
  clearTimeout(autoplayId);
  cancelAnimationFrame(progressRAF);
  progressStart = null;
  progressBar.style.width = "0%";
  progressRAF = requestAnimationFrame(tickProgress);
  autoplayId = setTimeout(next, AUTOPLAY_MS);
}

btnNext.addEventListener("click", next);
btnPrev.addEventListener("click", prev);
thumbs.forEach((t, i) => t.addEventListener("click", () => goTo(i)));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});

const slider = document.querySelector(".slider");
let touchStartX = 0;
slider.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);
slider.addEventListener(
  "touchend",
  (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) diff < 0 ? next() : prev();
  },
  { passive: true },
);

slider.addEventListener("mouseenter", () => {
  clearTimeout(autoplayId);
  cancelAnimationFrame(progressRAF);
});
slider.addEventListener("mouseleave", restartAutoplay);

restartAutoplay();
