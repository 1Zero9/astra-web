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
  const [filterVendor, setFilterVendor] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/security-news");
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
    setLoading(false);
  };

  const toggleSelection = (link: string) => {
    setSelectedItems((prev) =>
      prev.includes(link) ? prev.filter((l) => l !== link) : [...prev, link]
    );
  };

  const filteredNews = news.filter((item) => {
    const matchesVendor = !filterVendor ||
      item.title.toLowerCase().includes(filterVendor.toLowerCase()) ||
      item.description?.toLowerCase().includes(filterVendor.toLowerCase());

    const matchesSeverity = !filterSeverity ||
      item.title.toLowerCase().includes(filterSeverity.toLowerCase()) ||
      item.description?.toLowerCase().includes(filterSeverity.toLowerCase());

    return matchesVendor && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Pulse</h1>
        <p className="text-gray-600 mb-8">
          Latest cybersecurity news and threat intelligence
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-300 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 mb-2">
                    Vendor / Company
                  </label>
                  <input
                    type="text"
                    id="vendor"
                    value={filterVendor}
                    onChange={(e) => setFilterVendor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., Oracle, Microsoft"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., critical, ransomware"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border-2 border-gray-300">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Latest Security News</h2>
                <p className="text-sm text-gray-600">{filteredNews.length} articles</p>
              </div>

              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading news...</div>
              ) : (
                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {filteredNews.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleSelection(item.link)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.link)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              {item.title}
                            </a>
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="font-medium text-blue-600">{item.source}</span>
                            <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border-2 border-gray-300 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate Content</h2>

              {selectedItems.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-900">{selectedItems.length} selected</p>
                </div>
              )}

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                    <option>Security Awareness Email</option>
                    <option>Executive Summary</option>
                    <option>Viva Post</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={selectedItems.length === 0}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Generate Content
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
