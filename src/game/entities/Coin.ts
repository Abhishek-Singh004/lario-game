export class Coin {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  
  // Animation properties
  frame: number;
  frameTimer: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;
    this.collected = false;
    this.frame = 0;
    this.frameTimer = 0;
  }

  update(deltaTime: number) {
    if (this.collected) return;
    this.frameTimer += deltaTime;
    if (this.frameTimer > 0.15) { // 150ms per frame
      this.frame = (this.frame + 1) % 4; // 4 animation frames
      this.frameTimer = 0;
    }
  }
}
