"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getFullVersionInfo } from "@/lib/version";

type ModuleConfig = {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  href: string;
  badge?: string;
};

const modules: ModuleConfig[] = [
  {
    id: 'security-pulse',
    name: 'Security Pulse',
    description: 'Threat intelligence, vulnerabilities, and security news with AI analysis.',
    icon: '🛡️',
    gradient: 'from-[#2C7BE5]/90 to-[#1A3B66]/90',
    href: '/pulse?category=security'
  },
  {
    id: 'ai-pulse',
    name: 'AI Pulse',
    description: 'AI research, model releases, and machine learning news with AI summaries.',
    icon: '🤖',
    gradient: 'from-[#A855F7]/90 to-[#7C3AED]/90',
    href: '/pulse?category=ai'
  },
  {
    id: 'tech-pulse',
    name: 'Tech Pulse',
    description: 'Product launches, startups, and technology news with AI analysis.',
    icon: '💻',
    gradient: 'from-[#14B8A6]/90 to-[#0D9488]/90',
    href: '/pulse?category=tech'
  },
  {
    id: 'f1-pulse',
    name: 'F1 Pulse',
    description: 'Formula 1 news, race results, and team updates (just for fun!).',
    icon: '🏎️',
    gradient: 'from-[#EF4444]/90 to-[#DC2626]/90',
    href: '/pulse?category=f1'
  }
];

export default function Home() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [moduleLoading, setModuleLoading] = useState(false);
  const [footerExpanded, setFooterExpanded] = useState(false);

  const openModule = (moduleId: string) => {
    setModuleLoading(true);
    setIsAnimating(true);
    setActiveModule(moduleId);
  };

  const closeModule = () => {
    setIsAnimating(false);
    setModuleLoading(false);
    setTimeout(() => setActiveModule(null), 300);
  };

  const activeModuleData = modules.find(m => m.id === activeModule);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModule) {
        closeModule();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeModule]);
  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Dark gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#1A3B66] to-[#0A1628] transition-all duration-700 ${activeModule ? 'blur-2xl scale-110' : ''}`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#2C7BE5]/20 blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#1A3B66]/30 blur-[120px]"></div>
      </div>

      {/* Content */}
      <div className={`relative mx-auto max-w-6xl px-4 py-8 space-y-8 transition-all duration-700 ${activeModule ? 'blur-xl opacity-30 scale-95' : ''}`}>
        {/* Logo Hero */}
        <div className="flex flex-col items-center text-center pt-8">
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
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 pb-8">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => openModule(module.id)}
              className="group relative h-40 cursor-pointer"
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
                <div className="relative h-full flex flex-col justify-between p-5 text-left">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl filter drop-shadow-lg">
                      {module.icon}
                    </div>
                    {module.badge && (
                      <span className="px-2 py-1 bg-black/30 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold text-white uppercase tracking-wide">
                        {module.badge}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">
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
            </button>
          ))}
        </section>

        {/* Expandable Footer */}
        <div className="text-center pb-4">
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

      {/* Modal Overlay for Modules */}
      {activeModule && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-700 ${
            isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Backdrop blur overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
            onClick={closeModule}
          ></div>

          {/* Modal Container */}
          <div
            className={`relative w-full h-full max-w-full max-h-full sm:max-w-[90vw] sm:max-h-[90vh] transition-all duration-700 ${
              isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            {/* Glass morphism container */}
            <div className="relative w-full h-full bg-[#F8F9FA]/95 backdrop-blur-3xl rounded-none sm:rounded-3xl shadow-2xl border border-[#2C7BE5]/30 overflow-hidden">
              {/* Header bar with close button */}
              <div className="absolute top-0 left-0 right-0 z-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 bg-[#1A3B66]/90 backdrop-blur-xl border-b border-[#2C7BE5]/20">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{activeModuleData?.icon}</div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{activeModuleData?.name}</h2>
                    <p className="text-xs text-white/60">Press ESC or click outside to close</p>
                  </div>
                </div>
                <button
                  onClick={closeModule}
                  className="group flex items-center justify-center w-10 h-10 self-end sm:self-auto bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300"
                  aria-label="Close module"
                >
                  <svg className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Module Content - iframe */}
              <div className="w-full h-full pt-[72px]">
                <iframe
                  src={activeModuleData?.href}
                  className="w-full h-full border-0"
                  title={activeModuleData?.name}
                  onLoad={() => setModuleLoading(false)}
                />
              </div>
            </div>

            {/* Loading indicator */}
            {moduleLoading && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-[#F8F9FA]/90 backdrop-blur-xl rounded-2xl p-6 border border-[#2C7BE5]/30">
                  <div className="animate-spin h-8 w-8 border-2 border-[#2C7BE5]/30 border-t-[#2C7BE5] rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
