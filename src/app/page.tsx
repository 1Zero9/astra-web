import Link from "next/link";
import Image from "next/image";
import { getFullVersionInfo } from "@/lib/version";

type ModuleShowcase = {
  name: string;
  description: string;
  href: string;
  statLabel: string;
  statValue: string;
  accent: string;
};

type MissionEvent = {
  label: string;
  detail: string;
  icon: string;
};

const keyMetrics = [
  { label: "Threat surfaces monitored", value: "128+" },
  { label: "Content workflows automated", value: "24" },
  { label: "Avg. response uplift", value: "4.3x" },
];

const coreModules: ModuleShowcase[] = [
  {
    name: "Security Pulse",
    description: "Curated threat intelligence briefings with analyst-ready context and CVE enrichment.",
    href: "/pulse",
    statLabel: "Latest briefings",
    statValue: "12 today",
    accent: "from-cyan-400/30 via-blue-500/20 to-transparent",
  },
  {
    name: "Phishing Simulator",
    description: "Generate realistic phishing runs with callouts, risk scoring, and auto-generated landing pages.",
    href: "/phishing",
    statLabel: "Campaign templates",
    statValue: "46 presets",
    accent: "from-amber-400/30 via-orange-500/20 to-transparent",
  },
  {
    name: "Awareness Campaigns",
    description: "Transform policies and news into polished awareness comms styled for your teams.",
    href: "/awareness",
    statLabel: "Playbooks",
    statValue: "18 curated",
    accent: "from-emerald-400/30 via-teal-500/20 to-transparent",
  },
  {
    name: "Prompt Builder (Beta)",
    description: "Prototype secure prompt frameworks with reusable guardrails and quick hand-off to teams.",
    href: "/prompt-builder",
    statLabel: "Framework packs",
    statValue: "7 beta",
    accent: "from-purple-400/30 via-fuchsia-500/20 to-transparent",
  },
];

const missionLog: MissionEvent[] = [
  {
    label: "Pulse v2.2",
    detail: "Live SOC dashboard aesthetic, analytics, and CVE lenses.",
    icon: "⚡",
  },
  {
    label: "Awareness 1.1",
    detail: "Template theming + scheduled delivery windows.",
    icon: "🛰️",
  },
  {
    label: "Prompt Builder Beta",
    detail: "Guardrail packs added for DLP controls.",
    icon: "🛡️",
  },
  {
    label: "API Surface",
    detail: "New webhook triggers for incident automation.",
    icon: "🌐",
  },
];

const operatorQuotes = [
  {
    role: "Director, Security Awareness",
    quote:
      "ASTRA feels like stepping into a clean SOC interface. The AI output is staged so we stay in control.",
  },
  {
    role: "CISO, FinTech Scale-up",
    quote:
      "Pulse briefings read like our analysts wrote them—only faster. The brand keeps the board engaged.",
  },
];

const consoleLines = [
  "> astra launch pulse --focus \"zero-day intel\"",
  "[astra] ingesting sources: CISA • Talos • Rapid7 • BleepingComputer",
  "[astra] extracting CVEs... CVE-2025-1337 • CVE-2025-1742 • CVE-2025-2010",
  "[astra] synthesizing executive brief • awareness copy • recommended actions",
  "> output ready: share to execs? (y/n)",
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute -top-48 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-160px] right-[-80px] h-[28rem] w-[28rem] rounded-full bg-emerald-500/10 blur-[180px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(94,234,212,0.18),_transparent_55%)] opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(15,118,110,0.12)_0%,transparent_38%,rgba(14,116,144,0.14)_72%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.12]" />
      </div>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 pt-20 sm:px-6 sm:pt-24 lg:pt-28">
        {/* Hero */}
        <section className="flex flex-col items-center gap-10 text-center">
          <div className="group relative flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-[48px] bg-white/10 blur-3xl" />
              <div className="relative flex h-32 w-32 items-center justify-center rounded-[48px] border border-white/20 bg-white/10 backdrop-blur-md sm:h-40 sm:w-40">
                <Image
                  src="/images/ASTRA_logo.png"
                  alt="ASTRA Logo"
                  width={160}
                  height={160}
                  className="h-20 w-20 object-contain brightness-110"
                  priority
                />
                <div className="absolute inset-0 rounded-[48px] border border-cyan-300/30 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              </div>
              <div className="absolute inset-x-0 -bottom-8 h-16 translate-y-1/2 bg-gradient-to-b from-cyan-400/20 via-transparent to-transparent blur-2xl" />
            </div>

            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-200/70">
                Security operations co-pilot
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                ASTRA Command Center
              </h1>
              <p className="mx-auto max-w-2xl text-sm text-slate-200/80 sm:text-base">
                Launch AI-guided awareness, phishing, and threat intel workflows that feel like a
                hardened SOC interface—controlled, precise, and unmistakably on brand.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/pulse"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-emerald-300 to-cyan-300 px-8 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Enter Command Center →
              </Link>
              <Link
                href="#modules"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
              >
                Browse mission modules
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {keyMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left backdrop-blur-sm transition hover:border-cyan-300/40"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">{metric.label}</p>
                <p className="mt-2 text-xl font-semibold text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Console + Value props */}
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-200/20 bg-slate-900/80 p-6 backdrop-blur-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_55%)]" />
            <div className="relative flex items-center justify-between pb-4">
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-200/70">
                Live console
              </p>
              <span className="rounded-full border border-cyan-300/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-cyan-100/80">
                AI Assist
              </span>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-cyan-200/10 bg-black/60 p-6 font-mono text-sm text-cyan-100/90 shadow-inner">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0)_60%)] opacity-60" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] bg-[length:40px_40px]" />
              <div className="relative space-y-3">
                {consoleLines.map((line, index) => (
                  <p
                    key={line}
                    className={`whitespace-pre-wrap ${
                      index === consoleLines.length - 1 ? "text-emerald-200" : ""
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/70">
                Why teams deploy ASTRA
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Precision without boredom</h2>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                ASTRA’s surface delivers the thrill of hands-on-keyboard security, with AI orchestrating the
                heavy lifting. Every workflow is wrapped with context so analysts keep ownership.
              </p>
            </div>
            {operatorQuotes.map((quote) => (
              <div
                key={quote.role}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md"
              >
                <p className="text-sm text-white/75 leading-relaxed">“{quote.quote}”</p>
                <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/50">{quote.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Module Carousel */}
        <section id="modules" className="space-y-6">
          <div className="flex flex-col gap-3 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-200/70">
              Mission modules
            </p>
            <h2 className="text-3xl font-semibold text-white">Choose your interface</h2>
            <p className="mx-auto max-w-3xl text-sm text-white/70">
              Each module launches into a focused cockpit. No endless menus—just the tools you need to
              brief execs, simulate risks, or broadcast awareness.
            </p>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-950 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-950 to-transparent" />
            <div className="flex gap-5 overflow-x-auto pb-2 pr-4">
              {coreModules.map((module) => (
                <Link
                  key={module.name}
                  href={module.href}
                  className="group relative min-w-[260px] flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-300/40 lg:min-w-[280px]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.accent}`} />
                  <div className="relative flex h-full flex-col justify-between gap-6">
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-white">{module.name}</h3>
                      <p className="text-sm text-white/75 leading-relaxed">{module.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-white/50">{module.statLabel}</p>
                        <p className="mt-1 text-sm font-semibold text-white">{module.statValue}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-white/90 transition group-hover:gap-2">
                        Launch →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Timeline */}
        <section className="space-y-6">
          <div className="flex flex-col items-start gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-cyan-200/70">Mission log</p>
            <h2 className="text-3xl font-semibold text-white">Latest transmissions</h2>
            <p className="max-w-2xl text-sm text-white/70">
              The ASTRA core is in constant iteration. Here’s what shipped recently, and what’s rolling out
              next.
            </p>
          </div>

          <div className="relative border-l border-white/10 pl-8">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-300/40 via-white/5 to-transparent" />
            <div className="flex flex-col gap-8">
              {missionLog.map((item) => (
                <div key={item.label} className="relative">
                  <div className="absolute -left-11 flex h-6 w-6 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-900 text-base">
                    {item.icon}
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="mt-2 text-sm text-white/70">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* POC Ticker */}
      <div className="relative border-t border-white/10 bg-black/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 text-xs text-white/70 sm:px-6">
          <span className="flex items-center gap-2 font-semibold text-amber-200">
            <span className="text-lg">⚠️</span>
            Proof of Concept
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
            Review outputs with your security team before distribution. ASTRA assists; humans decide.
          </span>
          <span className="ml-auto whitespace-nowrap font-mono text-[11px] text-white/40">
            {getFullVersionInfo()}
          </span>
        </div>
      </div>
    </div>
  );
}
