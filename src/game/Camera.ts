export class Camera {
  x: number = 0;
  y: number = 0;
  width: number;
  height: number;
  levelWidth: number;
  
  deadzoneX: number;

  constructor(width: number, height: number, levelWidth: number) {
    this.width = width;
    this.height = height;
    this.levelWidth = levelWidth;
    this.deadzoneX = width / 2;
  }

  update(playerX: number) {
    const targetX = playerX - this.deadzoneX;
    
    this.x = targetX;

    // Clamp camera
    if (this.x < 0) this.x = 0;
    if (this.x > this.levelWidth - this.width) {
      this.x = this.levelWidth - this.width;
    }
  }
}
