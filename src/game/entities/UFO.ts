export class UFO {
  x: number;
  y: number;
  width: number;
  height: number;
  vy: number = 0;
  active: boolean = false;
  boarded: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 32;
  }

  update(deltaTime: number) {
    if (this.active && !this.boarded) {
      // Descend slowly until it hits platform (y = 352)
      if (this.y < 352) {
         this.y += 100 * deltaTime;
         if (this.y > 352) this.y = 352;
      }
    } else if (this.boarded) {
      // Ascend to win
      this.vy -= 200 * deltaTime; // Accelerate up
      this.y += this.vy * deltaTime;
    }
  }
}
