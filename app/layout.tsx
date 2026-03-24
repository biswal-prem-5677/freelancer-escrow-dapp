import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Web3Provider from "./providers/Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreelancerEscrow — Trustless Web3 Payments",
  description:
    "Decentralized escrow for freelancers and clients. Lock funds on-chain, submit proof of work via IPFS, release on approval.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        <Web3Provider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
        </Web3Provider>
      </body>
    </html>
  );
}
