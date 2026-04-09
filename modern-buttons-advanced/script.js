document.querySelectorAll(".btn-magnetic").forEach((btn) => {
  btn.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    btn.style.transition = "transform 0.1s ease";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0, 0)";
    btn.style.transition =
      "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  });
});
