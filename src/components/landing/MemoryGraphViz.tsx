"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Brain, User, Settings, Database, Clock, ShieldAlert } from "lucide-react";

export default function MemoryGraphViz() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    {
      id: "pref",
      label: "User Preferences",
      desc: "Tracks communication tone, formatting rules, and direct user requests.",
      icon: Settings,
      color: "from-blue-500 to-indigo-500",
      x: 120,
      y: 90,
    },
    {
      id: "fact",
      label: "User Facts",
      desc: "Extracts biographical details, tech stack info, and timeline occurrences.",
      icon: Database,
      color: "from-purple-500 to-pink-500",
      x: 480,
      y: 100,
    },
    {
      id: "sess",
      label: "Session Context",
      desc: "Short term chat history thread references and immediate prompt tokens.",
      icon: Clock,
      color: "from-emerald-500 to-teal-500",
      x: 100,
      y: 310,
    },
    {
      id: "sec",
      label: "Security Guidelines",
      desc: "Filter triggers, rate limits, and custom guardrails per session.",
      icon: ShieldAlert,
      color: "from-red-500 to-orange-500",
      x: 480,
      y: 290,
    },
  ];

  return (
    <section className="py-24 bg-black border-t border-border-subtle relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent-blue mb-3">
            Context Graphs
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Visualize operational context graphs
          </h3>
          <p className="mt-4 text-text-secondary text-base sm:text-lg">
            Understand how decisions, risks, and workflow state connect. Hover over any node to explore its structure.
          </p>
        </div>

        {/* Center SVG layout */}
        <div className="relative w-full max-w-2xl h-[420px] mx-auto border border-border-subtle bg-surface-1/40 rounded-2xl p-6 overflow-hidden flex items-center justify-center">
          {/* SVG connecting wires */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {nodes.map((node) => (
              <line
                key={node.id}
                x1="320"
                y1="200"
                x2={node.x}
                y2={node.y}
                stroke="rgba(99, 102, 241, 0.25)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            ))}
          </svg>

          {/* Central Main user node */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            onHoverStart={() => setActiveNode("center")}
            className="absolute z-10 w-24 h-24 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple p-1 shadow-[0_0_40px_rgba(99,102,241,0.3)] cursor-pointer flex items-center justify-center"
            style={{ left: "calc(50% - 48px)", top: "calc(50% - 48px)" }}
          >
            <div className="w-full h-full rounded-full bg-black flex flex-col items-center justify-center gap-1">
              <User className="w-6 h-6 text-accent-blue" />
              <span className="text-[10px] font-bold text-white tracking-wider uppercase">SARAH_C</span>
            </div>
          </motion.div>

          {/* Connected nodes */}
          {nodes.map((node) => {
            const Icon = node.icon;
            const isHovered = activeNode === node.id;
            return (
              <motion.div
                key={node.id}
                whileHover={{ scale: 1.15 }}
                onHoverStart={() => setActiveNode(node.id)}
                onHoverEnd={() => setActiveNode(null)}
                className="absolute z-10 cursor-pointer flex flex-col items-center"
                style={{ left: node.x - 24, top: node.y - 24 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${node.color} p-[1px] shadow-[0_0_20px_rgba(99,102,241,0.1)]`}>
                  <div className="w-full h-full rounded-[11px] bg-black hover:bg-black/80 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Tooltip drawer at bottom */}
          <div className="absolute bottom-4 left-4 right-4 h-[72px] rounded-xl border border-border-subtle bg-surface-2/90 backdrop-blur-md px-4 py-3 flex flex-col justify-center">
            {activeNode === "center" && (
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">User Node: sarah_chen</h5>
                <p className="text-xs text-text-secondary mt-0.5">Central context profile containing preferences, signals, and workflow history.</p>
              </div>
            )}
            {activeNode && activeNode !== "center" && (
              <div>
                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                  {nodes.find((n) => n.id === activeNode)?.label}
                </h5>
                <p className="text-xs text-text-secondary mt-0.5">
                  {nodes.find((n) => n.id === activeNode)?.desc}
                </p>
              </div>
            )}
            {!activeNode && (
              <div className="text-center text-xs text-text-tertiary">
                Hover over nodes to explore relations
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
