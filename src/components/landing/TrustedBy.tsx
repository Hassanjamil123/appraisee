"use client";

import React from "react";
import { trustedByCompanies } from "@/lib/mock-data";

export default function TrustedBy() {
  // Duplicate list to ensure smooth infinite loop
  const displayCompanies = [...trustedByCompanies, ...trustedByCompanies];

  return (
    <section className="py-12 border-y border-border-subtle bg-black overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-text-tertiary">
          Trusted by developers at leading AI startups
        </p>
      </div>

      <div className="relative w-full flex items-center overflow-hidden">
        {/* Left and right fade gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex gap-16 animate-ticker whitespace-nowrap">
          {displayCompanies.map((company, index) => (
            <div
              key={index}
              className="text-lg md:text-xl font-bold tracking-tight text-text-tertiary/60 hover:text-white transition-colors duration-300 select-none cursor-default"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
