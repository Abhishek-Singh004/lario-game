export class Boss {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  health: number;
  dead: boolean;
  active: boolean = false;
  
  stateTimer: number = 0;
  isJumping: boolean = false;
  speed: number = 300;
  
  shootTimer: number = 0;
  bombsToSpawn: {x: number, y: number, vx: number}[] = [];
  
  phase: 'BOMBING' | 'CHASING' = 'BOMBING';
  phaseTimer: number = 0;
  jumpTimer: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.width = 64; 
    this.height = 64;
    this.vx = 0; 
    this.vy = 0;
    this.health = 1; 
    this.dead = false;
  }

  update(deltaTime: number, player: any, tiles: any[]) {
    if (this.dead) return;
    if (!this.active) {
        this.vx = 0;
        return;
    }
    
    if (this.vy === 0) {
        this.isJumping = false;
    }

    this.phaseTimer += deltaTime;
    const distToPlayer = Math.abs(player.x - this.x);

    let shouldJump = false;

    if (this.phase === 'BOMBING') {
      // Phase 1: Bombing (First 10 seconds)
      // Stay near the right edge or pace slowly, but don't aggressively chase
      this.vx = 0; 

      if (distToPlayer < 800) {
         this.shootTimer += deltaTime;
         if (this.shootTimer >= 1.5) { // Shoot more frequently in bombing phase
            this.shootTimer = 0;
            const bombVx = this.x < player.x ? 300 : -300;
            this.bombsToSpawn.push({ x: this.x + this.width / 2, y: this.y, vx: bombVx });
         }
      }

      if (this.phaseTimer > 10.0) {
         this.phase = 'CHASING';
         this.jumpTimer = 0;
      }
    } else {
      // Phase 2: Chasing and Evasion
      if (player.x > this.x) {
        this.vx = this.speed;
      } else {
        this.vx = -this.speed;
      }

      // Random jumping to evade player
      this.jumpTimer += deltaTime;
      if (this.jumpTimer > 1.0) {
         if (Math.random() < 0.4) {
            shouldJump = true;
         }
         this.jumpTimer = 0;
      }
    }

    // Pit and Wall Detection for Jumping over obstacles
    // We only need to check if moving. But if stationary in Bomb phase, it won't hit pits.
    if (this.vx !== 0) {
       const lookAheadX = this.vx > 0 ? this.x + this.width + 10 : this.x - 10;
       const lookAheadYWall = this.y + this.height - 10;
       const lookAheadYFloor = this.y + this.height + 5;
       
       let floorExists = false;
       let wallExists = false;

       for (const tile of tiles) {
          if (tile.type === 0 || tile.type === 1 || tile.type === 3) { // SOLID, BRICK, ITEM_EMPTY
             // Wall detection
             if (lookAheadX > tile.x && lookAheadX < tile.x + tile.width &&
                 lookAheadYWall > tile.y && lookAheadYWall < tile.y + tile.height) {
                 wallExists = true;
             }
             // Pit detection
             if (lookAheadX > tile.x && lookAheadX < tile.x + tile.width &&
                 lookAheadYFloor > tile.y && lookAheadYFloor < tile.y + tile.height) {
                 floorExists = true;
             }
          }
       }

       if (wallExists || !floorExists) {
          shouldJump = true;
       }
    }

    if (shouldJump && !this.isJumping) {
      // Randomize jump height slightly
      this.vy = -500 - Math.random() * 200; 
      this.isJumping = true;
    }
  }

  reverseDirection() {
    this.vx = -this.vx;
  }

  takeDamage() {
    this.health--;
    if (this.health <= 0) {
      this.dead = true;
    }
  }
}
