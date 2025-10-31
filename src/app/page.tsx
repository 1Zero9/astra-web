"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFullVersionInfo } from "@/lib/version";

type ModuleConfig = {
  name: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
  badge?: string;
};

const modules: ModuleConfig[] = [
  {
    name: "Security Pulse",
    description: "Curated AI briefings on the latest threat intelligence and security news.",
    href: "/pulse",
    icon: "⚡",
    gradient: "from-[#2C7BE5]/90 to-[#1A3B66]/90",
  },
  {
    name: "Phishing Simulator",
    description: "Generate realistic phishing emails with safe callouts for awareness training.",
    href: "/phishing",
    icon: "🪝",
    gradient: "from-[#1A3B66]/90 to-[#2C7BE5]/90",
  },
  {
    name: "Awareness Campaigns",
    description: "Turn policies or articles into polished awareness content in minutes.",
    href: "/awareness",
    icon: "📣",
    gradient: "from-[#2C7BE5]/90 to-[#1A3B66]/90",
  },
  {
    name: "Prompt Builder",
    description: "Rapidly prototype prompts with ready-to-use frameworks and guardrails.",
    href: "/prompt-builder",
    icon: "🎯",
    gradient: "from-[#1A3B66]/90 to-[#2C7BE5]/90",
    badge: "Beta",
  },
];

export default function Home() {
  const [footerExpanded, setFooterExpanded] = useState(false);
  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Animated gradient background - ASTRA Brand Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A3B66] via-[#2C7BE5] to-[#1A3B66]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-4 py-12 space-y-12">
        {/* Minimal Hero */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full"></div>
            <Image
              src="/images/ASTRA_logo.png"
              alt="ASTRA Logo"
              width={300}
              height={300}
              className="object-contain relative z-10"
              priority
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              ASTRA
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Awareness, Security & Threat Response Assistant
            </p>
            <p className="text-sm text-white/75 max-w-2xl mx-auto leading-relaxed pt-2">
              Build security awareness campaigns, simulate phishing scenarios, and stay informed on cyber threats with an AI co-pilot.
            </p>
          </div>
        </div>

        {/* Module Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {modules.map((module) => (
            <Link
              key={module.name}
              href={module.href}
              className="group relative h-48 sm:h-52"
            >
              {/* Glass card with gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} rounded-3xl shadow-2xl border border-white/30 backdrop-blur-lg transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-3xl group-active:scale-[0.98]`}>
                {/* Multi-layer glass effect */}
                <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 rounded-3xl"></div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-3xl"></div>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-5 sm:p-6 text-left">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl sm:text-5xl filter drop-shadow-lg">
                      {module.icon}
                    </div>
                    {module.badge && (
                      <span className="px-2 py-1 bg-black/30 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold text-white uppercase tracking-wide">
                        {module.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">
                      {module.name}
                    </h3>
                    <p className="text-sm text-white/80 leading-snug line-clamp-2">
                      {module.description}
                    </p>
                    <div className="flex items-center text-white/90 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Launch →</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Expandable Footer */}
        <div className="text-center pt-4 pb-2">
          <button
            onClick={() => setFooterExpanded(!footerExpanded)}
            className="text-xs text-white/50 hover:text-white/70 transition-colors cursor-pointer"
          >
            {getFullVersionInfo()} {footerExpanded ? '▲' : '▼'}
          </button>

          {footerExpanded && (
            <div className="mt-4 text-xs text-white/60 space-y-1 animate-in fade-in duration-300">
              <p>Built by <span className="font-semibold text-white/70">1Zero9</span></p>
              <p>© 2025 • Proof of Concept Tool</p>
              <p className="text-white/50">Review all generated output with your security team before sharing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
