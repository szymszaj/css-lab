class CyberInterface {
  constructor() {
    this.scrollProgress = document.getElementById("scrollProgress");
    this.sections = document.querySelectorAll("section");
    this.cards = document.querySelectorAll(".card");

    this.init();
  }

  init() {
    this.setupScrollProgress();
    this.setupIntersectionObserver();
    this.setupCardTilt();
    this.setupTextScramble();
  }

  setupScrollProgress() {
    window.addEventListener("scroll", () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;

      requestAnimationFrame(() => {
        if (this.scrollProgress) {
          this.scrollProgress.style.height = `${progress}%`;
        }
      });
    });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          
          const title = entry.target.querySelector(".card-content h2");
          if (title && !title.dataset.scrambled) {
            this.scrambleText(title);
            title.dataset.scrambled = "true";
          }
        }
      });
    }, observerOptions);

    this.sections.forEach((section) => {
      observer.observe(section);
    });
  }

  setupCardTilt() {
    this.cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; to 10 deg
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      });

      card.addEventListener("mouseleave", () => {
        
        card.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
      });
    });
  }

  setupTextScramble() {
  }
  scrambleText(element) {
    const originalText = element.innerText;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
    let iterations = 0;

    const interval = setInterval(() => {
      element.innerText = originalText
        .split("")
        .map((letter, index) => {
          if (index < iterations) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iterations >= originalText.length) {
        clearInterval(interval);
      }

      iterations += 1 / 2; 
    }, 30);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CyberInterface();
});
