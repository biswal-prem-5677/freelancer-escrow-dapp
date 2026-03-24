"use client";

import { ReactNode } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { http, fallback } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { polygonAmoy, sepolia, hardhat } from "wagmi/chains";

// Build wagmi config adapted for Privy
const config = createConfig({
  chains: [polygonAmoy, sepolia, hardhat],
  transports: {
    [polygonAmoy.id]: fallback([
      http("https://polygon-amoy-bor-rpc.publicnode.com"),
      http("https://polygon-amoy.drpc.org"),
      http("https://rpc-amoy.polygon.technology/"),
    ]),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Web3Provider({ children }: { children: ReactNode }) {
  console.log("PRIVY ENV:", process.env.NEXT_PUBLIC_PRIVY_APP_ID);
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
      config={{
        // Customize Privy's appearance to match our dark glassmorphism theme
        appearance: {
          theme: "dark",
          accentColor: "#6366f1",
        },
        // Automatically create embedded wallets for users who sign in without one (email/Google)
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        // Smart Wallets (gasless tx via ERC-4337 Paymaster) are enabled via
        // the Privy Dashboard → Wallet Infrastructure → Smart Wallets.
        // No code config needed for this version of @privy-io/react-auth.
        defaultChain: polygonAmoy,
        supportedChains: [polygonAmoy, sepolia, hardhat],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

