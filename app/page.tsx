// app/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import AppFooter from "@/components/AppFooter";

export default function Home() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [username, setUsername] = useState("");

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    // Hide navbar if scrolling down and past 100px threshold, show if scrolling up
    if (latest > previous && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      {/* Load JetBrains Mono for clean technical accents */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <style>{`
        .font-mono-custom { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-neutral-800 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        {/* Sticky Dynamic Navbar */}
        <motion.header 
          variants={{
            visible: { y: 0 },
            hidden: { y: "-100%" },
          }}
          animate={hidden ? "hidden" : "visible"}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900/60"
        >
          <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-neutral-100 text-neutral-950 flex items-center justify-center font-bold text-lg tracking-tighter shadow-lg shadow-white/10 font-mono-custom">
                C
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-lg leading-none">C.L.A.W.S.</span>
                <span className="text-[10px] font-mono-custom text-neutral-400 tracking-widest uppercase mt-1">Custom Links & Web Sites</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link
                href="/auth?state=login"
                className="text-xs font-mono-custom tracking-wider px-5 py-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition shadow-sm"
              >
                Log in
              </Link>
              <Link
                href="/auth?state=register"
                className="text-xs font-mono-custom tracking-wider px-5 py-2.5 rounded-full bg-neutral-100 text-neutral-950 font-semibold hover:bg-white transition shadow-sm"
              >
                Sign up free
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-5xl mx-auto space-y-8">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-4xl leading-[1.05]"
          >
            Your links. Your pages. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-400 to-neutral-600">
              Zero limits.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl font-normal leading-relaxed"
          >
            The hybrid builder built for creators who outgrew rigid link-in-bio tools. Spin up a clean link tree or switch into full structural web design instantly.
          </motion.p>

          <motion.form 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-lg mx-auto pt-6"
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = username.trim();
              const query = trimmed ? `?state=register&username=${encodeURIComponent(trimmed)}` : "?state=register";
              router.push(`/auth${query}`);
            }}
          >
            <div className="flex items-center p-1.5 bg-neutral-900/50 backdrop-blur-md border border-neutral-800 hover:border-neutral-700 focus-within:border-neutral-500 focus-within:bg-neutral-900 transition-all rounded-2xl shadow-xl shadow-white/5">
              
              {/* Static Prefix */}
              <div className="pl-4 text-neutral-500 font-mono-custom text-sm sm:text-base select-none flex-shrink-0">
                mysite.com/
              </div>
              
              {/* Interactive Input */}
              <input
                type="text"
                placeholder="yourname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-neutral-100 font-mono-custom text-sm sm:text-base px-1 min-w-[80px] placeholder:text-neutral-700"
                autoComplete="off"
                spellCheck="false"
              />
              
              {/* Submit Button */}
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-neutral-100 text-neutral-950 font-semibold text-sm hover:bg-white transition flex items-center justify-center group whitespace-nowrap font-mono-custom flex-shrink-0 ml-2"
              >
                <span>Get started</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
              
            </div>
          </motion.form>
        </section>

        {/* Multi-Paragraph Background Section */}
        <section id="about" className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 border-t border-neutral-900/80">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-12 text-center"
          >
            <div className="inline-block uppercase tracking-widest text-xs font-mono-custom text-neutral-500">
              The Philosophy Behind C.L.A.W.S.
            </div>
            
            <div className="space-y-6 text-lg md:text-xl text-neutral-300 font-normal leading-relaxed text-left md:text-center">
              <p>
                For years, creators, developers, and independent professionals have been forced to choose between two extremes: overly simplistic link-in-bio directories that offer zero design freedom, or heavy, complex enterprise website builders that take hours just to configure a basic portfolio layout.
              </p>
              <p>
                We built C.L.A.W.S. to shatter that false dichotomy. By combining a lightning-fast data layer with a robust visual architecture, our platform allows you to start simple with your daily links and effortlessly scale into a fully customized web presence without ever changing tools or breaking your core links.
              </p>
              <p className="text-neutral-400 text-base">
                Whether you are launching a personal brand, a creator hub, or a professional portfolio, C.L.A.W.S. gives you absolute command over your digital footprint with zero bloat and uncompromising speed.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Feature Walkthrough Sections (Optimized for GIFs / Screenshots) */}
        <section id="features" className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 space-y-32">
          
          {/* Feature 1: Simple Mode */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 font-mono-custom text-xs uppercase tracking-wider">
                Mode 01
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Lightning-fast link & bio management.
              </h2>
              <p className="text-neutral-400 leading-relaxed">
                When you just need to get your content live, Simple Mode keeps things clean. Drop your social profiles, organize your content streams, and instantly sync changes directly to your live tree without layout friction.
              </p>
              <ul className="space-y-3 font-mono-custom text-xs text-neutral-300">
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">✓</span> Real-time state synchronization
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">✓</span> Instant drag-and-drop link ordering
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400">✓</span> Native cross-platform profile embeds
                </li>
              </ul>
            </div>

            {/* Media Slot for GIF / Screenshot */}
            <div className="lg:col-span-6">
              <div className="aspect-video w-full rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center p-6 text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-neutral-900/50 to-neutral-800/20" />
                <div className="relative z-10 space-y-2">
                  <span className="font-mono-custom text-xs text-neutral-500 uppercase tracking-widest">Media Slot</span>
                  <p className="text-sm font-medium text-neutral-400">Drop your Simple Mode walkthrough GIF or screenshot here</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature 2: Advanced Canvas */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Media Slot for GIF / Screenshot */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="aspect-video w-full rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center p-6 text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900 via-neutral-900/50 to-neutral-800/20" />
                <div className="relative z-10 space-y-2">
                  <span className="font-mono-custom text-xs text-neutral-500 uppercase tracking-widest">Media Slot</span>
                  <p className="text-sm font-medium text-neutral-400">Drop your Craft.js Advanced Canvas demo GIF or screenshot here</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-950/50 border border-indigo-900/50 text-indigo-400 font-mono-custom text-xs uppercase tracking-wider">
                Mode 02
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Total structural freedom with Advanced Canvas.
              </h2>
              <p className="text-neutral-400 leading-relaxed">
                Outgrew standard link trees? Flip the switch into Advanced Mode powered by Craft.js. Drag and drop modular blocks, nest multi-column layouts, and customize properties down to the finest detail.
              </p>
              <ul className="space-y-3 font-mono-custom text-xs text-neutral-300">
                <li className="flex items-center gap-3">
                  <span className="text-indigo-400">✓</span> Modular drag-and-drop structural editor
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-indigo-400">✓</span> Deep property inspection and styling
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-indigo-400">✓</span> Seamless parity between link IDs and components
                </li>
              </ul>
            </div>
          </motion.div>

        </section>

        {/* New Section: Architectural Deep-Dive */}
        <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 border-t border-neutral-900/80">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <div className="inline-block uppercase tracking-widest text-xs font-mono-custom text-neutral-500">
                Under the Hood
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Engineered for speed, built for scale.
              </h2>
              <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base">
                No sluggish client-side rendering bloat. C.L.A.W.S. utilizes an optimized pipeline that keeps your assets lightweight.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
                <div className="font-mono-custom text-emerald-400 text-xs">01 / DATA LAYER</div>
                <h3 className="font-bold text-lg">Instant Synchronization</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Your state updates propagate across edge nodes immediately, ensuring zero downtime when switching parameters.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
                <div className="font-mono-custom text-indigo-400 text-xs">02 / CANVAS ENGINE</div>
                <h3 className="font-bold text-lg">Craft.js Architecture</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Modular React components rendered dynamically with full control over CSS variables, shadows, and spacing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
                <div className="font-mono-custom text-neutral-300 text-xs">03 / DEPLOYMENT</div>
                <h3 className="font-bold text-lg">Edge-First Hosting</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Your pages load instantly anywhere in the world thanks to static generation and optimized edge asset delivery.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* New Section: 3-Step Workflow */}
        <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 border-t border-neutral-900/80">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-16"
          >
            <div className="text-center space-y-4">
              <div className="inline-block uppercase tracking-widest text-xs font-mono-custom text-neutral-500">
                Streamlined Workflow
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Up and running in under a minute.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="space-y-4">
                <div className="font-mono-custom text-2xl font-bold text-neutral-600">01</div>
                <h3 className="font-bold text-xl">Claim Your Handle</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Create your unique profile path, pick a starting theme template, and drop in your core links.
                </p>
              </div>

              <div className="space-y-4">
                <div className="font-mono-custom text-2xl font-bold text-neutral-600">02</div>
                <h3 className="font-bold text-xl">Choose Your Mode</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Stick to the clean link tree view or flip into Advanced Canvas to design multi-column layouts.
                </p>
              </div>

              <div className="space-y-4">
                <div className="font-mono-custom text-2xl font-bold text-neutral-600">03</div>
                <h3 className="font-bold text-xl">Publish & Grow</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Hit publish and share your live custom page across all your social channels seamlessly.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Modular Footer */}
        <AppFooter />
      </main>
    </>
  );
}