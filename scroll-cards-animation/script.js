document.addEventListener("DOMContentLoaded", () => {
  const scrollProgress = document.getElementById("scrollProgress");
  const sections = document.querySelectorAll("section");

  window.addEventListener("scroll", () => {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;

    requestAnimationFrame(() => {
      scrollProgress.style.height = `${progress}%`;
    });
  });

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });
});
