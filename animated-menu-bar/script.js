document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document
      .querySelectorAll(".nav-link")
      .forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
  });
});

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const overlay = document.getElementById("overlay");

function openMenu() {
  hamburger.classList.add("open");
  mobileMenu.classList.add("open");
  overlay.classList.add("show");
  requestAnimationFrame(() => overlay.classList.add("visible"));
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  hamburger.classList.remove("open");
  mobileMenu.classList.remove("open");
  overlay.classList.remove("visible");
  overlay.addEventListener(
    "transitionend",
    () => overlay.classList.remove("show"),
    { once: true },
  );
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
});

overlay.addEventListener("click", closeMenu);

document.querySelectorAll(".mob-link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const navbar = document.querySelector(".navbar");
let ticking = false;

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      if (window.scrollY > 20) {
        navbar.style.top = "8px";
        navbar.style.background = "rgba(10 10 16 / .85)";
      } else {
        navbar.style.top = "16px";
        navbar.style.background = "rgba(14 14 22 / .55)";
      }
      ticking = false;
    });
    ticking = true;
  }
});
