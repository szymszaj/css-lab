document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", function (e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = (x - centerX) / 15;
      const rotateX = (centerY - y) / 15;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) translateZ(0)";
    });

    const animatedText = card.querySelector(".animated-text");
    const words = animatedText.getAttribute("data-text").split(",");

    function createFloatingText() {
      if (!card.matches(":hover")) return;

      const floatingText = document.createElement("span");
      floatingText.className = "floating-text";

      const word = words[Math.floor(Math.random() * words.length)];
      floatingText.textContent = word;

      const cardRect = card.getBoundingClientRect();
      const startX =
        Math.random() * cardRect.width * 0.6 + cardRect.width * 0.2;
      const startY =
        Math.random() * cardRect.height * 0.6 + cardRect.height * 0.2;

      floatingText.style.left = `${startX}px`;
      floatingText.style.top = `${startY}px`;

      const animationDuration = Math.random() * 2 + 2;
      floatingText.style.animationDuration = `${animationDuration}s`;

      card.appendChild(floatingText);

      setTimeout(() => {
        if (floatingText.parentNode === card) {
          floatingText.remove();
        }
      }, animationDuration * 1000);
    }

    card.addEventListener("mouseenter", function () {
      createFloatingText();
      card.animationInterval = setInterval(createFloatingText, 600);
    });

    card.addEventListener("mouseleave", function () {
      clearInterval(card.animationInterval);
    });
  });
});
