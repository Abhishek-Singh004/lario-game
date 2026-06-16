import { Player, PlayerState } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { Tile } from './entities/Tile';

export class CollisionDetector {
  
  static checkAABB(a: {x: number, y: number, width: number, height: number}, 
                   b: {x: number, y: number, width: number, height: number}): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  static applyPhysicsAndResolve(entity: Player | Enemy, tiles: Tile[], deltaTime: number): Tile[] {
    const hitTilesFromBelow: Tile[] = [];

    if (entity instanceof Player && entity.state === PlayerState.DEAD) {
      entity.y += entity.vy * deltaTime;
      return hitTilesFromBelow;
    }

    // X axis
    entity.x += entity.vx * deltaTime;
    for (const p of tiles) {
      if (this.checkAABB(entity, p)) {
        if (entity.vx > 0) { 
          entity.x = p.x - entity.width;
          entity.vx = 0;
          if (entity instanceof Enemy) entity.reverseDirection();
        } else if (entity.vx < 0) { 
          entity.x = p.x + p.width;
          entity.vx = 0;
          if (entity instanceof Enemy) entity.reverseDirection();
        }
      }
    }

    // Y axis
    entity.y += entity.vy * deltaTime;
    let grounded = false;
    for (const p of tiles) {
      if (this.checkAABB(entity, p)) {
        if (entity.vy > 0) { 
          entity.y = p.y - entity.height;
          entity.vy = 0;
          grounded = true;
        } else if (entity.vy < 0) { 
          entity.y = p.y + p.height;
          entity.vy = 0;
          if (entity instanceof Player) {
            hitTilesFromBelow.push(p);
          }
        }
      }
    }
    
    if (entity instanceof Player) {
      entity.isGrounded = grounded;
    }

    return hitTilesFromBelow;
  }
}
