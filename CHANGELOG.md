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