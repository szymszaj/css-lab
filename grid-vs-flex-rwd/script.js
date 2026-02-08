const menuBtn = document.querySelector(".mobile-menu-btn");
const nav = document.querySelector(".nav-menu");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("is-active");
    menuBtn.classList.toggle("is-active");
  });
}
