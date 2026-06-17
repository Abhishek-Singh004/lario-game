import { Game } from './Game';
import { PlayerState } from './entities/Player';
import { TileType } from './entities/Tile';
import { AirEnemy } from './entities/AirEnemy';
import { PowerupType } from './entities/Powerup';

export class GameRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Could not get 2D context");
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false; // Pixel art
  }

  render(game: Game) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const camX = game.camera.x;
    
    // 1. Draw Parallax Backgrounds
    const sky = game.assets.get('bg_sky');
    const clouds = game.assets.get('bg_clouds');
    
    // Draw sky statically
    this.ctx.drawImage(sky, 0, 0, this.canvas.width, this.canvas.height);
    
    // Draw clouds with parallax
    const cloudParallax = (-camX * 0.2) % this.canvas.width;
    this.ctx.drawImage(clouds, cloudParallax, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(clouds, cloudParallax + this.canvas.width, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.translate(-camX, -game.camera.y);

    // 2. Draw Tiles
    const platformImg = game.assets.get('platform');
    const brickImg = game.assets.get('brick');
    const itemBlockImg = game.assets.get('item_block');
    
    for (const tile of game.tiles) {
      if (tile.type === TileType.SOLID) {
         this.ctx.drawImage(platformImg, tile.x, tile.y, tile.width, tile.height);
      } else if (tile.type === TileType.BRICK) {
         this.ctx.drawImage(brickImg, tile.x, tile.y + tile.bounceOffset, tile.width, tile.height);
      } else if (tile.type === TileType.ITEM_FULL) {
         this.ctx.drawImage(itemBlockImg, tile.x, tile.y + tile.bounceOffset, tile.width, tile.height);
      } else if (tile.type === TileType.ITEM_EMPTY) {
         // It should be markedForDestruction, but just in case
         this.ctx.fillStyle = 'rgba(150, 150, 150, 0.8)';
         this.ctx.fillRect(tile.x, tile.y + tile.bounceOffset, tile.width, tile.height);
      }
    }

    // 3. Draw Coins
    const coinImg = game.assets.get('coin');
    const nowSecs = Date.now() / 1000;
    for (const coin of game.coins) {
      if (!coin.collected) {
         // simple rotation scaling
         const scale = Math.abs(Math.sin(nowSecs * 5 + coin.x));
         const drawW = coin.width * scale;
         const offsetX = (coin.width - drawW) / 2;
         this.ctx.drawImage(coinImg, coin.x + offsetX, coin.y, drawW, coin.height);
      }
    }

    // 4. Draw Enemies
    const enemyW1 = game.assets.get('enemy_walk1');
    const enemyW2 = game.assets.get('enemy_walk2');
    const airW1 = game.assets.get('air_enemy1');
    const airW2 = game.assets.get('air_enemy2');
    
    for (const enemy of game.enemies) {
      if (!enemy.dead) {
         const isWalk2 = Math.floor(Date.now() / 200) % 2 === 0;
         let img = isWalk2 ? enemyW2 : enemyW1;
         
         if (enemy instanceof AirEnemy) {
            img = isWalk2 ? airW2 : airW1;
         }
         
         this.ctx.save();
         let drawX = enemy.x;
         const isMovingRight = 'vx' in enemy && (enemy as any).vx > 0;
         if (isMovingRight) { // If moving right, flip
            this.ctx.translate(enemy.x + enemy.width, enemy.y);
            this.ctx.scale(-1, 1);
            drawX = 0;
            this.ctx.drawImage(img, drawX, 0, enemy.width, enemy.height);
         } else {
            this.ctx.drawImage(img, drawX, enemy.y, enemy.width, enemy.height);
         }
         this.ctx.restore();
      }
    }

    // 5. Draw Powerups
    for (const p of game.powerups) {
       let imgKey = 'heart';
       if (p.type === PowerupType.GEM) imgKey = 'gem';
       else if (p.type === PowerupType.FIREBALL) imgKey = 'fireball'; // assuming there is a fireball asset
       
       const img = game.assets.get(imgKey);
       if (img) {
           this.ctx.drawImage(img, p.x, p.y, p.width, p.height);
       } else {
           if (p.type === PowerupType.HEART) this.ctx.fillStyle = 'pink';
           else if (p.type === PowerupType.GEM) this.ctx.fillStyle = 'cyan';
           else this.ctx.fillStyle = 'orange'; // FIREBALL
           this.ctx.fillRect(p.x, p.y, p.width, p.height);
       }
    }

    // 5.5. Draw Player Fireballs
    for (const fb of game.playerFireballs) {
        this.ctx.fillStyle = 'orange';
        this.ctx.beginPath();
        this.ctx.arc(fb.x + fb.width/2, fb.y + fb.height/2, fb.width/2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 6. Draw Player
    const p = game.player;
    if (p.state !== PlayerState.DEAD || p.y < game.levelHeight + 100) {
      if (p.isInvincible) {
          // Flashing effect
          this.ctx.globalAlpha = Math.floor(p.invincibleTimer * 10) % 2 === 0 ? 0.5 : 1.0;
      }
      this.ctx.save();
      let drawX = p.x;
      let drawY = p.y;
      
      if (!p.facingRight) {
         this.ctx.translate(p.x + p.width, p.y);
         this.ctx.scale(-1, 1);
         drawX = 0;
         drawY = 0;
      }
      
      // Select frame based on state
      let pImg = game.assets.get('player_idle');
      if (p.state === PlayerState.RUNNING) {
          const isWalk2 = Math.floor(Date.now() / 150) % 2 === 0;
          pImg = isWalk2 ? game.assets.get('player_walk2') : game.assets.get('player_walk1');
      } else if (p.state === PlayerState.JUMPING || p.state === PlayerState.FALLING) {
          pImg = game.assets.get('player_jump');
      }
      
      this.ctx.drawImage(pImg, drawX, drawY, p.width, p.height);
      this.ctx.restore();
      this.ctx.globalAlpha = 1.0;
    }

    // 7. Draw Projectiles
    for (const proj of game.projectiles) {
      this.ctx.fillStyle = 'orange';
      this.ctx.beginPath();
      this.ctx.arc(proj.x + proj.width/2, proj.y + proj.height/2, proj.width/2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 8. Draw Boss and UFO
    if (game.boss && !game.boss.dead) {
       const bossImg = game.assets.get('boss');
       this.ctx.save();
       let bx = game.boss.x;
       let by = game.boss.y;
       if (game.boss.vx > 0) {
           this.ctx.translate(bx + game.boss.width, by);
           this.ctx.scale(-1, 1);
           bx = 0;
           by = 0;
       }
       this.ctx.drawImage(bossImg, bx, by, game.boss.width, game.boss.height);
       this.ctx.restore();
    }
    
    if (game.ufo && game.ufo.active) {
       const ufoImg = game.assets.get('ufo');
       this.ctx.drawImage(ufoImg, game.ufo.x, game.ufo.y, game.ufo.width, game.ufo.height);
    }


    // 8. Draw Bombs
    for (const bomb of game.bombs) {
        const img = game.assets.get('bomb');
        if (img) {
            this.ctx.drawImage(img, bomb.x, bomb.y, bomb.width, bomb.height);
        } else {
            this.ctx.fillStyle = 'black';
            this.ctx.beginPath();
            this.ctx.arc(bomb.x + bomb.width/2, bomb.y + bomb.height/2, bomb.width/2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    // 9. Draw Particles
    for (const part of game.particles.particles) {
       this.ctx.fillStyle = part.color;
       this.ctx.globalAlpha = Math.max(0, part.life / part.maxLife);
       this.ctx.fillRect(part.x, part.y, part.size, part.size);
       this.ctx.globalAlpha = 1;
    }

    this.ctx.restore();
  }
}
