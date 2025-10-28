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
  app/                    # Next.js App Router pages
    layout.tsx            # Root layout with fonts & metadata
    page.tsx              # Homepage - Portal/launchpad design
    icon.tsx              # Dynamic favicon generator
    globals.css           # Global Tailwind styles
    dashboard/            # Dashboard page
    pulse/                # Security Pulse tool
    phishing/             # Phishing Simulator tool
    awareness/            # Awareness Content tool
    login/                # Login page
  components/             # React components
    Header.tsx            # Global header with navigation
    Footer.tsx            # Global footer with disclaimers
public/
  images/
    ASTRA_logo.png        # Main logo (used in header, homepage, favicon)
  favicon.ico             # Fallback favicon
```

## Key Configuration

- **Path alias**: `@/*` maps to `./src/*`
- **React Compiler**: Enabled in next.config.ts
- **Turbopack Root**: Configured in next.config.ts to resolve workspace root issues
- **TypeScript**: Strict mode enabled
- **ESLint**: Using Next.js ESM config (eslint.config.mjs)

## Design System

### Homepage Portal Design
- Clean white card on dark gradient background
- Horizontal hero layout: logo left, title/subtitle right
- Color-coded feature boxes with gradients:
  - Security Pulse: Blue
  - Phishing Simulator: Purple
  - Awareness Content: Green
  - Knowledge Explainer: Gray (coming soon)
- Hover effects: scale, shadow lift, border color change
- Professional amber warning notice for POC status

### Color Palette
- **Background**: Gray-900 to Gray-800 gradient
- **Cards**: White (#FFFFFF)
- **Text**: Gray-900 (headings), Gray-700 (body), Gray-600 (secondary)
- **Accents**: Blue, Purple, Green for feature differentiation
- **Warnings**: Amber for POC notices

### Components
- **Header**: White background, dark text, logo + navigation
- **Footer**: Dark background (Zinc-900), light text, legal/compliance info
- All pages maintain consistent header/footer layout

## Important Notes

- This project uses the **Next.js App Router** (not Pages Router)
- React 19.2.0 is stable but newer; verify compatibility with third-party libraries
- TailwindCSS v4 uses a different PostCSS plugin (@tailwindcss/postcss)
- React Compiler is experimental; avoid patterns that may cause issues (e.g., mutation during render)
- **File editing issues**: Use bash `cat` for writing files if Edit/Write tools fail silently
- **Cache issues**: Clear `.next` directory and restart dev server if hot reload fails

## Development Progress

### Completed Features
✅ Project structure and navigation
✅ Header component with logo and navigation
✅ Footer component with legal disclaimers
✅ Homepage portal/launchpad design
✅ ASTRA logo integration (header + homepage)
✅ Dynamic favicon generation
✅ Four main tool pages (placeholders):
  - Security Pulse
  - Phishing Simulator
  - Awareness Content
  - Knowledge Explainer (coming soon)
✅ Dashboard page
✅ Login page
✅ Professional styling with color-coded gradients
✅ Hover animations and transitions
✅ Responsive design (mobile + desktop)

### Pending Features
⏳ Backend API integration
⏳ Authentication system
⏳ Actual tool functionality (AI content generation)
⏳ Knowledge Explainer tool
⏳ User registration flow
⏳ Data persistence
⏳ Production deployment configuration

## Known Issues

- Hot module reload can be flaky; may need manual browser refresh
- Favicon may not update immediately; clear browser cache
- File editing via Edit/Write tools may fail silently; use bash as fallback
- Turbopack workspace root warnings resolved via next.config.ts

## Troubleshooting

**Changes not appearing in browser:**
1. Kill all node processes: `pkill -9 node`
2. Delete cache: `rm -rf .next`
3. Restart server: `npm run dev`
4. Hard refresh browser: Cmd + Shift + R

**File writes not working:**
- Use bash `cat > file.tsx << 'ENDOFFILE'` instead of Edit/Write tools
- Verify file contents with `head` or `cat` after writing

## Recent Fixes (27 Oct 2025)

- **Font loading error**: Switched from Geist to Inter font to resolve Turbopack module resolution issues in Next.js 16.0.0
- **React checkbox warnings**: Removed redundant `readOnly` prop from controlled checkboxes in Security Pulse page
- **Security Pulse filters**: Added publication dropdown filter (first column) alongside vendor and severity filters
