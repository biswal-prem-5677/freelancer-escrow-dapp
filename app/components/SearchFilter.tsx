"use client";

import { EscrowState, STATE_LABELS, STATE_COLORS } from "../config/contracts";
import { Search, Filter } from "lucide-react";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: EscrowState | "ALL";
  onStatusChange: (status: EscrowState | "ALL") => void;
}

const filterOptions: { value: EscrowState | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Status" },
  ...Object.entries(STATE_LABELS).map(([key, label]) => ({
    value: Number(key) as EscrowState,
    label,
  })),
];

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: SearchFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by description or address…"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>

      {/* Status filter */}
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <select
          value={statusFilter === "ALL" ? "ALL" : statusFilter.toString()}
          onChange={(e) =>
            onStatusChange(e.target.value === "ALL" ? "ALL" : (Number(e.target.value) as EscrowState))
          }
          className="appearance-none rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer transition-colors"
        >
          {filterOptions.map((opt) => (
            <option key={opt.value.toString()} value={opt.value.toString()} className="bg-slate-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
