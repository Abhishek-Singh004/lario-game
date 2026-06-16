# Lario Game 🍄

A completely client-side, 2D browser platformer built entirely with **TypeScript**, **HTML5 Canvas**, and **Vite**. Jump, dash, and stomp your way through enemies, collect coins, find powerups, and face off against the final Fire Slime Boss!

<!-- Update with an actual screenshot path later if available -->

## 🌟 Features
* **Custom Physics Engine**: A lightweight, scratch-built Axis-Aligned Bounding Box (AABB) collision system.
* **Dynamic AI**: Ground enemies detect pits and walls, Air enemies patrol the skies, and the Boss features a multi-phase AI combat system.
* **Powerups & RNG Drops**: Break bricks for a chance to find hidden Hearts (Extra Life) or Gems (Invincibility).
* **Zero Dependencies**: Pure HTML5 Canvas rendering. No heavy game engines (like Phaser or Unity)—just raw TypeScript performance.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lario-game.git
   cd lario-game
   ```
2. Install the necessary build dependencies:
   ```bash
   npm install
   ```

### Running Locally
To spin up the local development server:
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser to play the game!

### Building for Production
To compile the TypeScript and bundle the assets for production deployment (e.g., GitHub Pages, Vercel, Netlify):
```bash
npm run build
```
This will output a highly optimized, static application into the `dist/` directory.

## 🎮 Controls
* **Move Left/Right**: `Left Arrow` / `Right Arrow`
* **Jump**: `Up Arrow` or `Spacebar`
* **Dash**: `Shift`
* **Restart Level**: `R` (When Dead or Level Cleared)

## 🗺️ Project Structure
```
lario-game/
├── public/                 # Static assets (images, audio)
├── src/
│   ├── game/               # Core Game Logic
│   │   ├── entities/       # Player, Enemies, Boss, Items
│   │   ├── AssetManager.ts # Preloads images and sounds
│   │   ├── CollisionDetector.ts # Core physics and AABB logic
│   │   ├── Game.ts         # Main game loop, state, and level parsing
│   │   ├── GameRenderer.ts # HTML5 Canvas rendering logic
│   │   ├── InputHandler.ts # Keyboard event listeners
│   │   └── SoundManager.ts # Audio playback
│   ├── main.ts             # Entry point
│   └── style.css           # UI Overlay styling
├── index.html              # Main HTML container and UI overlays
└── docs/                   # Additional Technical Documentation
```

## 🛠️ Deep Dive
Are you a developer looking to understand how the physics system works or how the level matrix is parsed? Check out the [Architecture Guide](docs/architecture.md) for an in-depth breakdown of the codebase!

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/lario-game/issues).

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
