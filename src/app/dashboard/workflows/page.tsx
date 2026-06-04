"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Save, Plus, ArrowRight, Brain, Settings, Database, Cpu, MessageSquare, RefreshCw, Layers } from "lucide-react";
import { defaultWorkflowNodes, defaultWorkflowConnections } from "@/lib/mock-data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  input: MessageSquare,
  memory_retrieval: Brain,
  reasoning: Cpu,
  context_injection: Layers,
  action: Settings,
  feedback_loop: RefreshCw,
};

const colorMap: Record<string, string> = {
  input: "border-green-500/30 text-green-700 bg-green-500/5",
  memory_retrieval: "border-accent-blue/30 text-accent-blue bg-accent-blue/5",
  reasoning: "border-accent-purple/30 text-accent-purple bg-accent-purple/5",
  context_injection: "border-accent-indigo/30 text-accent-indigo bg-accent-indigo/5",
  action: "border-amber-500/30 text-amber-400 bg-amber-500/5",
  feedback_loop: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5",
};

export default function WorkflowBuilder() {
  const [nodes, setNodes] = useState(defaultWorkflowNodes);
  const [connections, setConnections] = useState(defaultWorkflowConnections);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Visual Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Agent Workflows</h1>
          <p className="text-xs text-text-secondary mt-1">
            Build and test multi-session context graphs and LLM prompt pipelines.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-2 border border-border-subtle hover:bg-surface-3 transition-colors text-slate-950">
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-90 text-white transition-opacity">
            <Play className="w-3.5 h-3.5" />
            Deploy Pipeline
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Node Drawer Side Bar */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 rounded-xl border border-border-subtle bg-surface-1 space-y-4">
            <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Available Blocks</h3>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Drag or click blocks to add them directly into your agent runtime pipeline.
            </p>

            <div className="space-y-2.5">
              {[
                { type: "input", label: "User Input", color: "text-green-700 bg-green-500/10" },
                { type: "memory_retrieval", label: "Recall Context", color: "text-accent-blue bg-accent-blue/10" },
                { type: "reasoning", label: "LLM Reasoning", color: "text-accent-purple bg-accent-purple/10" },
                { type: "context_injection", label: "Inject Context", color: "text-accent-indigo bg-accent-indigo/10" },
                { type: "action", label: "External Action", color: "text-amber-400 bg-amber-500/10" },
                { type: "feedback_loop", label: "Outcome Feedback", color: "text-cyan-400 bg-cyan-500/10" },
              ].map((item) => (
                <button
                  key={item.type}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border-subtle bg-surface-2 hover:border-border-medium transition-all text-left text-xs font-semibold text-slate-950"
                >
                  <span className="flex items-center gap-2">
                    <span className={`p-1.5 rounded ${item.color}`}>
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Visual Builder */}
        <div className="lg:col-span-9 p-6 rounded-xl border border-border-subtle bg-surface-1/40 relative h-[520px] overflow-hidden">
          {/* Grid visual lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* SVG Connector lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {connections.map((conn) => {
              const fromNode = nodes.find((n) => n.id === conn.from);
              const toNode = nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              // Bezier coordinates
              const x1 = fromNode.x + 80;
              const y1 = fromNode.y + 40;
              const x2 = toNode.x - 20;
              const y2 = toNode.y + 40;
              const mx = (x1 + x2) / 2;

              return (
                <path
                  key={conn.id}
                  d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.4)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
              );
            })}
          </svg>

          {/* Visual Cards Mapping */}
          <div className="absolute inset-0 overflow-auto p-6 z-10">
            {nodes.map((node) => {
              const Icon = iconMap[node.type] || Brain;
              const colorClasses = colorMap[node.type] || "";
              return (
                <motion.div
                  key={node.id}
                  drag
                  dragMomentum={false}
                  onDrag={(event, info) => {
                    // Update drag coordinates
                    setNodes((prev) =>
                      prev.map((n) =>
                        n.id === node.id
                          ? { ...n, x: n.x + info.delta.x, y: n.y + info.delta.y }
                          : n
                      )
                    );
                  }}
                  className={`absolute w-44 rounded-xl border p-4 bg-surface-2/95 shadow-lg select-none cursor-grab active:cursor-grabbing hover:border-border-medium hover:shadow-xl transition-colors ${colorClasses}`}
                  style={{ left: node.x, top: node.y }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] font-bold tracking-tight text-slate-950">{node.label}</span>
                  </div>
                  {node.description && (
                    <p className="text-[10px] text-text-secondary leading-relaxed">
                      {node.description}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
