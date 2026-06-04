"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTAFooter() {
  return (
    <section className="py-24 md:py-32 bg-black border-t border-border-subtle relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
          Start building <span className="gradient-text">intelligent AI apps</span> today
        </h2>
        <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Give your AI systems context that survives session timeouts. Turn one-off conversations into deep, evolving user understanding.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-accent-blue to-accent-purple text-sm font-semibold text-white rounded-lg shadow-lg shadow-accent-indigo/20 hover:opacity-95 transition-opacity"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/docs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface-2 border border-border-subtle text-sm font-semibold text-white rounded-lg hover:bg-surface-3 transition-colors"
          >
            Read API Docs
          </Link>
        </div>
      </div>
    </section>
  );
}
