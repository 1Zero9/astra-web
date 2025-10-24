export default function PhishingSimulator() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Phishing Simulation Builder</h1>
        <p className="text-zinc-600 mb-8">
          Generate realistic phishing email templates and landing page content for training exercises
        </p>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Create Phishing Template</h2>

          <form className="space-y-4">
            <div>
              <label htmlFor="scenario" className="block text-sm font-medium text-zinc-900 mb-2">
                Scenario Type
              </label>
              <select
                id="scenario"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Password reset request</option>
                <option>IT support alert</option>
                <option>Package delivery notification</option>
                <option>Payroll update</option>
                <option>Executive communication</option>
              </select>
            </div>

            <div>
              <label htmlFor="sophistication" className="block text-sm font-medium text-zinc-900 mb-2">
                Sophistication Level
              </label>
              <select
                id="sophistication"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Basic (easy to detect)</option>
                <option>Intermediate</option>
                <option>Advanced (realistic)</option>
              </select>
            </div>

            <div>
              <label htmlFor="includeRedFlags" className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeRedFlags"
                  className="rounded border-zinc-300"
                />
                <span className="text-sm text-zinc-900">Include obvious red flags for training</span>
              </label>
            </div>

            <button
              type="submit"
              className="bg-zinc-900 text-white px-6 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Generate Phishing Template
            </button>
          </form>

          <div className="mt-8 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <p className="text-sm text-zinc-500">Generated email template will appear here...</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-900">
            ⚠️ <strong>Disclaimer:</strong> Phishing simulations should only be used for authorised training exercises.
            All content should be reviewed by security professionals before use.
          </p>
        </div>
      </main>
    </div>
  );
}
