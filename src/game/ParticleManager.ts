export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;

  constructor(x: number, y: number, vx: number, vy: number, life: number, color: string, size: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.color = color;
    this.size = size;
  }

  update(deltaTime: number, gravity: number) {
    this.vy += gravity * deltaTime;
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.life -= deltaTime;
  }
}

export class ParticleManager {
  particles: Particle[] = [];
  gravity: number = 800;

  update(deltaTime: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update(deltaTime, this.gravity);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  spawnBrickDebris(x: number, y: number) {
    // Spawn 4 particles exploding outwards
    const color = '#b45f06'; // brownish
    this.particles.push(new Particle(x, y, -150, -300, 0.5, color, 8));
    this.particles.push(new Particle(x + 16, y, 150, -300, 0.5, color, 8));
    this.particles.push(new Particle(x, y + 16, -100, -150, 0.5, color, 8));
    this.particles.push(new Particle(x + 16, y + 16, 100, -150, 0.5, color, 8));
  }

  spawnCoinSparkle(x: number, y: number) {
    const color = '#f1c232'; // gold
    for(let i=0; i<5; i++) {
       const vx = (Math.random() - 0.5) * 200;
       const vy = (Math.random() - 0.5) * 200 - 100;
       this.particles.push(new Particle(x + 8, y + 8, vx, vy, 0.3 + Math.random()*0.2, color, 4));
    }
  }
}
