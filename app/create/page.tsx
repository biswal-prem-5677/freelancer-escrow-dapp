"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useCreateEscrow, useCreateMilestoneEscrow, useCalculatePayout } from "../hooks/useEscrow";
import { useToast } from "../components/Toast";
import { parseEther, formatEther } from "viem";
import {
  Plus,
  Trash2,
  Loader2,
  ArrowRight,
  Layers,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

interface Milestone {
  description: string;
  amount: string;
}

export default function CreatePage() {
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const { addToast } = useToast();

  // Form state
  const [freelancerAddr, setFreelancerAddr] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("30");
  const [useMilestones, setUseMilestones] = useState(false);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { description: "", amount: "" },
    { description: "", amount: "" },
  ]);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hooks
  const simple = useCreateEscrow();
  const milestone = useCreateMilestoneEscrow();
  const active = useMilestones ? milestone : simple;

  // Fee preview
  const amountBigInt = (() => {
    try {
      if (!amount || parseFloat(amount) <= 0) return undefined;
      return parseEther(amount);
    } catch {
      return undefined;
    }
  })();
  const { data: payoutData } = useCalculatePayout(amountBigInt);

  // Success redirect
  useEffect(() => {
    if (active.isSuccess) {
      addToast("success", "Escrow created! Redirecting to dashboard…");
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  }, [active.isSuccess]);

  useEffect(() => {
    if (active.error) {
      addToast("error", active.error.message?.split("\n")[0] ?? "Transaction failed");
    }
  }, [active.error]);

  if (!ready) return null;
  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <FileText className="h-12 w-12 text-slate-600" />
        <p className="text-2xl font-bold text-white">Sign in to create an escrow</p>
        <p className="text-slate-400">Connect your wallet or sign in with email</p>
      </div>
    );
  }

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!freelancerAddr) errs.freelancerAddr = "Required";
    else if (!/^0x[a-fA-F0-9]{40}$/.test(freelancerAddr)) errs.freelancerAddr = "Invalid Ethereum address";
    else if (freelancerAddr.toLowerCase() === user?.wallet?.address?.toLowerCase())
      errs.freelancerAddr = "Cannot be your own address";

    if (!description.trim()) errs.description = "Required";

    if (useMilestones) {
      let total = 0;
      milestones.forEach((m, i) => {
        if (!m.description.trim()) errs[`m_desc_${i}`] = "Required";
        if (!m.amount || parseFloat(m.amount) <= 0) errs[`m_amt_${i}`] = "Must be > 0";
        else total += parseFloat(m.amount);
      });
      if (total <= 0) errs.amount = "Total must be > 0";
    } else {
      if (!amount || parseFloat(amount) <= 0) errs.amount = "Must be > 0";
    }

    if (!deadlineDays || parseInt(deadlineDays) <= 0) errs.deadlineDays = "Must be > 0";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const totalMilestoneAmount = milestones.reduce(
    (sum, m) => sum + (parseFloat(m.amount) || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (useMilestones) {
      milestone.createMilestoneEscrow(
        freelancerAddr as `0x${string}`,
        description,
        totalMilestoneAmount.toString(),
        parseInt(deadlineDays),
        milestones.map((m) => m.description),
        milestones.map((m) => m.amount)
      );
    } else {
      simple.createEscrow(
        freelancerAddr as `0x${string}`,
        description,
        amount,
        parseInt(deadlineDays)
      );
    }
  };

  const addMilestone = () => {
    if (milestones.length >= 10) return;
    setMilestones([...milestones, { description: "", amount: "" }]);
  };

  const removeMilestone = (idx: number) => {
    if (milestones.length <= 2) return;
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const updateMilestone = (idx: number, field: keyof Milestone, value: string) => {
    const updated = [...milestones];
    updated[idx] = { ...updated[idx], [field]: value };
    setMilestones(updated);
  };

  const displayAmount = useMilestones ? totalMilestoneAmount.toString() : amount;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20">
          <Plus className="h-5 w-5 text-indigo-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">Create Escrow</h1>
        <p className="mt-1 text-sm text-slate-400">
          Lock funds for a freelancer. They get paid when you approve.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Freelancer Address */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Freelancer Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={freelancerAddr}
            onChange={(e) => setFreelancerAddr(e.target.value)}
            className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 transition-colors ${
              errors.freelancerAddr ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors.freelancerAddr && <p className="mt-1 text-xs text-red-400">{errors.freelancerAddr}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Job Description</label>
          <textarea
            rows={3}
            placeholder="Describe the work to be done..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 resize-none transition-colors ${
              errors.description ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
        </div>

        {/* Deadline */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Clock className="h-3 w-3" /> Deadline (days)
          </label>
          <input
            type="number"
            min="1"
            max="365"
            value={deadlineDays}
            onChange={(e) => setDeadlineDays(e.target.value)}
            className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 transition-colors ${
              errors.deadlineDays ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500"
            }`}
          />
          {errors.deadlineDays && <p className="mt-1 text-xs text-red-400">{errors.deadlineDays}</p>}
        </div>

        {/* Toggle: Simple vs Milestone */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-violet-400" />
              <span className="text-sm font-medium text-white">Multi-Milestone Payment</span>
            </div>
            <button
              type="button"
              onClick={() => setUseMilestones(!useMilestones)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                useMilestones ? "bg-indigo-600" : "bg-white/20"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  useMilestones ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Split payment into phases. Freelancer gets paid as each milestone is approved.
          </p>
        </div>

        {/* Amount (simple mode) */}
        {!useMilestones && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Amount (MATIC)</label>
            <input
              type="number"
              step="0.001"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 transition-colors ${
                errors.amount ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            {errors.amount && <p className="mt-1 text-xs text-red-400">{errors.amount}</p>}
          </div>
        )}

        {/* Milestones */}
        {useMilestones && (
          <div className="space-y-3">
            <label className="block text-xs font-medium text-slate-400">Milestones</label>
            {milestones.map((m, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Phase {i + 1}</span>
                  {milestones.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeMilestone(i)}
                      className="text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Milestone description..."
                  value={m.description}
                  onChange={(e) => updateMilestone(i, "description", e.target.value)}
                  className={`mb-2 w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors ${
                    errors[`m_desc_${i}`] ? "border-red-500" : "border-white/10 focus:border-indigo-500"
                  }`}
                />
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="Amount (MATIC)"
                  value={m.amount}
                  onChange={(e) => updateMilestone(i, "amount", e.target.value)}
                  className={`w-full rounded-lg border bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors ${
                    errors[`m_amt_${i}`] ? "border-red-500" : "border-white/10 focus:border-indigo-500"
                  }`}
                />
              </div>
            ))}
            {milestones.length < 10 && (
              <button
                type="button"
                onClick={addMilestone}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/10 py-2.5 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-colors"
              >
                <Plus className="h-3 w-3" /> Add Milestone
              </button>
            )}
            <div className="text-right text-sm">
              <span className="text-slate-500">Total: </span>
              <span className="font-semibold text-white">
                {totalMilestoneAmount.toFixed(4)} MATIC
              </span>
            </div>
          </div>
        )}

        {/* Fee Preview */}
        {payoutData && amountBigInt && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Info className="h-3 w-3" /> Fee Preview
            </p>
            <div className="grid grid-cols-3 text-center text-xs">
              <div>
                <p className="text-slate-500">Total</p>
                <p className="font-semibold text-white">{formatEther(amountBigInt)} MATIC</p>
              </div>
              <div>
                <p className="text-slate-500">Fee (1%)</p>
                <p className="font-semibold text-yellow-400">{formatEther(payoutData[1])} MATIC</p>
              </div>
              <div>
                <p className="text-slate-500">Freelancer Gets</p>
                <p className="font-semibold text-emerald-400">{formatEther(payoutData[0])} MATIC</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={active.isPending || active.isConfirming}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {active.isPending || active.isConfirming ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {active.isPending ? "Confirm in Wallet…" : "Processing…"}
            </>
          ) : (
            <>
              Create {useMilestones ? "Milestone " : ""}Escrow
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Success */}
        {active.isSuccess && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-emerald-300">Escrow created successfully!</p>
              <p className="text-xs text-emerald-400/60 mt-0.5">Redirecting to dashboard…</p>
            </div>
          </div>
        )}

        {/* Error */}
        {active.error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
            <p className="text-xs text-red-400">{active.error.message?.split("\n")[0]}</p>
          </div>
        )}
      </form>
    </div>
  );
}
