(() => {
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const uiLevel = document.getElementById("level");
  const uiScore = document.getElementById("score");
  const uiShots = document.getElementById("shots");
  const btnReset = document.getElementById("reset");
  const overlay = document.getElementById("overlay");
  const nextBtn = document.getElementById("next");

  const W = canvas.width,
    H = canvas.height;
  const groundY = H - 80;
  const gravity = 0.45;

  const sling = { x: 140, y: groundY - 100, r: 14 };
  const bandAnchorL = { x: sling.x - 24, y: sling.y + 8 };
  const bandAnchorR = { x: sling.x + 24, y: sling.y + 8 };

  let level = 1;
  let cups = [];
  let stone = null;
  let dragging = false;
  let mouse = { x: sling.x, y: sling.y };
  let hits = 0;
  let shotsLeft = 5;
  let levelWon = false;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resetLevel(keepLevel = false) {
    hits = 0;
    shotsLeft = 5;
    levelWon = false;
    overlay.hidden = true;
    stone = {
      x: sling.x,
      y: sling.y,
      vx: 0,
      vy: 0,
      r: 10,
      active: false,
      trail: [],
    };
    genCups(keepLevel ? level : (level = 1));
    updateUI();
  }

  function genCups(lv) {
    cups = [];
    const cols = Math.min(5, 2 + Math.floor(lv / 2));
    const rows = 2 + Math.min(4, Math.floor((lv + 1) / 2));
    const cupWBase = 46,
      cupHBase = 60;
    const distanceBoost = 260 + lv * 38;
    const scale = 1 - Math.min(0.55, lv * 0.04);
    const cupW = cupWBase * scale,
      cupH = cupHBase * scale;
    const pad = 10 * scale;

    const baseX = Math.min(W - 200, 540 + distanceBoost);
    const startX = baseX - (cols * (cupW + pad)) / 2;
    const startY = groundY - cupH;

    for (let r = 0; r < rows; r++) {
      const colsThis = Math.max(1, cols - (r % 3));
      const y = startY - r * (cupH + pad * 0.8);
      for (let c = 0; c < colsThis; c++) {
        const x = startX + c * (cupW + pad) + r * 0.5 * (cupW * 0.6);
        cups.push({
          x,
          y,
          w: cupW,
          h: cupH,
          hit: false,
          fall: 0,
          vx: rand(-0.6, 0.6),
          vy: 0,
        });
      }
    }
  }

  function updateUI() {
    uiLevel.textContent = `Poziom: ${level}`;
    uiScore.textContent = `Trafienia: ${hits}/${cups.length}`;
    uiShots.textContent = `Strzały: ${shotsLeft}`;
  }

  function isOnSling(px, py) {
    const dx = px - sling.x,
      dy = py - sling.y;
    return Math.hypot(dx, dy) <= 40;
  }

  function pointerDown(px, py) {
    if (levelWon) {
      return;
    }
    if (isOnSling(px, py)) {
      dragging = true;
      mouse.x = px;
      mouse.y = py;
    }
  }
  function pointerMove(px, py) {
    if (dragging) {
      mouse.x = px;
      mouse.y = py;
    }
  }
  function pointerUp() {
    if (!dragging) return;
    dragging = false;
    if (shotsLeft <= 0 || stone.active) return;
    const dx = sling.x - mouse.x;
    const dy = sling.y - mouse.y;
    const dist = Math.min(120, Math.hypot(dx, dy));
    const k = 0.18;
    stone.vx = dx * k;
    stone.vy = dy * k;
    stone.active = true;
    shotsLeft--;
    updateUI();
  }

  canvas.addEventListener("mousedown", (e) => {
    const r = canvas.getBoundingClientRect();
    pointerDown(
      ((e.clientX - r.left) * W) / r.width,
      ((e.clientY - r.top) * H) / r.height
    );
  });
  canvas.addEventListener("mousemove", (e) => {
    const r = canvas.getBoundingClientRect();
    pointerMove(
      ((e.clientX - r.left) * W) / r.width,
      ((e.clientY - r.top) * H) / r.height
    );
  });
  window.addEventListener("mouseup", (e) => pointerUp());

  canvas.addEventListener(
    "touchstart",
    (e) => {
      const t = e.changedTouches[0];
      const r = canvas.getBoundingClientRect();
      pointerDown(
        ((t.clientX - r.left) * W) / r.width,
        ((t.clientY - r.top) * H) / r.height
      );
    },
    { passive: true }
  );
  canvas.addEventListener(
    "touchmove",
    (e) => {
      const t = e.changedTouches[0];
      const r = canvas.getBoundingClientRect();
      pointerMove(
        ((t.clientX - r.left) * W) / r.width,
        ((t.clientY - r.top) * H) / r.height
      );
    },
    { passive: true }
  );
  window.addEventListener("touchend", (e) => pointerUp(), {
    passive: true,
  });

  btnReset.addEventListener("click", () => resetLevel(true));

  nextBtn.addEventListener("click", () => {
    level++;
    resetLevel(true);
  });

  function step() {
    requestAnimationFrame(step);
    update();
    draw();
  }

  function update() {
    if (stone.active) {
      stone.vy += gravity;
      stone.x += stone.vx;
      stone.y += stone.vy;
      stone.trail.push({ x: stone.x, y: stone.y, a: 1 });
      if (stone.trail.length > 30) stone.trail.shift();

      if (stone.y + stone.r > groundY) {
        stone.y = groundY - stone.r;
        stone.vy *= -0.35;
        stone.vx *= 0.6;
        if (Math.abs(stone.vy) < 1.2) {
          stone.vy = 0;
        }
        if (Math.hypot(stone.vx, stone.vy) < 1) {
          stone.active = false;
          setTimeout(() => {
            stone.x = sling.x;
            stone.y = sling.y;
            stone.trail = [];
          }, 300);
        }
      }

      if (stone.x < stone.r) {
        stone.x = stone.r;
        stone.vx *= -0.5;
      }
      if (stone.x > W - stone.r) {
        stone.x = W - stone.r;
        stone.vx *= -0.5;
      }
      if (stone.y < stone.r) {
        stone.y = stone.r;
        stone.vy *= -0.5;
      }

      for (const cup of cups) {
        if (cup.hit) continue;
        if (
          circleRectOverlap(
            stone.x,
            stone.y,
            stone.r,
            cup.x,
            cup.y,
            cup.w,
            cup.h
          )
        ) {
          cup.hit = true;
          hits++;

          const impulse = Math.max(
            3.5,
            Math.min(8, Math.hypot(stone.vx, stone.vy) * 0.12)
          );
          cup.vx += (stone.vx * 0.1 + rand(-0.6, 0.6)) * 0.7;
          cup.vy = -impulse;
          stone.vx *= 0.8;
          stone.vy *= 0.8;
          updateUI();
          if (hits === cups.length) {
            levelWon = true;
            overlay.hidden = false;
          }
        }
      }
    }

    for (const cup of cups) {
      if (!cup.hit) continue;
      cup.vy += gravity * 0.7;
      cup.x += cup.vx;
      cup.y += cup.vy;
      cup.fall += 0.08;
      if (cup.y + cup.h > groundY) {
        cup.y = groundY - cup.h;
        cup.vy *= -0.25;
        cup.vx *= 0.8;
      }
    }

    if (shotsLeft === 0 && !stone.active && !levelWon) {
      setTimeout(() => {
        if (!levelWon) {
          overlay.hidden = false;
          const m = document.getElementById("message");
          m.querySelector("h2").textContent = "Koniec strzałów";
          m.querySelector("p").textContent = "Spróbuj ponownie ten poziom.";
          nextBtn.textContent = "Spróbuj ponownie";
          nextBtn.onclick = () => {
            resetLevel(true);
            nextBtn.onclick = null;
            nextBtn.addEventListener(
              "click",
              () => {
                level++;
                resetLevel(true);
              },
              { once: true }
            );
            overlay.hidden = true;
          };
        }
      }, 400);
    }
  }

  function circleRectOverlap(cx, cy, cr, rx, ry, rw, rh) {
    const nx = Math.max(rx, Math.min(cx, rx + rw));
    const ny = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - nx,
      dy = cy - ny;
    return dx * dx + dy * dy <= cr * cr;
  }

  function draw() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0d1c46");
    g.addColorStop(1, "#0a1330");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.15;
    for (let i = 0; i < 60; i++) {
      const x = (i * 211) % W,
        y = (i * 97) % (H - 200);
      ctx.fillStyle = i % 2 ? "#b7c9ff" : "#8fb2ff";
      ctx.fillRect(x, y, 2, 2);
    }
    ctx.restore();

    ctx.fillStyle = "#1a234b";
    ctx.fillRect(0, groundY, W, H - groundY);

    ctx.fillStyle = "#0f1738";
    ctx.fillRect(0, groundY + 24, W, H - groundY - 24);

    for (const cup of cups) {
      ctx.save();
      const rr = 10;
      const x = cup.x,
        y = cup.y,
        w = cup.w,
        h = cup.h;
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate(cup.fall * (cup.hit ? (cup.vx > 0 ? 1 : -1) : 0));
      ctx.translate(-(x + w / 2), -(y + h / 2));

      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(x + 6, y + 6, w, h);

      roundRect(ctx, x, y, w, h, rr);
      const grad = ctx.createLinearGradient(x, y, x, y + h);
      grad.addColorStop(0, "#c4d7ff");
      grad.addColorStop(1, "#e9f0ff");
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.fillStyle = "#8aa2ff";
      ctx.fillRect(x + 6, y + h * 0.45, w - 12, h * 0.18);
      ctx.restore();
    }

    drawSling();

    if (stone.trail.length) {
      ctx.save();
      stone.trail.forEach((p, i) => {
        const a = i / stone.trail.length;
        ctx.globalAlpha = a * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * a, 0, Math.PI * 2);
        ctx.fillStyle = "#cde7ff";
        ctx.fill();
      });
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(stone.x, stone.y, stone.r, 0, Math.PI * 2);
    const sg = ctx.createRadialGradient(
      stone.x - 3,
      stone.y - 3,
      1,
      stone.x,
      stone.y,
      stone.r
    );
    sg.addColorStop(0, "#ffffff");
    sg.addColorStop(1, "#94a3b8");
    ctx.fillStyle = sg;
    ctx.fill();
    ctx.strokeStyle = "#222a3f";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function drawSling() {
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    const px = dragging ? mouse.x : stone.active ? stone.x : sling.x;
    const py = dragging ? mouse.y : stone.active ? stone.y : sling.y;

    ctx.strokeStyle = "#3e2a16";
    ctx.beginPath();
    ctx.moveTo(bandAnchorL.x, bandAnchorL.y);
    ctx.lineTo(px, py);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(bandAnchorR.x, bandAnchorR.y);
    ctx.lineTo(px, py);
    ctx.stroke();

    ctx.strokeStyle = "#704b28";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(bandAnchorL.x, groundY);
    ctx.lineTo(bandAnchorL.x, bandAnchorL.y);
    ctx.moveTo(bandAnchorR.x, groundY);
    ctx.lineTo(bandAnchorR.x, bandAnchorR.y);
    ctx.stroke();

    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(sling.x, groundY);
    ctx.lineTo(sling.x, sling.y + 24);
    ctx.stroke();

    ctx.fillStyle = "#2e2a28";
    roundRect(ctx, px - 16, py - 8, 32, 16, 6);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(sling.x, sling.y, 9, 0, Math.PI * 2);
    ctx.fillStyle = "#f1b980";
    ctx.fill();
    ctx.strokeStyle = "#2b1c10";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  genCups(level);
  stone = {
    x: sling.x,
    y: sling.y,
    vx: 0,
    vy: 0,
    r: 10,
    active: false,
    trail: [],
  };
  updateUI();
  step();
})();
