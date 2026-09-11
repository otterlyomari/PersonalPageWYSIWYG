// components/DashboardSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  username: string;
}

export default function DashboardSidebar({ username }: DashboardSidebarProps) {
  const pathname = usePathname();
  const basePath = `/dashboard/${username}`;

  const navItems = [
    { name: "Overview", href: `${basePath}`, icon: "🏠", exact: true },
    { name: "Builder", href: `${basePath}/builder`, icon: "⚡" },
    { name: "Analytics", href: `${basePath}/analytics`, icon: "📊" },
    { name: "Settings", href: `${basePath}/settings`, icon: "⚙️" },
  ];

  return (
    <>
      {/* Load JetBrains Mono */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <style>{`
        .font-mono-custom { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      {/* Left Sidebar Navigation */}
      <aside className="w-64 border-r border-neutral-900 bg-neutral-950 flex flex-col justify-between hidden md:flex sticky top-0 h-screen select-none">
        
        {/* Top Brand & Workspace Identifier */}
        <div className="p-6 space-y-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-lg bg-neutral-100 text-neutral-950 flex items-center justify-center font-bold text-sm tracking-tighter font-mono-custom group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="font-bold tracking-tight text-sm">C.L.A.W.S.</span>
          </Link>

          {/* Active Handle Badge */}
          <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3 flex items-center justify-between">
            <div className="flex flex-col truncate">
              <span className="text-[10px] font-mono-custom text-neutral-500 uppercase tracking-widest">Workspace</span>
              <span className="text-xs font-mono-custom text-neutral-200 font-semibold truncate">@{username}</span>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Primary Nav Links */}
          <nav className="space-y-1 font-mono-custom text-xs pt-2">
            <div className="text-[10px] font-mono-custom text-neutral-500 uppercase tracking-widest px-3 pb-2">
              Menu
            </div>
            {navItems.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition ${
                    isActive
                      ? "bg-neutral-900 text-neutral-100 font-semibold border border-neutral-800 shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions / Live Link */}
        <div className="p-6 border-t border-neutral-900 space-y-3">
          <Link
            href={`/${username}`}
            target="_blank"
            className="w-full py-2.5 px-3.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-mono-custom text-xs transition flex items-center justify-between group"
          >
            <span>View Live Site</span>
            <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
          </Link>
        </div>
      </aside>
    </>
  );
}