"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { VERSION, getFullVersionInfo } from "@/lib/version";

export default function Home() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

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

  const openModule = (moduleId: string) => {
    setIsAnimating(true);
    setActiveModule(moduleId);
  };

  const closeModule = () => {
    setIsAnimating(false);
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
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 transition-all duration-700 ${activeModule ? 'blur-2xl scale-110' : ''}`}>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className={`relative mx-auto max-w-6xl px-4 pt-16 pb-12 space-y-16 transition-all duration-700 ${activeModule ? 'blur-xl opacity-30 scale-95' : ''}`}>
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
              <button
                key={module.id}
                onClick={() => openModule(module.id)}
                className="group relative h-64 cursor-pointer"
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
                  <div className="relative h-full flex flex-col justify-between p-8 text-left">
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
              </button>
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
            className={`relative w-full h-full max-w-[95vw] max-h-[95vh] transition-all duration-700 ${
              isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            {/* Glass morphism container */}
            <div className="relative w-full h-full bg-white/10 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header bar with close button */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-black/30 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{activeModuleData?.icon}</div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{activeModuleData?.name}</h2>
                    <p className="text-xs text-white/60">Press ESC or click outside to close</p>
                  </div>
                </div>
                <button
                  onClick={closeModule}
                  className="group flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 transition-all duration-300"
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
                />
              </div>
            </div>

            {/* Loading indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="animate-spin h-8 w-8 border-2 border-white/30 border-t-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
