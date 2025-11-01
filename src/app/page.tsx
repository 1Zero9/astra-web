"use client";

import Link from "next/link";
import Image from "next/image";
import { getFullVersionInfo } from "@/lib/version";
import { useState } from "react";

type AppModule = {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  href: string;
  features?: string[];
  badge?: string;
};

const apps: AppModule[] = [
  {
    id: 'pulse',
    name: 'Pulse',
    description: 'Intelligence feeds with AI analysis across Security, AI, and Tech news.',
    icon: '🛡️',
    gradient: 'from-[#2C7BE5] to-[#1A3B66]',
    href: '/pulse',
    features: [
      '📰 Live RSS Feeds',
      '📚 Saved Articles',
      '📋 Reading Queue',
      '🤖 AI Summaries',
      '✍️ Content Generator',
      '📊 Analytics'
    ]
  },
  {
    id: 'prompt-builder',
    name: 'Prompt Builder',
    description: 'Build and refine AI prompts for better results.',
    icon: '📝',
    gradient: 'from-[#A855F7] to-[#7C3AED]',
    href: '/prompt-builder',
    badge: 'COMING SOON'
  },
  {
    id: 'learning-mode',
    name: 'Learning Mode',
    description: 'Interactive learning and knowledge testing.',
    icon: '📚',
    gradient: 'from-[#14B8A6] to-[#0D9488]',
    href: '/learning-mode',
    badge: 'COMING SOON'
  }
];

export default function Home() {
  const [footerExpanded, setFooterExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1628] via-[#1A3B66] to-[#0A1628] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#2C7BE5]/20 blur-[120px]"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#1A3B66]/30 blur-[120px]"></div>

      <div className="relative min-h-screen flex flex-col">
        {/* Logo Hero */}
        <div className="flex flex-col items-center text-center pt-12 pb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-[#2C7BE5]/30 blur-3xl rounded-full group-hover:bg-[#2C7BE5]/40 transition-all duration-500"></div>
            <div className="absolute inset-0 animate-pulse bg-white/10 blur-2xl rounded-full"></div>
            <Image
              src="/images/ASTRA_logo.png"
              alt="ASTRA Logo"
              width={180}
              height={180}
              className="object-contain relative z-10 drop-shadow-2xl"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold text-white mt-4 tracking-tight">ASTRA</h1>
          <p className="text-white/60 text-sm mt-2">Awareness, Security & Threat Response Assistant</p>
        </div>

        {/* App Launcher */}
        <div className="flex-1 mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-6">
            <h2 className="text-white/80 text-xs font-bold uppercase tracking-wider mb-4">App Launcher</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {apps.map((app) => (
              <Link
                key={app.id}
                href={app.href}
                className="group relative block"
              >
                <div className={`relative bg-gradient-to-br ${app.gradient} rounded-2xl p-6 border-2 border-white/20 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-3xl ${app.badge ? 'opacity-60' : ''}`}>
                  {/* Glass overlay */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/10 rounded-2xl"></div>

                  {/* Content */}
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl filter drop-shadow-lg">{app.icon}</div>
                      {app.badge && (
                        <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-white uppercase tracking-wide">
                          {app.badge}
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                      {app.name}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">
                      {app.description}
                    </p>

                    {app.features && (
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/20">
                        {app.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-white/90 text-xs font-medium"
                          >
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center text-white text-sm font-bold mt-6 group-hover:translate-x-2 transition-transform duration-300">
                      <span>Launch App →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-6">
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
