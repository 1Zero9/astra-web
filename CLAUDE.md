# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ASTRA (AI Security Awareness Assistant) is a POC application for generating security awareness content, threat intelligence summaries, and phishing simulations. Built with Next.js, TypeScript, and TailwindCSS with a focus on rapid iteration over perfect architecture.

## Technology Stack

- **Framework**: Next.js 16.0.0 (App Router with Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: TailwindCSS v4 (via @tailwindcss/postcss)
- **React**: 19.2.0
- **Fonts**: Inter (via next/font/google)

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
- **POC-first approach**: Prioritise working code over perfect architecture
- Client components must include `"use client"` directive when using hooks or interactivity

## Architecture Overview

### Application Structure

```
src/
  app/
    layout.tsx              # Root layout with Inter font, Header, Footer
    page.tsx                # Homepage with portal/launchpad design
    icon.tsx                # Dynamic favicon generator using ASTRA logo
    globals.css             # Global Tailwind styles
    api/
      security-news/        # API route for fetching security news feeds
    dashboard/              # Dashboard overview page
    pulse/                  # Security Pulse - news aggregation + content generation
    phishing/               # Phishing Simulator tool (placeholder)
    awareness/              # Awareness Content generator (placeholder)
    login/                  # Login page (placeholder)
  components/
    Header.tsx              # Global navigation with active link highlighting
    Footer.tsx              # Footer with legal disclaimers and compliance notices
public/
  images/
    ASTRA_logo.png          # Main logo (250x250px transparent PNG)
```

### Key Patterns

**Layout Architecture:**
- Root layout (`app/layout.tsx`) includes Header and Footer for all pages
- Uses `flex flex-col min-h-screen` to ensure footer stays at bottom
- Header detects active route via `usePathname()` and applies active styling

**Client-Side State Management:**
- Tools like Security Pulse use local React state for filters, selections, and UI
- No global state management library (intentionally simple for POC)
- API calls made directly from components via `fetch()`

**Styling Conventions:**
- Color palette: Zinc/Gray for neutrals, Blue for primary actions, Amber for warnings
- Card-based UI with consistent borders (`border-2 border-gray-300`)
- Hover effects with smooth transitions (`transition-colors`, `hover:bg-*`)
- Responsive design with Tailwind breakpoints (`md:`, `lg:`)

**Security Pulse Page Architecture:**
- Three-column filter system: Publication (dropdown) | Vendor (text input) | Severity (text input)
- News items displayed with checkboxes for multi-selection
- Right sidebar for content generation options
- Filter state managed separately, combined with AND logic in `filteredNews`

## Key Configuration

- **Path alias**: `@/*` maps to `./src/*`
- **React Compiler**: Disabled (next.config.ts: `reactCompiler: false`)
- **TypeScript**: Strict mode enabled, `jsx: "react-jsx"`
- **ESLint**: Using Next.js ESM config (eslint.config.mjs)
- **Hot Reload**: Webpack polling configured (1s poll, 300ms aggregate delay)
- **Turbopack**: Default bundler in Next.js 16

## Important Notes

- This project uses **Next.js App Router** (not Pages Router)
- React 19.2.0 is stable but very new; verify third-party library compatibility
- TailwindCSS v4 uses `@tailwindcss/postcss` (different from v3)
- All pages maintain consistent header/footer via root layout
- API routes are placeholders returning mock data for POC
- No authentication system implemented yet (login page is UI-only)

## Troubleshooting

### Hot Reload Not Working

1. **Hard browser refresh**: Cmd + Shift + R (macOS) / Ctrl + Shift + R (Windows)
2. **Kill and restart**: `pkill -9 node && rm -rf .next && npm run dev`
3. **Check terminal**: Look for Turbopack compilation messages
4. **Try incognito**: Rules out browser cache issues

### Common Issues

**Turbopack font errors:**
- Resolved by using Inter font instead of Geist
- If adding new fonts, verify they're properly supported in Next.js 16

**File editing issues:**
- If Edit/Write tools fail silently, check file permissions: `ls -la <file>`
- Check extended attributes: `xattr -l <file>` (macOS)
- Remove problematic attributes: `xattr -c <file>`

**Port conflicts:**
- Default port 3000 may conflict with other services
- Use `lsof -i :3000 | xargs kill` to free the port
- Or specify different port: `PORT=3001 npm run dev`
