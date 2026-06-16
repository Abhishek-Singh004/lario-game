import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.join(__dirname, '../public/assets');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

const assets = [
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/src/games/firstgame/assets/dude.png', name: 'player.png' },
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/src/games/firstgame/assets/platform.png', name: 'platform.png' },
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/src/games/firstgame/assets/star.png', name: 'coin.png' },
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/src/games/firstgame/assets/bomb.png', name: 'enemy.png' },
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/src/games/firstgame/assets/sky.png', name: 'sky.png' },
  // Additional assets for expansion
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/mushroom2.png', name: 'boss.png' },
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/ufo.png', name: 'ufo.png' },
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/particles/red.png', name: 'particle.png' },
  { url: 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/bullets/bullet1.png', name: 'projectile.png' }
];

async function downloadAsset(asset) {
  console.log(`Downloading ${asset.name}...`);
  try {
    const response = await fetch(asset.url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(path.join(ASSETS_DIR, asset.name), Buffer.from(buffer));
    console.log(`Saved ${asset.name}`);
  } catch (e) {
    console.error(`Failed to download ${asset.name}:`, e.message);
  }
}

async function run() {
  await Promise.all(assets.map(downloadAsset));
  console.log("Asset fetching complete.");
}

run();
