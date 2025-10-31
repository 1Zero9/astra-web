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
    <div className="flex-1 relative overflow-hidden h-screen flex flex-col">
      {/* Dark gradient background - ASTRA Brand Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#1A3B66] to-[#0A1628]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#2C7BE5]/20 blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#1A3B66]/30 blur-[120px]"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-4 py-6 flex-1 flex flex-col justify-center space-y-8">
        {/* Logo Hero */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#2C7BE5]/30 blur-3xl rounded-full group-hover:bg-[#2C7BE5]/40 transition-all duration-500"></div>
            <div className="absolute inset-0 animate-pulse bg-white/10 blur-2xl rounded-full"></div>
            <Image
              src="/images/ASTRA_logo.png"
              alt="ASTRA Logo"
              width={200}
              height={200}
              className="object-contain relative z-10 drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Module Cards */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {modules.map((module) => (
            <Link
              key={module.name}
              href={module.href}
              className="group relative h-36 sm:h-40"
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
                <div className="relative h-full flex flex-col justify-between p-4 text-left">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl filter drop-shadow-lg">
                      {module.icon}
                    </div>
                    {module.badge && (
                      <span className="px-2 py-0.5 bg-black/30 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-white uppercase tracking-wide">
                        {module.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white drop-shadow-lg">
                      {module.name}
                    </h3>
                    <p className="text-xs text-white/80 leading-snug line-clamp-2">
                      {module.description}
                    </p>
                    <div className="flex items-center text-white/90 text-xs font-semibold group-hover:translate-x-2 transition-transform duration-300">
                      <span>Launch →</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* Expandable Footer */}
        <div className="text-center pt-2">
          <button
            onClick={() => setFooterExpanded(!footerExpanded)}
            className="text-[10px] text-white/40 hover:text-white/60 transition-colors cursor-pointer"
          >
            {getFullVersionInfo()} {footerExpanded ? '▲' : '▼'}
          </button>

          {footerExpanded && (
            <div className="mt-2 text-[10px] text-white/50 space-y-0.5">
              <p>Built by <span className="font-semibold text-white/60">1Zero9</span></p>
              <p>© 2025 • POC Tool</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
