"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { pricingTiers } from "@/lib/mock-data";

export default function Pricing() {
  return (
    <section className="py-24 bg-black border-t border-border-subtle relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-accent-glow rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent-blue mb-3">
            Pricing plans
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Scale context for{" "}
            <span className="gradient-text">every user volume</span>
          </h3>
          <p className="mt-4 text-text-secondary text-base sm:text-lg">
            Free tier allows rapid prototyping. Premium options support secure high-concurrency context execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, idx) => {
            const isPro = tier.highlighted;
            return (
              <div
                key={idx}
                className={`rounded-xl border p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isPro
                    ? "bg-surface-2 border-accent-blue shadow-[0_0_40px_rgba(99,102,241,0.15)] md:scale-105 z-10"
                    : "bg-surface-1/60 border-border-subtle hover:border-border-medium"
                }`}
              >
                {isPro && tier.badge && (
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-accent-blue to-accent-purple text-[10px] font-bold text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {tier.badge}
                  </span>
                )}

                <div>
                  <h4 className="text-lg font-bold text-white mb-2">{tier.name}</h4>
                  <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                    {tier.period && (
                      <span className="text-xs text-text-secondary">{tier.period}</span>
                    )}
                  </div>

                  <div className="h-[1px] bg-border-subtle mb-8" />

                  <ul className="space-y-4 mb-8">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-text-secondary">
                        <Check className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/dashboard"
                  className={`w-full text-center py-3 rounded-lg text-xs font-semibold transition-all ${
                    isPro
                      ? "bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:opacity-95 shadow-md shadow-accent-blue/10"
                      : "bg-surface-2 border border-border-subtle text-white hover:bg-surface-3"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
