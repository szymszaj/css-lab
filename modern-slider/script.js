class ModernSlider {
  constructor() {
    this.slider = document.querySelector(".slider");
    this.slides = document.querySelectorAll(".slide");
    this.prevBtn = document.querySelector(".nav-btn.prev");
    this.nextBtn = document.querySelector(".nav-btn.next");
    this.indicators = document.querySelectorAll(".indicator");

    this.currentIndex = 0;
    this.slideWidth = 0;
    this.isTransitioning = false;
    this.autoplayInterval = null;

    this.init();
  }

  init() {
    this.updateSlideWidth();
    this.addEventListeners();
    this.updateIndicators();
    this.startAutoplay();
    window.addEventListener("resize", () => this.updateSlideWidth());
  }

  updateSlideWidth() {
    const wrapper = document.querySelector(".slider-wrapper");
    this.slideWidth = wrapper.offsetWidth;
  }

  addEventListeners() {
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.prevSlide();
      if (e.key === "ArrowRight") this.nextSlide();
    });

    this.slider.parentElement.addEventListener("mouseenter", () =>
      this.stopAutoplay(),
    );
    this.slider.parentElement.addEventListener("mouseleave", () =>
      this.startAutoplay(),
    );

    this.addTouchSupport();
  }

  addTouchSupport() {
    let startX = 0;
    let endX = 0;

    this.slider.parentElement.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      this.stopAutoplay();
    });

    this.slider.parentElement.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      this.handleSwipe(startX, endX);
      this.startAutoplay();
    });
  }

  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const difference = startX - endX;

    if (Math.abs(difference) > swipeThreshold) {
      if (difference > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  updateSlideClasses() {
    this.slides.forEach((slide, index) => {
      slide.classList.remove("active", "prev", "next");

      if (index === this.currentIndex) {
        slide.classList.add("active");
      } else if (
        index ===
        (this.currentIndex - 1 + this.slides.length) % this.slides.length
      ) {
        slide.classList.add("prev");
      } else if (index === (this.currentIndex + 1) % this.slides.length) {
        slide.classList.add("next");
      }
    });
  }

  updateSlider() {
    const offset = -this.currentIndex * this.slideWidth;
    this.slider.style.transform = `translateX(${offset}px)`;
    this.updateSlideClasses();
    this.updateIndicators();
  }

  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentIndex);
    });
  }

  nextSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlider();

    setTimeout(() => {
      this.isTransitioning = false;
    }, 800);
  }

  prevSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.currentIndex =
      (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlider();

    setTimeout(() => {
      this.isTransitioning = false;
    }, 800);
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    this.isTransitioning = true;

    this.currentIndex = index;
    this.updateSlider();

    setTimeout(() => {
      this.isTransitioning = false;
    }, 800);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ModernSlider();
});
