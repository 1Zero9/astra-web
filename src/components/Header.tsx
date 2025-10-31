"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navigation: Array<{ name: string; href: string; badge?: string }> = [
    { name: "Security Pulse", href: "/pulse" },
    { name: "Phishing Simulator", href: "/phishing" },
    { name: "Awareness Campaigns", href: "/awareness" },
    { name: "Prompt Builder", href: "/prompt-builder", badge: "Beta" },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

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
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-zinc-900">ASTRA</div>
              <span className="text-sm text-zinc-500 hidden sm:inline">
                Security Awareness Assistant
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{item.name}</span>
                  {item.badge ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Sign in
            </Link>
          </div>
        </div>

        <nav className="md:hidden pb-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{item.name}</span>
                {item.badge ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
                    {item.badge}
                  </span>
                ) : null}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
