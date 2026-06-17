export enum TileType {
  SOLID,
  BRICK,
  ITEM_FULL,
  ITEM_EMPTY,
  ITEM_FIREBALL
}

export class Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  type: TileType;
  markedForDestruction: boolean = false;
  bounceOffset: number = 0;
  bounceTimer: number = 0;

  constructor(x: number, y: number, width: number, height: number, type: TileType = TileType.SOLID) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
  }

  update(deltaTime: number) {
    if (this.bounceTimer > 0) {
      this.bounceTimer -= deltaTime;
      // Simple sine wave bounce
      this.bounceOffset = Math.sin((this.bounceTimer / 0.15) * Math.PI) * -8;
      if (this.bounceTimer <= 0) {
        this.bounceTimer = 0;
        this.bounceOffset = 0;
      }
    }
  }

  hitFromBelow(): 'break' | 'coin' | 'bounce' | 'none' | 'fireball' {
    if (this.type === TileType.SOLID || this.type === TileType.ITEM_EMPTY) {
      return 'none';
    }

    this.bounceTimer = 0.15; // 150ms bounce animation

    if (this.type === TileType.BRICK) {
      this.markedForDestruction = true;
      return 'break';
    } else if (this.type === TileType.ITEM_FULL) {
      this.type = TileType.ITEM_EMPTY;
      this.bounceTimer = 0.15;
      return 'coin'; // the game will decide if it's coin or powerup based on random chance
    } else if (this.type === TileType.ITEM_FIREBALL) {
      this.type = TileType.ITEM_EMPTY;
      this.bounceTimer = 0.15;
      return 'fireball';
    }
    return 'bounce';
  }
}
