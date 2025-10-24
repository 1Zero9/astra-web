export default function Login() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-zinc-200">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Sign in to ASTRA</h1>
          <p className="text-zinc-600 mb-6 text-sm">
            Access your security awareness assistant
          </p>

          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-900 mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-900 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-zinc-900 text-white px-6 py-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Sign in
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-600">
              Don't have an account?{" "}
              <a href="#" className="text-zinc-900 font-medium hover:underline">
                Request access
              </a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-200">
            <p className="text-xs text-zinc-500">
              ⚠️ This is a Proof of Concept (POC) tool. Authentication will be implemented in Stage 4.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
