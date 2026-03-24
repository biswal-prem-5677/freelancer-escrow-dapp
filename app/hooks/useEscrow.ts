"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
} from "wagmi";
import { parseEther } from "viem";
import { CONTRACT_ADDRESSES, ESCROW_ABI } from "../config/contracts";

// ─── Read: single escrow ──────────────────────────────────────────────────────
export function useGetEscrow(id: bigint | undefined) {
  const chainId = useChainId();
  return useReadContract({
    address: CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002],
    abi: ESCROW_ABI,
    functionName: "getEscrow",
    args: id !== undefined ? [id] : undefined,
    query: { 
      enabled: id !== undefined,
      staleTime: 60_000, 
    },
  });
}

// ─── Read: escrows by client ──────────────────────────────────────────────────
export function useGetClientEscrows(address: `0x${string}` | undefined) {
  const chainId = useChainId();
  return useReadContract({
    address: CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002],
    abi: ESCROW_ABI,
    functionName: "getClientEscrows",
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address,
      staleTime: 60_000,
    },
  });
}

// ─── Read: escrows by freelancer ──────────────────────────────────────────────
export function useGetFreelancerEscrows(address: `0x${string}` | undefined) {
  const chainId = useChainId();
  return useReadContract({
    address: CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002],
    abi: ESCROW_ABI,
    functionName: "getFreelancerEscrows",
    args: address ? [address] : undefined,
    query: { 
      enabled: !!address,
      staleTime: 60_000,
    },
  });
}

// ─── Write: createEscrow ──────────────────────────────────────────────────────
export function useCreateEscrow() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createEscrow = (
    freelancer: `0x${string}`,
    description: string,
    amountEth: string
  ) => {
    writeContract({
      address: CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002],
      abi: ESCROW_ABI,
      functionName: "createEscrow",
      args: [freelancer, description],
      value: parseEther(amountEth),
    });
  };

  return { createEscrow, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Write: submitWork ────────────────────────────────────────────────────────
export function useSubmitWork() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const submitWork = (id: bigint, ipfsHash: string) => {
    writeContract({
      address: CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002],
      abi: ESCROW_ABI,
      functionName: "submitWork",
      args: [id, ipfsHash],
    });
  };

  return { submitWork, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Write: approveWork ───────────────────────────────────────────────────────
export function useApproveWork() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approveWork = (id: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002],
      abi: ESCROW_ABI,
      functionName: "approveWork",
      args: [id],
    });
  };

  return { approveWork, hash, isPending, isConfirming, isSuccess, error };
}

// ─── Write: raiseDispute ──────────────────────────────────────────────────────
export function useRaiseDispute() {
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const raiseDispute = (id: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002],
      abi: ESCROW_ABI,
      functionName: "raiseDispute",
      args: [id],
    });
  };

  return { raiseDispute, hash, isPending, isConfirming, isSuccess, error };
}
