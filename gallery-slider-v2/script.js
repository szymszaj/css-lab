const cards = Array.from(document.querySelectorAll(".card"));
const infoSlides = Array.from(document.querySelectorAll(".info__slide"));
const dots = Array.from(document.querySelectorAll(".dot"));
const btnPrev = document.querySelector(".nav--prev");
const btnNext = document.querySelector(".nav--next");
const stageBg = document.querySelector(".stage__bg");
const root = document.documentElement;

const total = cards.length;
const AUTOPLAY_MS = 6000;
let current = 0;
let autoplayId = null;

root.style.setProperty("--autoplay", AUTOPLAY_MS + "ms");

function getPos(i) {
  let offset = i - current;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  if (offset === 0) return "0";
  if (offset === -1) return "-1";
  if (offset === 1) return "1";
  if (offset === -2) return "-2";
  if (offset === 2) return "2";
  return "hidden";
}

function render() {
  cards.forEach((card, i) => {
    card.dataset.pos = getPos(i);
    card.classList.toggle("is-active", i === current);
  });
  infoSlides.forEach((s, i) => s.classList.toggle("is-active", i === current));
  dots.forEach((d, i) => {
    const wasActive = d.classList.contains("is-active");
    d.classList.toggle("is-active", i === current);
    if (i === current && !wasActive) {
      d.style.animation = "none";
      void d.offsetWidth;
      d.style.animation = "";
    }
  });

  const activeImg = cards[current].style.getPropertyValue("--img");
  stageBg.style.setProperty("--bg-img", activeImg);
}

function goTo(i) {
  current = (i + total) % total;
  render();
  restartAutoplay();
}

function next() {
  goTo(current + 1);
}
function prev() {
  goTo(current - 1);
}

function restartAutoplay() {
  clearTimeout(autoplayId);
  autoplayId = setTimeout(next, AUTOPLAY_MS);
}

btnNext.addEventListener("click", next);
btnPrev.addEventListener("click", prev);

cards.forEach((card, i) => {
  card.addEventListener("click", () => {
    if (i === current) return;
    goTo(i);
  });
});

dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});

const viewport = document.querySelector(".coverflow");
let touchStartX = 0;
viewport.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);
viewport.addEventListener(
  "touchend",
  (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) diff < 0 ? next() : prev();
  },
  { passive: true },
);

const gallery = document.querySelector(".gallery");
gallery.addEventListener("mouseenter", () => clearTimeout(autoplayId));
gallery.addEventListener("mouseleave", restartAutoplay);

render();
restartAutoplay();
