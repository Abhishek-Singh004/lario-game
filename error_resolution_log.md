# QA & Bug Resolution Log

| Timestamp | Failing Module/File | Exact Error Trace | Code/Architectural Modification Applied |
| :--- | :--- | :--- | :--- |
| 2026-06-15T12:19 | `npm run build` | `'tsc' is not recognized as an internal or external command` | Updated `package.json` build script to explicitly use `npx tsc && npx vite build` ensuring local binaries are resolved correctly on Windows environments. |
| 2026-06-15T12:20 | `src/game/entities/Enemy.ts` | `error TS6133: 'deltaTime' is declared but its value is never read.` | Removed unused `deltaTime` parameter from `Enemy.update()` and updated the call signature in `Game.ts`. |
| 2026-06-15T12:20 | Docker Verification | `The term 'docker' is not recognized as the name of a cmdlet` | Docker is not installed on the host machine. Bypassed local Docker build verification; relying on successful standard Node.js production build (`npm run build`). |
