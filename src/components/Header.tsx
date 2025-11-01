"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/ASTRA_logo.png"
              alt="ASTRA Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
            <div className="flex flex-col">
              <div className="text-xl font-bold text-zinc-900">ASTRA</div>
              <span className="text-xs text-zinc-500 hidden sm:inline">
                Awareness, Security & Threat Response Assistant
              </span>
            </div>
          </Link>

          <div className="text-xs text-zinc-400">
            POC Tool
          </div>
        </div>
      </div>
    </header>
  );
}
