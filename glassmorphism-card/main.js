document.addEventListener("DOMContentLoaded", () => {
  const container = document.createElement("div");
  container.className = "container";
  document.body.appendChild(container);

  // Create animated background
  const animatedBg = document.createElement("div");
  animatedBg.className = "animated-bg";
  document.body.appendChild(animatedBg);

  // Create particles
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div");
    particle.className = "particles";

    // Random positioning
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const size = Math.random() * 5 + 3;
    const duration = Math.random() * 10 + 5;

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animation = `float ${duration}s ease-in-out infinite`;
    particle.style.animationDelay = `${Math.random() * 5}s`;
    particle.style.opacity = Math.random() * 0.7 + 0.3;

    animatedBg.appendChild(particle);
  }

  // Card data
  const cardsData = [
    {
      frontTitle: "3D Design",
      frontText: "Interactive Experience",
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      badge: "Popular",
      backTitle: "Design Details",
      backText:
        "This card showcases modern 3D transitions with interactive elements. Hover over different parts to see animations and effects in real-time.",
      keywords: ["Design", "Creative", "3D", "Art", "Interactive"],
    },
    {
      frontTitle: "Web Animation",
      frontText: "Modern Effects",
      image:
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      badge: "New",
      backTitle: "Animation Info",
      backText:
        "Discover the power of web animations with this interactive card. The floating text and 3D transitions create an immersive experience.",
      keywords: ["Motion", "Animation", "Effects", "Interactive", "Web"],
    },
    {
      frontTitle: "Creative Code",
      frontText: "Next Generation",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      badge: "Featured",
      backTitle: "Code Details",
      backText:
        "This card demonstrates how creative coding can produce stunning visual effects. The interactive elements respond to user interaction.",
      keywords: ["Code", "Creative", "Development", "Tech", "Future"],
    },
  ];

  // Create cards
  cardsData.forEach((data) => {
    const card = document.createElement("div");
    card.className = "card";

    // Create front face
    const frontFace = document.createElement("div");
    frontFace.className = "face front";

    const frontContent = document.createElement("div");
    frontContent.className = "content";

    const image = document.createElement("img");
    image.src = data.image;
    image.alt = data.frontTitle;

    const title = document.createElement("h3");
    title.textContent = data.frontTitle;

    const text = document.createElement("p");
    text.textContent = data.frontText;

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = data.badge;

    const button = document.createElement("a");
    button.href = "#";
    button.className = "button";
    button.textContent = "Learn More";

    frontContent.appendChild(image);
    frontContent.appendChild(title);
    frontContent.appendChild(text);
    frontContent.appendChild(button);
    frontFace.appendChild(frontContent);
    frontFace.appendChild(badge);

    // Create back face
    const backFace = document.createElement("div");
    backFace.className = "face back";

    const backTitle = document.createElement("h3");
    backTitle.textContent = data.backTitle;

    const backText = document.createElement("p");
    backText.textContent = data.backText;

    const socialIcons = document.createElement("div");
    socialIcons.className = "social-icons";

    // Add some icons
    for (let i = 0; i < 4; i++) {
      const icon = document.createElement("i");
      icon.className = `icon-${i}`;
      icon.innerHTML = "★"; // Using a star as placeholder for social icons
      socialIcons.appendChild(icon);
    }

    backFace.appendChild(backTitle);
    backFace.appendChild(backText);
    backFace.appendChild(socialIcons);

    card.appendChild(frontFace);
    card.appendChild(backFace);
    container.appendChild(card);

    // Add floating text animation
    data.keywords.forEach((keyword) => {
      setInterval(() => {
        const floatingText = document.createElement("div");
        floatingText.className = "floating-text";
        floatingText.textContent = keyword;

        // Random positioning around the card
        const rect = card.getBoundingClientRect();
        const x = rect.left + Math.random() * rect.width;
        const y = rect.top + rect.height;

        floatingText.style.left = `${x}px`;
        floatingText.style.top = `${y}px`;
        floatingText.style.animation = `floatingText ${
          Math.random() * 3 + 4
        }s ease-out forwards`;

        document.body.appendChild(floatingText);

        // Remove after animation completes
        setTimeout(() => {
          floatingText.remove();
        }, 7000);
      }, Math.random() * 4000 + 3000);
    });
  });
});

// Add 3D effect to cards
const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = (x - centerX) / 10;
    const rotateX = (centerY - y) / 10;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // Add depth to content elements
    const contents = card.querySelectorAll(".content *");
    contents.forEach((element, index) => {
      const z = 50 + index * 10;
      element.style.transform = `translateZ(${z}px)`;
    });
  });
});
