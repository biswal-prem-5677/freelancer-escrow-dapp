"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { formatEther } from "viem";
import {
  useGetEscrow,
  useApproveWork,
  useRaiseDispute,
} from "../../hooks/useEscrow";
import TransactionModal from "../../components/TransactionModal";
import StatusBadge from "../../components/StatusBadge";
import NetworkGuard from "../../components/NetworkGuard";
import { EscrowState } from "../../config/contracts";
import {
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  User,
  Briefcase,
  Lock,
  Clock,
} from "lucide-react";

type ModalAction = "approve" | "dispute" | null;

export default function EscrowDetailPage() {
  const { id } = useParams();
  const { user } = usePrivy();
  // Get the active wallet address (either external or embedded)
  const address = user?.wallet?.address as `0x${string}` | undefined;
  const isEmbeddedWallet =
    user?.wallet?.walletClientType === "privy" ||
    user?.wallet?.walletClientType === "coinbase_smart_wallet";

  const escrowId = BigInt(id as string);

  const { data: escrow, isLoading, refetch } = useGetEscrow(escrowId);

  const approveHook = useApproveWork();
  const disputeHook = useRaiseDispute();

  const [activeModal, setActiveModal] = useState<ModalAction>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        Escrow not found.
      </div>
    );
  }

  const isClient = address?.toLowerCase() === escrow.client.toLowerCase();
  const date = new Date(Number(escrow.createdAt) * 1000).toLocaleString();
  const shortAddr = (a: string) => `${a.slice(0, 8)}…${a.slice(-6)}`;

  const handleApprove = () => {
    setActiveModal("approve");
    approveHook.approveWork(escrowId);
  };

  const handleDispute = () => {
    setActiveModal("dispute");
    disputeHook.raiseDispute(escrowId);
  };

  const closeModal = () => {
    setActiveModal(null);
    refetch();
  };

  const currentHook = activeModal === "approve" ? approveHook : disputeHook;

  return (
    <NetworkGuard>
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Escrow #{id?.toString()}</p>
          <h1 className="text-2xl font-bold text-white">{escrow.description}</h1>
        </div>
        <StatusBadge state={escrow.state} />
      </div>

      {/* Details card */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-500 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Client</p>
              <p className="font-mono text-xs text-white">
                {shortAddr(escrow.client)}
                {isClient && (
                  <span className="ml-1 rounded bg-indigo-600/20 px-1 text-[10px] text-indigo-400">
                    You
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-slate-500 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Freelancer</p>
              <p className="font-mono text-xs text-white">
                {shortAddr(escrow.freelancer)}
                {address?.toLowerCase() === escrow.freelancer.toLowerCase() && (
                  <span className="ml-1 rounded bg-indigo-600/20 px-1 text-[10px] text-indigo-400">
                    You
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-slate-500 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">{isEmbeddedWallet ? "Payment" : "Locked"}</p>
              <p className="text-sm font-bold text-white">
                {parseFloat(formatEther(escrow.amount)).toFixed(4)} MATIC
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-500 shrink-0" />
            <div>
              <p className="text-xs text-slate-500">Created</p>
              <p className="text-xs text-white">{date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* IPFS proof */}
      {escrow.ipfsHash && (
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
            Work Proof (IPFS)
          </p>
          <p className="break-all font-mono text-xs text-slate-300">
            {escrow.ipfsHash}
          </p>
          <a
            href={`https://ipfs.io/ipfs/${escrow.ipfsHash}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            View on IPFS Gateway <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Client actions */}
      {isClient && escrow.state === EscrowState.WORK_SUBMITTED && (
        <div className="flex gap-3">
          <button
            onClick={handleApprove}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            <CheckCircle className="h-4 w-4" /> Approve &amp; Release Funds
          </button>
          <button
            onClick={handleDispute}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <AlertTriangle className="h-4 w-4" /> Raise Dispute
          </button>
        </div>
      )}

      {/* Freelancer can also raise dispute */}
      {address?.toLowerCase() === escrow.freelancer.toLowerCase() &&
        (escrow.state === EscrowState.AWAITING_WORK ||
          escrow.state === EscrowState.WORK_SUBMITTED) && (
          <button
            onClick={handleDispute}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <AlertTriangle className="h-4 w-4" /> Raise Dispute
          </button>
        )}

      {/* Completed / Refunded states */}
      {(escrow.state === EscrowState.COMPLETE ||
        escrow.state === EscrowState.REFUNDED) && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-sm text-slate-400">
          This escrow is{" "}
          {escrow.state === EscrowState.COMPLETE ? "complete" : "refunded"}.
        </div>
      )}

      {/* Modal */}
      <TransactionModal
        open={activeModal !== null}
        onClose={closeModal}
        isPending={currentHook.isPending}
        isConfirming={currentHook.isConfirming}
        isSuccess={currentHook.isSuccess}
        error={currentHook.error}
        hash={currentHook.hash}
        successMessage={
          activeModal === "approve"
            ? "Work approved! Funds sent to freelancer."
            : "Dispute raised. Owner will arbitrate."
        }
      />
    </div>
    </NetworkGuard>
  );
}
