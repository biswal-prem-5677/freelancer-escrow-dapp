"use client";

import { useState, useMemo } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import { useGetClientEscrows, useGetFreelancerEscrows, useGetEscrow } from "../hooks/useEscrow";
import EscrowCard from "../components/EscrowCard";
import SearchFilter from "../components/SearchFilter";
import EmptyState from "../components/EmptyState";
import { Plus, Briefcase, LayoutDashboard } from "lucide-react";
import { EscrowState } from "../config/contracts";

// Helper: render one EscrowCard given an id
function EscrowCardLoader({
  id,
  viewerAddress,
  searchTerm,
  statusFilter,
}: {
  id: bigint;
  viewerAddress: string;
  searchTerm: string;
  statusFilter: EscrowState | "ALL";
}) {
  const { data, isLoading } = useGetEscrow(id);

  if (isLoading) {
    return (
      <div className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
    );
  }
  if (!data) return null;

  // Apply search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    const matchDesc = data.description?.toLowerCase().includes(term);
    const matchClient = data.client?.toLowerCase().includes(term);
    const matchFreelancer = data.freelancer?.toLowerCase().includes(term);
    if (!matchDesc && !matchClient && !matchFreelancer) return null;
  }

  // Apply status filter
  if (statusFilter !== "ALL" && data.state !== statusFilter) return null;

  return (
    <EscrowCard
      id={data.id}
      client={data.client}
      freelancer={data.freelancer}
      amount={data.amount}
      description={data.description}
      state={data.state}
      createdAt={data.createdAt}
      deadline={data.deadline}
      milestoneCount={data.milestoneCount}
      milestonesApproved={data.milestonesApproved}
      viewerAddress={viewerAddress}
    />
  );
}

type Tab = "all" | "client" | "freelancer";

export default function DashboardPage() {
  const { ready, authenticated, user } = usePrivy();
  const address = user?.wallet?.address as `0x${string}` | undefined;

  const { data: clientIds } = useGetClientEscrows(address);
  const { data: freelancerIds } = useGetFreelancerEscrows(address);

  const [tab, setTab] = useState<Tab>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<EscrowState | "ALL">("ALL");

  const filteredIds = useMemo(() => {
    const cIds = (clientIds ?? []).map(String);
    const fIds = (freelancerIds ?? []).map(String);

    let ids: string[];
    if (tab === "client") ids = cIds;
    else if (tab === "freelancer") ids = fIds;
    else ids = Array.from(new Set([...cIds, ...fIds]));

    // Sort newest first
    return ids.map(BigInt).sort((a, b) => (b > a ? 1 : b < a ? -1 : 0));
  }, [clientIds, freelancerIds, tab]);

  if (!ready) return null;

  if (!authenticated || !address) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <LayoutDashboard className="h-12 w-12 text-slate-600" />
        <p className="text-2xl font-bold text-white">Sign in to view dashboard</p>
        <p className="text-slate-400">Connect a wallet or sign in with email</p>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All", count: new Set([...(clientIds ?? []).map(String), ...(freelancerIds ?? []).map(String)]).size },
    { key: "client", label: "As Client", count: clientIds?.length ?? 0 },
    { key: "freelancer", label: "As Freelancer", count: freelancerIds?.length ?? 0 },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your escrows and track payments
          </p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-transform"
        >
          <Plus className="h-4 w-4" /> New Escrow
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {t.label}
            <span className={`ml-1.5 text-xs ${tab === t.key ? "text-indigo-200" : "text-slate-600"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="mb-6">
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {/* Escrow List */}
      {filteredIds.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-7 w-7" />}
          title="No escrows yet"
          description="Create your first escrow to get started with trustless freelance payments."
          actionLabel="Create Escrow"
          actionHref="/create"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredIds.map((id) => (
            <EscrowCardLoader
              key={id.toString()}
              id={id}
              viewerAddress={address!}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          ))}
        </div>
      )}
    </div>
  );
}
