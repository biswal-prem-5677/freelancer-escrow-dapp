"use client";

import { useChainId, useSwitchChain } from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { CONTRACT_ADDRESSES } from "../config/contracts";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

interface Props {
  children: React.ReactNode;
}

/**
 * NetworkGuard wraps any page that requires blockchain interaction.
 * - If not authenticated → children rendered normally (page handles it)
 * - If authenticated and on wrong chain → show a switch-network banner
 * - If authenticated and on correct chain → children rendered normally
 */
export default function NetworkGuard({ children }: Props) {
  const { authenticated, user } = usePrivy();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  // Only check chain for external wallet users (email users use embedded wallet
  // which is always on the configured defaultChain — polygonAmoy)
  const isEmbeddedWallet =
    user?.wallet?.walletClientType === "privy" ||
    user?.wallet?.walletClientType === "coinbase_smart_wallet";

  // The contract address for the current chain (zero address = unsupported)
  const contractAddr = CONTRACT_ADDRESSES[chainId];
  const isUnsupportedChain =
    authenticated &&
    !isEmbeddedWallet &&
    (!contractAddr || contractAddr === "0x0000000000000000000000000000000000000000");

  if (isUnsupportedChain) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        {/* Wrong network banner */}
        <div className="mb-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-yellow-400" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-300">Wrong Network</p>
              <p className="mt-1 text-sm text-yellow-200/80">
                This app is deployed on{" "}
                <span className="font-mono font-bold">Polygon Amoy</span>. You
                are currently connected to chain ID{" "}
                <span className="font-mono font-bold">{chainId}</span>. Please
                switch to continue.
              </p>
              <button
                onClick={() => switchChain({ chainId: polygonAmoy.id })}
                disabled={isPending}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-yellow-400 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`}
                />
                {isPending ? "Switching…" : "Switch to Polygon Amoy"}
              </button>
            </div>
          </div>
        </div>

        {/* Dimmed page content below (not interactive) */}
        <div className="pointer-events-none select-none opacity-30">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
