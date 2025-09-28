import { periodOptions, compoundOptions } from "./data.js";

const periodTypeSel = document.getElementById("periodType");
const compoundSel = document.getElementById("compound");

periodOptions.forEach((opt) => {
  const option = document.createElement("option");
  option.value = opt.value;
  option.textContent = opt.label;
  periodTypeSel.appendChild(option);
});
compoundOptions.forEach((opt) => {
  const option = document.createElement("option");
  option.value = opt.value;
  option.textContent = opt.label;
  compoundSel.appendChild(option);
});

periodTypeSel.addEventListener("change", function () {
  document.getElementById("customPeriodDiv").style.display =
    this.value === "custom" ? "block" : "none";
});

const disablePeriodCheckbox = document.getElementById("disablePeriod");
const periodSection = document.getElementById("periodSection");
disablePeriodCheckbox.addEventListener("change", function () {
  periodSection.style.display = this.checked ? "none" : "";
});

function formatNumber(num) {
  return Number(num).toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

document.getElementById("calculateBtn").onclick = calculate;

function calculate() {
  const bar = document.getElementById("progressBar");
  bar.style.width = "0";
  setTimeout(() => {
    bar.style.width = "100%";
  }, 40);

  const amount = parseFloat(document.getElementById("amount").value);
  const rate = parseFloat(document.getElementById("rate").value);

  let period = 1;
  let compound = "rocznie";
  let periodInfo = "1 rok, kapitalizacja roczna";

  if (!disablePeriodCheckbox.checked) {
    const periodType = periodTypeSel.value;
    period = parseInt(periodType);
    if (periodType === "custom") {
      period = parseInt(document.getElementById("customPeriod").value) || 1;
    }
    compound = compoundSel.value;
    periodInfo = `${period} ${
      period === 1 ? "rok" : "lat(a)"
    }, kapitalizacja: ${compound}`;
  } else {
    period = 1;
    compound = "rocznie";
    periodInfo = "1 okres (rok), kapitalizacja roczna";
  }

  if (isNaN(amount) || isNaN(rate) || amount <= 0 || rate <= 0 || period <= 0) {
    document.getElementById("result").innerHTML =
      "<span style='color:#e74c3c;'>Wprowadź poprawne dane!</span>";
    return;
  }

  let n = 1;
  if (compound === "miesięcznie") n = 12;
  else if (compound === "dzienne") n = 365;

  const r = rate / 100;
  const finalValue = amount * Math.pow(1 + r / n, n * period);
  const profit = finalValue - amount;

  let emoji = "🚀";
  if (profit > 500000) emoji = "🌕";
  else if (profit > 100000) emoji = "🤑";
  else if (profit > 10000) emoji = "💰";
  else if (profit < 0) emoji = "😱";

  document.getElementById("result").innerHTML = `
    <div>
      <div>Kwota końcowa: <b style="color:var(--accent);">${formatNumber(
        finalValue
      )} zł ${emoji}</b></div>
      <div style="font-size: 0.96em; color:var(--text-secondary); margin-top:4px;">
        Zysk: <b>${formatNumber(profit)} zł</b> <br>
        ${periodInfo}
      </div>
    </div>
  `;
}
