export class PlayerFireball {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  dead: boolean = false;
  startX: number;
  
  // physics
  gravity: number = 800;

  constructor(x: number, y: number, facingRight: boolean) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.width = 16;
    this.height = 16;
    this.vx = facingRight ? 600 : -600; // fast horizontal speed
    this.vy = 0; // initially no vertical speed
  }

  update(deltaTime: number) {
    if (this.dead) return;

    this.x += this.vx * deltaTime;
    
    // Check if it traveled 4 tiles (256 pixels)
    if (Math.abs(this.x - this.startX) >= 256) {
        // Stop horizontal speed, start falling
        this.vx = 0;
        this.vy += this.gravity * deltaTime;
        this.y += this.vy * deltaTime;
    }

    // if it falls off screen (arbitrary large Y)
    if (this.y > 1000) {
        this.dead = true;
    }
  }
}
