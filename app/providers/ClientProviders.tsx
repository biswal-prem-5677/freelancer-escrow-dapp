"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

// ssr: false is only allowed inside a Client Component.
// This wrapper is the Client boundary that prevents PrivyProvider
// from ever running on the server during static page generation.
const Web3Provider = dynamic(() => import("./Web3Provider"), { ssr: false });

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <Web3Provider>{children}</Web3Provider>;
}
