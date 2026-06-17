import { Player, PlayerState } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { AirEnemy } from './entities/AirEnemy';
import { Coin } from './entities/Coin';
import { Tile, TileType } from './entities/Tile';
import { Powerup, PowerupType } from './entities/Powerup';
import { Projectile } from './entities/Projectile';
import { Boss } from './entities/Boss';
import { UFO } from './entities/UFO';
import { Bomb } from './entities/Bomb';

import { Camera } from './Camera';
import { InputHandler } from './InputHandler';
import { SoundManager } from './SoundManager';
import { CollisionDetector } from './CollisionDetector';
import { ParticleManager } from './ParticleManager';
import { AssetManager } from './AssetManager';

// A massively expanded level (10 rows for 600px canvas height with 64px tiles)
// Row 7 is the ground, with deep pits. Rows 8-9 are empty below.
const LEVEL = [
  "................A.........................A.........................A................................A.......................................A.........................A.........................A................................A.......................",
  ".......A...........................A.......................A..............................A.........................A...................A...........................A.......................A..............................A.........................A..",
  "..............................A.........................A.........................A.............................A........................................A.........................A.........................A.............................A..........",
  "......................................................................................................................................................................................................................................................",
  "........?..........B..B..B....B..BA............................A........B..B......B...BC...C....A.............?.........B..B....A.................B..B....C....?.....C.....B.C.........A.......B..B..........BC...C...A...............?........B.....F..",
  "...............B............B................B......C.......B...................B..............B...................B............C......B........................B................C..B...................B..............B.........................B.....B",
  "..P...........E......................C.......E............C...E...............C...............E...........C...C.......E................C.......E..................E......................C...............E...........C...C.......E...................O",
  "#######################..################################..#######################################...########################..#######################################...################################..###############################################",
  "..........................................................................................................................................................................................................................................................",
  ".........................................................................................................................................................................................................................................................."
];

import { PlayerFireball } from './entities/PlayerFireball';

export class Game {
  player!: Player;
  enemies: (Enemy | AirEnemy)[] = [];
  coins: Coin[] = [];
  tiles: Tile[] = [];
  powerups: Powerup[] = [];
  projectiles: Projectile[] = [];
  playerFireballs: PlayerFireball[] = [];
  bombs: Bomb[] = [];
  boss: Boss | null = null;
  ufo: UFO | null = null;
  checkpoints: {x: number, y: number}[] = [];
  
  camera: Camera;
  input: InputHandler;
  sounds: SoundManager;
  particles: ParticleManager;
  assets: AssetManager;
  
  score: number = 0;
  lives: number = 3;
  coinsCount: number = 0;
  isGameOver: boolean = false;
  isLevelCleared: boolean = false;

  levelWidth: number = 0;
  levelHeight: number = 0;
  bossArenaX: number = 0;
  inBossArena: boolean = false;
  cutsceneMode: boolean = false;
  brickBreakCounter: number = 0;

  constructor(canvasWidth: number, canvasHeight: number, assets: AssetManager) {
    this.assets = assets;
    this.input = new InputHandler();
    this.sounds = new SoundManager();
    this.particles = new ParticleManager();
    this.parseLevel(LEVEL);
    this.camera = new Camera(canvasWidth, canvasHeight, this.levelWidth);
    this.updateUI();
  }

  parseLevel(levelGrid: string[]) {
    this.enemies = [];
    this.coins = [];
    this.tiles = [];
    this.powerups = [];
    this.projectiles = [];
    this.playerFireballs = [];
    this.bombs = [];
    this.boss = null;
    this.ufo = null;
    this.inBossArena = false;
    this.cutsceneMode = false;
    
    const tileSize = 64; // Updated to 64px for new assets
    this.levelHeight = levelGrid.length * tileSize;
    this.levelWidth = levelGrid[0].length * tileSize;
    this.bossArenaX = this.levelWidth - 800; // Last screen

    for (let y = 0; y < levelGrid.length; y++) {
      for (let x = 0; x < levelGrid[y].length; x++) {
        const char = levelGrid[y][x];
        const px = x * tileSize;
        const py = y * tileSize;

        if (char === '#') {
          this.tiles.push(new Tile(px, py, tileSize, tileSize, TileType.SOLID));
        } else if (char === 'B') {
          this.tiles.push(new Tile(px, py, tileSize, tileSize, TileType.BRICK));
        } else if (char === '?') {
          this.tiles.push(new Tile(px, py, tileSize, tileSize, TileType.ITEM_FULL));
        } else if (char === 'F') {
          this.tiles.push(new Tile(px, py, tileSize, tileSize, TileType.ITEM_FIREBALL));
        } else if (char === 'P') {
          this.player = new Player(px, py); 
        } else if (char === 'E') {
          this.enemies.push(new Enemy(px, py + 16)); // Shift down 16px since 48 height
        } else if (char === 'A') {
          this.enemies.push(new AirEnemy(px, py));
        } else if (char === 'C') {
          this.coins.push(new Coin(px + 16, py + 16));
        } else if (char === 'O') {
          this.boss = new Boss(px, py); // Boss is 64x64
        } else if (char === 'U') {
          this.ufo = new UFO(px, py);
        }
      }
    }

    this.checkpoints = [];
    for (let i = 1; i <= 9; i++) {
        const targetX = (this.levelWidth / 10) * i;
        let bestTile: Tile | null = null;
        let minDx = Infinity;
        
        for (const tile of this.tiles) {
            if (tile.type === TileType.SOLID || tile.type === TileType.BRICK) {
                const dx = Math.abs(tile.x - targetX);
                // Pick nearest tile in X; if same X, pick the one highest up (smallest Y) to ensure it's the floor
                if (dx < minDx || (dx === minDx && bestTile && tile.y < bestTile.y)) {
                    minDx = dx;
                    bestTile = tile;
                }
            }
        }
        if (bestTile) {
            this.checkpoints.push({ x: bestTile.x, y: bestTile.y - 48 }); // 48 is player height
        }
    }
  }

  resetLevel() {
    this.isGameOver = false;
    this.isLevelCleared = false;
    document.getElementById('game-over-screen')?.classList.add('hidden');
    document.getElementById('level-clear-screen')?.classList.add('hidden');
    this.parseLevel(LEVEL);
  }

  update(deltaTime: number) {
    if (this.input.isPressed('KeyR')) {
      if (this.isGameOver || this.isLevelCleared) {
         this.lives = 3;
         this.score = 0;
         this.coinsCount = 0;
         this.updateUI();
         this.resetLevel();
      }
    }

    if (this.isGameOver || this.isLevelCleared) {
        this.input.update();
        return;
    }

    let inputX = 0;
    let jumpPressed = false;
    let jumpHeld = false;
    let dashHeld = false;

    if (!this.cutsceneMode) {
      if (this.input.isDown('ArrowLeft')) inputX -= 1;
      if (this.input.isDown('ArrowRight')) inputX += 1;
      jumpPressed = this.input.isPressed('Space') || this.input.isPressed('ArrowUp');
      jumpHeld = this.input.isDown('Space') || this.input.isDown('ArrowUp');
      dashHeld = this.input.isDown('ShiftLeft') || this.input.isDown('ShiftRight');
    } else if (this.ufo && this.ufo.active) {
      const targetX = this.ufo.x + this.ufo.width / 2 - this.player.width / 2;
      if (this.player.x < targetX - 5) {
        inputX = 1;
      } else if (this.player.x > targetX + 5) {
        inputX = -1;
      } else {
        inputX = 0;
        if (this.ufo.y >= 256) {
           this.ufo.boarded = true;
           this.player.y = -1000; // Hide player inside UFO
        }
      }
    }

    if (inputX !== 0 || jumpPressed) {
      this.sounds.init();
    }

    this.player.update(deltaTime, inputX, jumpPressed, jumpHeld, dashHeld);
    
    if (this.player.justJumped) {
      this.sounds.playJump();
    }
    
    if (this.player.wantsToShootFireball) {
        this.playerFireballs.push(new PlayerFireball(this.player.x, this.player.y + 16, this.player.facingRight));
        this.sounds.playMagic();
    }

    const hitTiles = CollisionDetector.applyPhysicsAndResolve(this.player, this.tiles, deltaTime);
    
    for (const tile of hitTiles) {
        const action = tile.hitFromBelow();
        if (action === 'break') {
            this.particles.spawnBrickDebris(tile.x, tile.y);
            this.sounds.playStomp();
            this.brickBreakCounter++;
            // Check for Powerup drop (1/6 chance)
            const rng = Math.random();
            if (rng < 1/6) {
                const type = Math.random() < 0.5 ? PowerupType.HEART : PowerupType.GEM;
                this.powerups.push(new Powerup(tile.x, tile.y, type));
            } else if (this.brickBreakCounter % 2 === 0) {
                this.coins.push(new Coin(tile.x, tile.y));
            }
        } else if (action === 'coin') {
            this.coinsCount++;
            this.score += 100;
            this.particles.spawnCoinSparkle(tile.x, tile.y - 16);
            this.sounds.playCoin();
            this.updateUI();
        } else if (action === 'fireball') {
            this.powerups.push(new Powerup(tile.x, tile.y, PowerupType.FIREBALL));
            this.sounds.playCoin(); // Or some magic sound
        }
    }
    
    // Cleanup broken tiles
    this.tiles = this.tiles.filter(t => !t.markedForDestruction);

    if (this.boss) {
      if (!this.boss.active && (this.inBossArena || this.player.x >= this.levelWidth * 0.95)) {
        this.boss.active = true;
      }
      this.boss.update(deltaTime, this.player, this.tiles);
      CollisionDetector.applyPhysicsAndResolve(this.boss as any, this.tiles, deltaTime);
      
      // Transfer spawned bombs to the game level
      if (this.boss.bombsToSpawn.length > 0) {
          for (const b of this.boss.bombsToSpawn) {
              this.bombs.push(new Bomb(b.x, b.y, b.vx));
          }
          this.boss.bombsToSpawn = [];
      }
    }

    // Update Bombs
    for (const bomb of this.bombs) {
        bomb.update(deltaTime);
        
        // Bomb kills player
        if (!bomb.dead && this.player.state !== PlayerState.DEAD && CollisionDetector.checkAABB(this.player, bomb)) {
            this.killPlayer();
        }
        
        // Remove bombs that fall off screen
        if (bomb.y > this.levelHeight + 200) {
            bomb.dead = true;
        }
    }
    this.bombs = this.bombs.filter(b => !b.dead);

    // Update Player Fireballs
    for (const fb of this.playerFireballs) {
        fb.update(deltaTime);
        
        if (!fb.dead && this.boss && !this.boss.dead && this.boss.active && CollisionDetector.checkAABB(fb, this.boss)) {
            fb.dead = true;
            this.boss.dead = true; // INSTANT KILL
            this.sounds.playStomp();
            this.particles.spawnBrickDebris(this.boss.x, this.boss.y);
            this.score += 5000;
            this.updateUI();
            
            if (this.boss.dead && !this.ufo) {
                this.ufo = new UFO(this.boss.x, -100);
                this.ufo.active = true;
                this.cutsceneMode = true;
            }
        }
    }
    this.playerFireballs = this.playerFireballs.filter(fb => !fb.dead);

    // Update Powerups
    for (const powerup of this.powerups) {
      powerup.update(deltaTime);
      if (!powerup.collected && this.player.state !== PlayerState.DEAD && CollisionDetector.checkAABB(this.player, powerup)) {
         powerup.collected = true;
         if (powerup.type === PowerupType.HEART) {
             this.sounds.playCoin(); 
             this.lives++;
             this.updateUI();
         } else if (powerup.type === PowerupType.GEM) {
             this.sounds.playCoin(); 
             this.player.isInvincible = true;
             this.player.invincibleTimer = 15;
         } else if (powerup.type === PowerupType.FIREBALL) {
             this.sounds.playCoin();
             this.player.hasFireball = true;
             this.player.fireballDuration = 5.0;
             this.player.fireballsShot = 0;
             this.player.fireballShootTimer = 0; // shoot immediately
         }
      }
    }
    this.powerups = this.powerups.filter(p => !p.collected);

    for (const tile of this.tiles) {
       tile.update(deltaTime);
    }

    for (const enemy of this.enemies) {
      if (enemy instanceof Enemy) {
        enemy.update(deltaTime, this.tiles);
        CollisionDetector.applyPhysicsAndResolve(enemy, this.tiles, deltaTime);
      } else {
        enemy.update(deltaTime);
      }
      
      const hitBox = {
          x: enemy.x + 8,
          y: enemy.y + 8,
          width: enemy.width - 16,
          height: enemy.height - 8
      };
      
      if (!enemy.dead && this.player.state !== PlayerState.DEAD && CollisionDetector.checkAABB(this.player, hitBox)) {
        if (this.player.isInvincible) {
            enemy.dead = true;
            this.sounds.playStomp();
            this.particles.spawnBrickDebris(enemy.x, enemy.y);
            this.score += 200;
            this.updateUI();
        } else if (this.player.vy > 0 && this.player.y + this.player.height < enemy.y + enemy.height / 2) {
            // Player stomps enemy
            enemy.dead = true;
            this.sounds.playStomp();
            this.player.vy = this.player.jumpForce * 0.8; 
            this.particles.spawnBrickDebris(enemy.x, enemy.y);
            this.score += 100;
            this.updateUI();
        } else {
            // Enemy hits player
            this.killPlayer();
        }
      }
    }

    if (this.boss && !this.boss.dead && this.player.state !== PlayerState.DEAD && CollisionDetector.checkAABB(this.player, this.boss)) {
        if (this.player.vy > 0 && this.player.y + this.player.height < this.boss.y + this.boss.height / 2) {
            this.boss.takeDamage();
            this.player.vy = this.player.jumpForce * 0.8;
            this.sounds.playStomp();
            this.score += 1000;
            this.particles.spawnBrickDebris(this.boss.x, this.boss.y);
            this.updateUI();
            
            if (this.boss.dead) {
                // Boss dead, spawn UFO
                this.ufo = new UFO(this.boss.x, -100);
                this.ufo.active = true;
                this.cutsceneMode = true;
            }
        } else {
            this.killPlayer();
        }
    }

    for (const coin of this.coins) {
      coin.update(deltaTime);
      if (!coin.collected && CollisionDetector.checkAABB(this.player, coin)) {
        coin.collected = true;
        this.sounds.playCoin();
        this.score += 50;
        this.coinsCount++;
        this.particles.spawnCoinSparkle(coin.x, coin.y);
        this.updateUI();
      }
    }

    this.particles.update(deltaTime);

    if (this.ufo) {
        this.ufo.update(deltaTime);
        if (this.ufo.boarded && this.ufo.y < -200) {
            this.isLevelCleared = true;
            document.getElementById('level-clear-screen')?.classList.remove('hidden');
        }
    }

    if (this.player.x > this.bossArenaX) {
       this.inBossArena = true;
    }

    if (this.inBossArena) {
       this.camera.update(this.bossArenaX + 400); // Lock camera

       // Lock player inside the arena
       if (this.player.x < this.bossArenaX) {
           this.player.x = this.bossArenaX;
       }
       if (this.player.x > this.levelWidth - this.player.width) {
           this.player.x = this.levelWidth - this.player.width;
       }

       // Lock boss inside the arena
       if (this.boss && !this.boss.dead) {
           if (this.boss.x < this.bossArenaX) {
               this.boss.x = this.bossArenaX;
           }
           if (this.boss.x > this.levelWidth - this.boss.width) {
               this.boss.x = this.levelWidth - this.boss.width;
           }
       }
    } else {
       this.camera.update(this.player.x);
    }

    if (this.player.y > this.levelHeight && this.player.state !== PlayerState.DEAD) {
      this.killPlayer();
    }

    this.input.update();
  }

  killPlayer() {
    this.player.die();
    this.sounds.playDeath();
    this.lives -= 1;
    this.updateUI();
    
    if (this.lives <= 0) {
      this.isGameOver = true;
      document.getElementById('game-over-screen')?.classList.remove('hidden');
    } else {
      setTimeout(() => {
        if (!this.isGameOver) this.revivePlayer();
      }, 1000);
    }
  }

  revivePlayer() {
    let bestCp = { x: 100, y: 100 }; // default start
    for (const cp of this.checkpoints) {
        if (cp.x <= this.player.x) {
            if (cp.x > bestCp.x) {
                bestCp = cp;
            }
        }
    }
    
    this.player.x = bestCp.x;
    this.player.y = bestCp.y;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.state = PlayerState.IDLE;
    this.player.isInvincible = true;
    this.player.invincibleTimer = 2.0;
    
    if (this.player.x < this.bossArenaX) {
        this.inBossArena = false;
        this.camera.update(this.player.x);
    } else {
        this.camera.update(this.bossArenaX + 400);
    }
  }

  updateUI() {
    const scoreEl = document.getElementById('score-val');
    const livesEl = document.getElementById('lives-val');
    const coinsEl = document.getElementById('coins-val');
    
    if (scoreEl) scoreEl.innerText = this.score.toString().padStart(6, '0');
    if (livesEl) livesEl.innerText = this.lives.toString();
    if (coinsEl) coinsEl.innerText = this.coinsCount.toString().padStart(2, '0');
  }
}
