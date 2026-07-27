import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ClientProviders from "./providers/ClientProviders";
import { ToastProvider } from "./components/Toast";
import ErrorBoundary from "./components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreelancerEscrow — Trustless Web3 Payments",
  description:
    "Decentralized escrow for freelancers and clients. Lock funds on-chain, submit proof of work via IPFS, release on approval. Multi-milestone support, deadline enforcement, and dispute resolution on Polygon.",
  keywords: [
    "escrow",
    "freelancer",
    "blockchain",
    "polygon",
    "smart contract",
    "web3",
    "IPFS",
    "milestone payments",
    "decentralized",
  ],
  openGraph: {
    title: "FreelancerEscrow — Trustless Web3 Payments",
    description:
      "Lock funds, submit proof, get paid. Decentralized escrow on Polygon with IPFS proof-of-work.",
    type: "website",
    siteName: "FreelancerEscrow",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FreelancerEscrow — Trustless Freelance Payments on Polygon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreelancerEscrow — Trustless Web3 Payments",
    description:
      "Lock funds, submit proof, get paid. Decentralized escrow on Polygon with IPFS proof-of-work.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-white antialiased`}>
        <ClientProviders>
          <ToastProvider>
            <Navbar />
            <ErrorBoundary>
              <main className="min-h-screen pt-16">{children}</main>
            </ErrorBoundary>
          </ToastProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
