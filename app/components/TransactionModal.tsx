"use client";

import { useEffect } from "react";
import { CheckCircle, Loader2, XCircle, ExternalLink } from "lucide-react";

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  isPending: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
  hash?: `0x${string}`;
  successMessage?: string;
}

export default function TransactionModal({
  open,
  onClose,
  isPending,
  isConfirming,
  isSuccess,
  error,
  hash,
  successMessage = "Transaction confirmed!",
}: TransactionModalProps) {
  // Auto-close on success after 3s
  useEffect(() => {
    if (isSuccess) {
      const t = setTimeout(onClose, 3000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
        {/* Pending wallet */}
        {isPending && !isConfirming && !isSuccess && !error && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
            <p className="text-center text-sm text-slate-300">
              Confirm the transaction in your wallet…
            </p>
          </div>
        )}

        {/* Confirming on-chain */}
        {isConfirming && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
            <p className="text-center font-medium text-white">Broadcasting…</p>
            <p className="text-center text-xs text-slate-400">
              Waiting for blockchain confirmation
            </p>
          </div>
        )}

        {/* Success */}
        {isSuccess && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-12 w-12 text-emerald-400" />
            <p className="text-center font-semibold text-white">{successMessage}</p>
            {hash && (
              <a
                href={`https://amoy.polygonscan.com/tx/${hash}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 underline"
              >
                View on PolygonScan <ExternalLink className="h-3 w-3" />
              </a>
            )}
            <p className="text-xs text-slate-500">Closing automatically…</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-12 w-12 text-red-400" />
            <p className="text-center font-medium text-white">Transaction Failed</p>
            <p className="max-w-xs text-center text-xs text-slate-400">
              {error.message.slice(0, 120)}
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-lg bg-white/10 px-6 py-2 text-sm text-white hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
