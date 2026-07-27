"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { parseEther } from "viem";
import { CONTRACT_ADDRESSES, ESCROW_ABI } from "../config/contracts";

// ─── Helper: get contract address for current chain ───────────────────────────
function useContractAddress() {
  const chainId = useChainId();
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002];
}

// ─── Read: single escrow ──────────────────────────────────────────────────────
export function useGetEscrow(id: bigint | undefined) {
  const address = useContractAddress();
  return useReadContract({
    address,
    abi: ESCROW_ABI,
    functionName: "getEscrow",
    args: id !== undefined ? [id] : undefined,
    query: {
      enabled: id !== undefined,
      staleTime: 30_000,
      refetchInterval: 15_000,
    },
  });
}

// ─── Read: escrows by client ──────────────────────────────────────────────────
export function useGetClientEscrows(addr: `0x${string}` | undefined) {
  const address = useContractAddress();
  return useReadContract({
    address,
    abi: ESCROW_ABI,
    functionName: "getClientEscrows",
    args: addr ? [addr] : undefined,
    query: {
      enabled: !!addr,
      staleTime: 30_000,
      refetchInterval: 15_000,
    },
  });
}

// ─── Read: escrows by freelancer ──────────────────────────────────────────────
export function useGetFreelancerEscrows(addr: `0x${string}` | undefined) {
  const address = useContractAddress();
  return useReadContract({
    address,
    abi: ESCROW_ABI,
    functionName: "getFreelancerEscrows",
    args: addr ? [addr] : undefined,
    query: {
      enabled: !!addr,
      staleTime: 30_000,
      refetchInterval: 15_000,
    },
  });
}

// ─── Read: milestones for an escrow ───────────────────────────────────────────
export function useGetMilestones(escrowId: bigint | undefined) {
  const address = useContractAddress();
  return useReadContract({
    address,
    abi: ESCROW_ABI,
    functionName: "getMilestones",
    args: escrowId !== undefined ? [escrowId] : undefined,
    query: {
      enabled: escrowId !== undefined,
      staleTime: 30_000,
      refetchInterval: 15_000,
    },
  });
}

// ─── Read: platform stats ─────────────────────────────────────────────────────
export function usePlatformStats() {
  const address = useContractAddress();

  const total = useReadContract({
    address,
    abi: ESCROW_ABI,
    functionName: "totalEscrows",
    query: { staleTime: 30_000, refetchInterval: 30_000 },
  });

  const fee = useReadContract({
    address,
    abi: ESCROW_ABI,
    functionName: "platformFeeBps",
    query: { staleTime: 60_000 },
  });

  const treasuryAddr = useReadContract({
    address,
    abi: ESCROW_ABI,
    functionName: "treasury",
    query: { staleTime: 60_000 },
  });

  const deadlineDays = useReadContract({
    address,
    abi: ESCROW_ABI,
    functionName: "defaultDeadlineDays",
    query: { staleTime: 60_000 },
  });

  const ownerAddr = useReadContract({
    address,
    abi: ESCROW_ABI,
    functionName: "owner",
    query: { staleTime: 60_000 },
  });

  return {
    totalEscrows: total.data as bigint | undefined,
    platformFeeBps: fee.data as bigint | undefined,
    treasury: treasuryAddr.data as string | undefined,
    defaultDeadlineDays: deadlineDays.data as bigint | undefined,
    owner: ownerAddr.data as string | undefined,
    isLoading: total.isLoading || fee.isLoading,
  };
}

// ─── Read: payout calculator ──────────────────────────────────────────────────
export function useCalculatePayout(amount: bigint | undefined) {
  const address = useContractAddress();
  return useReadContract({
    address,
    abi: ESCROW_ABI,
    functionName: "calculatePayout",
    args: amount !== undefined ? [amount] : undefined,
    query: { enabled: amount !== undefined && amount > 0n },
  });
}

// ─── Write: createEscrow (simple) ─────────────────────────────────────────────
export function useCreateEscrow() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createEscrow = (
    freelancer: `0x${string}`,
    description: string,
    amountEth: string,
    deadlineDays: number = 0
  ) => {
    writeContract({
      address,
      abi: ESCROW_ABI,
      functionName: "createEscrow",
      args: [freelancer, description, BigInt(deadlineDays)],
      value: parseEther(amountEth),
    });
  };

  return { createEscrow, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Write: createMilestoneEscrow ─────────────────────────────────────────────
export function useCreateMilestoneEscrow() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createMilestoneEscrow = (
    freelancer: `0x${string}`,
    description: string,
    totalAmountEth: string,
    deadlineDays: number,
    milestoneDescriptions: string[],
    milestoneAmountsEth: string[]
  ) => {
    writeContract({
      address,
      abi: ESCROW_ABI,
      functionName: "createMilestoneEscrow",
      args: [
        freelancer,
        description,
        BigInt(deadlineDays),
        milestoneDescriptions,
        milestoneAmountsEth.map((a) => parseEther(a)),
      ],
      value: parseEther(totalAmountEth),
    });
  };

  return { createMilestoneEscrow, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Write: cancelEscrow ──────────────────────────────────────────────────────
export function useCancelEscrow() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const cancelEscrow = (id: bigint) => {
    writeContract({
      address,
      abi: ESCROW_ABI,
      functionName: "cancelEscrow",
      args: [id],
    });
  };

  return { cancelEscrow, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Write: claimExpired ──────────────────────────────────────────────────────
export function useClaimExpired() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const claimExpired = (id: bigint) => {
    writeContract({
      address,
      abi: ESCROW_ABI,
      functionName: "claimExpired",
      args: [id],
    });
  };

  return { claimExpired, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Write: submitWork ────────────────────────────────────────────────────────
export function useSubmitWork() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const submitWork = (id: bigint, ipfsHash: string) => {
    writeContract({
      address,
      abi: ESCROW_ABI,
      functionName: "submitWork",
      args: [id, ipfsHash],
    });
  };

  return { submitWork, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Write: approveWork ───────────────────────────────────────────────────────
export function useApproveWork() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approveWork = (id: bigint) => {
    writeContract({
      address,
      abi: ESCROW_ABI,
      functionName: "approveWork",
      args: [id],
    });
  };

  return { approveWork, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Write: submitMilestone ───────────────────────────────────────────────────
export function useSubmitMilestone() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const submitMilestone = (escrowId: bigint, milestoneIndex: bigint, ipfsHash: string) => {
    writeContract({
      address,
      abi: ESCROW_ABI,
      functionName: "submitMilestone",
      args: [escrowId, milestoneIndex, ipfsHash],
    });
  };

  return { submitMilestone, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Write: approveMilestone ──────────────────────────────────────────────────
export function useApproveMilestone() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approveMilestone = (escrowId: bigint, milestoneIndex: bigint) => {
    writeContract({
      address,
      abi: ESCROW_ABI,
      functionName: "approveMilestone",
      args: [escrowId, milestoneIndex],
    });
  };

  return { approveMilestone, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Write: raiseDispute ──────────────────────────────────────────────────────
export function useRaiseDispute() {
  const address = useContractAddress();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const raiseDispute = (id: bigint) => {
    writeContract({
      address,
      abi: ESCROW_ABI,
      functionName: "raiseDispute",
      args: [id],
    });
  };

  return { raiseDispute, hash, isPending, isConfirming, isSuccess, error };
}
