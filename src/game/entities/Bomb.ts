export class Bomb {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isJumping: boolean;
  dead: boolean;

  constructor(x: number, y: number, vx: number) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.vx = vx;
    this.vy = 0; // Thrown horizontally
    this.isJumping = true;
    this.dead = false;
  }

  update(_deltaTime: number) {
    if (this.dead) return;
    
    // Physics and gravity applied externally via CollisionDetector
    // Bounce logic: if it lands (isJumping becomes false from CollisionDetector), bounce again
    if (!this.isJumping) {
       this.vy = -250; // Small bounce up
       this.isJumping = true;
    }
  }
}
