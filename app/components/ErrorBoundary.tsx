"use client";

import { Component, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />
          </div>

          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="h-7 w-7 text-red-400" />
          </div>

          <h2 className="text-2xl font-bold text-white">
            {this.props.fallbackTitle || "Something went wrong"}
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-400 leading-relaxed">
            An unexpected error occurred. This might be a network issue or a temporary problem.
            Try again or go back to the homepage.
          </p>

          {/* Error details (collapsed) */}
          {this.state.error && (
            <details className="mt-4 w-full max-w-md text-left">
              <summary className="cursor-pointer text-xs text-slate-600 hover:text-slate-400 transition-colors">
                Show error details
              </summary>
              <pre className="mt-2 max-h-32 overflow-auto rounded-lg border border-white/10 bg-white/5 p-3 text-[11px] text-red-300 font-mono">
                {this.state.error.message}
              </pre>
            </details>
          )}

          <div className="mt-8 flex gap-3">
            <button
              onClick={this.handleRetry}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
