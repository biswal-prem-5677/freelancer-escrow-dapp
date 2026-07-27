import Link from "next/link";
import { formatEther } from "viem";
import StatusBadge from "./StatusBadge";
import CountdownTimer from "./CountdownTimer";
import { EscrowState } from "../config/contracts";
import { Lock, User, ArrowRight, Layers } from "lucide-react";

interface EscrowCardProps {
  id: bigint;
  client: string;
  freelancer: string;
  amount: bigint;
  description: string;
  state: number;
  createdAt: bigint;
  deadline?: bigint;
  milestoneCount?: bigint;
  milestonesApproved?: bigint;
  viewerAddress: string;
}

export default function EscrowCard({
  id,
  client,
  freelancer,
  amount,
  description,
  state,
  createdAt,
  deadline,
  milestoneCount,
  milestonesApproved,
  viewerAddress,
}: EscrowCardProps) {
  const isClient = viewerAddress.toLowerCase() === client.toLowerCase();
  const isFreelancer = viewerAddress.toLowerCase() === freelancer.toLowerCase();
  const role = isClient ? "Client" : isFreelancer ? "Freelancer" : "Viewer";
  const shortAddr = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
  const hasMilestones = milestoneCount !== undefined && milestoneCount > 0n;
  const isActive = state === EscrowState.AWAITING_WORK || state === EscrowState.WORK_SUBMITTED;

  // Determine the link
  const href = isFreelancer && state === EscrowState.AWAITING_WORK
    ? `/submit/${id.toString()}`
    : `/escrow/${id.toString()}`;

  return (
    <Link href={href} className="group block">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all duration-200 hover:border-indigo-500/30 hover:bg-white/[0.07] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/5">
        {/* Top row: ID + Status */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">#{id.toString()}</span>
            <span className={`text-[10px] rounded-full px-2 py-0.5 font-medium ${
              isClient ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
              "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}>
              {role}
            </span>
            {hasMilestones && (
              <span className="flex items-center gap-1 text-[10px] rounded-full px-2 py-0.5 font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Layers className="h-2.5 w-2.5" />
                {milestonesApproved?.toString()}/{milestoneCount?.toString()}
              </span>
            )}
          </div>
          <StatusBadge state={state} />
        </div>

        {/* Description */}
        <p className="mb-3 text-sm font-medium text-white line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Details */}
        <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-slate-600">
              {isClient ? "Freelancer" : "Client"}
            </p>
            <p className="font-mono text-slate-400">
              {shortAddr(isClient ? freelancer : client)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-600">Locked</p>
            <p className="font-semibold text-white">
              {parseFloat(formatEther(amount)).toFixed(4)} MATIC
            </p>
          </div>
        </div>

        {/* Bottom row: Deadline + Arrow */}
        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          {deadline && isActive ? (
            <CountdownTimer deadline={deadline} compact />
          ) : (
            <span className="text-[10px] text-slate-600">
              {new Date(Number(createdAt) * 1000).toLocaleDateString()}
            </span>
          )}
          <ArrowRight className="h-3.5 w-3.5 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-400" />
        </div>
      </div>
    </Link>
  );
}
