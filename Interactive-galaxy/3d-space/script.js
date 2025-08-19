const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cam = { x: 0, y: 0, z: -500, yaw: 0, pitch: 0 };

const stars = [];
for (let i = 0; i < 1500; i++) {
  stars.push({
    x: (Math.random() - 0.5) * 4000,
    y: (Math.random() - 0.5) * 4000,
    z: Math.random() * 4000,
  });
}

const keys = {};
document.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
document.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

document.body.addEventListener("click", () => {
  canvas.requestPointerLock();
});

document.addEventListener("mousemove", (e) => {
  if (document.pointerLockElement === canvas) {
    cam.yaw += e.movementX * 0.002;
    cam.pitch -= e.movementY * 0.002;
    cam.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cam.pitch));
  }
});

function loop() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const speed = 5;
  const forward = keys["w"] ? speed : keys["s"] ? -speed : 0;
  const strafe = keys["a"] ? -speed : keys["d"] ? speed : 0;

  cam.x += Math.cos(cam.yaw) * forward + Math.sin(cam.yaw) * strafe;
  cam.z += Math.sin(cam.yaw) * forward - Math.cos(cam.yaw) * strafe;

  for (let star of stars) {
    let dx = star.x - cam.x;
    let dy = star.y - cam.y;
    let dz = star.z - cam.z;

    let cosY = Math.cos(cam.yaw),
      sinY = Math.sin(cam.yaw);
    let cosP = Math.cos(cam.pitch),
      sinP = Math.sin(cam.pitch);

    let x = cosY * dx - sinY * dz;
    let z = sinY * dx + cosY * dz;
    let y = cosP * dy - sinP * z;
    z = sinP * dy + cosP * z;

    if (z > 1) {
      let scale = 500 / z;
      let sx = x * scale + canvas.width / 2;
      let sy = y * scale + canvas.height / 2;
      let size = Math.max(0.5, 2 - z / 1000);

      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    }
  }

  requestAnimationFrame(loop);
}
loop();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
