// app/dashboard/[username]/layout.tsx
"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const username = params.username as string;

  const basePath = `/dashboard/${username}`;
  const navItems = [
    { name: "Overview", href: `${basePath}` },
    { name: "Builder", href: `${basePath}/builder` },
    { name: "Analytics", href: `${basePath}/analytics` },
    { name: "Settings", href: `${basePath}/settings` },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex selection:bg-neutral-800">
      
      {/* Reusable Sidebar Component */}
      <DashboardSidebar username={username} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header (Fallback for small screens) */}
        <header className="md:hidden h-16 border-b border-neutral-900 bg-neutral-950 px-6 flex items-center justify-between sticky top-0 z-50">
          <span className="font-bold font-mono-custom text-sm">@{username}</span>
          <div className="flex items-center gap-2 font-mono-custom text-xs overflow-x-auto py-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
                  pathname === item.href ? "bg-neutral-800 text-neutral-100" : "text-neutral-400"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col bg-neutral-950">
          {children}
        </main>
      </div>

    </div>
  );
}