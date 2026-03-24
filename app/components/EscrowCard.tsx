import Link from "next/link";
import { formatEther } from "viem";
import StatusBadge from "./StatusBadge";
import { EscrowState } from "../config/contracts";
import { ArrowUpRight, User, Briefcase } from "lucide-react";

interface EscrowCardProps {
  id: bigint;
  client: string;
  freelancer: string;
  amount: bigint;
  description: string;
  state: number;
  createdAt: bigint;
  viewerAddress?: string;
}

export default function EscrowCard({
  id,
  client,
  freelancer,
  amount,
  description,
  state,
  createdAt,
  viewerAddress,
}: EscrowCardProps) {
  const isClient =
    viewerAddress?.toLowerCase() === client.toLowerCase();
  const shortAddr = (addr: string) =>
    `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  const date = new Date(Number(createdAt) * 1000).toLocaleDateString();

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all hover:border-indigo-500/40 hover:bg-white/8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium text-white">{description}</p>
          <p className="mt-0.5 text-xs text-slate-500">Created {date}</p>
        </div>
        <StatusBadge state={state} />
      </div>

      {/* Addresses */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <User className="h-3 w-3 shrink-0" />
          <span className="text-slate-500">Client:</span>
          <span className="font-mono">{shortAddr(client)}</span>
          {isClient && (
            <span className="rounded bg-indigo-600/20 px-1 py-0.5 text-[10px] text-indigo-400">
              You
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Briefcase className="h-3 w-3 shrink-0" />
          <span className="text-slate-500">Freelancer:</span>
          <span className="font-mono">{shortAddr(freelancer)}</span>
          {!isClient && viewerAddress?.toLowerCase() === freelancer.toLowerCase() && (
            <span className="rounded bg-indigo-600/20 px-1 py-0.5 text-[10px] text-indigo-400">
              You
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">Locked</p>
          <p className="text-base font-bold text-white">
            {parseFloat(formatEther(amount)).toFixed(4)}{" "}
            <span className="text-sm font-normal text-slate-400">MATIC</span>
          </p>
        </div>

        <div className="flex gap-2">
          {/* Submit work — for freelancer when awaiting */}
          {state === EscrowState.AWAITING_WORK &&
            viewerAddress?.toLowerCase() === freelancer.toLowerCase() && (
              <Link
                href={`/submit/${id}`}
                className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition-colors"
              >
                Submit Work <ArrowUpRight className="h-3 w-3" />
              </Link>
            )}

          {/* Detail / actions link */}
          <Link
            href={`/escrow/${id}`}
            className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:border-white/30 hover:text-white transition-colors"
          >
            View <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
