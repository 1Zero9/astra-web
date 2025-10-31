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
      {/* Full-Width Hero Section */}
      <section className="relative w-full border-b border-white/10">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A3B66] via-[#2C7BE5]/20 to-[#050B18]" />
          <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-[#2C7BE5]/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-[#1A3B66]/40 blur-[140px]" />
        </div>

        {/* Hero Content */}
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex flex-col items-center text-center gap-6">
            {/* Logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
              <Image
                src="/images/ASTRA_logo.png"
                alt="ASTRA Logo"
                width={300}
                height={300}
                className="relative z-10 object-contain"
                priority
              />
            </div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                ASTRA
              </h1>
              <p className="text-lg sm:text-xl text-white/90">
                Awareness, Security &amp; Threat Response Assistant
              </p>
              <p className="max-w-2xl text-sm text-white/75 mx-auto leading-relaxed">
                Build security awareness campaigns, simulate phishing scenarios, and stay informed on cyber
                threats with an AI co-pilot that is tuned for security teams.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/pulse"
                className="inline-flex items-center justify-center rounded-full bg-white text-[#050B18] px-8 py-3 text-sm font-semibold shadow-xl transition hover:scale-105"
              >
                Launch Security Pulse →
              </Link>
              <Link
                href="#modules"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/5 backdrop-blur-lg px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore all modules
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative mx-auto max-w-6xl px-4 py-12 space-y-12">
        {/* Value Props */}
        <section className="grid w-full gap-4 sm:grid-cols-3">
          {valueProps.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-left backdrop-blur-sm"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">{item.title}</p>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </section>

        {/* Core Modules */}
        <section id="modules" className="space-y-4">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/60">
              Core modules
            </span>
            <h2 className="text-xl font-semibold text-white">Choose your workflow</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreModules.map((module) => (
              <Link
                key={module.name}
                href={module.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 bg-gradient-to-tr ${module.accent} opacity-60`} />
                <div className="relative flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl drop-shadow-md">{module.icon}</div>
                    {module.badge && (
                      <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/90">
                        {module.badge}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{module.name}</h3>
                    <p className="text-xs text-white/75 leading-relaxed line-clamp-2">{module.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-white/90 transition group-hover:gap-2">
                    Launch →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Labs */}
        <section className="space-y-4">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center rounded-full border border-amber-200/40 bg-amber-100/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-amber-200">
              Astra labs
            </span>
            <h2 className="text-xl font-semibold text-white">Experiment in beta</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {labsModules.map((module) => (
              <Link
                key={module.name}
                href={module.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all hover:scale-[1.02]"
              >
                <div className={`absolute inset-0 bg-gradient-to-tr ${module.accent} opacity-60`} />
                <div className="relative flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl drop-shadow-md">{module.icon}</div>
                    {module.badge && (
                      <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/90">
                        {module.badge}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{module.name}</h3>
                    <p className="text-xs text-white/75 leading-relaxed line-clamp-2">{module.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-white/90 transition group-hover:gap-2">
                    Try →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer */}
        <section className="text-center pt-4 pb-2">
          <div className="text-xs text-white/40">
            {getFullVersionInfo()} • <strong className="text-white/50">⚠️ POC Tool</strong> • Built by <span className="font-semibold text-white/50">1Zero9</span>
          </div>
        </section>
      </main>
    </div>
  );
}
