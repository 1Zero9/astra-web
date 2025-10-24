"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Security Pulse", href: "/pulse" },
    { name: "Phishing Simulator", href: "/phishing" },
    { name: "Awareness Content", href: "/awareness" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="bg-white border-b border-zinc-200">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-zinc-900">ASTRA</div>
            <span className="text-sm text-zinc-500 hidden sm:inline">
              Security Awareness Assistant
            </span>
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
                {item.name}
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
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
