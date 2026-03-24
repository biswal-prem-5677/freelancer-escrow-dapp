"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi";
import { formatEther } from "viem";
import { CONTRACT_ADDRESSES, ESCROW_ABI, EscrowState } from "../config/contracts";
import NetworkGuard from "../components/NetworkGuard";
import TransactionModal from "../components/TransactionModal";
import StatusBadge from "../components/StatusBadge";
import { ShieldAlert, CheckCircle, RotateCcw, Lock, Loader2 } from "lucide-react";

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useOwner() {
  const chainId = useChainId();
  return useReadContract({
    address: CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002],
    abi: ESCROW_ABI,
    functionName: "owner",
  });
}

function useTotalEscrows() {
  const chainId = useChainId();
  return useReadContract({
    address: CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002],
    abi: ESCROW_ABI,
    functionName: "totalEscrows",
  });
}

function useEscrowById(id: bigint) {
  const chainId = useChainId();
  return useReadContract({
    address: CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002],
    abi: ESCROW_ABI,
    functionName: "getEscrow",
    args: [id],
  });
}

function useResolveDispute() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const resolveDispute = (id: bigint, releaseFunds: boolean) => {
    writeContract({
      address: CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002],
      abi: ESCROW_ABI,
      functionName: "resolveDispute",
      args: [id, releaseFunds],
    });
  };

  return { resolveDispute, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Disputed Escrow Row ──────────────────────────────────────────────────────

function DisputedEscrowRow({
  id,
  onAction,
}: {
  id: bigint;
  onAction: (id: bigint, release: boolean) => void;
}) {
  const { data: escrow, isLoading } = useEscrowById(id);

  if (isLoading) {
    return (
      <div className="h-20 animate-pulse rounded-xl border border-white/10 bg-white/5" />
    );
  }

  if (!escrow || escrow.state !== EscrowState.DISPUTED) return null;

  const shortAddr = (a: string) => `${a.slice(0, 8)}…${a.slice(-6)}`;

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Escrow #{id.toString()}</p>
          <p className="font-medium text-white">{escrow.description}</p>
        </div>
        <StatusBadge state={escrow.state} />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-slate-500">Client</p>
          <p className="font-mono text-slate-300">{shortAddr(escrow.client)}</p>
        </div>
        <div>
          <p className="text-slate-500">Freelancer</p>
          <p className="font-mono text-slate-300">{shortAddr(escrow.freelancer)}</p>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <Lock className="h-3 w-3 text-slate-500" />
          <span className="text-slate-500">Locked:</span>
          <span className="font-bold text-white">
            {parseFloat(formatEther(escrow.amount)).toFixed(4)} MATIC
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => onAction(id, true)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Release to Freelancer
        </button>
        <button
          onClick={() => onAction(id, false)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Refund to Client
        </button>
      </div>
    </div>
  );
}

// ─── Helper: render ALL escrows, filter disputed client-side ──────────────────

function DisputeList({
  total,
  onAction,
}: {
  total: bigint;
  onAction: (id: bigint, release: boolean) => void;
}) {
  const ids = Array.from({ length: Number(total) }, (_, i) => BigInt(i));

  if (ids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
        <CheckCircle className="mb-3 h-8 w-8 text-emerald-400 opacity-40" />
        <p className="text-slate-400">No escrows exist yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ids.map((id) => (
        <DisputedEscrowRow key={id.toString()} id={id} onAction={onAction} />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { ready, authenticated, user } = usePrivy();
  const address = user?.wallet?.address as `0x${string}` | undefined;

  const { data: ownerAddress, isLoading: ownerLoading } = useOwner();
  const { data: totalEscrows, isLoading: totalLoading } = useTotalEscrows();

  const resolveHook = useResolveDispute();

  const [modalOpen, setModalOpen] = useState(false);
  const [resolveAction, setResolveAction] = useState<"release" | "refund" | null>(null);

  const handleAction = (id: bigint, release: boolean) => {
    setResolveAction(release ? "release" : "refund");
    setModalOpen(true);
    resolveHook.resolveDispute(id, release);
  };

  if (!ready || ownerLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!authenticated || !address) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center px-4">
        <ShieldAlert className="h-10 w-10 text-slate-500" />
        <p className="text-xl font-bold text-white">Sign In Required</p>
        <p className="text-sm text-slate-400">Connect your owner wallet to access the admin panel.</p>
      </div>
    );
  }

  const isOwner =
    ownerAddress &&
    address.toLowerCase() === (ownerAddress as string).toLowerCase();

  if (!isOwner) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-10">
          <ShieldAlert className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <p className="text-xl font-bold text-white">Access Denied</p>
          <p className="mt-2 text-sm text-slate-400">
            This page is restricted to the contract owner.
          </p>
          <p className="mt-3 font-mono text-xs text-slate-500 break-all">
            Owner: {ownerAddress as string}
          </p>
        </div>
      </div>
    );
  }

  return (
    <NetworkGuard>
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20">
            <ShieldAlert className="h-5 w-5 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin — Dispute Resolution</h1>
          <p className="mt-1 text-sm text-slate-400">
            Review disputed escrows and arbitrate. Only the contract owner can perform these actions.
          </p>
        </div>

        {/* Stats strip */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-500">Total Escrows</p>
            <p className="text-2xl font-bold text-white">
              {totalLoading ? "…" : totalEscrows?.toString() ?? "0"}
            </p>
          </div>
          <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-slate-500">Your Role</p>
            <p className="text-sm font-bold text-emerald-400 mt-1">Contract Owner ✓</p>
          </div>
        </div>

        {/* Disputed escrows */}
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
          Disputed Escrows
        </h2>

        {totalEscrows !== undefined && totalEscrows > BigInt(0) ? (
          <DisputeList total={totalEscrows} onAction={handleAction} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <CheckCircle className="mb-3 h-8 w-8 text-emerald-400 opacity-40" />
            <p className="text-slate-400">No escrows to review.</p>
          </div>
        )}

        {/* Transaction modal */}
        <TransactionModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setResolveAction(null);
          }}
          isPending={resolveHook.isPending}
          isConfirming={resolveHook.isConfirming}
          isSuccess={resolveHook.isSuccess}
          error={resolveHook.error}
          hash={resolveHook.hash}
          successMessage={
            resolveAction === "release"
              ? "Dispute resolved — funds released to freelancer."
              : "Dispute resolved — funds refunded to client."
          }
        />
      </div>
    </NetworkGuard>
  );
}
