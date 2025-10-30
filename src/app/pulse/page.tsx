'use client';

import { useState } from 'react';

export default function SecurityPulse() {
  const [topic, setTopic] = useState('');
  const [outputFormat, setOutputFormat] = useState('Email draft');
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
          module: 'pulse',
          topic,
          outputFormat,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <main className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
        <header className="mb-12 text-white">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400/90 mb-4">Security Intelligence</p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Security Pulse
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            Generate concise, actionable summaries of emerging cyber security threats, breaches and sector news. Tailor the
            delivery format for your audience and keep teams briefed in seconds.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-12">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-sky-500/5 backdrop-blur">
            <div className="mb-6 flex items-center justify-between text-white">
              <h2 className="text-lg font-semibold">Generate a briefing</h2>
              <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-300">Live</span>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="topic" className="mb-2 block text-sm font-medium text-slate-200">
                  Topic or news source (optional)
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                  placeholder="e.g. recent ransomware attacks, financial services incidents"
                />
              </div>

              <div>
                <label htmlFor="outputFormat" className="mb-2 block text-sm font-medium text-slate-200">
                  Output format
                </label>
                <select
                  id="outputFormat"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                >
                  <option className="text-slate-900">Email draft</option>
                  <option className="text-slate-900">Viva post</option>
                  <option className="text-slate-900">Slide bullets</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Generating…' : 'Generate summary'}
              </button>
            </form>

            <div className="mt-8 space-y-4 text-xs text-slate-400">
              <p className="font-medium uppercase tracking-[0.25em] text-sky-300/80">Quick tips</p>
              <ul className="space-y-2">
                <li className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                  Use precise terms (e.g. “zero-day Exchange exploitation”) for deeper analysis.
                </li>
                <li className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
                  Try combining a sector with a geography to tailor incident briefings.
                </li>
              </ul>
            </div>
          </section>

          <section className="flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Output stream</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Scroll to review</span>
            </div>

            <div className="mt-4 flex-1 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 shadow-xl shadow-sky-500/10">
              <div className="border-b border-white/5 bg-white/5 px-6 py-4">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-sky-300/80">Generated summary</p>
              </div>
              <div className="relative h-full max-h-[60vh] overflow-y-auto px-6 py-6 text-sm text-slate-200">
                {loading ? (
                  <p className="text-slate-400">Generating content…</p>
                ) : result ? (
                  <article className="prose prose-invert prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900/80 p-4 font-sans text-[0.9rem] leading-6 text-slate-100">
                      {result}
                    </pre>
                  </article>
                ) : (
                  <p className="text-slate-500">Generated content will appear here. Run a query to populate the stream.</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
