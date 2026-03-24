"use client";

import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useGetClientEscrows, useGetFreelancerEscrows, useGetEscrow } from "../hooks/useEscrow";
import EscrowCard from "../components/EscrowCard";
import { Plus } from "lucide-react";

// Helper: render one EscrowCard given an id
function EscrowCardLoader({
  id,
  viewerAddress,
}: {
  id: bigint;
  viewerAddress: string;
}) {
  const { data, isLoading } = useGetEscrow(id);

  if (isLoading) {
    return (
      <div className="h-36 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
    );
  }
  if (!data) return null;

  return (
    <EscrowCard
      id={data.id}
      client={data.client}
      freelancer={data.freelancer}
      amount={data.amount}
      description={data.description}
      state={data.state}
      createdAt={data.createdAt}
      viewerAddress={viewerAddress}
    />
  );
}

export default function DashboardPage() {
  const { ready, authenticated, user } = usePrivy();
  // Get the active wallet address (either external or embedded)
  const address = user?.wallet?.address as `0x${string}` | undefined;

  const { data: clientIds } = useGetClientEscrows(address);
  const { data: freelancerIds } = useGetFreelancerEscrows(address);

  if (!ready) return null; // Wait for Privy to initialize

  if (!authenticated || !address) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-2xl font-bold text-white">Sign in to view dashboard</p>
        <p className="text-slate-400">Connect a wallet or sign in with email</p>
      </div>
    );
  }

  const allIds = Array.from(
    new Set([...(clientIds ?? []), ...(freelancerIds ?? [])].map(String))
  ).map(BigInt);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            {allIds.length} escrow{allIds.length !== 1 ? "s" : ""} in your account
          </p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Escrow
        </Link>
      </div>

      {allIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
          <p className="text-slate-400">No escrows yet.</p>
          <Link href="/create" className="mt-4 text-sm text-indigo-400 underline">
            Create your first escrow →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {allIds.map((id) => (
            <EscrowCardLoader key={id.toString()} id={id} viewerAddress={address!} />
          ))}
        </div>
      )}
    </div>
  );
}
