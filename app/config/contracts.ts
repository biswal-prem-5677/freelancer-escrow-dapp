// ─── Contract Addresses ───────────────────────────────────────────────────────
// Map of Chain IDs to their respective deployed contract addresses.
// Update these after redeploying the v2 (milestone-enabled) contract.
export const CONTRACT_ADDRESSES: Record<number, `0x${string}`> = {
  80002: "0x493cb97D92477CB87Ef5117a6D8E42c0e08CfaAB", // Polygon Amoy (update after redeploy)
  11155111: "0x0000000000000000000000000000000000000000", // Ethereum Sepolia (Placeholder)
  31337: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // Hardhat Localnet (Placeholder)
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
      { name: "deadline", type: "uint256" },
      { name: "milestoneCount", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "EscrowCancelled",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "client", type: "address" },
      { name: "refundAmount", type: "uint256" },
    ],
  },
  {
    type: "event",
    name: "EscrowExpired",
    inputs: [
      { name: "id", type: "uint256", indexed: true },
      { name: "client", type: "address" },
      { name: "refundAmount", type: "uint256" },
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
      { name: "payout", type: "uint256" },
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
    name: "DefaultDeadlineUpdated",
    inputs: [{ name: "newDays", type: "uint256" }],
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
  {
    type: "event",
    name: "MilestoneSubmitted",
    inputs: [
      { name: "escrowId", type: "uint256", indexed: true },
      { name: "milestoneIndex", type: "uint256", indexed: true },
      { name: "ipfsHash", type: "string" },
    ],
  },
  {
    type: "event",
    name: "MilestoneApproved",
    inputs: [
      { name: "escrowId", type: "uint256", indexed: true },
      { name: "milestoneIndex", type: "uint256", indexed: true },
      { name: "payout", type: "uint256" },
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
      { name: "_deadlineDays", type: "uint256" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "createMilestoneEscrow",
    stateMutability: "payable",
    inputs: [
      { name: "freelancerAddr", type: "address" },
      { name: "description", type: "string" },
      { name: "_deadlineDays", type: "uint256" },
      { name: "milestoneDescriptions", type: "string[]" },
      { name: "milestoneAmounts", type: "uint256[]" },
    ],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "cancelEscrow",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "claimExpired",
    stateMutability: "nonpayable",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [],
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
    name: "submitMilestone",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "milestoneIndex", type: "uint256" },
      { name: "ipfsHash", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "approveMilestone",
    stateMutability: "nonpayable",
    inputs: [
      { name: "id", type: "uint256" },
      { name: "milestoneIndex", type: "uint256" },
    ],
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
  {
    type: "function",
    name: "updateDefaultDeadline",
    stateMutability: "nonpayable",
    inputs: [{ name: "_days", type: "uint256" }],
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
          { name: "deadline", type: "uint256" },
          { name: "milestoneCount", type: "uint256" },
          { name: "milestonesApproved", type: "uint256" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getMilestone",
    stateMutability: "view",
    inputs: [
      { name: "escrowId", type: "uint256" },
      { name: "milestoneIndex", type: "uint256" },
    ],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "description", type: "string" },
          { name: "amount", type: "uint256" },
          { name: "ipfsHash", type: "string" },
          { name: "state", type: "uint8" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getMilestones",
    stateMutability: "view",
    inputs: [{ name: "escrowId", type: "uint256" }],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "description", type: "string" },
          { name: "amount", type: "uint256" },
          { name: "ipfsHash", type: "string" },
          { name: "state", type: "uint8" },
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
  {
    type: "function",
    name: "defaultDeadlineDays",
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
  CANCELLED = 5,
}

export const STATE_LABELS: Record<EscrowState, string> = {
  [EscrowState.AWAITING_WORK]: "Awaiting Work",
  [EscrowState.WORK_SUBMITTED]: "Work Submitted",
  [EscrowState.COMPLETE]: "Complete",
  [EscrowState.DISPUTED]: "Disputed",
  [EscrowState.REFUNDED]: "Refunded",
  [EscrowState.CANCELLED]: "Cancelled",
};

export const STATE_COLORS: Record<EscrowState, string> = {
  [EscrowState.AWAITING_WORK]: "yellow",
  [EscrowState.WORK_SUBMITTED]: "blue",
  [EscrowState.COMPLETE]: "green",
  [EscrowState.DISPUTED]: "red",
  [EscrowState.REFUNDED]: "gray",
  [EscrowState.CANCELLED]: "slate",
};

// ─── Milestone State Enum ─────────────────────────────────────────────────────
export enum MilestoneState {
  PENDING = 0,
  SUBMITTED = 1,
  APPROVED = 2,
  DISPUTED = 3,
}

export const MILESTONE_LABELS: Record<MilestoneState, string> = {
  [MilestoneState.PENDING]: "Pending",
  [MilestoneState.SUBMITTED]: "Submitted",
  [MilestoneState.APPROVED]: "Approved",
  [MilestoneState.DISPUTED]: "Disputed",
};
