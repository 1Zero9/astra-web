export default function SecurityPulse() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Security Pulse</h1>
        <p className="text-zinc-600 mb-8">
          Generate AI-powered summaries of current cyber threats, breaches, and security news
        </p>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200">
          <h2 className="text-xl font-semibold text-zinc-900 mb-4">Generate Security Summary</h2>

          <form className="space-y-4">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-zinc-900 mb-2">
                Topic or News Source (optional)
              </label>
              <input
                type="text"
                id="topic"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., recent ransomware attacks, cloud security breaches"
              />
            </div>

            <div>
              <label htmlFor="outputFormat" className="block text-sm font-medium text-zinc-900 mb-2">
                Output Format
              </label>
              <select
                id="outputFormat"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Email draft</option>
                <option>Viva post</option>
                <option>Slide bullets</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-zinc-900 text-white px-6 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Generate Summary
            </button>
          </form>

          <div className="mt-8 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <p className="text-sm text-zinc-500">Generated content will appear here...</p>
          </div>
        </div>
      </main>
    </div>
  );
}
