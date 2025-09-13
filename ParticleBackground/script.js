const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
let particles = [];
let mouseX = 0,
  mouseY = 0;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width - canvas.width / 2;
    this.y = Math.random() * canvas.height - canvas.height / 2;
    this.z = Math.random() * 1000;
    this.size = Math.random() * 2 + 1;
    this.speed = Math.random() * 0.5 + 0.2;
  }
  update() {
    this.z -= this.speed;
    if (this.z <= 0) {
      this.z = 1000;
    }
  }
  draw() {
    const scale = 200 / this.z;
    const x2d =
      this.x * scale +
      canvas.width / 2 +
      (mouseX - canvas.width / 2) * 0.002 * this.z;
    const y2d =
      this.y * scale +
      canvas.height / 2 +
      (mouseY - canvas.height / 2) * 0.002 * this.z;
    ctx.beginPath();
    ctx.arc(x2d, y2d, this.size * scale, 0, Math.PI * 2);
    ctx.fillStyle = `oklch(${70 + Math.sin(Date.now() / 1000) * 20}% 0.3 ${
      (((this.x + this.y) % 360) + 360) % 360
    })`;
    ctx.fill();
  }
}

function init() {
  particles = [];
  for (let i = 0; i < 400; i++) {
    particles.push(new Particle());
  }
}
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
