"use client";

  import { useState, useEffect } from "react";

  interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    source: string;
    description?: string;
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
    const [lastSync, setLastSync] = useState<Date | null>(null);

    useEffect(() => {
      fetchNews();
    }, []);

    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/security-news");
        const data = await response.json();
        setNews(data);
        setLastSync(new Date());
      } catch (error) {
        console.error("Failed to fetch news:", error);
      }
      setLoading(false);
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

      const selectedArticles = news.filter(item => selectedItems.includes(item.link));

      console.log("Generating content with:", {
        contentType,
        focusArea,
        tone,
        articles: selectedArticles
      });

      setTimeout(() => {
        alert(`Content generation coming soon!\n\nType: ${contentType}\nFocus: ${focusArea || "General"}\nTone: ${tone}\nArticles: ${selectedArticles.length}`);
        setGenerating(false);
      }, 1000);
    };

    const filteredNews = news.filter((item) => {
      const matchesPublication = !filterPublication ||
        item.source.toLowerCase().includes(filterPublication.toLowerCase());

      const matchesVendor = !filterVendor ||
        item.title.toLowerCase().includes(filterVendor.toLowerCase()) ||
        item.description?.toLowerCase().includes(filterVendor.toLowerCase());

      const matchesSeverity = !filterSeverity ||
        item.title.toLowerCase().includes(filterSeverity.toLowerCase()) ||
        item.description?.toLowerCase().includes(filterSeverity.toLowerCase());

      return matchesPublication && matchesVendor && matchesSeverity;
    });

    const publications = Array.from(new Set(news.map(item => item.source))).sort();

    return (
      <div className="min-h-screen bg-zinc-50">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Filters */}
              <div className="bg-white p-4 rounded-lg border-2 border-gray-300 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter News</h2>
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
                  <button
                    onClick={() => {
                      setFilterPublication("");
                      setFilterVendor("");
                      setFilterSeverity("");
                    }}
                    className="mt-3 text-sm text-blue-600 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* News List */}
              <div className="bg-white rounded-lg border-2 border-gray-300">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Latest Security News</h2>
                  <p className="text-sm text-gray-600">
                    {filteredNews.length} articles {(filterPublication || filterVendor || filterSeverity) && "matching filters"}
                  </p>
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
                  <div className="divide-y divide-gray-100 max-h-[700px] overflow-y-auto">
                    {filteredNews.map((item, index) => (
                      <div
                        key={index}
                        className={`p-5 hover:bg-gray-50 transition-all border-l-4 ${
                          selectedItems.includes(item.link)
                            ? "bg-blue-50 border-l-blue-500"
                            : "border-l-transparent"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.link)}
                            onChange={() => toggleSelection(item.link)}
                            className="mt-1.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 mb-2 leading-tight">
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                              >
                                {item.title}
                              </a>
                            </h3>
                            {item.description && (
                              <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 text-xs">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.source}
                              </span>
                              <span className="text-gray-500 font-medium">
                                {getTimeAgo(item.pubDate)}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500">
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
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content Generation Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border-2 border-gray-300 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Content</h2>

                {selectedItems.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      {selectedItems.length} article{selectedItems.length > 1 ? "s" : ""} selected
                    </p>
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
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed 
  transition-colors font-medium"
                  >
                    {generating ? "Generating..." : "Generate Content"}
                  </button>
                </form>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-900">
                    <strong>⚠️ Note:</strong> Generated content should be reviewed before distribution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }