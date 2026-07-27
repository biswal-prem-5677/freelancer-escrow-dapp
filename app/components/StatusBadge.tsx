import { EscrowState, STATE_LABELS, STATE_COLORS } from "../config/contracts";

interface StatusBadgeProps {
  state: number;
}

const colorMap: Record<string, string> = {
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  gray: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  slate: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

const dotColorMap: Record<string, string> = {
  yellow: "bg-yellow-400",
  blue: "bg-blue-400",
  green: "bg-emerald-400",
  red: "bg-red-400",
  gray: "bg-slate-400",
  slate: "bg-slate-500",
};

export default function StatusBadge({ state }: StatusBadgeProps) {
  const stateEnum = state as EscrowState;
  const label = STATE_LABELS[stateEnum] ?? "Unknown";
  const color = STATE_COLORS[stateEnum] ?? "gray";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${colorMap[color]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColorMap[color]}`} />
      {label}
    </span>
  );
}
