"use client";

import { useState } from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useReadContract, useChainId } from "wagmi";
import { CONTRACT_ADDRESSES, ESCROW_ABI } from "../config/contracts";
import { Shield, Menu, X, ShieldAlert, BarChart3, User } from "lucide-react";

export default function Navbar() {
  const { login, logout, authenticated, ready, user } = usePrivy();
  const [menuOpen, setMenuOpen] = useState(false);
  const chainId = useChainId();

  const address = user?.wallet?.address as `0x${string}` | undefined;

  // Check if current user is the contract owner (for admin link)
  const { data: ownerAddress } = useReadContract({
    address: CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[80002],
    abi: ESCROW_ABI,
    functionName: "owner",
    query: { enabled: !!address },
  });

  const isOwner =
    ownerAddress &&
    address &&
    address.toLowerCase() === (ownerAddress as string).toLowerCase();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/stats", label: "Stats" },
  ];

  const authLinks = authenticated
    ? [{ href: "/profile", label: "Profile", icon: User }]
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setMenuOpen(false)}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/30 group-hover:bg-indigo-500 transition-colors">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">
            Freelance<span className="text-indigo-400">Escrow</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {authLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <link.icon className="h-3.5 w-3.5" />
              {link.label}
            </Link>
          ))}
          {isOwner && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
          <Link
            href="/create"
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
          >
            + New Escrow
          </Link>
        </div>

        {/* Right: Auth + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Auth section */}
          <div className="hidden md:flex items-center gap-4">
            {ready && !authenticated && (
              <button
                onClick={login}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Sign In / Connect
              </button>
            )}
            {ready && authenticated && user && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-300">
                  {user.email?.address ||
                    (user.wallet?.address
                      ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                      : "Connected")}
                </span>
                <button
                  onClick={logout}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile: Sign In button (always visible) */}
          {ready && !authenticated && (
            <button
              onClick={login}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors md:hidden"
            >
              Sign In
            </button>
          )}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors md:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 px-4 py-4 md:hidden animate-slide-in-down">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            {isOwner && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <ShieldAlert className="h-4 w-4" />
                Admin
              </Link>
            )}
            <Link
              href="/create"
              onClick={() => setMenuOpen(false)}
              className="mt-1 rounded-xl bg-indigo-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              + New Escrow
            </Link>
            {/* Mobile Sign Out */}
            {ready && authenticated && user && (
              <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
                <p className="px-3 text-xs text-slate-500">
                  {user.email?.address ||
                    (user.wallet?.address
                      ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}`
                      : "Connected")}
                </p>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
