const themeToggle = document.getElementById("themeToggle");
const htmlElement = document.documentElement;

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || (prefersDark ? "dark" : "light");
  htmlElement.setAttribute("data-theme", theme);
}

themeToggle.addEventListener("click", () => {
  const currentTheme = htmlElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";
  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  showNotification(`Theme changed to ${newTheme} mode`, "info");
});

const openModal1Btn = document.getElementById("openModal1");
const closeModal1Btn = document.getElementById("close1");
const cancelModal1Btn = document.getElementById("cancel1");
const overlay1 = document.getElementById("overlay1");
const modal1 = document.getElementById("modal1");

const openModal2Btn = document.getElementById("openModal2");
const closeModal2Btn = document.getElementById("close2");
const cancelModal2Btn = document.getElementById("cancel2");
const overlay2 = document.getElementById("overlay2");
const modal2 = document.getElementById("modal2");

const openModal3Btn = document.getElementById("openModal3");
const closeModal3Btn = document.getElementById("close3");
const cancelModal3Btn = document.getElementById("cancel3");
const overlay3 = document.getElementById("overlay3");
const modal3 = document.getElementById("modal3");
const sendNotifBtn = document.getElementById("sendNotifBtn");

function openModal(modal) {
  modal.classList.add("active");
}

function closeModal(modal) {
  modal.classList.remove("active");
}

openModal1Btn.addEventListener("click", () => {
  openModal(modal1);
  showNotification("Glassmorphism Modal opened", "success");
});
closeModal1Btn.addEventListener("click", () => closeModal(modal1));
cancelModal1Btn.addEventListener("click", () => closeModal(modal1));
overlay1.addEventListener("click", () => closeModal(modal1));

openModal2Btn.addEventListener("click", () => {
  openModal(modal2);
  showNotification("Slide Modal opened", "success");
});
closeModal2Btn.addEventListener("click", () => closeModal(modal2));
cancelModal2Btn.addEventListener("click", () => closeModal(modal2));
overlay2.addEventListener("click", () => closeModal(modal2));

openModal3Btn.addEventListener("click", () => {
  openModal(modal3);
  restoreModalPosition(modal3);
  showNotification("Advanced Modal opened - Try dragging it!", "info");
});
closeModal3Btn.addEventListener("click", () => closeModal(modal3));
cancelModal3Btn.addEventListener("click", () => closeModal(modal3));
overlay3.addEventListener("click", () => closeModal(modal3));

function showNotification(message, type = "info") {
  const container = document.getElementById("notificationContainer");
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `<span class="notification-text">${message}</span>`;

  container.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

sendNotifBtn.addEventListener("click", () => {
  const types = ["success", "error", "info", "warning"];
  const messages = [
    "✨ Amazing! You clicked the button!",
    "🚀 System is running smoothly!",
    "💡 Did you try dragging the modal?",
    "⚡ Dark mode looks cool, right?",
  ];

  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  showNotification(randomMessage, randomType);
});

let draggedModal = null;
let offsetX = 0;
let offsetY = 0;

function makeModalDraggable(modal) {
  const header = modal.querySelector(".drag-handle");
  if (!header) return;

  header.addEventListener("mousedown", (e) => {
    draggedModal = modal;
    const content = modal.querySelector(".modal-content");

    const rect = content.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    modal.classList.add("dragging");
    content.style.transition = "none";
  });
}

document.addEventListener("mousemove", (e) => {
  if (draggedModal) {
    const content = draggedModal.querySelector(".modal-content");
    const x = e.clientX - offsetX;
    const y = e.clientY - offsetY;

    content.style.position = "fixed";
    content.style.left = x + "px";
    content.style.top = y + "px";
    content.style.margin = "0";
    content.style.transform = "none";
  }
});

document.addEventListener("mouseup", () => {
  if (draggedModal) {
    const content = draggedModal.querySelector(".modal-content");
    draggedModal.classList.remove("dragging");
    content.style.transition = "";

    const rect = content.getBoundingClientRect();
    const position = {
      x: parseFloat(content.style.left),
      y: parseFloat(content.style.top),
    };
    localStorage.setItem(
      `modal-${draggedModal.id}-position`,
      JSON.stringify(position),
    );

    draggedModal = null;
  }
});

function restoreModalPosition(modal) {
  const savedPosition = localStorage.getItem(`modal-${modal.id}-position`);
  if (savedPosition) {
    const position = JSON.parse(savedPosition);
    const content = modal.querySelector(".modal-content");
    content.style.position = "fixed";
    content.style.left = position.x + "px";
    content.style.top = position.y + "px";
    content.style.margin = "0";
    content.style.transform = "none";
  }
}

makeModalDraggable(modal3);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal(modal1);
    closeModal(modal2);
    closeModal(modal3);
  }
});

initializeTheme();
