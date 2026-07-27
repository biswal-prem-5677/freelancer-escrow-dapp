import Link from "next/link";
import { Shield, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
        <span className="text-4xl font-black text-white/10">404</span>
      </div>

      <h1 className="text-3xl font-bold text-white">Page Not Found</h1>
      <p className="mt-3 max-w-sm text-sm text-slate-400">
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the URL or head back to safety.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
