# Changelog

## 2025-10-30

- Resolved merge conflict in `astra-web/src/app/page.tsx`, keeping the gradient background.
- Updated root `.gitignore` to include `node_modules/`, `.DS_Store`, and `.env`.
- Restructured the repository from a monorepo with `astra-web` as a submodule to a single repository:
    - Removed `astra-web` from Git index.
    - Moved all contents of `astra-web` to the root directory.
    - Removed redundant root `index.js`, `package.json`, and `package-lock.json`.
    - Restored the correct `package.json` and `package-lock.json` (from the former `astra-web` submodule) to the root.
- Ran `npm install` successfully in the root directory.
- Synced all changes to the remote repository.
- Updated `package.json` and `package-lock.json` with correct Next.js dependencies.
- Converted `next.config.ts` to `next.config.js` for Vercel compatibility.
- Resolved merge conflict in `src/app/page.tsx`.
- Added `@tailwindcss/postcss` and `@google/generative-ai` as dependencies.
- Removed `reactCompiler` and `turbopack` options from `next.config.js`.
- Modified `postcss.config.js` to use `tailwindcss` directly.
- Created `tailwind.config.js`.
- Deleted `postcss.config.mjs`.
- Modified `src/app/globals.css` to explicitly import Tailwind CSS files.
- Modified `tsconfig.json` to exclude `prisma.config.ts` and aggressively exclude `node_modules`.
- Modified `package.json` to specify Prisma schema path in `build` and `postinstall` scripts.
- Restored `prisma/schema.prisma` from git history.
- Added `RSSSource` model with `description` and `isActive` fields to `prisma/schema.prisma`.