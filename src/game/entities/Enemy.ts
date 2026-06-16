export class Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  speed: number;
  dead: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 48;
    this.height = 48;
    this.speed = 50; // pixels per second
    this.vx = -this.speed; // Starts moving left
    this.vy = 0;
    this.dead = false;
  }

  update(_deltaTime: number, tiles: any[]) {
    if (this.dead) return;
    
    // Look ahead to check if there is ground to walk on
    const lookAheadX = this.vx > 0 ? this.x + this.width + 5 : this.x - 5;
    const lookAheadY = this.y + this.height + 5;
    let floorExists = false;

    for (const tile of tiles) {
       if (tile.type === 0 || tile.type === 1 || tile.type === 3) { // SOLID, BRICK, ITEM_EMPTY
           if (lookAheadX > tile.x && lookAheadX < tile.x + tile.width &&
               lookAheadY > tile.y && lookAheadY < tile.y + tile.height) {
               floorExists = true;
               break;
           }
       }
    }

    if (!floorExists) {
        this.reverseDirection();
    }
  }

  reverseDirection() {
    this.vx = -this.vx;
  }
}
