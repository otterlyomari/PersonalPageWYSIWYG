// app/dashboard/[username]/page.tsx
"use client";

import AppFooter from "@/components/AppFooter";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DashboardRootPage() {
  const params = useParams();
  const username = params.username as string;

  return (
    <div className="flex-1 bg-neutral-950 text-neutral-100 p-6 md:p-10 space-y-8 max-w-6xl mx-auto w-full">
      
      {/* Top Greeting & Live Link Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-neutral-400 font-mono-custom">@{username}</span>
          </h1>
          <p className="text-xs text-neutral-500 font-mono-custom mt-1">
            Here is what is happening with your digital space today.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-neutral-900/60 border border-neutral-800/80 px-4 py-2 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono-custom text-neutral-300">mysite.com/{username}</span>
          <Link
            href={`/${username}`}
            target="_blank"
            className="ml-2 text-xs font-mono-custom text-neutral-400 hover:text-white transition"
          >
            ↗
          </Link>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Live Card Preview / Quick Launch */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-950/60 pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono-custom text-neutral-500 uppercase tracking-wider">Active Workspace</span>
              <span className="text-[10px] font-mono-custom bg-emerald-950/60 border border-emerald-900/50 text-emerald-400 px-2.5 py-1 rounded-md">
                Published
              </span>
            </div>

            {/* Mini Visual Preview Card */}
            <div className="aspect-[1/1] w-full rounded-2xl bg-neutral-950 border border-neutral-800 p-6 flex flex-col items-center justify-between text-center relative shadow-inner">
              <div className="w-42 h-42 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center font-mono-custom text-xl font-bold text-neutral-300 shadow-md">
                {username ? username.slice(0, 2).toUpperCase() : "CL"}
              </div>

              <div className="space y-1">
               <h3 className="font-bold text-base text-neutral-100">Display Name</h3>
                <h3 className="font-mono font-bold text-base text-sm text-neutral-400">@{username}</h3>
                <p className="text-xs text-neutral-500 font-mono-custom italic">0 links active</p>
              </div>

              <Link
                href={`/dashboard/${username}/builder`}
                className="w-full py-3 rounded-xl bg-neutral-100 text-neutral-950 font-semibold text-xs font-mono-custom hover:bg-white transition shadow-lg shadow-white/5"
              >
                Open Builder Canvas →
              </Link>
            </div>
          </div>

          {/* Setup Checklist Widget */}
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-custom font-bold text-neutral-300">Setup Checklist</span>
              <span className="text-[10px] font-mono-custom text-neutral-500">2 of 4 complete</span>
            </div>
            <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
              <div className="bg-neutral-100 h-full w-1/2" />
            </div>
            <ul className="space-y-2 text-xs font-mono-custom text-neutral-400 pt-1">
              <li className="flex items-center gap-2 text-neutral-200">
                <span className="text-emerald-400">✓</span> Claim your unique handle
              </li>
              <li className="flex items-center gap-2 text-neutral-200">
                <span className="text-emerald-400">✓</span> Set account credentials
              </li>
              <li className="flex items-center gap-2 text-neutral-500">
                <span className="text-neutral-700">○</span> Add your first link block
              </li>
              <li className="flex items-center gap-2 text-neutral-500">
                <span className="text-neutral-700">○</span> Share your live custom page
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Privacy Analytics Peek & Quick Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Traffic Overview Card */}
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold tracking-tight">Privacy-First Analytics</h2>
                <p className="text-xs text-neutral-500 font-mono-custom mt-0.5">Zero tracking, zero cookies, cookieless metrics.</p>
              </div>
              <span className="text-xs font-mono-custom text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-lg">
                Last 7 days
              </span>


            </div>

            {/* Empty state graph representation */}
            <div className="h-48 w-full rounded-2xl bg-neutral-950/80 border border-neutral-800/60 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 font-mono-custom text-sm">
                📊
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-neutral-300">No traffic recorded yet</p>
                <p className="text-xs text-neutral-500 font-mono-custom max-w-xs">
                  Share your link on social channels to start viewing anonymous interaction metrics.
                </p>
              </div>
            </div>

            {/* Centered Analytics Button (text content determinant width measurement) */}
            <div className="flex justify-center pt-2">
              <Link
                href={`/dashboard/${username}/analytics`}
                className="text-xs font-mono-custom bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 px-4 py-2 rounded-xl transition inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>📊</span>
                <span>View Analytics</span>
              </Link>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href={`/dashboard/${username}/builder`}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition space-y-2 group"
            >
              <div className="text-xs font-mono-custom text-indigo-400">01 / DESIGN</div>
              <h3 className="font-bold text-sm">Visual Builder</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Arrange blocks, swap themes, and manage your link tree layout.
              </p>
            </Link>

            <Link
              href={`/dashboard/${username}/settings`}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition space-y-2 group"
            >
              <div className="text-xs font-mono-custom text-neutral-400">02 / INFRASTRUCTURE</div>
              <h3 className="font-bold text-sm">Settings & Domains</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Configure custom domains, security keys, and data exports.
              </p>
            </Link>
          </div>

        </div>

      </div>
    <AppFooter />
    </div>
  );
}