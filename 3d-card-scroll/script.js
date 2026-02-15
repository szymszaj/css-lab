class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById("particleCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.particleCount = 80;
    this.mouse = { x: 0, y: 0 };

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = document.documentElement.scrollHeight;
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getRandomColor(),
      });
    }
  }

  getRandomColor() {
    const colors = [
      "rgba(99, 102, 241, ",
      "rgba(139, 92, 246, ",
      "rgba(236, 72, 153, ",
      "rgba(79, 172, 254, ",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle, index) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const angle = Math.atan2(dy, dx);
        particle.x -= Math.cos(angle) * 2;
        particle.y -= Math.sin(angle) * 2;
      }

      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.speedX *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.speedY *= -1;
      }

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color + particle.opacity + ")";
      this.ctx.fill();

      this.particles.forEach((otherParticle, otherIndex) => {
        if (index !== otherIndex) {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            this.ctx.beginPath();
            this.ctx.strokeStyle =
              particle.color + 0.15 * (1 - distance / 120) + ")";
            this.ctx.lineWidth = 0.5;
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(otherParticle.x, otherParticle.y);
            this.ctx.stroke();
          }
        }
      });
    });

    requestAnimationFrame(() => this.animate());
  }
}

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
    const rotateY = this.easeInOutCubic(progress) * 360;

    const rotateX = Math.sin(progress * Math.PI * 2) * 15;

    const rotateZ = Math.sin(progress * Math.PI * 4) * 8;

    const scale = 1 + Math.sin(progress * Math.PI) * 0.15;

    const translateY = Math.sin(progress * Math.PI * 2) * 30;

    const translateX = Math.sin(progress * Math.PI * 3) * 15;

    this.card.style.transform = `
      rotateY(${rotateY}deg)
      rotateX(${rotateX}deg)
      rotateZ(${rotateZ}deg)
      scale(${scale})
      translateY(${translateY}px)
      translateX(${translateX}px)
    `;

    const glowIntensity = Math.abs(Math.sin(progress * Math.PI * 2));
    const glowSize = 30 + glowIntensity * 50;
    const glowOpacity = 0.4 + glowIntensity * 0.6;

    this.card.style.filter = `drop-shadow(0 0 ${glowSize}px rgba(99, 102, 241, ${glowOpacity}))`;
  }

  updateProgressBar(progress) {
    const percentage = Math.round(progress * 100);
    this.progressFill.style.width = `${percentage}%`;
    this.progressValue.textContent = `${percentage}%`;
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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

document.addEventListener("DOMContentLoaded", () => {
  new ParticleSystem();
  new CardScrollAnimation();
});

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
