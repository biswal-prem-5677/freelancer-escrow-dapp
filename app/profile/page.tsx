"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useGetClientEscrows, useGetFreelancerEscrows, useGetEscrow } from "../hooks/useEscrow";
import { formatEther } from "viem";
import { User, Copy, CheckCircle, Briefcase, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import Footer from "../components/Footer";

function EscrowStatLoader({ id }: { id: bigint }) {
  const { data } = useGetEscrow(id);
  if (!data) return null;
  return <>{data}</>;
}

export default function ProfilePage() {
  const { ready, authenticated, user } = usePrivy();
  const address = user?.wallet?.address as `0x${string}` | undefined;
  const [copied, setCopied] = useState(false);

  const { data: clientIds } = useGetClientEscrows(address);
  const { data: freelancerIds } = useGetFreelancerEscrows(address);

  if (!ready) return null;

  if (!authenticated || !address) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <User className="h-12 w-12 text-slate-600" />
        <p className="text-2xl font-bold text-white">Sign in to view profile</p>
        <p className="text-slate-400">Connect a wallet or sign in with email</p>
      </div>
    );
  }

  const clientCount = clientIds?.length ?? 0;
  const freelancerCount = freelancerIds?.length ?? 0;
  const totalEscrows = new Set([
    ...(clientIds ?? []).map(String),
    ...(freelancerIds ?? []).map(String),
  ]).size;

  const loginMethod = user?.email?.address
    ? `Email (${user.email.address})`
    : user?.google?.email
    ? `Google (${user.google.email})`
    : "External Wallet";

  const walletType =
    user?.wallet?.walletClientType === "privy" ? "Embedded (Privy)" :
    user?.wallet?.walletClientType === "coinbase_smart_wallet" ? "Coinbase Smart Wallet" :
    "External (MetaMask / WalletConnect)";

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20">
            <User className="h-5 w-5 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Your Profile</h1>
          <p className="mt-1 text-sm text-slate-400">Wallet information and escrow summary.</p>
        </div>

        {/* Wallet Card */}
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 p-6 backdrop-blur">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Connected Wallet</p>
          <div className="flex items-center gap-3">
            <p className="font-mono text-sm text-white break-all flex-1">{address}</p>
            <button
              onClick={copyAddress}
              className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {copied ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-500">Login Method</p>
              <p className="text-slate-300 mt-0.5">{loginMethod}</p>
            </div>
            <div>
              <p className="text-slate-500">Wallet Type</p>
              <p className="text-slate-300 mt-0.5">{walletType}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className="text-2xl font-bold text-white">{totalEscrows}</p>
            <p className="mt-1 text-xs text-slate-500">Total Escrows</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <ArrowUpRight className="h-4 w-4 text-indigo-400" />
              <p className="text-2xl font-bold text-white">{clientCount}</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">As Client</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5">
              <ArrowDownLeft className="h-4 w-4 text-emerald-400" />
              <p className="text-2xl font-bold text-white">{freelancerCount}</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">As Freelancer</p>
          </div>
        </div>

        {/* Recent IDs */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">Recent Escrow IDs</h2>
          {totalEscrows === 0 ? (
            <p className="text-sm text-slate-500">No escrows yet. Create your first one!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set([...(clientIds ?? []), ...(freelancerIds ?? [])].map(String)))
                .slice(-20)
                .map((idStr) => (
                  <a
                    key={idStr}
                    href={`/escrow/${idStr}`}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    #{idStr}
                  </a>
                ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
