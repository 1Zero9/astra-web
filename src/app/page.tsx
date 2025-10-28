import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex-1 flex items-start justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-50 pt-16 pb-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Hero Section - Large Logo */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/ASTRA_logo.png"
              alt="ASTRA Logo"
              width={240}
              height={240}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-zinc-900 mb-4">
            ASTRA
          </h1>
          <p className="text-xl text-zinc-600 mb-2">
            Awareness, Security & Threat Response Assistant
          </p>
          <p className="text-base text-zinc-500 max-w-2xl mx-auto">
            AI-powered security awareness content generation
          </p>
        </div>

        {/* Features Grid - Single Screen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            href="/pulse"
            className="group relative bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl shadow-lg border-2 border-blue-200 hover:shadow-2xl hover:border-blue-300 hover:scale-105 transition-all duration-300"
          >
            <div className="text-4xl mb-3 text-blue-600">⚡</div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Security Pulse</h3>
            <p className="text-zinc-600 text-xs mb-3">
              AI summaries of cyber threats and security news
            </p>
            <p className="text-blue-700 text-xs font-medium">
              Enter →
            </p>
          </Link>

          <Link
            href="/phishing"
            className="group relative bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-xl shadow-lg border-2 border-purple-200 hover:shadow-2xl hover:border-purple-300 hover:scale-105 transition-all duration-300"
          >
            <div className="text-4xl mb-3 text-purple-600">🪝</div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Phishing Simulator</h3>
            <p className="text-zinc-600 text-xs mb-3">
              Generate phishing training scenarios
            </p>
            <p className="text-purple-700 text-xs font-medium">
              Enter →
            </p>
          </Link>

          <Link
            href="/awareness"
            className="group relative bg-gradient-to-br from-green-50 to-green-100/50 p-5 rounded-xl shadow-lg border-2 border-green-200 hover:shadow-2xl hover:border-green-300 hover:scale-105 transition-all duration-300"
          >
            <div className="text-4xl mb-3 text-green-600">📣</div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Awareness Content</h3>
            <p className="text-zinc-600 text-xs mb-3">
              Create security awareness materials
            </p>
            <p className="text-green-700 text-xs font-medium">
              Enter →
            </p>
          </Link>

          <div className="group relative bg-gradient-to-br from-zinc-50 to-zinc-100/50 p-5 rounded-xl shadow-lg border-2 border-zinc-200 opacity-60 cursor-not-allowed">
            <div className="text-4xl mb-3 text-zinc-400">🎓</div>
            <h3 className="text-lg font-semibold text-zinc-700 mb-2">Knowledge Explainer</h3>
            <p className="text-zinc-500 text-xs mb-3">
              Explain compliance frameworks
            </p>
            <p className="text-zinc-500 text-xs italic">
              Coming soon
            </p>
          </div>
        </div>

        {/* Compact POC Notice */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
            <p className="text-xs text-amber-800">
              <strong>⚠️ POC Tool</strong> — Review all generated content before use
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
