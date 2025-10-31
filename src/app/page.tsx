"use client";

import { useState } from "react";
import Image from "next/image";
import { VERSION, getFullVersionInfo } from "@/lib/version";

export default function Home() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const modules = [
    {
      id: 'pulse',
      name: 'Security Pulse',
      description: 'Curated AI briefings on the latest threat intelligence and security news.',
      icon: '⚡',
      gradient: 'from-blue-500/90 to-indigo-600/90',
      href: '/pulse'
    },
    {
      id: 'phishing',
      name: 'Phishing Simulator',
      description: 'Generate realistic phishing emails with safe callouts for awareness training.',
      icon: '🪝',
      gradient: 'from-purple-500/90 to-pink-600/90',
      href: '/phishing'
    },
    {
      id: 'awareness',
      name: 'Awareness Campaigns',
      description: 'Turn policies or articles into polished awareness content in minutes.',
      icon: '📣',
      gradient: 'from-green-500/90 to-emerald-600/90',
      href: '/awareness'
    },
    {
      id: 'prompt-builder',
      name: 'Prompt Builder',
      description: 'Rapidly prototype prompts with ready-to-use frameworks and guardrails.',
      icon: '🎯',
      gradient: 'from-amber-500/90 to-orange-600/90',
      href: '/prompt-builder',
      badge: 'Beta'
    }
  ];

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 space-y-16">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full"></div>
            <Image
              src="/images/ASTRA_logo.png"
              alt="ASTRA Logo"
              width={120}
              height={120}
              className="object-contain relative z-10"
              priority
            />
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              ASTRA
            </h1>
            <p className="text-xl text-white/90 font-medium">
              Awareness, Security & Threat Response Assistant
            </p>
            <p className="text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
              Build security awareness campaigns, simulate phishing scenarios, and stay informed on
              cyber threats with an AI co-pilot.
            </p>
          </div>
        </div>

        {/* Glass Morphism Module Cards */}
        <section id="modules" className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-white/90">
                Core Modules
              </span>
            </div>
            <p className="text-sm text-white/60">
              Select a module to launch the application
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <a
                key={module.id}
                href={module.href}
                className="group relative h-64 cursor-pointer"
              >
                {/* Glass card with gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.gradient} rounded-3xl shadow-2xl border border-white/30 backdrop-blur-lg transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-3xl`}>
                  {/* Multi-layer glass effect */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-3xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 rounded-3xl"></div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-3xl"></div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-8">
                    <div className="flex items-start justify-between">
                      <div className="text-6xl filter drop-shadow-lg">
                        {module.icon}
                      </div>
                      {module.badge && (
                        <span className="px-3 py-1 bg-black/30 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold text-white uppercase tracking-wide">
                          {module.badge}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                        {module.name}
                      </h3>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {module.description}
                      </p>
                      <div className="flex items-center text-white/90 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                        <span>Launch →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Stats/Info Glass Panel */}
        <section>
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="absolute inset-1 bg-white/5 rounded-2xl backdrop-blur-sm"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-white/10 to-transparent"></div>

            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">⚠️</div>
                <h3 className="text-lg font-bold text-white">POC Tool Notice</h3>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                ASTRA is a Proof of Concept tool. Review all generated content with your security team before distribution.
                Not a replacement for certified security systems or professional threat monitoring platforms.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center space-y-2 pt-8">
          <p className="font-mono text-sm text-white/60">
            {getFullVersionInfo()}
          </p>
          <p className="text-xs text-white/50">
            Built by <span className="font-semibold text-white/70">1Zero9</span> • © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
