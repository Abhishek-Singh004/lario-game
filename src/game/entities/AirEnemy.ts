export class AirEnemy {
  x: number;
  y: number;
  width: number;
  height: number;
  startX: number;
  startY: number;
  speed: number;
  dead: boolean;
  time: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.width = 64;
    this.height = 64;
    this.speed = 40; // pixels per second
    this.dead = false;
  }

  update(deltaTime: number) {
    if (this.dead) return;
    this.time += deltaTime;
    
    // Sine wave pattern
    this.x -= this.speed * deltaTime;
    this.y = this.startY + Math.sin(this.time * 2) * 50; 
  }
}
