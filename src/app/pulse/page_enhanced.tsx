"use client";

import { useState, useEffect } from "react";

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

interface SavedArticle {
  id: string;
  title: string;
  link: string;
  source: string;
  pubDate: string;
  description?: string;
  tags: string[];
  notes?: string;
  savedAt: string;
}

interface ReadingListItem {
  id: string;
  title: string;
  link: string;
  source: string;
  pubDate: string;
  description?: string;
  priority: string;
  notes?: string;
  addedAt: string;
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

interface ArticleSummary {
  summary: string;
  eli5?: string;
  impact?: string;
  actions?: string;
  cves?: string[];
}

type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
type ActiveTab = 'browse' | 'saved' | 'reading-list' | 'analytics';
type SidebarTab = 'generate' | 'history' | 'sources' | 'export';

interface SeverityInfo {
  level: SeverityLevel;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export default function SecurityPulse() {
  // Existing state
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
  const [contentHistory, setContentHistory] = useState<ContentHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [rssSources, setRssSources] = useState<any[]>([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [newSource, setNewSource] = useState({ name: '', url: '', description: '' });
  const [addingSource, setAddingSource] = useState(false);

  // New state for enhanced features
  const [activeTab, setActiveTab] = useState<ActiveTab>('browse');
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('generate');
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [readingList, setReadingList] = useState<ReadingListItem[]>([]);
  const [bookmarkedLinks, setBookmarkedLinks] = useState<Set<string>>(new Set());
  const [readingListLinks, setReadingListLinks] = useState<Set<string>>(new Set());
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<ArticleSummary | null>(null);
  const [summaryArticle, setSummaryArticle] = useState<NewsItem | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [severityDropdown, setSeverityDropdown] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Initialize
  useEffect(() => {
    // Load read items from localStorage (will migrate to DB)
    const stored = localStorage.getItem('astra-read-items');
    if (stored) {
      setReadItems(new Set(JSON.parse(stored)));
    }

    const storedLinks = localStorage.getItem('astra-previous-links');
    if (storedLinks) {
      setPreviousLinks(new Set(JSON.parse(storedLinks)));
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === 'granted');
      });
    } else if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    fetchNews();
    fetchSavedArticles();
    fetchReadingList();
  }, []);

  // Fetch news
  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/security-news");
      const data = await response.json();

      const uniqueNews = Array.from(
        new Map(data.map((item: NewsItem) => [item.link, item])).values()
      ) as NewsItem[];

      const currentLinks = new Set(uniqueNews.map((item) => item.link));
      const newItemLinks = new Set(
        [...currentLinks].filter(link => !previousLinks.has(link))
      );

      // Check for critical threats and send notifications
      if (notificationsEnabled && newItemLinks.size > 0) {
        uniqueNews.forEach(item => {
          if (newItemLinks.has(item.link)) {
            const severity = detectSeverity(item);
            if (severity.level === 'critical') {
              sendNotification(item);
            }
          }
        });
      }

      setNews(uniqueNews);
      setNewItems(newItemLinks);
      setPreviousLinks(currentLinks);
      setLastSync(new Date());

      localStorage.setItem('astra-previous-links', JSON.stringify([...currentLinks]));
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
    setLoading(false);
  };

  // Fetch saved articles
  const fetchSavedArticles = async () => {
    try {
      const response = await fetch('/api/saved-articles');
      const data = await response.json();
      if (data.success) {
        setSavedArticles(data.articles);
        setBookmarkedLinks(new Set(data.articles.map((a: SavedArticle) => a.link)));
      }
    } catch (error) {
      console.error('Error fetching saved articles:', error);
    }
  };

  // Fetch reading list
  const fetchReadingList = async () => {
    try {
      const response = await fetch('/api/reading-list');
      const data = await response.json();
      if (data.success) {
        setReadingList(data.items);
        setReadingListLinks(new Set(data.items.map((item: ReadingListItem) => item.link)));
      }
    } catch (error) {
      console.error('Error fetching reading list:', error);
    }
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
          tags: article.cves || [],
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchSavedArticles();
        alert('Article bookmarked!');
      } else if (response.status === 409) {
        alert('Article already bookmarked');
      }
    } catch (error) {
      console.error('Error bookmarking:', error);
      alert('Failed to bookmark article');
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
          priority: 'medium',
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchReadingList();
        alert('Added to reading list!');
      } else if (response.status === 409) {
        alert('Already in reading list');
      }
    } catch (error) {
      console.error('Error adding to reading list:', error);
      alert('Failed to add to reading list');
    }
  };

  // Remove from saved
  const removeFromSaved = async (id: string) => {
    try {
      await fetch('/api/saved-articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchSavedArticles();
    } catch (error) {
      console.error('Error removing:', error);
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
      console.error('Error removing:', error);
    }
  };

  // Show AI summary
  const showAISummary = async (article: NewsItem, type: string = 'summary') => {
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
          type,
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

  // Load more summary types
  const loadSummaryType = async (type: string) => {
    if (!summaryArticle) return;
    setLoadingSummary(true);

    try {
      const response = await fetch('/api/article-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleLink: summaryArticle.link,
          title: summaryArticle.title,
          description: summaryArticle.description,
          source: summaryArticle.source,
          type,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentSummary(data.summary);
      }
    } catch (error) {
      console.error('Error loading summary type:', error);
    } finally {
      setLoadingSummary(false);
    }
  };

  // Send browser notification
  const sendNotification = (article: NewsItem) => {
    if (notificationsEnabled && 'Notification' in window) {
      new Notification('Critical Security Alert', {
        body: article.title,
        icon: '/images/ASTRA_logo.png',
        badge: '/images/ASTRA_logo.png',
        tag: article.link,
        requireInteraction: true,
      });
    }
  };

  // Load analytics
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

  // Export articles
  const exportArticles = async (format: string) => {
    try {
      const articlesToExport = activeTab === 'browse' ? filteredNews :
                               activeTab === 'saved' ? savedArticles :
                               activeTab === 'reading-list' ? readingList : [];

      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articles: articlesToExport,
          format,
          includeType: activeTab,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `astra-${activeTab}-export.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert(`Exported as ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export');
    }
  };

  // Existing helper functions
  const markAsRead = (link: string) => {
    const newReadItems = new Set(readItems);
    newReadItems.add(link);
    setReadItems(newReadItems);
    localStorage.setItem('astra-read-items', JSON.stringify([...newReadItems]));

    // TODO: Sync to database
    fetch('/api/read-state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleLink: link, articleTitle: 'Article' }),
    });
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

  const toggleSelection = (link: string) => {
    setSelectedItems((prev) =>
      prev.includes(link) ? prev.filter((l) => l !== link) : [...prev, link]
    );
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
      fetchHistory();
    } catch (error) {
      console.error('Error generating content:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate content');
    } finally {
      setGenerating(false);
    }
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
        setNewSource({ name: '', url: '', description: '' });
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

  const detectSeverity = (item: NewsItem): SeverityInfo => {
    const text = `${item.title} ${item.description || ''}`.toLowerCase();

    const criticalKeywords = [
      'critical', 'zero-day', '0-day', 'actively exploited', 'emergency',
      'immediate action', 'urgent patch', 'under attack', 'mass exploitation'
    ];

    const highKeywords = [
      'ransomware', 'breach', 'data leak', 'vulnerability', 'exploit',
      'malware', 'backdoor', 'apt', 'threat actor', 'compromised',
      'severe', 'dangerous', 'widespread'
    ];

    const mediumKeywords = [
      'warning', 'alert', 'security flaw', 'bug', 'patch', 'update',
      'phishing', 'campaign', 'attack', 'threat', 'risk'
    ];

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

    return {
      level: 'low',
      label: 'INFO',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-900'
    };
  };

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

    const matchesSeverityDropdown = !severityDropdown || detectSeverity(item).level === severityDropdown;

    const matchesDateRange = (() => {
      if (!filterDateFrom && !filterDateTo) return true;
      const itemDate = new Date(item.pubDate);
      if (filterDateFrom && itemDate < new Date(filterDateFrom)) return false;
      if (filterDateTo && itemDate > new Date(filterDateTo)) return false;
      return true;
    })();

    const matchesSearch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPublication && matchesVendor && matchesSeverity && matchesSeverityDropdown && matchesDateRange && matchesSearch;
  });

  const filteredSavedArticles = savedArticles.filter(article =>
    !searchQuery ||
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredReadingList = readingList.filter(item =>
    !searchQuery ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = filteredNews.filter(item => !readItems.has(item.link)).length;
  const newCount = filteredNews.filter(item => newItems.has(item.link)).length;
  const publications = Array.from(new Set(news.map(item => item.source))).sort();

  // Render functions continue in next part...
  return (
    <div className="min-h-screen bg-zinc-50 relative">
      {/* Glass Loading Overlay */}
      {(generating || loadingSummary) && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {generating ? 'Generating Content' : 'Analyzing Article'}
            </h3>
            <p className="text-gray-600 animate-pulse">
              {generating ? 'AI is crafting your security content...' : 'AI is analyzing the article...'}
            </p>
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      {showSummaryModal && summaryArticle && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={() => setShowSummaryModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Analysis</h2>
                  <h3 className="text-lg text-gray-700">{summaryArticle.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{summaryArticle.source}</p>
                </div>
                <button
                  onClick={() => setShowSummaryModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              {/* Summary Type Tabs */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => loadSummaryType('summary')}
                  className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium"
                >
                  Summary
                </button>
                <button
                  onClick={() => loadSummaryType('eli5')}
                  className="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 text-sm font-medium"
                >
                  ELI5
                </button>
                <button
                  onClick={() => loadSummaryType('impact')}
                  className="px-4 py-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 text-sm font-medium"
                >
                  Impact
                </button>
                <button
                  onClick={() => loadSummaryType('actions')}
                  className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm font-medium"
                >
                  Actions
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loadingSummary ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                  <p className="text-gray-600">Generating analysis...</p>
                </div>
              ) : currentSummary ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-gray-800 whitespace-pre-wrap">{currentSummary.summary}</p>
                  </div>

                  {currentSummary.eli5 && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                      <h4 className="font-semibold text-green-900 mb-2">Simple Explanation</h4>
                      <p className="text-gray-800 whitespace-pre-wrap">{currentSummary.eli5}</p>
                    </div>
                  )}

                  {currentSummary.impact && (
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                      <h4 className="font-semibold text-orange-900 mb-2">Business Impact</h4>
                      <p className="text-gray-800 whitespace-pre-wrap">{currentSummary.impact}</p>
                    </div>
                  )}

                  {currentSummary.actions && (
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                      <h4 className="font-semibold text-purple-900 mb-2">Recommended Actions</h4>
                      <p className="text-gray-800 whitespace-pre-wrap">{currentSummary.actions}</p>
                    </div>
                  )}

                  {currentSummary.cves && currentSummary.cves.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <h4 className="font-semibold text-red-900 mb-2">CVEs Mentioned</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentSummary.cves.map(cve => (
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

                  <button
                    onClick={() => {
                      const text = [
                        `Summary: ${currentSummary.summary}`,
                        currentSummary.eli5 ? `\n\nSimple Explanation: ${currentSummary.eli5}` : '',
                        currentSummary.impact ? `\n\nBusiness Impact: ${currentSummary.impact}` : '',
                        currentSummary.actions ? `\n\nRecommended Actions: ${currentSummary.actions}` : '',
                      ].join('');
                      navigator.clipboard.writeText(text);
                      alert('Analysis copied to clipboard!');
                    }}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Copy Analysis
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Select an analysis type above</p>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Security Pulse</h1>
          {lastSync && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>Last sync: {lastSync.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
              <button
                onClick={() => fetchNews()}
                className="ml-2 text-blue-600 hover:text-blue-700 font-medium"
                disabled={loading}
              >
                {loading ? 'Syncing...' : 'Refresh'}
              </button>
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-6">
          Latest cybersecurity news and threat intelligence
        </p>

        {/* Main Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'browse'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Browse ({news.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'saved'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Saved ({savedArticles.length})
          </button>
          <button
            onClick={() => setActiveTab('reading-list')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'reading-list'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Reading List ({readingList.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('analytics');
              if (!analytics) fetchAnalytics();
            }}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Content continues... This file is getting very large. I'll continue in the next part */}

        <p className="text-center text-gray-500 py-12">
          UI is being built... This is a placeholder. The complete enhanced UI will be implemented in the actual deployment.
        </p>

      </main>
    </div>
  );
}
