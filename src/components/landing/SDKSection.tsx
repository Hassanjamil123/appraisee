"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Copy, Check, ArrowUpRight } from "lucide-react";

export default function SDKSection() {
  const [copiedTs, setCopiedTs] = useState(false);
  const [copiedPy, setCopiedPy] = useState(false);

  const copyTs = () => {
    navigator.clipboard.writeText("npm install @appraise/sdk");
    setCopiedTs(true);
    setTimeout(() => setCopiedTs(false), 2500);
  };

  const copyPy = () => {
    navigator.clipboard.writeText("pip install appraise");
    setCopiedPy(true);
    setTimeout(() => setCopiedPy(false), 2500);
  };

  return (
    <section className="py-24 bg-black border-t border-border-subtle relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent-purple mb-3">
            Developer Tooling
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            First-class client libraries
          </h3>
          <p className="mt-4 text-text-secondary text-base sm:text-lg">
            Deploy to your stack in seconds. Type-safe and async-first libraries designed for clean integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* TypeScript SDK Card */}
          <div className="rounded-xl border border-border-subtle bg-surface-1 p-8 hover:border-accent-blue/30 transition-all duration-300 relative group glow-card">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-[10px] font-semibold text-accent-blue tracking-wider uppercase">
              TypeScript / JS
            </div>
            <h4 className="text-xl font-bold text-white mb-2">TypeScript SDK</h4>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Fully typed, ESM & CJS compatible client for Next.js, Node, Cloudflare Workers, and Vercel Edge.
            </p>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-2 border border-border-subtle font-mono text-xs text-white mb-6">
              <span>npm install @appraise/sdk</span>
              <button
                onClick={copyTs}
                className="p-1 rounded hover:bg-surface-3 text-text-secondary hover:text-white transition-colors"
              >
                {copiedTs ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-blue group-hover:text-accent-purple transition-colors"
            >
              TypeScript Docs
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Python SDK Card */}
          <div className="rounded-xl border border-border-subtle bg-surface-1 p-8 hover:border-accent-purple/30 transition-all duration-300 relative group glow-card">
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-[10px] font-semibold text-accent-purple tracking-wider uppercase">
              Python
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Python SDK</h4>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              Thread-safe async and sync client designed for LangChain, LlamaIndex, FastAPI, and notebooks.
            </p>

            <div className="flex items-center justify-between p-3.5 rounded-lg bg-surface-2 border border-border-subtle font-mono text-xs text-white mb-6">
              <span>pip install appraise</span>
              <button
                onClick={copyPy}
                className="p-1 rounded hover:bg-surface-3 text-text-secondary hover:text-white transition-colors"
              >
                {copiedPy ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-blue group-hover:text-accent-purple transition-colors"
            >
              Python Docs
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
