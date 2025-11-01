"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { VERSION, getModuleVersion } from "@/lib/version";
import { type CategoryType, getCategoryConfig, getAllCategories } from "@/lib/categories";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
  cves?: string[];
  author?: string;
  category?: string;
}

interface TrendingTopic {
  keyword: string;
  count: number;
  articles: NewsItem[];
  isNew: boolean;
}

interface ContentHistory {
  id: string;
  contentType: string;
  title: string;
  content: string;
  focusArea: string | null;
  tone: string | null;
  sourceLinks: string[];
  createdAt: string;
}

type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

interface SeverityInfo {
  level: SeverityLevel;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export default function SecurityPulse() {
  // Read category from URL params
  const searchParams = useSearchParams();
  const urlCategory = (searchParams.get('category') as CategoryType) || 'security';

  // Category state
  const [activeCategory, setActiveCategory] = useState<CategoryType>(urlCategory);
  const categoryConfig = getCategoryConfig(activeCategory);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPublication, setFilterPublication] = useState("");
  const [filterVendor, setFilterVendor] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [contentType, setContentType] = useState("Security Awareness Email");
  const [focusArea, setFocusArea] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [readItems, setReadItems] = useState<Set<string>>(new Set());
  const [newItems, setNewItems] = useState<Set<string>>(new Set());
  const [previousLinks, setPreviousLinks] = useState<Set<string>>(new Set());
  const [flaggedItems, setFlaggedItems] = useState<Set<string>>(new Set());
  const [showHistory, setShowHistory] = useState(false);
  const [contentHistory, setContentHistory] = useState<ContentHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [rssSources, setRssSources] = useState<any[]>([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [newSource, setNewSource] = useState({ name: '', url: '', description: '', category: 'security' as CategoryType });
  const [addingSource, setAddingSource] = useState(false);

  // New state for enhancements
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<any>(null);
  const [summaryArticle, setSummaryArticle] = useState<NewsItem | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState<'browse' | 'saved' | 'reading-list' | 'analytics' | 'generate'>('browse');
  const [savedArticles, setSavedArticles] = useState<any[]>([]);
  const [readingList, setReadingList] = useState<any[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [loadingReadingList, setLoadingReadingList] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    // Load read items from localStorage
    const stored = localStorage.getItem('astra-read-items');
    if (stored) {
      setReadItems(new Set(JSON.parse(stored)));
    }

    // Load previous links
    const storedLinks = localStorage.getItem('astra-previous-links');
    if (storedLinks) {
      setPreviousLinks(new Set(JSON.parse(storedLinks)));
    }

    // Load flagged items from localStorage
    const storedFlagged = localStorage.getItem('astra-flagged-items');
    if (storedFlagged) {
      setFlaggedItems(new Set(JSON.parse(storedFlagged)));
    }

    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/security-news");
      const data = await response.json();

      // Deduplicate by link
      const uniqueNews = Array.from(
        new Map(data.map((item: NewsItem) => [item.link, item])).values()
      ) as NewsItem[];

      // Detect new items
      const currentLinks = new Set(uniqueNews.map((item) => item.link));
      const newItemLinks = new Set(
        [...currentLinks].filter(link => !previousLinks.has(link))
      );

      setNews(uniqueNews);
      setNewItems(newItemLinks);
      setPreviousLinks(currentLinks);
      setLastSync(new Date());

      // Store current links for next comparison
      localStorage.setItem('astra-previous-links', JSON.stringify([...currentLinks]));
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
    setLoading(false);
  };

  const markAsRead = (link: string) => {
    const newReadItems = new Set(readItems);
    newReadItems.add(link);
    setReadItems(newReadItems);
    localStorage.setItem('astra-read-items', JSON.stringify([...newReadItems]));
  };

  const markAllAsRead = () => {
    const allLinks = new Set(filteredNews.map(item => item.link));
    setReadItems(allLinks);
    setNewItems(new Set());
    localStorage.setItem('astra-read-items', JSON.stringify([...allLinks]));
  };

  const markSelectedAsUnread = () => {
    const newReadItems = new Set(readItems);
    selectedItems.forEach(link => newReadItems.delete(link));
    setReadItems(newReadItems);
    localStorage.setItem('astra-read-items', JSON.stringify([...newReadItems]));
  };

  const markAsUnread = (link: string) => {
    const newReadItems = new Set(readItems);
    newReadItems.delete(link);
    setReadItems(newReadItems);
    localStorage.setItem('astra-read-items', JSON.stringify([...newReadItems]));
  };

  const toggleFlag = (link: string) => {
    const newFlaggedItems = new Set(flaggedItems);
    if (newFlaggedItems.has(link)) {
      newFlaggedItems.delete(link);
    } else {
      newFlaggedItems.add(link);
    }
    setFlaggedItems(newFlaggedItems);
    localStorage.setItem('astra-flagged-items', JSON.stringify([...newFlaggedItems]));
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const getFullDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return { dateStr, timeStr, relative: getTimeAgo(dateString) };
  };

  const toggleSelection = (link: string) => {
    setSelectedItems((prev) =>
      prev.includes(link) ? prev.filter((l) => l !== link) : [...prev, link]
    );
  };

  // Bookmark article
  const bookmarkArticle = async (article: NewsItem) => {
    try {
      const response = await fetch('/api/saved-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          link: article.link,
          source: article.source,
          pubDate: article.pubDate,
          description: article.description,
          category: activeCategory,
          tags: article.cves || [],
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Article bookmarked!');
      } else if (response.status === 409) {
        alert('ℹ️ Article already bookmarked');
      }
    } catch (error) {
      console.error('Error bookmarking:', error);
      alert('❌ Failed to bookmark article');
    }
  };

  // Add to reading list
  const addToReadingList = async (article: NewsItem) => {
    try {
      const response = await fetch('/api/reading-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          link: article.link,
          source: article.source,
          pubDate: article.pubDate,
          description: article.description,
          category: activeCategory,
          priority: 'medium',
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Added to reading list!');
      } else if (response.status === 409) {
        alert('ℹ️ Already in reading list');
      }
    } catch (error) {
      console.error('Error adding to reading list:', error);
      alert('❌ Failed to add to reading list');
    }
  };

  // Show AI summary
  const showAISummary = async (article: NewsItem) => {
    setLoadingSummary(true);
    setSummaryArticle(article);
    setShowSummaryModal(true);
    setCurrentSummary(null);

    try {
      const response = await fetch('/api/article-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleLink: article.link,
          title: article.title,
          description: article.description,
          source: article.source,
          type: 'summary',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentSummary(data.summary);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Fetch saved articles
  const fetchSavedArticles = async () => {
    setLoadingSaved(true);
    try {
      const response = await fetch('/api/saved-articles');
      const data = await response.json();
      if (data.success) {
        setSavedArticles(data.articles);
      }
    } catch (error) {
      console.error('Error fetching saved articles:', error);
    } finally {
      setLoadingSaved(false);
    }
  };

  // Fetch reading list
  const fetchReadingList = async () => {
    setLoadingReadingList(true);
    try {
      const response = await fetch('/api/reading-list');
      const data = await response.json();
      if (data.success) {
        setReadingList(data.items);
      }
    } catch (error) {
      console.error('Error fetching reading list:', error);
    } finally {
      setLoadingReadingList(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const response = await fetch('/api/analytics?type=overview&days=30');
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  // Remove from saved articles
  const removeFromSaved = async (id: string) => {
    try {
      await fetch('/api/saved-articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchSavedArticles();
    } catch (error) {
      console.error('Error removing from saved:', error);
    }
  };

  // Remove from reading list
  const removeFromReadingList = async (id: string) => {
    try {
      await fetch('/api/reading-list', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchReadingList();
    } catch (error) {
      console.error('Error removing from reading list:', error);
    }
  };

  // Update reading list priority
  const updatePriority = async (id: string, priority: string) => {
    try {
      await fetch('/api/reading-list', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, priority }),
      });
      fetchReadingList();
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGenerationError(null);
    setGeneratedContent(null);

    const selectedArticles = news.filter(item => selectedItems.includes(item.link));

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentType,
          articles: selectedArticles,
          focusArea: focusArea || undefined,
          tone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setGeneratedContent(data.content);
      // Refresh history after generating
      fetchHistory();
    } catch (error) {
      console.error('Error generating content:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate content');
    }

    // Ensure generating state is cleared
    setGenerating(false);
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      alert('Content copied to clipboard!');
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await fetch('/api/content-history?limit=10');
      const data = await response.json();
      if (data.success) {
        setContentHistory(data.history);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const response = await fetch('/api/content-history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setContentHistory(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const fetchSources = async () => {
    setLoadingSources(true);
    try {
      const response = await fetch('/api/rss-sources');
      const data = await response.json();
      if (data.success) {
        setRssSources(data.sources);
      }
    } catch (error) {
      console.error('Error fetching RSS sources:', error);
    } finally {
      setLoadingSources(false);
    }
  };

  const addRssSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.name || !newSource.url) return;

    setAddingSource(true);
    try {
      const response = await fetch('/api/rss-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSource),
      });
      const data = await response.json();
      if (data.success) {
        setRssSources(prev => [...prev, data.source].sort((a, b) => a.name.localeCompare(b.name)));
        setNewSource({ name: '', url: '', description: '', category: 'security' });
        alert('RSS source added successfully!');
      } else {
        alert(data.error || 'Failed to add RSS source');
      }
    } catch (error) {
      console.error('Error adding RSS source:', error);
      alert('Failed to add RSS source');
    } finally {
      setAddingSource(false);
    }
  };

  const toggleSourceStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/rss-sources', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      });
      const data = await response.json();
      if (data.success) {
        setRssSources(prev => prev.map(s => s.id === id ? data.source : s));
      }
    } catch (error) {
      console.error('Error toggling source:', error);
    }
  };

  const deleteSource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this RSS source?')) return;

    try {
      const response = await fetch('/api/rss-sources', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setRssSources(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting source:', error);
    }
  };

  // Detect severity level based on keywords
  const detectSeverity = (item: NewsItem): SeverityInfo => {
    const text = `${item.title} ${item.description || ''}`.toLowerCase();

    // Critical keywords
    const criticalKeywords = [
      'critical', 'zero-day', '0-day', 'actively exploited', 'emergency',
      'immediate action', 'urgent patch', 'under attack', 'mass exploitation'
    ];

    // High severity keywords
    const highKeywords = [
      'ransomware', 'breach', 'data leak', 'vulnerability', 'exploit',
      'malware', 'backdoor', 'apt', 'threat actor', 'compromised',
      'severe', 'dangerous', 'widespread'
    ];

    // Medium severity keywords
    const mediumKeywords = [
      'warning', 'alert', 'security flaw', 'bug', 'patch', 'update',
      'phishing', 'campaign', 'attack', 'threat', 'risk'
    ];

    // Check for critical
    if (criticalKeywords.some(keyword => text.includes(keyword))) {
      return {
        level: 'critical',
        label: 'CRITICAL',
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-500',
        textColor: 'text-red-900'
      };
    }

    // Check for high
    if (highKeywords.some(keyword => text.includes(keyword))) {
      return {
        level: 'high',
        label: 'HIGH',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-400',
        textColor: 'text-orange-900'
      };
    }

    // Check for medium
    if (mediumKeywords.some(keyword => text.includes(keyword))) {
      return {
        level: 'medium',
        label: 'MEDIUM',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-400',
        textColor: 'text-yellow-900'
      };
    }

    // Default to low
    return {
      level: 'low',
      label: 'INFO',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-900'
    };
  };

  // Detect trending topics
  const getTrendingTopics = (): TrendingTopic[] => {
    const keywords = new Map<string, NewsItem[]>();
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can']);

    news.forEach(item => {
      const words = item.title.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 4 && !stopWords.has(word));

      words.forEach(word => {
        if (!keywords.has(word)) {
          keywords.set(word, []);
        }
        keywords.get(word)!.push(item);
      });
    });

    const trending: TrendingTopic[] = [];
    keywords.forEach((articles, keyword) => {
      if (articles.length >= 2) {
        const uniqueSources = new Set(articles.map(a => a.source));
        if (uniqueSources.size >= 2) {
          const hasNewArticle = articles.some(a => newItems.has(a.link));
          trending.push({
            keyword,
            count: uniqueSources.size,
            articles,
            isNew: hasNewArticle
          });
        }
      }
    });

    return trending
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const trendingTopics = getTrendingTopics();

  // Helper function to normalize text for matching (remove special chars, spaces)
  const normalizeForMatching = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const filteredNews = news.filter((item) => {
    const matchesPublication = !filterPublication ||
      item.source.toLowerCase().includes(filterPublication.toLowerCase());

    const matchesVendor = !filterVendor || (() => {
      const vendorNormalized = normalizeForMatching(filterVendor);
      return normalizeForMatching(item.title).includes(vendorNormalized) ||
             (item.description && normalizeForMatching(item.description).includes(vendorNormalized));
    })();

    const matchesSeverity = !filterSeverity || (() => {
      const severityNormalized = normalizeForMatching(filterSeverity);
      return normalizeForMatching(item.title).includes(severityNormalized) ||
             (item.description && normalizeForMatching(item.description).includes(severityNormalized));
    })();

    return matchesPublication && matchesVendor && matchesSeverity;
  });

  const unreadCount = filteredNews.filter(item => !readItems.has(item.link)).length;
  const newCount = filteredNews.filter(item => newItems.has(item.link)).length;
  const publications = Array.from(new Set(news.map(item => item.source))).sort();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Glass Loading Overlay */}
      {(generating || loadingSummary) && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => {
            // Emergency dismiss - click overlay to close if stuck
            setGenerating(false);
            setLoadingSummary(false);
          }}
        >
          <div
            className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {generating ? 'Generating Content' : 'Analyzing Article'}
            </h3>
            <p className="text-gray-600 animate-pulse">
              {generating ? 'AI is crafting your security content...' : 'AI is analyzing the article...'}
            </p>
            <button
              onClick={() => {
                setGenerating(false);
                setLoadingSummary(false);
              }}
              className="mt-4 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Click to dismiss if stuck
            </button>
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      {showSummaryModal && summaryArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={() => setShowSummaryModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">🤖 AI Analysis</h2>
                  <h3 className="text-lg text-gray-700 mb-1">{summaryArticle.title}</h3>
                  <p className="text-sm text-gray-500">{summaryArticle.source}</p>
                </div>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-3xl font-bold leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
              {currentSummary ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h4 className="font-semibold text-blue-900 mb-2">Summary</h4>
                    <p className="text-gray-800 whitespace-pre-wrap">{currentSummary.summary}</p>
                  </div>

                  {currentSummary.cves && currentSummary.cves.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <h4 className="font-semibold text-red-900 mb-2">CVEs Mentioned</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentSummary.cves.map((cve: string) => (
                          <a
                            key={cve}
                            href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-red-200 text-red-900 rounded-full text-sm font-mono hover:bg-red-300"
                          >
                            {cve}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentSummary.summary);
                        alert('Summary copied to clipboard!');
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-center"
                    >
                      Copy Summary
                    </button>
                    <a
                      href={summaryArticle.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center font-medium"
                    >
                      Read Full Article
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                  <p>Generating summary...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{categoryConfig.icon} {categoryConfig.name.toUpperCase()} PULSE</h1>
              <span className="px-2 py-0.5 bg-slate-800 text-slate-100 text-xs font-mono">
                {getModuleVersion('pulse')}
              </span>
            </div>
            {lastSync && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <span className="font-mono">SYNC: {lastSync.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                </span>
                <button
                  onClick={() => fetchNews()}
                  className="w-full sm:w-auto px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-medium transition-colors"
                  disabled={loading}
                >
                  {loading ? 'SYNCING...' : 'REFRESH'}
                </button>
              </div>
            )}
          </div>
          <div className="text-xs text-slate-600 font-mono">
            THREAT INTELLIGENCE FEED • {unreadCount} UNREAD • {newCount} NEW
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-gradient-to-r" style={{backgroundImage: `linear-gradient(to right, ${categoryConfig.primary}, ${categoryConfig.secondary})`}}>
          <div className="mx-auto max-w-7xl px-4 py-2">
            <div className="flex gap-1 overflow-x-auto">
              {getAllCategories().map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === category.id
                      ? 'bg-white text-slate-900 shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <span className="text-base">{category.icon}</span>
                  <span>{category.name.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Command Bar */}
        <div className="bg-slate-50 border-t border-slate-300 py-2">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button
                  onClick={markAllAsRead}
                  className="w-full sm:w-auto px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-xs font-medium text-slate-700 transition-colors"
                >
                  MARK ALL READ
                </button>
                <button
                  onClick={markSelectedAsUnread}
                  disabled={selectedItems.length === 0}
                  className="w-full sm:w-auto px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-xs font-medium text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  MARK UNREAD ({selectedItems.length})
                </button>
                <div className="w-px h-5 bg-slate-300 mx-2"></div>
                <span className="text-xs text-slate-600 font-mono">
                  {filteredNews.length} ITEMS
                </span>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`flex-1 lg:flex-none min-w-[120px] px-4 py-1 text-xs font-semibold transition-colors ${
                    activeTab === 'browse'
                      ? 'bg-slate-800 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  FEED ({news.length})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('saved');
                    if (savedArticles.length === 0) fetchSavedArticles();
                  }}
                  className={`flex-1 lg:flex-none min-w-[120px] px-4 py-1 text-xs font-semibold transition-colors ${
                    activeTab === 'saved'
                      ? 'bg-slate-800 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  SAVED ({savedArticles.length})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('reading-list');
                    if (readingList.length === 0) fetchReadingList();
                  }}
                  className={`flex-1 lg:flex-none min-w-[120px] px-4 py-1 text-xs font-semibold transition-colors ${
                    activeTab === 'reading-list'
                      ? 'bg-slate-800 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  QUEUE ({readingList.length})
                </button>
                <button
                  onClick={() => {
                    setActiveTab('analytics');
                    if (!analytics) fetchAnalytics();
                  }}
                  className={`flex-1 lg:flex-none min-w-[120px] px-4 py-1 text-xs font-semibold transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-slate-800 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  METRICS
                </button>
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`flex-1 lg:flex-none min-w-[120px] px-4 py-1 text-xs font-semibold transition-colors ${
                    activeTab === 'generate'
                      ? 'bg-slate-800 text-white'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                  }`}
                >
                  GENERATE ({selectedItems.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-4">
        {/* Browse Tab Content */}
        {activeTab === 'browse' && (
          <>
        {/* Filters */}
        <div className="bg-white border border-slate-300 mb-3 p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <select
              value={filterPublication}
              onChange={(e) => setFilterPublication(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
            >
              <option value="">ALL SOURCES</option>
              {publications.map((pub) => (
                <option key={pub} value={pub}>
                  {pub.toUpperCase()}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={filterVendor}
              onChange={(e) => setFilterVendor(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
              placeholder="FILTER BY VENDOR..."
            />
            <input
              type="text"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
              placeholder="FILTER BY KEYWORD..."
            />
            {(filterPublication || filterVendor || filterSeverity) && (
              <button
                onClick={() => {
                  setFilterPublication("");
                  setFilterVendor("");
                  setFilterSeverity("");
                }}
                className="w-full sm:w-auto px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 border border-slate-300 font-medium transition-colors"
              >
                CLEAR FILTERS
              </button>
            )}
          </div>

          {/* Active Filters Indicator */}
          {(filterPublication || filterVendor || filterSeverity) && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-slate-600">ACTIVE:</span>
              {filterPublication && (
                <span className="px-2 py-1 bg-slate-700 text-slate-100 border border-slate-800">
                  PUB: {filterPublication.toUpperCase()}
                </span>
              )}
              {filterVendor && (
                <span className="px-2 py-1 bg-slate-700 text-slate-100 border border-slate-800">
                  VENDOR: {filterVendor.toUpperCase()}
                </span>
              )}
              {filterSeverity && (
                <span className="px-2 py-1 bg-slate-700 text-slate-100 border border-slate-800">
                  KEYWORD: {filterSeverity.toUpperCase()}
                </span>
              )}
            </div>
          )}
        </div>

        {/* News List */}
        <div className="bg-white border border-slate-300 mt-4">

              {loading ? (
                <div className="p-12 text-center text-slate-600">
                  <div className="inline-block animate-spin h-8 w-8 border-2 border-slate-300 border-t-slate-700 mb-3"></div>
                  <p className="text-xs font-mono uppercase tracking-wide">LOADING FEED...</p>
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="p-12 text-center text-slate-600">
                  <p className="text-sm font-mono uppercase mb-2">NO ARTICLES FOUND</p>
                  <p className="text-xs text-slate-500">Adjust filters or refresh feed</p>
                </div>
              ) : (
                <div className="border border-slate-300">
                  {filteredNews.map((item) => {
                    const isUnread = !readItems.has(item.link);
                    const isNew = newItems.has(item.link);
                    const isSelected = selectedItems.includes(item.link);
                    const severity = detectSeverity(item);

                    return (
                      <div
                        key={item.link}
                        className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                          isSelected ? "bg-slate-100" : ""
                        } ${isUnread ? 'bg-white' : 'bg-slate-50/50'}`}
                      >
                        <div className="flex items-start gap-3 p-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelection(item.link)}
                            className="mt-1 h-4 w-4 text-slate-700 border-slate-300 focus:ring-slate-500 cursor-pointer flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                  {isUnread && <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>}
                                  <span className="text-xs font-mono text-slate-600">{item.source.toUpperCase()}</span>
                                  {severity.level === 'critical' && (
                                    <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold">CRITICAL</span>
                                  )}
                                  {severity.level === 'high' && (
                                    <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold">HIGH</span>
                                  )}
                                  {isNew && (
                                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs font-bold">NEW</span>
                                  )}
                                  {item.cves && item.cves.map(cve => (
                                    <a
                                      key={cve}
                                      href={`https://nvd.nist.gov/vuln/detail/${cve}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2 py-0.5 bg-red-100 text-red-900 text-xs font-mono hover:bg-red-200 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {cve}
                                    </a>
                                  ))}
                                </div>
                                <h3 className={`text-sm leading-tight mb-1 ${isUnread ? 'font-semibold text-slate-900' : 'font-normal text-slate-600'}`}>
                                  <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => markAsRead(item.link)}
                                    className="hover:underline"
                                  >
                                    {item.title}
                                  </a>
                                </h3>
                                {item.description && (
                                  <p className="text-xs text-slate-600 line-clamp-1">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-start sm:items-end gap-0.5 flex-shrink-0 text-left sm:text-right">
                                <span className="text-xs font-semibold text-slate-700 font-mono whitespace-nowrap">
                                  {getFullDateTime(item.pubDate).relative.toUpperCase()}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                                  {getFullDateTime(item.pubDate).dateStr}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                                  {getFullDateTime(item.pubDate).timeStr}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {isUnread ? (
                                <button
                                  onClick={() => markAsRead(item.link)}
                                  className="w-full sm:w-auto text-xs px-2 py-1 bg-slate-200 hover:bg-slate-300 border border-slate-300 font-medium transition-colors text-center"
                                  title="Mark as read"
                                >
                                  READ
                                </button>
                              ) : (
                                <button
                                  onClick={() => markAsUnread(item.link)}
                                  className="w-full sm:w-auto text-xs px-2 py-1 bg-slate-200 hover:bg-slate-300 border border-slate-300 font-medium transition-colors text-center"
                                  title="Mark as unread"
                                >
                                  UNREAD
                                </button>
                              )}
                              <button
                                onClick={() => toggleFlag(item.link)}
                                className={`w-full sm:w-auto text-xs px-2 py-1 border font-medium transition-colors text-center ${
                                  flaggedItems.has(item.link)
                                    ? 'bg-amber-200 hover:bg-amber-300 border-amber-400 text-amber-900'
                                    : 'bg-slate-200 hover:bg-slate-300 border-slate-300'
                                }`}
                                title={flaggedItems.has(item.link) ? "Unflag" : "Flag for follow-up"}
                              >
                                {flaggedItems.has(item.link) ? '🚩 FLAGGED' : 'FLAG'}
                              </button>
                              <button
                                onClick={() => bookmarkArticle(item)}
                                className="w-full sm:w-auto text-xs px-2 py-1 bg-slate-200 hover:bg-slate-300 border border-slate-300 font-medium transition-colors text-center"
                                title="Save for later"
                              >
                                SAVE
                              </button>
                              <button
                                onClick={() => addToReadingList(item)}
                                className="w-full sm:w-auto text-xs px-2 py-1 bg-slate-200 hover:bg-slate-300 border border-slate-300 font-medium transition-colors text-center"
                                title="Add to queue"
                              >
                                QUEUE
                              </button>
                              {categoryConfig.aiSummaryEnabled && (
                                <button
                                  onClick={() => showAISummary(item)}
                                  className="w-full sm:w-auto text-xs px-2 py-1 bg-slate-200 hover:bg-slate-300 border border-slate-300 font-medium transition-colors text-center"
                                  title="AI Analysis"
                                >
                                  ANALYZE
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
        </div>

        {/* Saved Articles Tab */}
        {activeTab === 'saved' && (
          <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">⭐ Saved Articles</h2>
              <button
                onClick={fetchSavedArticles}
                className="w-full md:w-auto px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-lg font-medium transition-colors"
              >
                Refresh
              </button>
            </div>

            {loadingSaved ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600 mb-4"></div>
                <p className="text-gray-600">Loading saved articles...</p>
              </div>
            ) : savedArticles.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="text-6xl mb-4">⭐</div>
                <p className="text-xl mb-2">No saved articles yet</p>
                <p className="text-sm">Click the ⭐ Save button on any article to bookmark it</p>
              </div>
            ) : (
              <div className="space-y-4">
                {savedArticles.map((article) => (
                  <div key={article.id} className="border border-gray-200 rounded-lg p-5 hover:border-amber-300 hover:bg-amber-50/30 transition-all">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">
                        <a href={article.link} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600">
                          {article.title}
                        </a>
                      </h3>
                      <button
                        onClick={() => removeFromSaved(article.id)}
                        className="md:ml-4 w-full md:w-auto text-red-600 hover:text-red-800 text-sm font-medium text-left md:text-right"
                      >
                        Remove
                      </button>
                    </div>

                    {article.description && (
                      <p className="text-sm text-gray-600 mb-3">{article.description}</p>
                    )}

                    <div className="flex items-center gap-3 text-xs flex-wrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">{article.source}</span>
                      <span className="text-gray-500">{new Date(article.savedAt).toLocaleDateString('en-GB')}</span>
                      {article.tags && article.tags.length > 0 && (
                        <>
                          {article.tags.map((tag: string) => (
                            <span key={tag} className="px-2 py-1 bg-red-100 text-red-800 rounded font-mono text-xs">
                              {tag}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        )}

        {/* Reading List Tab */}
        {activeTab === 'reading-list' && (
          <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📚 Reading List</h2>
              <button
                onClick={fetchReadingList}
                className="w-full md:w-auto px-4 py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-medium transition-colors"
              >
                Refresh
              </button>
            </div>

            {loadingReadingList ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
                <p className="text-gray-600">Loading reading list...</p>
              </div>
            ) : readingList.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-xl mb-2">Reading list is empty</p>
                <p className="text-sm">Click the 📚 Read Later button to add articles</p>
              </div>
            ) : (
              <div className="space-y-4">
                {readingList.map((item) => (
                  <div key={item.id} className={`border-2 rounded-lg p-5 transition-all ${
                    item.priority === 'high' ? 'border-red-300 bg-red-50/30' :
                    item.priority === 'medium' ? 'border-purple-300 bg-purple-50/30' :
                    'border-gray-300 bg-gray-50/30'
                  }`}>
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <select
                            value={item.priority}
                            onChange={(e) => updatePriority(item.id, e.target.value)}
                            className={`px-2 py-1 rounded font-medium text-xs ${
                              item.priority === 'high' ? 'bg-red-200 text-red-900' :
                              item.priority === 'medium' ? 'bg-purple-200 text-purple-900' :
                              'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <option value="high">🔴 High</option>
                            <option value="medium">🟣 Medium</option>
                            <option value="low">⚪ Low</option>
                          </select>
                          <span className="text-xs text-gray-500">Added {new Date(item.addedAt).toLocaleDateString('en-GB')}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">
                            {item.title}
                          </a>
                        </h3>
                      </div>
                      <button
                        onClick={() => removeFromReadingList(item.id)}
                        className="md:ml-4 w-full md:w-auto text-red-600 hover:text-red-800 text-sm font-medium text-left md:text-right"
                      >
                        Remove
                      </button>
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    )}

                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-medium">{item.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">📊 Analytics</h2>
              <button
                onClick={fetchAnalytics}
                className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg font-medium transition-colors"
              >
                Refresh
              </button>
            </div>

            {loadingAnalytics ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mb-4"></div>
                <p className="text-gray-600">Loading analytics...</p>
              </div>
            ) : !analytics ? (
              <div className="text-center py-16 text-gray-500">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-xl mb-2">No analytics data yet</p>
                <p className="text-sm">Start reading articles to see your stats</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-600">{analytics.readArticles || 0}</div>
                    <div className="text-sm text-gray-600 mt-1">Articles Read</div>
                  </div>
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-amber-600">{analytics.savedArticles || 0}</div>
                    <div className="text-sm text-gray-600 mt-1">Saved Articles</div>
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-purple-600">{analytics.readingListCount || 0}</div>
                    <div className="text-sm text-gray-600 mt-1">Reading List</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-600">{analytics.generatedContent || 0}</div>
                    <div className="text-sm text-gray-600 mt-1">Content Generated</div>
                  </div>
                  <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
                    <div className="text-3xl font-bold text-indigo-600">{analytics.aiSummariesGenerated || 0}</div>
                    <div className="text-sm text-gray-600 mt-1">AI Summaries</div>
                  </div>
                </div>

                {/* Top Topics */}
                {analytics.topTopics && analytics.topTopics.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">🔥 Top Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {analytics.topTopics.map((topic: any) => (
                        <span key={topic.topic} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                          {topic.topic} ({topic.count})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <strong>Period:</strong> {analytics.period || 'Last 30 days'}
                  </p>
                </div>
              </div>
            )}
          </div>
          </div>
        )}

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Generate Content</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Create security awareness content from selected articles
                </p>
              </div>

              {selectedItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-lg mb-2">No articles selected</p>
                  <p className="text-sm">Go to the FEED tab and select articles using the checkboxes</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>{selectedItems.length}</strong> article{selectedItems.length > 1 ? 's' : ''} selected for content generation
                    </p>
                  </div>

                  <form onSubmit={handleGenerate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content Type
                      </label>
                      <select
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>Security Awareness Email</option>
                        <option>Executive Summary</option>
                        <option>Team Briefing</option>
                        <option>Viva Engage Post</option>
                        <option>Slide Bullets</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Focus Area (Optional)
                      </label>
                      <input
                        type="text"
                        value={focusArea}
                        onChange={(e) => setFocusArea(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., vulnerabilities, best practices, ransomware"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tone
                      </label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>Professional</option>
                        <option>Urgent</option>
                        <option>Educational</option>
                        <option>Casual</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={generating}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                    >
                      {generating ? 'Generating...' : 'Generate Content'}
                    </button>
                  </form>

                  {/* Generated Content Display */}
                  {generatedContent && (
                    <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-green-900">✓ Content Generated</h3>
                        <button
                          onClick={copyToClipboard}
                          className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                          Copy to Clipboard
                        </button>
                      </div>
                      <div className="bg-white p-4 rounded border border-green-200 max-h-96 overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                          {generatedContent}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Error Display */}
                  {generationError && (
                    <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-900 mb-2">✗ Generation Failed</h3>
                      <p className="text-sm text-red-700">{generationError}</p>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-900">
                      <strong>⚠️ Note:</strong> Generated content should be reviewed before distribution.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
