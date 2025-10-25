'use client';

import { useState } from 'react';

export default function AwarenessContent() {
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [contentType, setContentType] = useState('Email to staff');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: 'awareness',
          sourceUrl,
          sourceText,
          contentType,
          tone,
        }),
      });

      const data = await response.json();
      setResult(data.content);
    } catch (error) {
      setResult('Error generating content. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Awareness Content Generator</h1>
        <p className="text-zinc-600 mb-8">
          Convert links and articles into engaging security awareness content
        </p>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Generate Awareness Content</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="sourceUrl" className="block text-sm font-medium text-zinc-900 mb-2">
                Source URL or Article Link
              </label>
              <input
                type="url"
                id="sourceUrl"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/security-article"
              />
            </div>

            <div>
              <label htmlFor="sourceText" className="block text-sm font-medium text-zinc-900 mb-2">
                Or paste text/article content
              </label>
              <textarea
                id="sourceText"
                rows={6}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paste article or news content here..."
              />
            </div>

            <div>
              <label htmlFor="contentType" className="block text-sm font-medium text-zinc-900 mb-2">
                Content Type
              </label>
              <select
                id="contentType"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Email to staff</option>
                <option>Blog/Viva post</option>
                <option>Poster-style text</option>
                <option>Social media post</option>
              </select>
            </div>

            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-zinc-900 mb-2">
                Tone
              </label>
              <select
                id="tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Professional</option>
                <option>Conversational</option>
                <option>Urgent</option>
                <option>Educational</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-zinc-900 text-white px-6 py-2 rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            {loading ? (
              <p className="text-sm text-zinc-500">Generating content...</p>
            ) : result ? (
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-zinc-900 font-sans">{result}</pre>
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Generated awareness content will appear here...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
