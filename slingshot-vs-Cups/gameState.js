export const W = 1280;
export const H = 720;
export const groundY = H - 80;
export const gravity = 0.45;

export const sling = { x: 140, y: groundY - 100, r: 14 };
export const bandAnchorL = { x: sling.x - 24, y: sling.y + 8 };
export const bandAnchorR = { x: sling.x + 24, y: sling.y + 8 };

export let level = 1;
export let cups = [];
export let stone = null;
export let dragging = false;
export let mouse = { x: sling.x, y: sling.y };
export let hits = 0;
export let shotsLeft = 5;
export let levelWon = false;

export function resetLevel(keepLevel = false, overlay, genCups, updateUI) {
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
