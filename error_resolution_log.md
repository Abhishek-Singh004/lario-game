# QA & Bug Resolution Log

| Timestamp | Failing Module/File | Exact Error Trace | Code/Architectural Modification Applied |
| :--- | :--- | :--- | :--- |
| 2026-06-15T12:19 | `npm run build` | `'tsc' is not recognized as an internal or external command` | Updated `package.json` build script to explicitly use `npx tsc && npx vite build` ensuring local binaries are resolved correctly on Windows environments. |
