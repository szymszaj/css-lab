const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let slingshotX = 150;
let slingshotY = canvas.height - 100;
let dragging = false;
let dragStart = null;
let projectile = null;
let cups = [];
let level = 1;
let shots = 5;

class Projectile {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = 8;
    this.active = true;
  }

  update() {
    if (!this.active) return;
    this.x += this.dx;
    this.y += this.dy;
    this.dy += 0.3;

    if (this.x < 0 || this.x > canvas.width || this.y > canvas.height) {
      this.active = false;
    }
  }

  draw() {
    if (!this.active) return;
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Cup {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 60;
    this.hit = false;
  }

  draw() {
    if (this.hit) return;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }

  checkCollision(p) {
    if (this.hit || !p.active) return false;
    if (
      p.x + p.radius > this.x &&
      p.x - p.radius < this.x + this.width &&
      p.y + p.radius > this.y &&
      p.y - p.radius < this.y + this.height
    ) {
      this.hit = true;
      p.active = false;
      return true;
    }
    return false;
  }
}

function generateCups() {
  cups = [];
  let offsetX = 400 + level * 20;
  let offsetY = 300 - level * 10;
  for (let i = 0; i < level + 2; i++) {
    cups.push(new Cup(offsetX + i * 50, offsetY));
  }
}

function drawSlingshot() {
  ctx.beginPath();
  ctx.moveTo(slingshotX - 20, slingshotY);
  ctx.lineTo(slingshotX + 20, slingshotY);
  ctx.strokeStyle = "brown";
  ctx.lineWidth = 5;
  ctx.stroke();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSlingshot();

  if (projectile) {
    projectile.update();
    projectile.draw();
    cups.forEach((c) => c.checkCollision(projectile));
  }

  cups.forEach((c) => c.draw());

  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Level: ${level}`, 20, 30);
  ctx.fillText(`Strzały: ${shots}`, 20, 60);

  if (cups.every((c) => c.hit)) {
    level++;
    shots = 5;
    generateCups();
  }

  if (shots <= 0 && cups.some((c) => !c.hit)) {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText("Koniec gry!", canvas.width / 2 - 100, canvas.height / 2);
    return;
  }

  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("mousedown", (e) => {
  dragging = true;
  dragStart = { x: e.offsetX, y: e.offsetY };
});

canvas.addEventListener("mouseup", (e) => {
  if (dragging && shots > 0) {
    let dx = (dragStart.x - e.offsetX) * 0.2;
    let dy = (dragStart.y - e.offsetY) * 0.2;
    projectile = new Projectile(slingshotX, slingshotY, -dx, -dy);
    shots--;
  }
  dragging = false;
});

canvas.addEventListener("touchstart", (e) => {
  let touch = e.touches[0];
  let rect = canvas.getBoundingClientRect();
  dragging = true;
  dragStart = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
});

canvas.addEventListener("touchend", (e) => {
  if (dragging && shots > 0) {
    let rect = canvas.getBoundingClientRect();
    let touch = e.changedTouches[0];
    let dx = (dragStart.x - (touch.clientX - rect.left)) * 0.2;
    let dy = (dragStart.y - (touch.clientY - rect.top)) * 0.2;
    projectile = new Projectile(slingshotX, slingshotY, -dx, -dy);
    shots--;
  }
  dragging = false;
});

generateCups();
gameLoop();
