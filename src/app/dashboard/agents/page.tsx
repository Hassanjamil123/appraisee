"use client";

import React from "react";
import { Bot, Plus, ArrowUpRight, Cpu } from "lucide-react";
import { agents } from "@/lib/mock-data";
import { formatNumber, timeAgo } from "@/lib/utils";

export default function AgentsDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Agents</h1>
          <p className="text-xs text-text-secondary mt-1">
            Configure agent nodes accessing multi-session memories.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-90 text-white transition-opacity">
          <Plus className="w-4 h-4" />
          Create Agent
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="p-6 rounded-xl border border-border-subtle bg-surface-1 flex flex-col justify-between hover:border-border-medium transition-all group glow-card"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-surface-2 border border-border-subtle text-accent-blue group-hover:text-accent-purple transition-all duration-300">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-950">{agent.name}</h3>
                    <span className="text-[10px] text-text-tertiary font-mono">ID: {agent.id}</span>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    agent.status === "running"
                      ? "bg-green-500/10 text-green-700 border border-green-500/20"
                      : agent.status === "idle"
                      ? "bg-yellow-500/10 text-yellow-700 border border-yellow-500/20"
                      : "bg-red-500/10 text-red-600 border border-red-500/20"
                  }`}
                >
                  <span
                    className={`w-1 h-1 rounded-full ${
                      agent.status === "running"
                        ? "bg-green-400"
                        : agent.status === "idle"
                        ? "bg-yellow-400"
                        : "bg-red-400"
                    }`}
                  />
                  {agent.status}
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                {agent.description}
              </p>
            </div>

            <div>
              <div className="h-[1px] bg-border-subtle mb-4" />

              <div className="flex items-center justify-between text-[10px] text-text-secondary">
                <div className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-text-tertiary" />
                  <span className="font-mono text-slate-950">{agent.model}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-950">{formatNumber(agent.memoriesAccessed)}</span> recall events
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-[9px] text-text-tertiary">
                <span>Active {timeAgo(agent.lastActive)}</span>
                <span className="text-accent-blue group-hover:underline cursor-pointer inline-flex items-center gap-0.5">
                  Configure
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
