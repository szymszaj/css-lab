const themeToggle = document.getElementById("theme-toggle");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");
const body = document.body;

function setIcon(element, iconName) {
  element.innerHTML = `<i data-feather="${iconName}"></i>`;
  feather.replace();
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  body.setAttribute("data-theme", savedTheme);
  if (savedTheme === "dark") {
    setIcon(themeToggle, "sun");
  }
}

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  const iconName = newTheme === "dark" ? "sun" : "moon";
  setIcon(themeToggle, iconName);
});

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  body.classList.toggle("menu-open");

  const iconName = isOpen ? "x" : "menu";
  setIcon(menuToggle, iconName);
});

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    body.classList.remove("menu-open");
    setIcon(menuToggle, "menu");
  });
});
