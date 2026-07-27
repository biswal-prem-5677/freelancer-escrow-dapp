import { EscrowState, MilestoneState, STATE_LABELS } from "../config/contracts";
import { Clock, FileCheck, CheckCircle, AlertTriangle, Ban, XCircle, Plus, Layers } from "lucide-react";

interface ActivityItem {
  icon: typeof Clock;
  label: string;
  color: string;
  dotColor: string;
  timestamp?: string;
}

interface ActivityFeedProps {
  state: number;
  createdAt: bigint;
  milestoneCount?: bigint;
  milestonesApproved?: bigint;
  ipfsHash?: string;
}

export default function ActivityFeed({
  state,
  createdAt,
  milestoneCount,
  milestonesApproved,
  ipfsHash,
}: ActivityFeedProps) {
  const hasMilestones = milestoneCount !== undefined && milestoneCount > 0n;
  const items: ActivityItem[] = [];

  // Always: escrow created
  items.push({
    icon: Plus,
    label: "Escrow created",
    color: "text-indigo-400",
    dotColor: "bg-indigo-400",
    timestamp: new Date(Number(createdAt) * 1000).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  });

  // Milestone submissions
  if (hasMilestones && milestonesApproved !== undefined) {
    const approved = Number(milestonesApproved);
    const total = Number(milestoneCount);
    for (let i = 0; i < approved; i++) {
      items.push({
        icon: Layers,
        label: `Milestone ${i + 1}/${total} approved`,
        color: "text-emerald-400",
        dotColor: "bg-emerald-400",
      });
    }
  }

  // Work submitted (simple escrow)
  if (!hasMilestones && ipfsHash && state >= EscrowState.WORK_SUBMITTED) {
    items.push({
      icon: FileCheck,
      label: "Work submitted with IPFS proof",
      color: "text-blue-400",
      dotColor: "bg-blue-400",
    });
  }

  // Terminal states
  if (state === EscrowState.COMPLETE) {
    items.push({
      icon: CheckCircle,
      label: "Payment released to freelancer",
      color: "text-emerald-400",
      dotColor: "bg-emerald-400",
    });
  } else if (state === EscrowState.DISPUTED) {
    items.push({
      icon: AlertTriangle,
      label: "Dispute raised — awaiting admin resolution",
      color: "text-yellow-400",
      dotColor: "bg-yellow-400",
    });
  } else if (state === EscrowState.REFUNDED) {
    items.push({
      icon: XCircle,
      label: "Funds refunded to client",
      color: "text-red-400",
      dotColor: "bg-red-400",
    });
  } else if (state === EscrowState.CANCELLED) {
    items.push({
      icon: Ban,
      label: "Escrow cancelled by client",
      color: "text-slate-400",
      dotColor: "bg-slate-400",
    });
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
        Activity Timeline
      </h3>
      <div className="relative pl-5">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-white/10" />

        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="relative flex items-start gap-3">
              {/* Dot on the line */}
              <div className={`absolute -left-5 top-1.5 h-[9px] w-[9px] rounded-full border-2 border-slate-950 ${item.dotColor}`} />
              <div className="flex flex-1 items-start gap-2">
                <item.icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${item.color}`} />
                <div>
                  <p className="text-sm text-slate-300">{item.label}</p>
                  {item.timestamp && (
                    <p className="mt-0.5 text-[10px] text-slate-600">{item.timestamp}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
