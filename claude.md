# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ASTRA is an AI Security Assistant built with Next.js, TypeScript, and TailwindCSS. This is a proof-of-concept (POC) focused on rapid iteration.

## Technology Stack

- **Framework**: Next.js 16.0.0 (App Router)
- **Language**: TypeScript 5
- **Styling**: TailwindCSS v4 (via @tailwindcss/postcss)
- **React**: 19.2.0 with React Compiler enabled (experimental)
- **Fonts**: Geist Sans & Geist Mono (via next/font)

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Code Style Guidelines

- Use **functional React components** with TypeScript
- Use **TailwindCSS** for all styling (no CSS modules or styled-components)
- Keep components **small and reusable**
- Use **UK English** for all user-facing text and comments
- **POC-first approach**: Don't over-engineer; prioritise working code over perfect architecture

## Project Structure

```
src/
  app/              # Next.js App Router pages
    layout.tsx      # Root layout with fonts & metadata
    page.tsx        # Home page
    globals.css     # Global Tailwind styles
  # Future: Add /components, /lib, /hooks as needed
```

## Key Configuration

- **Path alias**: `@/*` maps to `./src/*`
- **React Compiler**: Enabled in next.config.ts
- **TypeScript**: Strict mode enabled
- **ESLint**: Using Next.js ESM config (eslint.config.mjs)

## Important Notes

- This project uses the **Next.js App Router** (not Pages Router)
- React 19.2.0 is stable but newer; verify compatibility with third-party libraries
- TailwindCSS v4 uses a different PostCSS plugin (@tailwindcss/postcss)
- React Compiler is experimental; avoid patterns that may cause issues (e.g., mutation during render)
