"use client";

import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import the Pulse content to avoid SSR issues
const PulseContent = dynamic(
  () => import("./pulse/page").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-slate-300 border-t-slate-800 rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading Pulse...</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Quick Nav Bar */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white">QUICK NAV</span>
            <div className="flex gap-2">
              <Link
                href="/prompt-builder"
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded transition-colors"
              >
                📝 PROMPT BUILDER
              </Link>
              <Link
                href="/learning-mode"
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded transition-colors"
              >
                📚 LEARNING MODE
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pulse Module */}
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-slate-300 border-t-slate-800 rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Loading Pulse...</p>
            </div>
          </div>
        }
      >
        <PulseContent />
      </Suspense>
    </div>
  );
}
