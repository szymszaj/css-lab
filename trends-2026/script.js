const accBtn = document.querySelector(".acc-btn");
const accBody = document.querySelector(".acc-body");

accBtn.addEventListener("click", () => {
  accBody.classList.toggle("open");
  accBtn.textContent = accBody.classList.contains("open")
    ? "Kliknij mnie ▴"
    : "Kliknij mnie ▾";
});

const vtData = {
  1: {
    icon: "🎨",
    title: "Design",
    text: "Bento grids, OKLCH colors, gradient meshes — estetyka 2026 to głębia, kolor i ruch kontrolowany przez CSS.",
  },
  2: {
    icon: "⚡",
    title: "Speed",
    text: "Scroll-driven animations działają na GPU bez JS. Interpolate-size eliminuje layout thrashing. CSS robi więcej niż kiedykolwiek.",
  },
  3: {
    icon: "🔮",
    title: "Future",
    text: "CSS Houdini, anchor positioning, @layer, native nesting — platforma webowa dogoniła frameworki.",
  },
};

function transitTo(card) {
  const id = card.dataset.id;
  const data = vtData[id];

  const run = () => {
    document.querySelector(".vt-cards").hidden = true;
    const detail = document.getElementById("vt-detail");
    const content = document.getElementById("vt-detail-content");
    content.innerHTML = `<p style="font-size:2rem;margin-bottom:.5rem">${data.icon}</p>
      <strong style="font-size:1.3rem;display:block;margin-bottom:.5rem">${data.title}</strong>
      <p style="color:var(--c-muted);font-size:.95rem">${data.text}</p>`;
    detail.hidden = false;
  };

  if (document.startViewTransition) {
    document.startViewTransition(run);
  } else {
    run();
  }
}

function closeDetail() {
  const run = () => {
    document.getElementById("vt-detail").hidden = true;
    document.querySelector(".vt-cards").hidden = false;
  };

  if (document.startViewTransition) {
    document.startViewTransition(run);
  } else {
    run();
  }
}
