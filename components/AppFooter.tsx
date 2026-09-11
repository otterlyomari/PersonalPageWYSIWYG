// components/AppFooter.tsx
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-300">C.L.A.W.S.</span>
          <span>— Custom Links and Web Sites</span>
        </div>
        <span className="hidden sm:inline text-neutral-700">|</span>
        <p>© {new Date().getFullYear()} C.L.A.W.S. Software LLC, All rights reserved.</p>
      </div>

      {/* Legal / Future-proofing links */}
      <div className="flex flex-wrap items-center justify-center gap-6 font-mono-custom text-neutral-400">
        <Link href="/legal/terms" className="hover:text-neutral-200 transition">
          Terms
        </Link>
        <Link href="/legal/privacy" className="hover:text-neutral-200 transition">
          Privacy
        </Link>
        <Link href="/legal/cookies" className="hover:text-neutral-200 transition">
          Cookies
        </Link>
        <Link href="/legal/acceptable-use" className="hover:text-neutral-200 transition">
          Acceptable Use
        </Link>
      </div>
    </footer>
  );
}