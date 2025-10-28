export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-6">Dashboard</h1>
        <p className="text-zinc-600">
          Welcome to ASTRA – your AI-powered security awareness assistant.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {/* Module cards will go here */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
            <h2 className="text-xl font-semibold text-zinc-900 mb-2">Security Pulse</h2>
            <p className="text-zinc-600 text-sm mb-4">
              AI-generated summaries of current cyber threats and news
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
            <h2 className="text-xl font-semibold text-zinc-900 mb-2">Phishing Simulator</h2>
            <p className="text-zinc-600 text-sm mb-4">
              Generate realistic phishing email templates
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
            <h2 className="text-xl font-semibold text-zinc-900 mb-2">Awareness Content</h2>
            <p className="text-zinc-600 text-sm mb-4">
              Convert articles into awareness posts
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
            <h2 className="text-xl font-semibold text-zinc-900 mb-2">Knowledge Explainer</h2>
            <p className="text-zinc-600 text-sm mb-4">
              Explain security frameworks in plain English
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
