// ─── Contract Addresses ───────────────────────────────────────────────────────
// Map of Chain IDs to their respective deployed contract addresses.
// Add your deployments for Sepolia (11155111) and Hardhat (31337) here!
export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  80002: "0x493cb97D92477CB87Ef5117a6D8E42c0e08CfaAB", // Polygon Amoy (fee-enabled v2)
  11155111: "0x0000000000000000000000000000000000000000", // Ethereum Sepolia (Placeholder)
  31337: "0x0000000000000000000000000000000000000000", // Hardhat Localnet (Placeholder)
};

// ─── ABI ──────────────────────────────────────────────────────────────────────
export const ESCROW_ABI = [
  // ─── Events ─────────────────────────────────────────────────────────────────
  {
    type: "event",
    name: "EscrowCreated",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "client", type: "address", indexed: true },
      { name: "freelancer", type: "address", indexed: true },
      { name: "amount", type: "uint256" },
      { name: "description", type: "string" },
    ],
  },
  {
    type: "event",
    name: "WorkSubmitted",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "ipfsHash", type: "string" },
    ],
  },
  {
    type: "event",
    name: "WorkApproved",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "freelancer", type: "address" },
      { name: "payout", type: "uint256" }, // renamed from amount — reflects post-fee payout
    ],
  },
  {
    type: "event",
    name: "FeeCollected",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "treasury", type: "address" },
      { name: "feeAmount", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "FeeUpdated",
    inputs: [{ name: "newFeeBps", type: "uint256" }],
  },
  {
    type: "event",
    name: "TreasuryUpdated",
    inputs: [{ name: "newTreasury", type: "address" }],
  },
  {
    type: "event",
    name: "DisputeRaised",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "raisedBy", type: "address" },
    ],
  },
  {
    type: "event",
    name: "DisputeResolved",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "releasedToFreelancer", type: "bool" },
    ],
  },

  // ─── Write Functions ─────────────────────────────────────────────────────────
  {
    type: "function",
    name: "createEscrow",
    stateMutability: "payable",
    inputs: [
      { name: "freelancerAddr", type: "address" },
      { name: "description", type: "string" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "submitWork",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "ipfsHash", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "approveWork",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "raiseDispute",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "resolveDispute",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "releaseFunds", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "updateFee",
    stateMutability: "nonpayable",
    inputs: [{ name: "_feeBps", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "updateTreasury",
    stateMutability: "nonpayable",
    inputs: [{ name: "_treasury", type: "address" }],
    outputs: [],
  },

  // ─── Read Functions ──────────────────────────────────────────────────────────
  {
    type: "function",
    name: "calculatePayout",
    stateMutability: "view",
    inputs: [{ name: "totalAmount", type: "uint256" }],
    outputs: [
      { name: "payout", type: "uint256" },
      { name: "fee", type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "getEscrow",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "client", type: "address" },
          { name: "freelancer", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "description", type: "string" },
          { name: "ipfsHash", type: "string" },
          { name: "state", type: "uint8" },
          { name: "createdAt", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getClientEscrows",
    stateMutability: "view",
    inputs: [{ name: "clientAddr", type: "address" }],
    outputs: [{ type: "uint256[]" }],
  },
  {
    type: "function",
    name: "getFreelancerEscrows",
    stateMutability: "view",
    inputs: [{ name: "freelancerAddr", type: "address" }],
    outputs: [{ type: "uint256[]" }],
  },
  {
    type: "function",
    name: "totalEscrows",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "treasury",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "platformFeeBps",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;

// ─── Escrow State Enum ────────────────────────────────────────────────────────
export enum EscrowState {
  AWAITING_WORK = 0,
  WORK_SUBMITTED = 1,
  COMPLETE = 2,
  DISPUTED = 3,
  REFUNDED = 4,
}

export const STATE_LABELS: Record<EscrowState, string> = {
  [EscrowState.AWAITING_WORK]: "Awaiting Work",
  [EscrowState.WORK_SUBMITTED]: "Work Submitted",
  [EscrowState.COMPLETE]: "Complete",
  [EscrowState.DISPUTED]: "Disputed",
  [EscrowState.REFUNDED]: "Refunded",
};

export const STATE_COLORS: Record<EscrowState, string> = {
  [EscrowState.AWAITING_WORK]: "yellow",
  [EscrowState.WORK_SUBMITTED]: "blue",
  [EscrowState.COMPLETE]: "green",
  [EscrowState.DISPUTED]: "red",
  [EscrowState.REFUNDED]: "gray",
};
