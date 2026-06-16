export class Projectile {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  dead: boolean;

  constructor(x: number, y: number, directionRight: boolean) {
    this.x = x;
    this.y = y;
    this.width = 8;
    this.height = 8;
    this.vx = directionRight ? 400 : -400;
    this.vy = -100;
    this.dead = false;
  }

  update(deltaTime: number, gravity: number) {
    if (this.dead) return;
    this.vy += gravity * deltaTime;
    // position handled in physics/Game
  }
}
