// app/auth/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Default to 'register' if state is missing or invalid
  const currentState = searchParams.get("state") === "login" ? "login" : "register";
  const isLogin = currentState === "login";

  // Capture username query param if available
  const initialUsername = searchParams.get("username") || "";
  const [handle, setHandle] = useState(initialUsername);

  // Keep handle synced if search params change dynamically
  useEffect(() => {
    const u = searchParams.get("username");
    if (u) setHandle(u);
  }, [searchParams]);

  // Helper to switch modes via query params cleanly
  const toggleMode = (mode: "login" | "register") => {
    const usernameParam = handle ? `&username=${encodeURIComponent(handle)}` : "";
    router.replace(`/auth?state=${mode}${usernameParam}`, { scroll: false });
  };

  return (
    <>
      {/* Load JetBrains Mono */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <style>{`
        .font-mono-custom { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-neutral-800 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        {/* Minimal Top Bar */}
        <header className="relative z-10 w-full max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-950 flex items-center justify-center font-bold text-lg tracking-tighter shadow-lg shadow-white/10 font-mono-custom group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="font-bold tracking-tight text-lg leading-none">C.L.A.W.S.</span>
          </Link>

          <div className="text-xs font-mono-custom text-neutral-400">
            {isLogin ? "New to C.L.A.W.S.?" : "Already have an account?"}{" "}
            <button
              onClick={() => toggleMode(isLogin ? "register" : "login")}
              className="text-neutral-100 underline hover:text-white ml-1 font-semibold transition"
            >
              {isLogin ? "Sign up free" : "Log in"}
            </button>
          </div>
        </header>

        {/* Center Card Container */}
        <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md w-full mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/80 p-8 rounded-3xl shadow-2xl space-y-6"
          >
            {/* Header info */}
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight">
                {isLogin 
                  ? "Welcome back" 
                  : (handle ? `Claim @${handle} today!` : "Claim your digital space")}
              </h1>
              <p className="text-xs text-neutral-400 font-mono-custom">
                {isLogin 
                  ? "Enter your credentials to manage your links." 
                  : "Set up your handle and launch your new page!"}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 bg-neutral-950/60 rounded-xl border border-neutral-800/60 text-xs font-mono-custom">
              <button
                onClick={() => toggleMode("register")}
                className={`py-2.5 rounded-lg font-medium transition ${
                  !isLogin 
                    ? "bg-neutral-800 text-neutral-100 shadow-sm" 
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Register
              </button>
              <button
                onClick={() => toggleMode("login")}
                className={`py-2.5 rounded-lg font-medium transition ${
                  isLogin 
                    ? "bg-neutral-800 text-neutral-100 shadow-sm" 
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Log In
              </button>
            </div>

            {/* Dynamic Form Content */}
            <AnimatePresence mode="wait">
              <motion.form 
                key={currentState}
                initial={{ opacity: 0, x: isLogin ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? -10 : 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: Handle auth submission logic here
                  router.push("/builder");
                }}
                className="space-y-4 pt-2"
              >
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono-custom uppercase tracking-wider text-neutral-400">
                      Desired Handle
                    </label>
                    <div className="flex items-center bg-neutral-950/80 border border-neutral-800 rounded-xl px-3 focus-within:border-neutral-500 transition">
                      <span className="text-xs font-mono-custom text-neutral-600">mysite.com/</span>
                      <input 
                        type="text" 
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="yourname"
                        className="w-full bg-transparent py-3 border-none outline-none text-sm font-mono-custom text-neutral-200 pl-1 placeholder:text-neutral-700"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono-custom uppercase tracking-wider text-neutral-400">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com"
                    className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-3.5 py-3 text-sm font-mono-custom text-neutral-200 outline-none focus:border-neutral-500 transition placeholder:text-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono-custom uppercase tracking-wider text-neutral-400">
                    Password
                  </label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-3.5 py-3 text-sm font-mono-custom text-neutral-200 outline-none focus:border-neutral-500 transition placeholder:text-neutral-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-neutral-100 text-neutral-950 font-semibold text-sm hover:bg-white transition flex items-center justify-center gap-2 font-mono-custom shadow-lg shadow-white/5 mt-2"
                >
                  <span>{isLogin ? "Sign In to Dashboard" : "Create Account & Build"}</span>
                  <span>→</span>
                </button>
              </motion.form>
            </AnimatePresence>

            <div className="text-center">
              <p className="text-[11px] text-neutral-500 font-mono-custom">
                By continuing, you agree to our{" "}
                <Link href="/legal/terms" className="underline hover:text-neutral-300">Terms</Link>.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Minimal Footer Spacer */}
        <div className="relative z-10 w-full h-16" />
      </main>
    </>
  );
}