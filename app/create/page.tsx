"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useCreateEscrow } from "../hooks/useEscrow";
import TransactionModal from "../components/TransactionModal";
import NetworkGuard from "../components/NetworkGuard";
import { Lock } from "lucide-react";

export default function CreatePage() {
  const { ready, authenticated, user } = usePrivy();
  // Get the active wallet address (either external or embedded)
  const address = user?.wallet?.address as `0x${string}` | undefined;
  // Detect if user logged in via email (embedded wallet) vs MetaMask
  const isEmbeddedWallet =
    user?.wallet?.walletClientType === "privy" ||
    user?.wallet?.walletClientType === "coinbase_smart_wallet";

  const router = useRouter();

  const [freelancer, setFreelancer] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { createEscrow, isPending, isConfirming, isSuccess, error } =
    useCreateEscrow();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freelancer || !description || !amount) return;
    setModalOpen(true);
    createEscrow(freelancer as `0x${string}`, description, amount);
  };

  const handleClose = () => {
    setModalOpen(false);
    if (isSuccess) router.push("/dashboard");
  };

  if (!ready) return null;

  if (!authenticated || !address) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center px-4">
        <p className="text-slate-400">Sign in to create an escrow.</p>
      </div>
    );
  }

  return (
    <NetworkGuard>
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="mb-8">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20">
          <Lock className="h-5 w-5 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Create Escrow</h1>
        <p className="mt-1 text-sm text-slate-400">
          {isEmbeddedWallet
            ? "Lock funds securely until work is approved — no crypto knowledge needed."
            : "Lock MATIC on-chain until work is approved."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
      >
        {/* Freelancer address */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Freelancer Wallet Address
          </label>
          <input
            type="text"
            value={freelancer}
            onChange={(e) => setFreelancer(e.target.value)}
            placeholder="0x…"
            required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Job Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the work to be done…"
            rows={4}
            required
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            {isEmbeddedWallet ? "Payment Amount (MATIC)" : "Amount to Lock (MATIC)"}
          </label>
          {isEmbeddedWallet && (
            <p className="mb-2 text-xs text-slate-500">
              1 MATIC ≈ $0.40 USD · A 1% platform fee applies on release.
            </p>
          )}
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.001"
              min="0.001"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-16 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
              MATIC
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-colors disabled:opacity-40"
          disabled={isPending || isConfirming}
        >
          Lock Funds & Create Escrow
        </button>
      </form>

      <TransactionModal
        open={modalOpen}
        onClose={handleClose}
        isPending={isPending}
        isConfirming={isConfirming}
        isSuccess={isSuccess}
        error={error}
        successMessage="Escrow created! Funds locked on-chain."
      />
    </div>
    </NetworkGuard>
  );
}
