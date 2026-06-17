export class Bomb {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isJumping: boolean;
  dead: boolean;
  radius: number = 8;
  active: boolean = true;
  startX: number;

  constructor(x: number, y: number, vx: number) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.startX = x;
    this.vx = vx;
    this.vy = 0;
    this.isJumping = true;
    this.dead = false;
  }

  update(deltaTime: number) {
    if (!this.active) return;

    this.x += this.vx * deltaTime;
    
    // Fall only after traveling 8 tiles (512 pixels) horizontally
    if (Math.abs(this.x - this.startX) >= 512) {
        this.vy += 800 * deltaTime; // gravity
        if (this.vy > 600) this.vy = 600;
        this.y += this.vy * deltaTime;
    }
  }
}
