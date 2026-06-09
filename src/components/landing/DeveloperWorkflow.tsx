"use client";

import React from "react";
import { Cpu, GitBranch, Settings, Terminal } from "lucide-react";

const steps = [
  {
    icon: Terminal,
    title: "1. Install SDK",
    description: "Add the Appraise client to any agent, copilot, or backend service.",
    cmd: "npm i @myappraise/sdk\n# or pip install appraise",
  },
  {
    icon: Settings,
    title: "2. Initialize client",
    description: "Authenticate once and point Appraise at your workflow namespace.",
    cmd: "const appraise = new Appraise({\n  apiKey: process.env.APPRAISE_KEY\n});",
  },
  {
    icon: GitBranch,
    title: "3. Track signals",
    description: "Send product events, workflow updates, risks, outcomes, and user state.",
    cmd: "await appraise.track({\n  workflow: 'recruiting',\n  event: 'candidate_interviewed'\n});",
  },
  {
    icon: Cpu,
    title: "4. Ask for context",
    description: "Retrieve a compact decision brief your AI can reason with immediately.",
    cmd: "const ctx = await appraise.context({\n  workflow: 'recruiting',\n  intent: 'should_extend_offer'\n});",
  },
];

export default function DeveloperWorkflow() {
  return (
    <section id="workflow" className="py-24 bg-black border-t border-border-subtle relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent-blue mb-3">Developer-First Integration</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Built to integrate in <span className="gradient-text">five minutes</span>
          </h3>
          <p className="mt-4 text-text-secondary text-base sm:text-lg">
            A simple loop for stateful AI products: track signals, request context, inject the decision brief into your model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-[1px] bg-gradient-to-r from-accent-blue/40 via-accent-purple/40 to-transparent z-0" />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex flex-col relative z-10">
                <div className="inline-flex p-3 w-12 h-12 items-center justify-center rounded-xl bg-surface-2 border border-border-subtle text-accent-blue mb-6">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
                <p className="text-sm text-text-secondary mb-5 leading-relaxed">{step.description}</p>
                <div className="mt-auto font-mono text-[11px] p-3 rounded-lg bg-surface-2 border border-border-subtle text-text-secondary overflow-x-auto whitespace-pre">
                  {step.cmd}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
