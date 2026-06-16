# Architecture & Systems Guide

This document provides a technical overview of how **Lario Game** is structured under the hood. The game was built from scratch without a standard game engine (like Phaser) to demonstrate raw TypeScript and HTML5 Canvas capabilities.

## 1. The Game Loop
The heart of the application lives in `Game.ts`. The loop relies on `requestAnimationFrame` to ensure smooth rendering tied to the monitor's refresh rate.

- **Delta Time**: We calculate `deltaTime` (the time passed since the last frame) and pass it to every `update()` function. This ensures that movement and physics are time-based, not frame-based, making the game run at the same speed on both 60Hz and 144Hz monitors.
- **Separation of Concerns**: `Game.ts` handles *logic and state update*, while `GameRenderer.ts` handles *drawing* that state to the Canvas.

## 2. Level Parsing & Grid System
Levels are defined as an array of strings in `Game.ts` (the `LEVEL` constant). Each character represents a specific entity or tile:
- `.` : Empty space
- `#` : Solid Ground
- `B` : Breakable Brick
- `?` : Item Block
- `C` : Coin
- `P` : Player Spawn
- `E` : Ground Enemy
- `A` : Air Enemy
- `O` : Boss Spawn

The `parseLevel()` function reads this string matrix and instantiates the corresponding TypeScript classes into an absolute pixel-space environment. The entire game uses a **64x64 pixel grid**.

## 3. Custom Physics & Collision (AABB)
Instead of using a library like Matter.js, physics are handled via Axis-Aligned Bounding Box (AABB) detection in `CollisionDetector.ts`.

### How it works:
1. **Apply Gravity & Velocity**: Entities have their `X` and `Y` coordinates updated based on their `vx` (velocity x) and `vy` (velocity y).
2. **Check Intersections**: `checkAABB()` calculates if two rectangles overlap.
3. **Resolve Overlaps**: If the player clips into a solid tile, the physics engine calculates the depth of the penetration. It then pushes the player back out along the shallowest axis (either snapping them to the top of the block, or pushing them out of the side).

## 4. Entity Component System (Simplified)
All interactive objects live in `src/game/entities/`. While not a strict ECS framework, entities share common properties (`x`, `y`, `width`, `height`, `vx`, `vy`) making them easy to pass into the unified `CollisionDetector`.

- **Player.ts**: Handles input acceleration, jump forces, and invincible states.
- **Enemy.ts**: Implements edge-detection logic to reverse direction when reaching a pit.
- **Boss.ts**: Features a timed state machine (Bombing Phase vs. Chasing Phase).

## 5. Asset Management
Because canvas rendering requires images to be fully loaded before drawing, `AssetManager.ts` handles preloading. It returns a Promise that only resolves when every `.png` sprite is loaded into browser memory, ensuring no invisible objects pop in during gameplay.
