const STEPS = [
  {
    num: "01",
    title: "Rozmowa",
    desc: "Krótka rozmowa telefoniczna — poznajemy się i omawiamy oczekiwania z obu stron.",
  },
  {
    num: "02",
    title: "Zaproszenie na spotkanie",
    desc: "Jeśli rozmowa idzie dobrze, zapraszamy na spotkanie — online lub w biurze.",
  },
  {
    num: "03",
    title: "Spotkanie rekrutacyjne",
    desc: "Rozmowa z zespołem i liderem. Bez testów logicznych — za to dużo konkretów o roli.",
  },
  {
    num: "04",
    title: "Oferta",
    desc: "Przesyłamy ofertę wraz z pełnym zakresem obowiązków i pakietem benefitów.",
  },
  {
    num: "05",
    title: "Start!",
    desc: "Witamy na pokładzie. Twój onboarding zaczyna się pierwszego dnia pracy.",
  },
];

const INTERVAL_MS = 3000;

const dots = Array.from(document.querySelectorAll(".step-dot"));
const trackFill = document.getElementById("trackFill");
const stepsSection = document.querySelector(".steps-section");

stepsSection.insertAdjacentHTML(
  "beforeend",
  `
  <div class="step-info-panel">
    <div class="panel-content fade-in">
      <div class="panel-num" id="panelNum">${STEPS[0].num}</div>
      <div class="panel-text">
        <h3 id="panelTitle">${STEPS[0].title}</h3>
        <p  id="panelDesc">${STEPS[0].desc}</p>
      </div>
    </div>
  </div>
`,
);

const panelContent = document.querySelector(".panel-content");
const panelNum = document.getElementById("panelNum");
const panelTitle = document.getElementById("panelTitle");
const panelDesc = document.getElementById("panelDesc");

let current = 0;

function setStep(index) {
  current = ((index % STEPS.length) + STEPS.length) % STEPS.length;

  dots.forEach((dot, i) => {
    dot.classList.remove("active", "done");
    if (i === current) dot.classList.add("active");
    if (i < current) dot.classList.add("done");
  });

  const fillPct = current === 0 ? 0 : (current / (STEPS.length - 1)) * 100;

  trackFill.style.width = fillPct + "%";

  panelContent.classList.remove("fade-in");
  panelContent.classList.add("fade-out");

  setTimeout(() => {
    const s = STEPS[current];
    panelNum.textContent = s.num;
    panelTitle.textContent = s.title;
    panelDesc.textContent = s.desc;

    panelContent.classList.remove("fade-out");
    panelContent.classList.add("fade-in");
  }, 260);
}

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    clearInterval(timer);
    setStep(i);
    timer = setInterval(advance, INTERVAL_MS);
  });
});

function advance() {
  setStep(current + 1);
}

setStep(0);
let timer = setInterval(advance, INTERVAL_MS);
