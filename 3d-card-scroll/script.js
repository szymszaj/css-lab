class CardScrollAnimation {
  constructor() {
    this.card = document.getElementById("animatedCard");
    this.cardSection = document.querySelector(".card-section");
    this.progressFill = document.getElementById("progressFill");
    this.progressValue = document.getElementById("progressValue");

    this.init();
  }

  init() {
    this.handleScroll = this.throttle(this.handleScroll.bind(this), 10);
    window.addEventListener("scroll", this.handleScroll);

    this.handleScroll();
  }

  handleScroll() {
    const scrollProgress = this.getScrollProgress();
    this.updateCard(scrollProgress);
    this.updateProgressBar(scrollProgress);
  }

  getScrollProgress() {
    const sectionTop = this.cardSection.offsetTop;
    const sectionHeight = this.cardSection.offsetHeight;
    const windowHeight = window.innerHeight;

    const scrollTop = window.pageYOffset;
    const sectionStart = sectionTop - windowHeight / 2;
    const sectionEnd = sectionTop + sectionHeight - windowHeight / 2;

    let progress = (scrollTop - sectionStart) / (sectionEnd - sectionStart);

    progress = Math.max(0, Math.min(1, progress));

    return progress;
  }

  updateCard(progress) {
    const rotateY = progress * 360;

    const rotateX = Math.sin(progress * Math.PI * 2) * 10;

    const rotateZ = Math.sin(progress * Math.PI * 4) * 5;

    const scale = 1 + Math.sin(progress * Math.PI) * 0.1;

    const translateY = Math.sin(progress * Math.PI * 2) * 20;

    this.card.style.transform = `
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
            rotateZ(${rotateZ}deg)
            scale(${scale})
            translateY(${translateY}px)
        `;

    const glowIntensity = Math.abs(Math.sin(progress * Math.PI * 2));
    this.card.style.filter = `drop-shadow(0 0 ${20 + glowIntensity * 30}px rgba(99, 102, 241, ${0.3 + glowIntensity * 0.4}))`;
  }

  updateProgressBar(progress) {
    const percentage = Math.round(progress * 100);
    this.progressFill.style.width = `${percentage}%`;
    this.progressValue.textContent = `${percentage}%`;
  }

  throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

// Initialize animation when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new CardScrollAnimation();
});

// Optional: Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
