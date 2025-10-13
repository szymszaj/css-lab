const canvas = document.getElementById("starsCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
  x: null,
  y: null,
  radius: 150,
};

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

const colors = [
  "#FFD700",
  "#FF69B4",
  "#00CED1",
  "#FF1493",
  "#9370DB",
  "#00FF00",
  "#FF4500",
  "#4169E1",
  "#FFD700",
  "#FF00FF",
  "#00FFFF",
  "#FFFF00",
];

class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 3 + 2;
    this.speedY = Math.random() * 1.5 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.5 + 0.5;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity;

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = Math.PI / 2 + (i * Math.PI * 2) / 5;
      const x = Math.cos(angle) * this.size;
      const y = Math.sin(angle) * this.size;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      const innerAngle = angle + Math.PI / 5;
      const innerX = Math.cos(innerAngle) * (this.size * 0.4);
      const innerY = Math.sin(innerAngle) * (this.size * 0.4);
      ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, this.color + "80");

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.fill();

    ctx.restore();
  }

  update() {
    if (mouse.x != null && mouse.y != null) {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * force * 5;
        this.y += Math.sin(angle) * force * 5;
      }
    }

    this.y -= this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotationSpeed;

    this.opacity += Math.sin(Date.now() * 0.001 + this.x) * 0.01;
    this.opacity = Math.max(0.3, Math.min(1, this.opacity));

    if (this.y + this.size < 0) {
      this.y = canvas.height + Math.random() * 100;
      this.x = Math.random() * canvas.width;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    if (this.x < 0 || this.x > canvas.width) {
      this.speedX = -this.speedX;
    }

    this.draw();
  }
}

const stars = [];
const numberOfStars = 100;

for (let i = 0; i < numberOfStars; i++) {
  const star = new Star();
  star.y = Math.random() * canvas.height;
  stars.push(star);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  stars.forEach((star) => {
    star.update();
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});
