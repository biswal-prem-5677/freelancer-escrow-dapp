import Link from "next/link";
import { Shield, Github, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                Freelance<span className="text-indigo-400">Escrow</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xs">
              Trustless freelance payments powered by blockchain. No middlemen, 1% fee, instant settlement.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Platform</h4>
            <div className="flex flex-col gap-2">
              <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Dashboard</Link>
              <Link href="/create" className="text-sm text-slate-400 hover:text-white transition-colors">Create Escrow</Link>
              <Link href="/stats" className="text-sm text-slate-400 hover:text-white transition-colors">Platform Stats</Link>
              <Link href="/profile" className="text-sm text-slate-400 hover:text-white transition-colors">Profile</Link>
            </div>
          </div>

          {/* Contract */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">Smart Contract</h4>
            <div className="flex flex-col gap-2">
              <a
                href="https://amoy.polygonscan.com/address/0x493cb97D92477CB87Ef5117a6D8E42c0e08CfaAB"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                View on PolygonScan
              </a>
              <a
                href="https://github.com/biswal-prem-5677/freelancer-escrow-dapp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Github className="h-3 w-3" />
                Source Code
              </a>
              <p className="text-xs text-slate-600 font-mono mt-1">
                Polygon Amoy · Chain ID 80002
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/5 pt-6 sm:flex-row">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} FreelancerEscrow. Built on Polygon.
          </p>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Testnet Live
            </span>
            <span className="text-[10px] text-slate-600">Solidity ^0.8.20 · Next.js 14 · Privy Auth</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
