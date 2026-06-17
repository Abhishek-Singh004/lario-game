export enum PowerupType {
  HEART,
  GEM,
  FIREBALL
}

export class Powerup {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  type: PowerupType;
  collected: boolean;
  
  // Animation properties
  time: number = 0;
  startY: number;

  constructor(x: number, y: number, type: PowerupType) {
    this.x = x;
    this.y = y;
    this.startY = y;
    this.width = 64;
    this.height = 64;
    this.type = type;
    this.collected = false;
    this.vx = 0;
    this.vy = -200; // Pops out of block slightly
  }

  update(deltaTime: number) {
    if (this.collected) return;
    
    // Simple gravity for popping out
    this.vy += 1000 * deltaTime;
    this.y += this.vy * deltaTime;
    
    // Stop falling when it hits the block's top (startY - 64)
    if (this.y > this.startY - 64) {
       this.y = this.startY - 64;
       this.vy = 0;
       
       // Bobbing animation once landed
       this.time += deltaTime;
       this.y = this.startY - 64 + Math.sin(this.time * 5) * 5;
    }
  }

  reverseDirection() {
    this.vx = -this.vx;
  }
}
