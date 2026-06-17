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
    this.y = y - 96; // Offset for new height
    this.width = 256;
    this.height = 128;
  }

  update(deltaTime: number) {
    if (this.active && !this.boarded) {
      // Descend slowly until it hits platform (y = 256)
      if (this.y < 256) {
         this.y += 100 * deltaTime;
         if (this.y > 256) this.y = 256;
      }
    } else if (this.boarded) {
      // Ascend to win
      this.vy -= 200 * deltaTime; // Accelerate up
      this.y += this.vy * deltaTime;
    }
  }
}
