"use client";

import { use, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useGetEscrow, useGetMilestones, useApproveWork, useCancelEscrow, useClaimExpired, useRaiseDispute, useApproveMilestone } from "../../hooks/useEscrow";
import { useToast } from "../../components/Toast";
import StatusBadge from "../../components/StatusBadge";
import CountdownTimer from "../../components/CountdownTimer";
import FileUpload from "../../components/FileUpload";
import { useSubmitWork, useSubmitMilestone } from "../../hooks/useEscrow";
import { formatEther } from "viem";
import { EscrowState, MilestoneState, MILESTONE_LABELS } from "../../config/contracts";
import {
  ArrowLeft,
  User,
  Shield,
  Loader2,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Layers,
  FileText,
  Ban,
} from "lucide-react";
import Link from "next/link";

export default function EscrowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const escrowId = BigInt(id);
  const { user } = usePrivy();
  const address = user?.wallet?.address?.toLowerCase();
  const { addToast } = useToast();

  const { data: escrow, isLoading, refetch } = useGetEscrow(escrowId);
  const { data: milestones } = useGetMilestones(escrowId);

  // Write hooks
  const approve = useApproveWork();
  const cancel = useCancelEscrow();
  const expire = useClaimExpired();
  const dispute = useRaiseDispute();
  const submitWork = useSubmitWork();
  const submitMilestoneHook = useSubmitMilestone();
  const approveMilestoneHook = useApproveMilestone();

  const [ipfsHash, setIpfsHash] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [milestoneIndex, setMilestoneIndex] = useState<number | null>(null);

  // Toast on success
  const actions = [
    { hook: approve, msg: "Work approved! Payment released." },
    { hook: cancel, msg: "Escrow cancelled. Funds refunded." },
    { hook: expire, msg: "Expired claim successful. Funds refunded." },
    { hook: dispute, msg: "Dispute raised." },
    { hook: submitWork, msg: "Work submitted!" },
    { hook: submitMilestoneHook, msg: "Milestone submitted!" },
    { hook: approveMilestoneHook, msg: "Milestone approved! Payment released." },
  ];

  for (const { hook, msg } of actions) {
    useEffect(() => {
      if (hook.isSuccess) {
        addToast("success", msg);
        refetch();
      }
    }, [hook.isSuccess]);

    useEffect(() => {
      if (hook.error) addToast("error", hook.error.message?.split("\n")[0] ?? "Transaction failed");
    }, [hook.error]);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <XCircle className="h-12 w-12 text-red-400" />
        <p className="text-2xl font-bold text-white">Escrow Not Found</p>
        <Link href="/dashboard" className="text-sm text-indigo-400 hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  const isClient = address === escrow.client.toLowerCase();
  const isFreelancer = address === escrow.freelancer.toLowerCase();
  const state = escrow.state as EscrowState;
  const hasMilestones = escrow.milestoneCount > 0n;
  const shortAddr = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
  const isActive = state === EscrowState.AWAITING_WORK || state === EscrowState.WORK_SUBMITTED;

  const handleSubmitWork = () => {
    if (!ipfsHash) return;
    submitWork.submitWork(escrowId, ipfsHash);
  };

  const handleSubmitMilestone = (idx: number) => {
    if (!ipfsHash) return;
    submitMilestoneHook.submitMilestone(escrowId, BigInt(idx), ipfsHash);
    setIpfsHash("");
  };

  const anyPending = [approve, cancel, expire, dispute, submitWork, submitMilestoneHook, approveMilestoneHook]
    .some((h) => h.isPending || h.isConfirming);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Back */}
      <Link href="/dashboard" className="mb-6 flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Dashboard
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm text-slate-500">Escrow #{id}</p>
            {hasMilestones && (
              <span className="flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5 font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Layers className="h-2.5 w-2.5" /> Multi-Milestone
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-white">{escrow.description}</h1>
        </div>
        <StatusBadge state={state} />
      </div>

      {/* Info Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
            <User className="h-3 w-3" /> Client
          </div>
          <p className="font-mono text-sm text-white">{shortAddr(escrow.client)}</p>
          {isClient && <p className="text-[10px] text-indigo-400 mt-1">You</p>}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
            <Shield className="h-3 w-3" /> Freelancer
          </div>
          <p className="font-mono text-sm text-white">{shortAddr(escrow.freelancer)}</p>
          {isFreelancer && <p className="text-[10px] text-emerald-400 mt-1">You</p>}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-500 mb-2">Amount Locked</p>
          <p className="text-xl font-bold text-white">{parseFloat(formatEther(escrow.amount)).toFixed(4)} <span className="text-sm text-slate-400">MATIC</span></p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-500 mb-2">Deadline</p>
          {isActive ? (
            <CountdownTimer deadline={escrow.deadline} />
          ) : (
            <p className="text-sm text-slate-400">{new Date(Number(escrow.deadline) * 1000).toLocaleDateString()}</p>
          )}
        </div>
      </div>

      {/* IPFS Proof */}
      {escrow.ipfsHash && (
        <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-500 mb-2 flex items-center gap-1.5"><FileText className="h-3 w-3" /> Proof of Work (IPFS)</p>
          <div className="flex items-center gap-2">
            <p className="font-mono text-xs text-slate-300 truncate flex-1">{escrow.ipfsHash}</p>
            <a
              href={`https://gateway.pinata.cloud/ipfs/${escrow.ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1 text-xs text-indigo-400 hover:underline"
            >
              View <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      )}

      {/* Milestones Section */}
      {hasMilestones && milestones && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">Milestones</h2>
          <div className="space-y-3">
            {(milestones as unknown as { description: string; amount: bigint; ipfsHash: string; state: number }[]).map((m, i) => {
              const ms = m.state as MilestoneState;
              return (
                <div key={i} className={`rounded-xl border p-4 ${
                  ms === MilestoneState.APPROVED ? "border-emerald-500/20 bg-emerald-500/5" :
                  ms === MilestoneState.SUBMITTED ? "border-blue-500/20 bg-blue-500/5" :
                  "border-white/10 bg-white/5"
                }`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-xs text-slate-500">Phase {i + 1}</p>
                      <p className="text-sm font-medium text-white">{m.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-white">{parseFloat(formatEther(m.amount)).toFixed(4)} MATIC</p>
                      <p className={`text-[10px] font-medium mt-0.5 ${
                        ms === MilestoneState.APPROVED ? "text-emerald-400" :
                        ms === MilestoneState.SUBMITTED ? "text-blue-400" :
                        "text-slate-500"
                      }`}>{MILESTONE_LABELS[ms]}</p>
                    </div>
                  </div>

                  {/* Milestone IPFS */}
                  {m.ipfsHash && (
                    <a
                      href={`https://gateway.pinata.cloud/ipfs/${m.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-400 hover:underline font-mono"
                    >
                      View proof ↗
                    </a>
                  )}

                  {/* Freelancer: Submit this milestone */}
                  {isFreelancer && ms === MilestoneState.PENDING && isActive && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      {milestoneIndex === i ? (
                        <div className="space-y-2">
                          <FileUpload onUpload={(hash) => setIpfsHash(hash)} isUploading={isUploading} setIsUploading={setIsUploading} />
                          {ipfsHash && (
                            <button
                              onClick={() => handleSubmitMilestone(i)}
                              disabled={submitMilestoneHook.isPending}
                              className="w-full rounded-lg bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                              {submitMilestoneHook.isPending ? "Submitting…" : `Submit Phase ${i + 1}`}
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setMilestoneIndex(i)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          Upload proof for this phase →
                        </button>
                      )}
                    </div>
                  )}

                  {/* Client: Approve this milestone */}
                  {isClient && ms === MilestoneState.SUBMITTED && (
                    <button
                      onClick={() => approveMilestoneHook.approveMilestone(escrowId, BigInt(i))}
                      disabled={approveMilestoneHook.isPending}
                      className="mt-3 w-full rounded-lg bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                    >
                      {approveMilestoneHook.isPending ? "Approving…" : `Approve & Release Phase ${i + 1}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {/* Freelancer: Submit Work (single-milestone) */}
        {isFreelancer && !hasMilestones && state === EscrowState.AWAITING_WORK && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="mb-3 text-sm font-semibold text-white">Submit Your Work</h3>
            <FileUpload onUpload={(hash) => setIpfsHash(hash)} isUploading={isUploading} setIsUploading={setIsUploading} />
            {ipfsHash && (
              <button
                onClick={handleSubmitWork}
                disabled={submitWork.isPending}
                className="mt-3 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {submitWork.isPending ? "Submitting…" : "Submit Work on Chain"}
              </button>
            )}
          </div>
        )}

        {/* Client: Approve (single-milestone) */}
        {isClient && !hasMilestones && state === EscrowState.WORK_SUBMITTED && (
          <button
            onClick={() => approve.approveWork(escrowId)}
            disabled={anyPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {approve.isPending || approve.isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Approve & Release Payment
          </button>
        )}

        {/* Client: Cancel */}
        {isClient && state === EscrowState.AWAITING_WORK && (
          <button
            onClick={() => cancel.cancelEscrow(escrowId)}
            disabled={anyPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 py-3 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50"
          >
            {cancel.isPending || cancel.isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
            Cancel Escrow (Full Refund)
          </button>
        )}

        {/* Client: Claim Expired */}
        {isClient && state === EscrowState.AWAITING_WORK && Number(escrow.deadline) * 1000 < Date.now() && (
          <button
            onClick={() => expire.claimExpired(escrowId)}
            disabled={anyPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-600 py-3 text-sm font-semibold text-white hover:bg-yellow-500 disabled:opacity-50"
          >
            {expire.isPending || expire.isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
            Claim Expired (Refund)
          </button>
        )}

        {/* Dispute */}
        {(isClient || isFreelancer) && isActive && (
          <button
            onClick={() => dispute.raiseDispute(escrowId)}
            disabled={anyPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 disabled:opacity-50"
          >
            {dispute.isPending || dispute.isConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
            Raise Dispute
          </button>
        )}
      </div>
    </div>
  );
}
