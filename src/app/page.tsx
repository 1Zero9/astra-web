import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex-1 bg-gradient-to-br from-zinc-50 via-white to-zinc-50">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-12 space-y-16">
        <div className="flex flex-col items-center text-center space-y-4">
          <Image
            src="/images/ASTRA_logo.png"
            alt="ASTRA Logo"
            width={140}
            height={140}
            className="object-contain"
            priority
          />
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900">ASTRA</h1>
            <p className="text-lg text-zinc-600">
              Awareness, Security & Threat Response Assistant
            </p>
            <p className="text-sm text-zinc-500 max-w-2xl mx-auto">
              Build security awareness campaigns, simulate phishing scenarios, and stay informed on
              cyber threats with an AI co-pilot.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
            >
              Go to dashboard
            </Link>
            <Link
              href="#modules"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:text-zinc-900"
            >
              Explore modules
            </Link>
          </div>
        </div>

        <section id="modules" className="space-y-6">
          <div className="space-y-2 text-center">
            <span className="inline-flex items-center rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600">
              Core modules
            </span>
            <p className="text-sm text-zinc-500">
              Pick a workflow to start generating insights and training material.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Link
              href="/pulse"
              className="group flex flex-col rounded-2xl border border-blue-100 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl mb-4 text-blue-600">⚡</div>
              <h3 className="text-lg font-semibold text-zinc-900">Security Pulse</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Curated AI briefings on the latest threat intelligence and security news.
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600">
                Open module →
              </span>
            </Link>
            <Link
              href="/phishing"
              className="group flex flex-col rounded-2xl border border-purple-100 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl mb-4 text-purple-600">🪝</div>
              <h3 className="text-lg font-semibold text-zinc-900">Phishing Simulator</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Generate realistic phishing emails with safe callouts for awareness training.
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-purple-600">
                Open module →
              </span>
            </Link>
            <Link
              href="/awareness"
              className="group flex flex-col rounded-2xl border border-green-100 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl mb-4 text-green-600">📣</div>
              <h3 className="text-lg font-semibold text-zinc-900">Awareness Campaigns</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Turn policies or articles into polished awareness content in minutes.
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-green-600">
                Open module →
              </span>
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2 text-center">
            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-600">
              Astra labs
            </span>
            <p className="text-sm text-zinc-500">
              Experimental tools that are useful today but still evolving.
            </p>
          </div>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/prompt-builder"
              className="group flex flex-col rounded-2xl border border-amber-100 bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="text-4xl text-amber-500">🎯</div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                  Beta
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">Prompt Builder</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Rapidly prototype prompts with ready-to-use frameworks and guardrails.
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-amber-600">
                Try it now →
              </span>
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-2 text-center">
            <span className="inline-flex items-center rounded-full bg-zinc-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600">
              On the roadmap
            </span>
            <p className="text-sm text-zinc-500">
              Ideas we are shaping with feedback from early security teams.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mx-auto max-w-3xl">
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-6 text-center text-zinc-500">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-lg font-semibold text-zinc-700">Knowledge Explainer</h3>
              <p className="mt-2 text-sm">
                Plain-language walkthroughs for ISO, NIST, and other compliance frameworks.
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide">Coming soon</p>
            </div>
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white/60 p-6 text-center text-zinc-500">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-zinc-700">Usage Dashboard</h3>
              <p className="mt-2 text-sm">
                Analytics to benchmark content adoption and phishing simulation results.
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide">Coming soon</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs text-amber-800">
            <strong>⚠️ POC Tool:</strong> Review generated output with your security team before
            sharing.
          </div>
        </div>
      </div>
    </div>
  );
}
