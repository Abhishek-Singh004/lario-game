import './styles/game.css';
import { Game } from './game/Game';
import { GameRenderer } from './game/GameRenderer';
import { AssetManager } from './game/AssetManager';

async function init() {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  if (!canvas) throw new Error("Canvas not found");

  canvas.width = 800;
  canvas.height = 600;

  const ctx = canvas.getContext('2d');
  if (ctx) {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.fillText('Loading Assets...', canvas.width/2 - 80, canvas.height/2);
  }

  const assetManager = new AssetManager();
  try {
     await assetManager.loadAll();
  } catch(e) {
     console.error("Error loading assets", e);
  }

  const game = new Game(canvas.width, canvas.height, assetManager);
  const renderer = new GameRenderer(canvas);

  let lastTime = performance.now();
  const timeStep = 1 / 60;
  let accumulator = 0;
  let gameState: 'START' | 'PLAYING' = 'START';

  // Start Screen DOM Elements
  const startScreen = document.getElementById('start-screen');
  const startBtn = document.getElementById('start-btn');
  const nameInput = document.getElementById('player-name-input') as HTMLInputElement;
  const nameDisplay = document.getElementById('player-name-val');

  // Check Session Storage
  const savedName = sessionStorage.getItem('playerName');
  if (savedName && nameInput) {
    nameInput.value = savedName;
  }

  // Start Game Handler
  if (startBtn && nameInput && startScreen && nameDisplay) {
    startBtn.addEventListener('click', () => {
      let playerName = nameInput.value.trim();
      if (!playerName) playerName = "Player 1";
      
      sessionStorage.setItem('playerName', playerName);
      nameDisplay.textContent = playerName;
      
      startScreen.classList.add('hidden');
      gameState = 'PLAYING';
    });
  }

  function gameLoop(time: number) {
    const deltaTime = (time - lastTime) / 1000;
    lastTime = time;

    accumulator += deltaTime;

    while (accumulator >= timeStep) {
      if (gameState === 'PLAYING') {
         game.update(timeStep);
      }
      accumulator -= timeStep;
    }

    renderer.render(game);
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

document.addEventListener('DOMContentLoaded', init);
