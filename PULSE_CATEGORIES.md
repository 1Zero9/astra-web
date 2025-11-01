# Pulse Multi-Category System

## Overview

The Pulse module now supports multiple content categories beyond just security, allowing you to aggregate and manage news from different domains with category-specific features and color schemes.

## Categories

### 1. Security (Default)
- **Icon**: 🛡️
- **Colors**: Blue/Navy (#2C7BE5, #1A3B66)
- **Features**:
  - ✅ AI Summaries (standard, ELI5, impact analysis, recommended actions)
  - ✅ CVE Extraction and enrichment
  - ✅ IOC (Indicators of Compromise) extraction
  - ✅ Threat intelligence aggregation
- **Example Sources**: CISA, BleepingComputer, Krebs on Security, Talos, Rapid7

### 2. AI
- **Icon**: 🤖
- **Colors**: Purple/Violet (#A855F7, #7C3AED)
- **Features**:
  - ✅ AI Summaries
  - ❌ CVE Extraction (not relevant)
  - ❌ IOC Extraction (not relevant)
- **Example Sources**: Papers With Code, Hugging Face Blog, OpenAI Blog, Anthropic News

### 3. Tech
- **Icon**: 💻
- **Colors**: Teal/Green (#14B8A6, #0D9488)
- **Features**:
  - ✅ AI Summaries
  - ❌ CVE Extraction (not relevant)
  - ❌ IOC Extraction (not relevant)
- **Example Sources**: TechCrunch, Hacker News, The Verge, Ars Technica, Product Hunt

### 4. F1 (Personal)
- **Icon**: 🏎️
- **Colors**: Red/Orange (#EF4444, #DC2626)
- **Features**:
  - ❌ AI Summaries (just for fun, no AI needed)
  - ❌ CVE Extraction (not relevant)
  - ❌ IOC Extraction (not relevant)
- **Example Sources**: Formula1.com, Autosport, The Race, F1 Subreddit

## Database Schema Changes

### RSSSource
```prisma
model RSSSource {
  // ... existing fields
  category    String   @default("security") // security, ai, tech, f1

  @@index([category])
}
```

### SavedArticle
```prisma
model SavedArticle {
  // ... existing fields
  category    String   @default("security")

  @@index([category])
}
```

### ReadingListItem
```prisma
model ReadingListItem {
  // ... existing fields
  category    String   @default("security")

  @@index([category])
}
```

### ArticleSummary
```prisma
model ArticleSummary {
  // ... existing fields
  category    String   @default("security") // security, ai, tech (NOT f1)

  @@index([category])
}
```

## Category Configuration

Categories are defined in `src/lib/categories.ts`:

```typescript
export type CategoryType = 'security' | 'ai' | 'tech' | 'f1';

export const CATEGORIES: Record<CategoryType, CategoryConfig> = {
  security: { /* config */ },
  ai: { /* config */ },
  tech: { /* config */ },
  f1: { /* config */ },
};
```

Each category has:
- **id**: unique identifier
- **name**: display name
- **description**: category description
- **icon**: emoji icon
- **primary/secondary**: color values
- **gradient**: Tailwind CSS gradient classes
- **aiSummaryEnabled**: whether AI summaries are allowed
- **cveExtractionEnabled**: whether CVE extraction is enabled

## Implementation Roadmap

### Phase 1: Schema & Config ✅
- [x] Add category field to database models
- [x] Create category configuration with color schemes
- [x] Document category system

### Phase 2: UI Updates (Next)
- [ ] Add category selector tabs/dropdown in Pulse
- [ ] Apply category-specific color schemes to UI
- [ ] Show/hide AI summary button based on category
- [ ] Filter articles by selected category

### Phase 3: RSS Management
- [ ] Add category field to "Add RSS Source" form
- [ ] Display category badges on sources
- [ ] Filter sources by category
- [ ] Seed default sources for each category

### Phase 4: API Updates
- [ ] Update RSS fetch API to respect categories
- [ ] Update saved articles API to include category
- [ ] Update reading list API to include category
- [ ] Validate AI summary requests (block F1)

### Phase 5: Integration
- [ ] Integrate awesome-public-datasets repo for feed discovery
- [ ] Create category-specific starter packs
- [ ] Add category switcher to navigation

## Migration

To apply schema changes:

```bash
npx prisma migrate dev --name add_category_to_pulse_models
npx prisma generate
```

## Usage Example

```typescript
import { getCategoryConfig } from '@/lib/categories';

const category = getCategoryConfig('ai');

// Use category colors
const buttonClass = `bg-gradient-to-r ${category.gradient}`;

// Check if AI summary is enabled
if (category.aiSummaryEnabled) {
  // Show AI summary button
}

// Check if CVE extraction is enabled
if (category.cveExtractionEnabled) {
  // Parse and display CVEs
}
```

## Feed Sources (awesome-public-datasets)

The [awesome-public-datasets](https://github.com/awesomedata/awesome-public-datasets) repository can be used to discover RSS feeds and data sources for each category:

- **Security**: cybersecurity datasets, threat feeds
- **AI/ML**: research papers, model releases, datasets
- **Tech**: startup data, product launches
- **F1**: race results, telemetry data

## Notes

- **Default category**: security
- **F1 is fun-only**: No AI summaries, just personal enjoyment
- **Color schemes**: Each category has distinct visual identity
- **Saved articles**: Category is preserved when saving
- **Reading list**: Category is preserved when adding to queue
- **Analytics**: Can track reading patterns per category
