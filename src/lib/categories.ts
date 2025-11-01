// Pulse category configuration
// Categories: Security, AI, Tech

export type CategoryType = 'security' | 'ai' | 'tech';

export interface CategoryConfig {
  id: CategoryType;
  name: string;
  description: string;
  icon: string;
  // Color scheme
  primary: string;      // Primary accent color
  secondary: string;    // Secondary accent color
  gradient: string;     // Tailwind gradient classes
  // Features
  aiSummaryEnabled: boolean;
  cveExtractionEnabled: boolean;
}

export const CATEGORIES: Record<CategoryType, CategoryConfig> = {
  security: {
    id: 'security',
    name: 'Security',
    description: 'Threat intelligence, vulnerabilities, and security news',
    icon: '🛡️',
    primary: '#2C7BE5',
    secondary: '#1A3B66',
    gradient: 'from-[#2C7BE5] to-[#1A3B66]',
    aiSummaryEnabled: true,
    cveExtractionEnabled: true,
  },
  ai: {
    id: 'ai',
    name: 'AI',
    description: 'AI research, model releases, and machine learning news',
    icon: '🤖',
    primary: '#A855F7',
    secondary: '#7C3AED',
    gradient: 'from-[#A855F7] to-[#7C3AED]',
    aiSummaryEnabled: true,
    cveExtractionEnabled: false,
  },
  tech: {
    id: 'tech',
    name: 'Tech',
    description: 'Product launches, startups, and technology news',
    icon: '💻',
    primary: '#14B8A6',
    secondary: '#0D9488',
    gradient: 'from-[#14B8A6] to-[#0D9488]',
    aiSummaryEnabled: true,
    cveExtractionEnabled: false,
  },
};

export const DEFAULT_CATEGORY: CategoryType = 'security';

export const getCategoryConfig = (category: CategoryType): CategoryConfig => {
  return CATEGORIES[category] || CATEGORIES[DEFAULT_CATEGORY];
};

export const getAllCategories = (): CategoryConfig[] => {
  return Object.values(CATEGORIES);
};
