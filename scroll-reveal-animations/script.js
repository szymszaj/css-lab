/* ─────────────────────────────────────────────
   Scroll Reveal Animations · script.js
   ─────────────────────────────────────────────*/

// ── 1. NAVBAR: scroll class + progress bar ───
const navbar = document.getElementById("navbar");
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener(
  "scroll",
  () => {
    // Sticky nav style
    navbar.classList.toggle("scrolled", window.scrollY > 40);

    // Progress bar
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / docHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
  },
  { passive: true },
);

// ── 2. INTERSECTION OBSERVER: reveal elements ──
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Trigger counter animation for stat items
        if (entry.target.classList.contains("stat-item")) {
          entry.target.classList.add("animated");
          const numEl = entry.target.querySelector(".stat-number");
          if (numEl) animateCounter(numEl);
        }

        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -60px 0px",
  },
);

// Observe all reveal elements
document.querySelectorAll('[class*="reveal-"]').forEach((el) => {
  revealObserver.observe(el);
});

// Observe stat items separately for counter + bar animation
document.querySelectorAll(".stat-item").forEach((el) => {
  revealObserver.observe(el);
});

// ── 3. COUNTER ANIMATION ─────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600; // ms
  const startTime = performance.now();

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.round(easeOutExpo(progress) * target);
    el.textContent = value.toLocaleString("pl-PL");
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// ── 4. PARALLAX: orbs & hero ─────────────────
const orbs = document.querySelectorAll(".orb");

window.addEventListener(
  "scroll",
  () => {
    const sy = window.scrollY;

    // Subtle parallax on background orbs
    orbs.forEach((orb, i) => {
      const speed = 0.04 + i * 0.015;
      orb.style.transform = `translateY(${sy * speed}px)`;
    });
  },
  { passive: true },
);

// ── 5. MOUSEMOVE: card tilt effect ───────────
document.querySelectorAll(".feature-card, .card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const tiltX = dy * -6;
    const tiltY = dx * 6;
    card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ── 6. BENTO ITEMS: mouse glow effect ────────
document.querySelectorAll(".bento-item").forEach((item) => {
  item.addEventListener("mousemove", (e) => {
    const rect = item.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    item.style.setProperty("--mx", `${x}%`);
    item.style.setProperty("--my", `${y}%`);
  });
});

// ── 7. SMOOTH ANCHOR SCROLL ──────────────────
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ── 8. STAGGER CHILDREN (utility) ────────────
document.querySelectorAll("[data-stagger]").forEach((parent) => {
  [...parent.children].forEach((child, i) => {
    child.style.setProperty("--d", `${i * 0.1}s`);
  });
});
