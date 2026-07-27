"use client";

import { usePlatformStats } from "../hooks/useEscrow";
import { formatEther } from "viem";
import { BarChart3, Users, Coins, Clock, Shield, TrendingUp } from "lucide-react";
import Footer from "../components/Footer";

export default function StatsPage() {
  const { totalEscrows, platformFeeBps, treasury, defaultDeadlineDays, owner, isLoading } = usePlatformStats();

  const stats = [
    {
      icon: BarChart3,
      label: "Total Escrows",
      value: totalEscrows?.toString() ?? "—",
      desc: "Created on-chain",
      color: "indigo",
    },
    {
      icon: Coins,
      label: "Platform Fee",
      value: platformFeeBps !== undefined ? `${Number(platformFeeBps) / 100}%` : "—",
      desc: `${platformFeeBps ?? 0} basis points`,
      color: "emerald",
    },
    {
      icon: Clock,
      label: "Default Deadline",
      value: defaultDeadlineDays !== undefined ? `${defaultDeadlineDays.toString()} days` : "—",
      desc: "For new escrows",
      color: "violet",
    },
    {
      icon: Shield,
      label: "Fee Cap",
      value: "5%",
      desc: "Max 500 bps hardcoded",
      color: "yellow",
    },
  ];

  const colorStyles: Record<string, { icon: string; border: string; bg: string }> = {
    indigo: { icon: "text-indigo-400", border: "border-indigo-500/20", bg: "bg-indigo-600/20" },
    emerald: { icon: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-600/20" },
    violet: { icon: "text-violet-400", border: "border-violet-500/20", bg: "bg-violet-600/20" },
    yellow: { icon: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-600/20" },
  };

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Platform Statistics</h1>
          <p className="mt-1 text-sm text-slate-400">
            Live on-chain data from the FreelancerEscrow smart contract on Polygon Amoy.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map((stat) => {
            const cs = colorStyles[stat.color];
            return (
              <div
                key={stat.label}
                className={`rounded-2xl border ${cs.border} bg-white/5 p-6 backdrop-blur transition-all hover:bg-white/[0.07]`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <p className={`mt-2 text-3xl font-bold text-white ${isLoading ? "animate-pulse" : ""}`}>
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{stat.desc}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cs.bg}`}>
                    <stat.icon className={`h-5 w-5 ${cs.icon}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contract Info */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">Contract Details</h2>
          <div className="space-y-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-500">Contract Owner</span>
              <span className="font-mono text-xs text-slate-300 break-all">{owner ?? "Loading..."}</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-500">Treasury Wallet</span>
              <span className="font-mono text-xs text-slate-300 break-all">{treasury ?? "Loading..."}</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-500">Network</span>
              <span className="text-xs text-slate-300">Polygon Amoy (Chain ID: 80002)</span>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-slate-500">Solidity Version</span>
              <span className="text-xs text-slate-300">^0.8.20 · Optimizer: 200 runs</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">V2 Features</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Multi-milestone escrows",
              "Deadline auto-expiry",
              "Escrow cancellation",
              "Dispute resolution",
              "Platform fee system (0-5%)",
              "IPFS proof of work",
              "Smart wallet compatible (ERC-4337)",
              "Gas-optimized transfers",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
