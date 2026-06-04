"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Search,
  GitBranch,
  Workflow,
  Bot,
  History,
  Sparkles,
  Layers,
} from "lucide-react";
import { features } from "@/lib/mock-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain: Brain,
  Search: Search,
  GitBranch: GitBranch,
  Workflow: Workflow,
  Bot: Bot,
  History: History,
  Sparkles: Sparkles,
  Layers: Layers,
};

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="features" className="py-24 md:py-32 relative bg-black">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-accent-glow rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent-blue mb-3">
            Core capabilities
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Everything you need to build{" "}
            <span className="gradient-text">context-aware AI workflows</span>
          </h3>
          <p className="mt-4 text-text-secondary text-base sm:text-lg">
            Appraise handles workflow state, operational signals, decision history,
            and context injection so you can focus on building your product.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Brain;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative rounded-xl border border-border-subtle bg-surface-1 p-6 transition-all duration-300 hover:border-accent-blue/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] glow-card"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative">
                  <div className="inline-flex p-3 rounded-lg bg-surface-2 border border-border-subtle text-accent-blue group-hover:text-accent-purple group-hover:border-accent-purple/20 transition-all duration-300 mb-5">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-white group-hover:text-accent-blue transition-colors mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
