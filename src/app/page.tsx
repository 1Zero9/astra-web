import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 bg-zinc-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-zinc-50 border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-4">
              Welcome to ASTRA
            </h1>
            <p className="text-xl text-zinc-600 mb-2">
              Awareness, Security & Threat Response Assistant
            </p>
            <p className="text-lg text-zinc-500 max-w-2xl mx-auto mb-8">
              AI-powered security awareness content generation for busy IT, Security, and Governance teams
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-zinc-900 text-white px-8 py-3 rounded-lg hover:bg-zinc-800 transition-colors font-medium"
              >
                Get Started
              </Link>
              <Link
                href="#features"
                className="bg-white text-zinc-900 px-8 py-3 rounded-lg hover:bg-zinc-50 transition-colors font-medium border border-zinc-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Core Features</h2>
            <p className="text-zinc-600 max-w-2xl mx-auto">
              ASTRA helps you create professional security awareness materials in minutes, not hours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/pulse"
              className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Security Pulse</h3>
              <p className="text-zinc-600 text-sm mb-4">
                AI-generated summaries of current cyber threats, breaches, and security news
              </p>
              <p className="text-zinc-900 text-sm font-medium">
                Output: Email drafts, Viva posts, slide bullets →
              </p>
            </Link>

            <Link
              href="/phishing"
              className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">🎣</div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Phishing Simulator</h3>
              <p className="text-zinc-600 text-sm mb-4">
                Generate realistic phishing email templates and landing page content for training
              </p>
              <p className="text-zinc-900 text-sm font-medium">
                Output: HTML emails, simulation text →
              </p>
            </Link>

            <Link
              href="/awareness"
              className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">📢</div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Awareness Content</h3>
              <p className="text-zinc-600 text-sm mb-4">
                Convert articles and news into engaging security awareness posts for your team
              </p>
              <p className="text-zinc-900 text-sm font-medium">
                Output: Emails, blog posts, posters →
              </p>
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-xl font-semibold text-zinc-900 mb-2">Knowledge Explainer</h3>
              <p className="text-zinc-600 text-sm mb-4">
                Explain ISO 27001, CE+, NIS2, and cyber topics in plain English
              </p>
              <p className="text-zinc-500 text-sm italic">
                Coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Who is ASTRA for?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🛡️</div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Security Teams</h3>
              <p className="text-zinc-600 text-sm">
                Save hours creating awareness campaigns, phishing simulations, and threat summaries
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">💼</div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">IT Leaders</h3>
              <p className="text-zinc-600 text-sm">
                Quickly communicate security updates and best practices to staff
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-semibold text-zinc-900 mb-2">Governance Teams</h3>
              <p className="text-zinc-600 text-sm">
                Translate complex frameworks into understandable guidance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* POC Notice */}
      <section className="py-12 bg-amber-50 border-y border-amber-200">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-amber-900 mb-2">
            <strong>⚠️ Proof of Concept Notice</strong>
          </p>
          <p className="text-amber-800 text-sm">
            ASTRA is currently a POC tool. All generated content should be reviewed by qualified
            security professionals before use. This tool does not replace certified security systems
            or professional training platforms.
          </p>
        </div>
      </section>
    </div>
  );
}
