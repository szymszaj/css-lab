const cards = document.querySelectorAll(".card");
const overlay = document.getElementById("overlay");
let openCard = null;

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

cards.forEach((card) => {
  const inner = card.querySelector(".card-inner");

  card.addEventListener("pointermove", (e) => {
    if (card.classList.contains("open")) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 18;
    const rx = -(py - 0.5) * 10;
    inner.style.setProperty("--rx", rx + "deg");
    inner.style.setProperty("--ry", ry + "deg");
  });

  card.addEventListener("pointerleave", () => {
    if (card.classList.contains("open")) return;
    inner.style.setProperty("--rx", "0deg");
    inner.style.setProperty("--ry", "0deg");
  });

  card.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      toggleOpen(card);
    }
  });

  card.addEventListener("click", () => {
    toggleOpen(card);
  });
});

function toggleOpen(card) {
  if (openCard && openCard !== card) {
    closeOpen();
  }
  if (card.classList.contains("open")) {
    closeOpen();
    return;
  }
  card.classList.add("open");
  overlay.classList.add("visible");
  overlay.setAttribute("aria-hidden", "false");
  openCard = card;

  addCloseButton(card);

  setTimeout(() => {
    const closeBtn = card.querySelector(".close-btn");
    if (closeBtn) closeBtn.focus();
  }, 250);
}

function addCloseButton(card) {
  if (card.querySelector(".close-btn")) return;
  const btn = document.createElement("button");
  btn.className = "close-btn";
  btn.innerHTML = "Zamknij";
  btn.setAttribute("aria-label", "Zamknij kartę");
  btn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    closeOpen();
  });
  card.querySelector(".card-inner").appendChild(btn);
}

function closeOpen() {
  if (!openCard) return;
  const btn = openCard.querySelector(".close-btn");
  if (btn) btn.remove();
  openCard.classList.remove("open");
  overlay.classList.remove("visible");
  overlay.setAttribute("aria-hidden", "true");
  const inner = openCard.querySelector(".card-inner");
  inner.style.setProperty("--rx", "0deg");
  inner.style.setProperty("--ry", "0deg");
  openCard = null;
}

overlay.addEventListener("click", closeOpen);

document.addEventListener("keydown", (ev) => {
  if (ev.key === "Escape") closeOpen();
});

cards.forEach((card) => {
  card.addEventListener("touchstart", () => {
    const inner = card.querySelector(".card-inner");
    inner.style.setProperty("--rx", "-6deg");
    inner.style.setProperty("--ry", "6deg");
  });
  card.addEventListener("touchend", () => {
    const inner = card.querySelector(".card-inner");
    inner.style.setProperty("--rx", "0deg");
    inner.style.setProperty("--ry", "0deg");
  });
});
