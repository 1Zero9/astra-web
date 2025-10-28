import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-8">
              <Image
                src="/public/images/ASTRA_logo.png"
                alt="ASTRA Logo"
                width={200}
                height={200}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              ASTRA
            </h1>
            <p className="text-2xl text-gray-700 mb-4 font-light max-w-3xl mx-auto">
              Awareness, Security & Threat Response Assistant
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI-powered security awareness content generation
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Link
              href="/pulse"
              className="group bg-white border-2 border-gray-300 p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Security Pulse</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                AI-generated summaries of current cyber threats, breaches, and security news
              </p>
              <span className="text-sm text-blue-600 font-medium group-hover:underline">
                Learn more →
              </span>
            </Link>

            <Link
              href="/phishing"
              className="group bg-white border-2 border-gray-300 p-8 hover:border-purple-500 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Phishing Simulator</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Generate realistic phishing email templates and landing page content for training
              </p>
              <span className="text-sm text-purple-600 font-medium group-hover:underline">
                Learn more →
              </span>
            </Link>

            <Link
              href="/awareness"
              className="group bg-white border-2 border-gray-300 p-8 hover:border-green-500 hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Awareness Content</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Convert articles and news into engaging security awareness posts for your team
              </p>
              <span className="text-sm text-green-600 font-medium group-hover:underline">
                Learn more →
              </span>
            </Link>
          </div>

          {/* Coming Soon Card */}
          <div className="max-w-5xl mx-auto mt-8">
            <div className="bg-gray-50 border-2 border-gray-300 p-8">
              <h3 className="text-xl font-semibold text-gray-500 mb-3">Knowledge Explainer</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">
                Explain ISO 27001, CE+, NIS2, and cyber topics in plain English
              </p>
              <span className="text-sm text-gray-400 italic">
                Coming soon
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* POC Notice */}
      <section className="py-12 bg-amber-50 border-t border-amber-200">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <p className="text-sm text-amber-900">
            <strong className="font-semibold">⚠️ Proof of Concept</strong> — All generated content should be reviewed by qualified security professionals before use.
          </p>
        </div>
      </section>
    </div>
  );
}
