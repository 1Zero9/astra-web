// ASTRA Version Information
// Update these when making significant changes

export const VERSION = {
  // Main ASTRA version
  app: '1.1.0',

  // Module versions
  pulse: '2.0.0',
  phishing: '1.0.0',
  awareness: '1.0.0',
  promptBuilder: '1.0.0',

  // Build info
  buildDate: '2025-10-31',

  // Feature flags
  features: {
    pulseEnhancements: true,
    aiSummary: true,
    bookmarks: true,
    readingList: true,
    cveExtraction: true,
    analytics: true,
    export: true,
  }
};

export const CHANGELOG = {
  '2.0.0': {
    module: 'Pulse',
    date: '2025-10-31',
    changes: [
      'Added bookmark functionality (⭐ Save button)',
      'Added reading list (📚 Read Later button)',
      'Added AI Summary modal (🤖 AI Summary button)',
      'CVE badges with NVD links',
      'Enhanced RSS parser with CVE extraction',
      '7 new API routes for advanced features',
      'Persistent storage for saved articles',
    ]
  },
  '1.1.0': {
    module: 'Core',
    date: '2025-10-31',
    changes: [
      'Tailwind configuration refactored',
      'Homepage UI redesign',
      'Database schema enhancements',
      'Performance improvements',
    ]
  },
  '1.0.0': {
    module: 'Core',
    date: '2025-10-29',
    changes: [
      'Initial ASTRA release',
      'Security Pulse v1.0',
      'RSS feed aggregation',
      'AI content generation',
    ]
  }
};

export function getVersionString(): string {
  return `v${VERSION.app}`;
}

export function getModuleVersion(module: keyof typeof VERSION): string {
  return `v${VERSION[module]}`;
}

export function getFullVersionInfo(): string {
  return `ASTRA ${VERSION.app} (${VERSION.buildDate})`;
}
