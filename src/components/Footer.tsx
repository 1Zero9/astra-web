export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-300 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Disclaimer */}
        <div className="mb-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <h3 className="text-sm font-semibold text-zinc-100 mb-2">⚠️ Important Disclaimer</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            ASTRA is a <strong>Proof of Concept (POC)</strong> tool. Use at your own discretion.
            It is not a certified security product and does not replace professional security systems,
            threat monitoring platforms, or certified training solutions. All generated content should
            be reviewed by a qualified security professional before use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-3">About ASTRA</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Awareness, Security & Threat Response Assistant — helping organisations create
              security awareness content, phishing simulations, and cyber event summaries.
            </p>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-3">Legal & Compliance</h3>
            <ul className="text-xs text-zinc-400 space-y-2">
              <li>
                <strong>GDPR:</strong> Registration data is used only for demonstration,
                feedback, and optional marketing follow-up.
              </li>
              <li>
                <strong>Liability:</strong> 1Zero9 and developers accept no liability
                for decisions made using output from this tool.
              </li>
              <li>
                <strong>Source Transparency:</strong> AI-generated content references source
                links where applicable.
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 mb-3">Contact</h3>
            <p className="text-xs text-zinc-400">
              Built by <strong>1Zero9</strong>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-zinc-800 text-xs text-zinc-500 text-center">
          © 2025 1Zero9. All rights reserved. This is a Proof of Concept application.
        </div>
      </div>
    </footer>
  );
}
