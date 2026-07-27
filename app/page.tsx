"use client";

import Link from "next/link";
import { Shield, ArrowRight, Lock, FileCheck, CheckCircle, BarChart3, Layers, Clock, Zap, Github, ExternalLink } from "lucide-react";
import { usePlatformStats } from "./hooks/useEscrow";
import Footer from "./components/Footer";

const steps = [
  {
    icon: Lock,
    title: "Lock Funds",
    desc: "Client deposits MATIC into the smart contract escrow. Funds are secured on-chain — no third party controls them.",
  },
  {
    icon: FileCheck,
    title: "Submit Proof",
    desc: "Freelancer uploads deliverables to IPFS and submits the content hash on-chain as tamper-proof evidence.",
  },
  {
    icon: CheckCircle,
    title: "Release Payment",
    desc: "Client reviews and approves. Funds instantly transfer to the freelancer. Any dispute goes to on-chain arbitration.",
  },
];

const features = [
  {
    icon: Layers,
    title: "Multi-Milestone",
    desc: "Split projects into phases. Pay freelancers as each deliverable is approved.",
  },
  {
    icon: Clock,
    title: "Auto-Expiry",
    desc: "Set deadlines. If work isn't delivered, clients get automatic refunds.",
  },
  {
    icon: Shield,
    title: "Dispute Resolution",
    desc: "On-chain arbitration by platform admin. Fair, transparent, immutable.",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    desc: "Polygon's fast finality means payments clear in seconds, not days.",
  },
];

export default function HomePage() {
  const { totalEscrows, platformFeeBps } = usePlatformStats();

  return (
    <div className="relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-0 h-[400px] w-[400px] translate-x-1/3 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/4 rounded-full bg-indigo-800/10 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-4 py-28 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/15">
          <Shield className="h-3.5 w-3.5" />
          Powered by Polygon Amoy · IPFS Proof of Work
        </div>

        {/* Headline with animated gradient */}
        <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Trustless Freelance{" "}
          <span
            className="inline-block bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400 bg-[length:200%_auto] bg-clip-text text-transparent"
            style={{ animation: "gradient-shift 4s linear infinite" }}
          >
            Payments
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-slate-400 leading-relaxed">
          Lock funds in a smart contract, deliver proof of work on IPFS, and
          release payment automatically — no middlemen, no disputes, no trust
          required.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/create"
            className="group flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            Create Escrow
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5 hover:-translate-y-0.5"
          >
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Live Platform Stats */}
      <section className="mx-auto max-w-3xl px-4 pb-20">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur hover:bg-white/[0.07] transition-colors">
            <p className="text-3xl font-bold text-white">{totalEscrows?.toString() ?? "—"}</p>
            <p className="mt-1 text-xs text-slate-500">Escrows Created</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur hover:bg-white/[0.07] transition-colors">
            <p className="text-3xl font-bold text-white">{platformFeeBps !== undefined ? `${Number(platformFeeBps) / 100}%` : "—"}</p>
            <p className="mt-1 text-xs text-slate-500">Platform Fee</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur hover:bg-white/[0.07] transition-colors">
            <p className="text-3xl font-bold text-white">~2s</p>
            <p className="mt-1 text-xs text-slate-500">Settlement Time</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-4 pb-28">
        <div className="mb-4 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Simple. Secure. On-Chain.
          </p>
          <h2 className="text-2xl font-bold text-white">How It Works</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-300 hover:border-indigo-500/40 hover:bg-white/8 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
            >
              {/* Step number — decorative */}
              <span className="absolute right-5 top-5 text-4xl font-black text-white/5 transition-colors group-hover:text-indigo-500/10">
                {i + 1}
              </span>

              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 transition-colors group-hover:bg-indigo-600/30">
                <step.icon className="h-5 w-5 text-indigo-400" />
              </div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Step {i + 1}
              </p>
              <h3 className="mb-2 text-base font-semibold text-white">
                {step.title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* V2 Features */}
      <section className="mx-auto max-w-5xl px-4 pb-28">
        <div className="mb-4 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            V2 Features
          </p>
          <h2 className="text-2xl font-bold text-white">Built for Real Projects</h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 group-hover:bg-indigo-600/20 transition-colors">
                <f.icon className="h-5 w-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="mb-1 text-base font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="mx-auto max-w-3xl px-4 pb-20">
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="https://amoy.polygonscan.com/address/0x493cb97D92477CB87Ef5117a6D8E42c0e08CfaAB"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Contract Verified
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            Open Source
          </a>
          <span className="flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-2 text-xs font-medium text-indigo-400">
            <Shield className="h-3.5 w-3.5" />
            76 Tests Passing
          </span>
          <span className="flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-2 text-xs font-medium text-violet-400">
            <Zap className="h-3.5 w-3.5" />
            ERC-4337 Compatible
          </span>
        </div>
      </section>

      <Footer />

      {/* Animated gradient keyframes injected inline */}
      <style>{`
        @keyframes gradient-shift {
          0%   { background-position: 0% center; }
          50%  { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
      `}</style>
    </div>
  );
}
