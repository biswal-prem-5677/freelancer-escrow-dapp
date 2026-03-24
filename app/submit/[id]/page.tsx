"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useGetEscrow, useSubmitWork } from "../../hooks/useEscrow";
import FileUpload from "../../components/FileUpload";
import TransactionModal from "../../components/TransactionModal";
import StatusBadge from "../../components/StatusBadge";
import NetworkGuard from "../../components/NetworkGuard";
import { EscrowState } from "../../config/contracts";
import { UploadCloud, CheckCircle } from "lucide-react";

export default function SubmitWorkPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = usePrivy();
  // Get the active wallet address (either external or embedded)
  const address = user?.wallet?.address as `0x${string}` | undefined;

  const escrowId = BigInt(id as string);

  const { data: escrow, isLoading } = useGetEscrow(escrowId);
  const { submitWork, isPending, isConfirming, isSuccess, error } = useSubmitWork();

  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  const isFreelancer =
    address?.toLowerCase() === escrow.freelancer.toLowerCase();
  const canSubmit =
    isFreelancer && escrow.state === EscrowState.AWAITING_WORK;

  const handleSubmit = () => {
    if (!ipfsHash) return;
    setModalOpen(true);
    submitWork(escrowId, ipfsHash);
  };

  return (
    <NetworkGuard>
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-8">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20">
          <UploadCloud className="h-5 w-5 text-indigo-400" />
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Submit Work</h1>
          <StatusBadge state={escrow.state} />
        </div>
        <p className="mt-1 text-sm text-slate-400">Escrow #{id?.toString()}</p>
      </div>

      {/* Escrow info */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm font-medium text-white">{escrow.description}</p>
        <p className="mt-1 text-xs text-slate-500 font-mono">
          Client: {escrow.client.slice(0, 8)}…{escrow.client.slice(-6)}
        </p>
      </div>

      {/* Access guard */}
      {!isFreelancer && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-300">
          Only the assigned freelancer can submit work for this escrow.
        </div>
      )}

      {canSubmit && (
        <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
              Step 1 — Upload deliverable to IPFS
            </p>
            <FileUpload
              onUpload={(hash) => setIpfsHash(hash)}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
            />
          </div>

          {ipfsHash && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Uploaded to IPFS</span>
              </div>
              <p className="mt-1 break-all text-xs font-mono text-slate-400">
                {ipfsHash}
              </p>
            </div>
          )}

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
              Step 2 — Record proof on-chain
            </p>
            <button
              onClick={handleSubmit}
              disabled={!ipfsHash || isPending || isConfirming}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Work On-Chain
            </button>
          </div>
        </div>
      )}

      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (isSuccess) router.push(`/escrow/${id}`);
        }}
        isPending={isPending}
        isConfirming={isConfirming}
        isSuccess={isSuccess}
        error={error}
        successMessage="Work submitted! IPFS proof recorded on-chain."
      />
    </div>
    </NetworkGuard>
  );
}
