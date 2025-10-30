"use client";

import { useState, useEffect } from "react";

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
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
  const [showHistory, setShowHistory] = useState(false);
  const [contentHistory, setContentHistory] = useState<ContentHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [rssSources, setRssSources] = useState<any[]>([]);
  const [loadingSources, setLoadingSources] = useState(false);
  const [newSource, setNewSource] = useState({ name: '', url: '', description: '' });
  const [addingSource, setAddingSource] = useState(false);

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
      // Refresh history after generating
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
    <div className="min-h-screen bg-zinc-50 relative">
      {/* Glass Loading Overlay */}
      {generating && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Generating Content</h3>
            <p className="text-gray-600 animate-pulse">
              AI is crafting your security content...
            </p>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8">
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
        <p className="text-gray-600 mb-8">
          Latest cybersecurity news and threat intelligence
        </p>

        {/* Trending Topics */}
        {trendingTopics.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                Trending Topics
              </h2>
              <span className="text-xs text-gray-600">Multiple sources reporting</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => setFilterSeverity(topic.keyword)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-orange-300 rounded-full text-sm font-medium text-gray-900 hover:bg-orange-100 hover:border-orange-400 transition-all"
                >
                  <span className="capitalize">{topic.keyword}</span>
                  <span className="px-1.5 py-0.5 bg-orange-200 text-orange-900 rounded-full text-xs font-bold">
                    {topic.count}
                  </span>
                  {topic.isNew && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                      NEW
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg border-2 border-gray-300 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filter News</h2>
                {(filterPublication || filterVendor || filterSeverity) && (
                  <button
                    onClick={() => {
                      setFilterPublication("");
                      setFilterVendor("");
                      setFilterSeverity("");
                    }}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="publication" className="block text-sm font-medium text-gray-700 mb-2">
                    Publication
                  </label>
                  <select
                    id="publication"
                    value={filterPublication}
                    onChange={(e) => setFilterPublication(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Publications</option>
                    {publications.map((pub) => (
                      <option key={pub} value={pub}>
                        {pub}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor / Company
                  </label>
                  <input
                    type="text"
                    id="vendor"
                    value={filterVendor}
                    onChange={(e) => setFilterVendor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Oracle, Microsoft, Cisco"
                  />
                </div>
                <div>
                  <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
                    Severity / Type
                  </label>
                  <input
                    type="text"
                    id="severity"
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., critical, ransomware, zero-day"
                  />
                </div>
              </div>
              {(filterPublication || filterVendor || filterSeverity) && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {filterPublication && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                      Publication: {filterPublication}
                      <button onClick={() => setFilterPublication("")} className="hover:text-blue-900">×</button>
                    </span>
                  )}
                  {filterVendor && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                      Vendor: {filterVendor}
                      <button onClick={() => setFilterVendor("")} className="hover:text-purple-900">×</button>
                    </span>
                  )}
                  {filterSeverity && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs">
                      Keyword: {filterSeverity}
                      <button onClick={() => setFilterSeverity("")} className="hover:text-green-900">×</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* News List */}
            <div className="bg-white rounded-lg border-2 border-gray-300">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">Latest Security News</h2>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <p className="text-gray-600">
                    {filteredNews.length} articles {(filterPublication || filterVendor || filterSeverity) && "matching filters"}
                  </p>
                  {unreadCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      {unreadCount} unread
                    </span>
                  )}
                  {newCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium animate-pulse">
                      <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                      {newCount} new
                    </span>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                  <p>Loading latest security news...</p>
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-lg mb-2">No articles found</p>
                  <p className="text-sm">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[700px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
                  <style jsx>{`
                    .scrollbar-thin::-webkit-scrollbar {
                      width: 8px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-track {
                      background: #f3f4f6;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb {
                      background: #9ca3af;
                      border-radius: 4px;
                    }
                    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                      background: #6b7280;
                    }
                  `}</style>
                  {filteredNews.map((item) => {
                    const isUnread = !readItems.has(item.link);
                    const isNew = newItems.has(item.link);
                    const isSelected = selectedItems.includes(item.link);
                    const severity = detectSeverity(item);

                    return (
                      <div
                        key={item.link}
                        className={`p-5 transition-all border-l-4 ${
                          isSelected
                            ? "bg-blue-50 border-l-blue-500"
                            : severity.level === 'critical'
                            ? `${severity.bgColor} ${severity.borderColor} hover:bg-red-100`
                            : severity.level === 'high'
                            ? `${severity.bgColor} ${severity.borderColor} hover:bg-orange-100`
                            : isUnread
                            ? "bg-white border-l-blue-400 hover:bg-blue-50/50"
                            : "bg-gray-50/50 border-l-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {isUnread && (
                            <div className="mt-2 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                          )}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelection(item.link)}
                            className="mt-1.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2 flex-wrap">
                              <h3 className={`font-semibold leading-tight flex-1 ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
                                <a
                                  href={item.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => markAsRead(item.link)}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {item.title}
                                </a>
                              </h3>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {(severity.level === 'critical' || severity.level === 'high') && (
                                  <span className={`px-2 py-0.5 ${
                                    severity.level === 'critical'
                                      ? 'bg-red-600 animate-pulse'
                                      : 'bg-orange-500'
                                  } text-white rounded-full text-xs font-bold`}>
                                    {severity.label}
                                  </span>
                                )}
                                {isNew && (
                                  <span className="px-2 py-0.5 bg-blue-500 text-white rounded-full text-xs font-bold animate-pulse">
                                    NEW
                                  </span>
                                )}
                              </div>
                            </div>
                            {item.description && (
                              <p className={`text-sm mb-3 leading-relaxed line-clamp-2 ${isUnread ? 'text-gray-600' : 'text-gray-500'}`}>
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-xs flex-wrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.source}
                              </span>
                              {severity.level !== 'low' && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  severity.level === 'critical'
                                    ? 'bg-red-100 text-red-800'
                                    : severity.level === 'high'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {severity.level === 'critical' ? '🔴' : severity.level === 'high' ? '🟠' : '🟡'} {severity.label}
                                </span>
                              )}
                              <span className={`font-medium ${isUnread ? 'text-gray-600' : 'text-gray-400'}`}>
                                {getTimeAgo(item.pubDate)}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className={isUnread ? 'text-gray-500' : 'text-gray-400'}>
                                {new Date(item.pubDate).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Content Generation Panel */}
          <div className="xl:col-span-5">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 sticky top-4">
              {/* Tabs */}
              <div className="flex gap-2 mb-4 border-b border-gray-200">
                <button
                  onClick={() => {
                    setShowHistory(false);
                    setShowSources(false);
                  }}
                  className={`px-4 py-2 font-medium transition-colors ${
                    !showHistory && !showSources
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Generate
                </button>
                <button
                  onClick={() => {
                    setShowHistory(true);
                    setShowSources(false);
                    if (contentHistory.length === 0) fetchHistory();
                  }}
                  className={`px-4 py-2 font-medium transition-colors ${
                    showHistory && !showSources
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  History
                </button>
                <button
                  onClick={() => {
                    setShowHistory(false);
                    setShowSources(true);
                    if (rssSources.length === 0) fetchSources();
                  }}
                  className={`px-4 py-2 font-medium transition-colors ${
                    showSources
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sources
                </button>
              </div>

              {/* Generate Tab */}
              {!showHistory && !showSources && (
                <>
                  {selectedItems.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 mb-2">
                    {selectedItems.length} article{selectedItems.length > 1 ? "s" : ""} selected
                  </p>
                  <button
                    onClick={markSelectedAsUnread}
                    className="text-xs text-blue-700 hover:text-blue-900 font-medium underline"
                  >
                    Mark as unread
                  </button>
                </div>
              )}

              <form onSubmit={handleGenerate} className="space-y-4">
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
                    placeholder="e.g., vulnerabilities, best practices"
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
                  disabled={selectedItems.length === 0 || generating}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {generating ? "Generating..." : "Generate Content"}
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

              {/* History Tab */}
              {showHistory && !showSources && (
                <div className="space-y-4">
                  {loadingHistory ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                      <p>Loading history...</p>
                    </div>
                  ) : contentHistory.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <p className="text-lg mb-2">No content generated yet</p>
                      <p className="text-sm">Generate some content to see it here!</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">Recent Generated Content</h3>
                        <button
                          onClick={fetchHistory}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Refresh
                        </button>
                      </div>
                      <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {contentHistory.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded mb-2">
                                  {item.contentType}
                                </span>
                                <p className="text-xs text-gray-500">
                                  {new Date(item.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <button
                                onClick={() => deleteHistoryItem(item.id)}
                                className="text-red-600 hover:text-red-800 text-xs font-medium"
                              >
                                Delete
                              </button>
                            </div>
                            {item.focusArea && (
                              <p className="text-xs text-gray-600 mb-2">
                                Focus: {item.focusArea} | Tone: {item.tone}
                              </p>
                            )}
                            <div className="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto">
                              <pre className="whitespace-pre-wrap text-xs text-gray-700 font-sans">
                                {item.content.substring(0, 300)}
                                {item.content.length > 300 && '...'}
                              </pre>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.content);
                                alert('Content copied to clipboard!');
                              }}
                              className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Copy Full Content
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Sources Tab */}
              {showSources && (
                <div className="space-y-4">
                  {/* Add New Source Form */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Add New RSS Source</h3>
                    <form onSubmit={addRssSource} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Source Name *
                        </label>
                        <input
                          type="text"
                          value={newSource.name}
                          onChange={(e) => setNewSource(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="e.g., Bleeping Computer"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          RSS Feed URL *
                        </label>
                        <input
                          type="url"
                          value={newSource.url}
                          onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="https://example.com/feed/"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description (optional)
                        </label>
                        <input
                          type="text"
                          value={newSource.description}
                          onChange={(e) => setNewSource(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Brief description"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={addingSource}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                      >
                        {addingSource ? 'Adding...' : 'Add Source'}
                      </button>
                    </form>
                  </div>

                  {/* Sources List */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">RSS Sources ({rssSources.length})</h3>
                      <button
                        onClick={fetchSources}
                        disabled={loadingSources}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {loadingSources ? 'Refreshing...' : 'Refresh'}
                      </button>
                    </div>

                    {loadingSources ? (
                      <div className="text-center py-8 text-gray-500">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                        <p>Loading sources...</p>
                      </div>
                    ) : rssSources.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p className="text-sm">No RSS sources configured</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {rssSources.map((source) => (
                          <div
                            key={source.id}
                            className={`p-3 border rounded-lg ${
                              source.isActive
                                ? 'border-green-200 bg-green-50'
                                : 'border-gray-200 bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm">{source.name}</h4>
                                {source.description && (
                                  <p className="text-xs text-gray-600 mt-1">{source.description}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1 break-all">{source.url}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-2">
                                <button
                                  onClick={() => toggleSourceStatus(source.id, source.isActive)}
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    source.isActive
                                      ? 'bg-green-600 text-white hover:bg-green-700'
                                      : 'bg-gray-400 text-white hover:bg-gray-500'
                                  }`}
                                  title={source.isActive ? 'Disable source' : 'Enable source'}
                                >
                                  {source.isActive ? 'Active' : 'Inactive'}
                                </button>
                                <button
                                  onClick={() => deleteSource(source.id)}
                                  className="text-red-600 hover:text-red-800 text-xs font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs text-amber-900">
                      <strong>Note:</strong> Changes to RSS sources will take effect on the next news refresh. Only active sources will be used to fetch news.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
