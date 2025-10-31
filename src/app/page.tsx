import Link from "next/link";
import Image from "next/image";
import { getFullVersionInfo } from "@/lib/version";

type ModuleConfig = {
  name: string;
  description: string;
  href: string;
  icon: string;
  accent: string;
  badge?: string;
};

const coreModules: ModuleConfig[] = [
  {
    name: "Security Pulse",
    description: "Curated threat intelligence briefings with instant context on emerging attacks.",
    href: "/pulse",
    icon: "⚡",
    accent: "from-[#2C7BE5]/30 via-[#1A3B66]/40 to-[#0B1220]/20",
    badge: "Most popular",
  },
  {
    name: "Phishing Simulator",
    description: "Generate realistic phishing campaigns and safe callouts for awareness training.",
    href: "/phishing",
    icon: "🪝",
    accent: "from-[#9466FF]/25 via-[#4B2FA8]/35 to-[#0B1220]/10",
  },
  {
    name: "Awareness Campaigns",
    description: "Transform policies and articles into digestible security comms in minutes.",
    href: "/awareness",
    icon: "📣",
    accent: "from-[#48E9A6]/25 via-[#1F7F59]/30 to-[#0B1220]/10",
  },
];

const labsModules: ModuleConfig[] = [
  {
    name: "Prompt Builder",
    description: "Prototype AI prompts faster with reusable patterns, guardrails, and snippets.",
    href: "/prompt-builder",
    icon: "🎯",
    accent: "from-[#FBB03B]/25 via-[#C97908]/30 to-[#0B1220]/10",
    badge: "Beta",
  },
];

const valueProps = [
  {
    title: "Comms ready",
    body: "Launch polished awareness campaigns with one review cycle instead of many rewrites.",
  },
  {
    title: "Threat-led",
    body: "Stay ahead of fast-moving incidents with curated threat intelligence summaries.",
  },
  {
    title: "Security-first",
    body: "Guided flows keep AI usage governed and auditable for security teams.",
  },
];

export default function Home() {
  return (
    <div className="relative flex-1 overflow-hidden bg-[#050B18] text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050B18] via-[#0A1D3C] to-[#050B18]" />
        <div className="absolute -top-40 right-1/4 h-72 w-72 rounded-full bg-[#2C7BE5]/30 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-40px] h-80 w-80 rounded-full bg-[#1A3B66]/40 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />
      </div>

      <main className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24 space-y-16">
        {/* Hero */}
        <section className="flex flex-col items-center text-center gap-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-[48px] bg-white/10 blur-2xl" />
            <Image
              src="/images/ASTRA_logo.png"
              alt="ASTRA Logo"
              width={168}
              height={168}
              className="relative z-10 h-28 w-28 sm:h-40 sm:w-40 object-contain"
              priority
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              ASTRA
            </h1>
            <p className="text-lg sm:text-xl text-white/80">
              Awareness, Security &amp; Threat Response Assistant
            </p>
            <p className="max-w-2xl text-sm sm:text-base text-white/70 mx-auto leading-relaxed">
              Build security awareness campaigns, simulate phishing scenarios, and stay informed on cyber
              threats with an AI co-pilot that is tuned for security teams.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/pulse"
              className="inline-flex items-center justify-center rounded-full bg-white text-[#050B18] px-6 py-3 text-sm font-semibold tracking-wide shadow-lg shadow-blue-500/25 transition hover:scale-[1.02]"
            >
              Launch Security Pulse →
            </Link>
            <Link
              href="#modules"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/80 transition hover:text-white hover:border-white/60"
            >
              Explore all modules
            </Link>
          </div>

          <div className="grid w-full gap-4 sm:grid-cols-3">
            {valueProps.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-left backdrop-blur-sm"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">{item.title}</p>
                <p className="mt-2 text-sm text-white/75 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Modules */}
        <section id="modules" className="space-y-6">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/60">
              Core modules
            </span>
            <h2 className="text-2xl font-semibold text-white">Choose your workflow</h2>
            <p className="text-sm text-white/65">
              Pick a module to dive straight into ASTRA’s guided experiences.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {coreModules.map((module) => (
              <Link
                key={module.name}
                href={module.href}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md transition-transform hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-tr ${module.accent} opacity-60`} />
                <div className="relative flex flex-col h-full gap-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="text-5xl drop-shadow-md">{module.icon}</div>
                    {module.badge && (
                      <span className="self-start rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/90">
                        {module.badge}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">{module.name}</h3>
                    <p className="text-sm text-white/75 leading-relaxed">{module.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-white/90 transition group-hover:gap-2">
                    Launch module →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Labs */}
        <section className="space-y-6">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center rounded-full border border-amber-200/40 bg-amber-100/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-200">
              Astra labs
            </span>
            <h2 className="text-2xl font-semibold text-white">Experiment in beta</h2>
            <p className="text-sm text-white/65">
              Prototype new workflows that are shaping the roadmap. Feedback is welcome.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {labsModules.map((module) => (
              <Link
                key={module.name}
                href={module.href}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-md transition-transform hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-tr ${module.accent} opacity-60`} />
                <div className="relative flex flex-col h-full gap-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="text-5xl drop-shadow-md">{module.icon}</div>
                    {module.badge && (
                      <span className="self-start rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/90">
                        {module.badge}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white">{module.name}</h3>
                    <p className="text-sm text-white/75 leading-relaxed">{module.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-white/90 transition group-hover:gap-2">
                    Try it now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Proof of Concept Notice */}
        <section className="space-y-4 text-center">
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-xs text-white/70 backdrop-blur">
            <strong className="font-semibold text-white">⚠️ Proof of Concept:</strong> ASTRA is an
            experimental tool. Review generated output with your security team before sharing.
          </div>
          <div className="text-xs text-white/40 font-mono">{getFullVersionInfo()}</div>
        </section>
      </main>
    </div>
  );
}
