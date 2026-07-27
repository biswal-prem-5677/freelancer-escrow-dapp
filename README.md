# FreelancerEscrow — Decentralized Escrow DApp

> Trustless freelance payments on Polygon. Lock funds, submit proof on IPFS, get paid automatically.

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js 14)                    │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  Privy  │  │  Wagmi   │  │  React   │  │  Tailwind   │  │
│  │  Auth   │  │  Hooks   │  │  Context │  │  CSS + UI   │  │
│  └────┬────┘  └────┬─────┘  └────┬─────┘  └─────────────┘  │
│       │            │             │                           │
│  ┌────▼────────────▼─────────────▼────┐  ┌──────────────┐   │
│  │        useEscrow.ts Hooks          │  │  /api/upload  │   │
│  │  (12 hooks: read + write + poll)   │  │  (server-side │   │
│  └────────────────┬───────────────────┘  │   IPFS upload)│   │
│                   │                      └───────┬──────┘   │
└───────────────────┼──────────────────────────────┼──────────┘
                    │                              │
          ┌────────▼────────┐           ┌──────────▼──────────┐
          │  Polygon Amoy   │           │     Pinata IPFS     │
          │  Smart Contract │           │  (server-side keys) │
          │  (Solidity 0.8) │           └─────────────────────┘
          └─────────────────┘
```

## ✨ Features

### Smart Contract (v2)
- **Escrow lifecycle**: Create → Submit Work → Approve → Payment release
- **Multi-milestone escrows**: Split deliverables into phases with per-milestone approval
- **Deadline enforcement**: Auto-expiry with client refund if freelancer doesn't deliver
- **Escrow cancellation**: Client can cancel before work starts (full refund, no fee)
- **Dispute resolution**: On-chain arbitration by platform admin
- **Platform fee**: Configurable 0-5% fee (default 1%) sent to treasury
- **Gas-safe transfers**: Uses `call{value:}("")` instead of `transfer()` (ERC-4337 compatible)
- **76 unit tests**: Full coverage including reentrancy + gas benchmarks

### Frontend
- **Privy auth**: Sign in with email, Google, or any wallet — zero crypto knowledge needed
- **Dashboard**: Tabbed view (All/Client/Freelancer) with search bar + status filter
- **Create page**: Simple or multi-milestone escrow creation with fee preview + deadline picker
- **Escrow detail**: Full milestone UI, cancel/expire actions, real-time countdown timer
- **Profile page**: Wallet info, escrow counts, login method display
- **Stats page**: Live on-chain platform statistics
- **Toast notifications**: Global success/error/info/warning toasts on all actions
- **Server-side IPFS**: Pinata keys protected via API route with rate limiting
- **Custom 404**: Styled not-found page matching dark theme
- **Animations**: Page fade-in, toast slide-in, skeleton shimmer, mobile menu transitions

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Solidity ^0.8.20, Hardhat, Polygon Amoy (Chain ID 80002) |
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Auth | Privy (email, Google, wallet abstraction) |
| Web3 | Wagmi v2, Viem |
| Storage | IPFS via Pinata (server-side upload) |
| Styling | Tailwind CSS, Lucide Icons |
| Testing | Chai + Mocha (smart contract), 76 tests |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Smart Contract

```bash
cd blockchain
npm install

# Run all 76 tests
npx hardhat test

# Deploy to Amoy (requires PRIVATE_KEY and AMOY_RPC_URL in .env)
npx hardhat run scripts/deploy.ts --network amoy

# Verify on PolygonScan
npx hardhat verify --network amoy <CONTRACT_ADDRESS> "<TREASURY>" 100 30
```

### 2. Frontend

```bash
cd frontend
npm install

# Create .env.local with your keys:
cat > .env.local << EOF
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PINATA_API_KEY=your_pinata_key
PINATA_SECRET_API_KEY=your_pinata_secret
EOF

# Development
npm run dev

# Production build
npm run build && npm start
```

## 📁 Project Structure

```
blockchain/
├── contracts/
│   └── FreelancerEscrow.sol    # Main contract (cancel, deadline, milestones)
├── test/
│   └── FreelancerEscrow.test.ts # 76 tests
├── scripts/
│   └── deploy.ts               # Deployment script
└── hardhat.config.ts

frontend/
├── app/
│   ├── api/upload/route.ts     # Server-side IPFS upload (rate limited)
│   ├── components/
│   │   ├── Navbar.tsx          # Global nav with profile/stats/admin links
│   │   ├── Footer.tsx          # Site-wide footer
│   │   ├── Toast.tsx           # Global toast notification system
│   │   ├── EscrowCard.tsx      # Card with countdown, milestones, role badges
│   │   ├── StatusBadge.tsx     # Color-coded state badges
│   │   ├── FileUpload.tsx      # IPFS upload via server-side API route
│   │   ├── CountdownTimer.tsx  # Real-time deadline countdown
│   │   ├── SearchFilter.tsx    # Dashboard search + status filter
│   │   └── EmptyState.tsx      # Illustrated empty state with CTA
│   ├── hooks/
│   │   └── useEscrow.ts        # 12 wagmi hooks with auto-refetch polling
│   ├── config/
│   │   └── contracts.ts        # ABI, addresses, state enums
│   ├── page.tsx                # Home (hero, stats, features, trust badges)
│   ├── dashboard/page.tsx      # Tabbed escrow list with search/filter
│   ├── create/page.tsx         # Create escrow (simple or multi-milestone)
│   ├── escrow/[id]/page.tsx    # Escrow detail with all actions
│   ├── submit/[id]/page.tsx    # Freelancer work submission
│   ├── profile/page.tsx        # User wallet info + stats
│   ├── stats/page.tsx          # Live platform statistics
│   ├── admin/page.tsx          # Owner dispute resolution panel
│   ├── not-found.tsx           # Custom 404 page
│   ├── layout.tsx              # Root layout (Toast + SEO meta)
│   └── globals.css             # Theme + animations
└── .env.local                  # API keys (not committed)
```

## 🔐 Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_PRIVY_APP_ID` | Frontend | Privy project ID for auth |
| `PINATA_API_KEY` | Server-only | Pinata API key (NOT `NEXT_PUBLIC_`) |
| `PINATA_SECRET_API_KEY` | Server-only | Pinata secret key (NOT `NEXT_PUBLIC_`) |
| `PRIVATE_KEY` | Blockchain | Deployer wallet private key |
| `AMOY_RPC_URL` | Blockchain | Polygon Amoy RPC endpoint |
| `POLYGONSCAN_API_KEY` | Blockchain | For contract verification |

## 📊 Contract Details

| Field | Value |
|-------|-------|
| Network | Polygon Amoy (Chain ID: 80002) |
| Contract | `0x493cb97D92477CB87Ef5117a6D8E42c0e08CfaAB` |
| Solidity | ^0.8.20 |
| Optimizer | 200 runs |
| Platform Fee | 1% (100 bps, max 500 bps / 5%) |
| Default Deadline | 30 days |
| Tests | 76 passing |

## 📜 License

MIT
