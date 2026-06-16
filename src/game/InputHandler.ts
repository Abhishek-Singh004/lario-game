export class InputHandler {
  keys: { [key: string]: boolean } = {};
  previousKeys: { [key: string]: boolean } = {};

  constructor() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  update() {
    this.previousKeys = { ...this.keys };
  }

  isDown(code: string): boolean {
    return this.keys[code] === true;
  }

  isPressed(code: string): boolean {
    return this.keys[code] === true && this.previousKeys[code] !== true;
  }
}
