"use client";

import React, { useState } from "react";
import { Check, Clipboard } from "lucide-react";

export default function APIExamples() {
  const [activeTab, setActiveTab] = useState<"ts" | "py">("ts");
  const [copied, setCopied] = useState(false);

  const tsCode = `import { Appraise } from "@myappraise/sdk";

const appraise = new Appraise({
  apiKey: process.env.APPRAISE_API_KEY
});

// 1. Track a workflow signal
await appraise.track({
  sessionId: "session_sarah_004",
  workflow: "wf_recruiting_001",
  event: "final_interview_completed",
  metadata: {
    candidate: "Sarah Chen",
    compensationRisk: "high",
    competingOffer: true,
    interviewerConfidence: 0.81
  }
});

// 2. Ask for decision-ready context
const context = await appraise.context({
  sessionId: "session_sarah_004",
  workflow: "wf_recruiting_001",
  intent: "should_we_extend_offer"
});`;

  const pyCode = `from appraise import Appraise
import os

appraise = Appraise(
    api_key=os.getenv("APPRAISE_API_KEY")
)

# 1. Track a workflow signal
appraise.track(
    session_id="session_sarah_004",
    workflow="wf_recruiting_001",
    event="final_interview_completed",
    metadata={
        "candidate": "Sarah Chen",
        "compensationRisk": "high",
        "competingOffer": True,
        "interviewerConfidence": 0.81,
    },
)

# 2. Ask for decision-ready context
context = appraise.context(
    session_id="session_sarah_004",
    workflow="wf_recruiting_001",
    intent="should_we_extend_offer",
)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab === "ts" ? tsCode : pyCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 bg-black border-t border-border-subtle overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center animate-fade-in">
          <div className="lg:col-span-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-accent-blue mb-3">API Reference</h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              One client. <br className="hidden sm:inline" />
              Two calls. <br className="hidden sm:inline" />
              Context your AI can use.
            </h3>
            <p className="mt-4 text-text-secondary text-base leading-relaxed">
              Track what happened inside a workflow, then ask Appraise for the context behind the next decision. No vector plumbing or custom retrieval layer required.
            </p>
            <div className="mt-8 flex gap-4">
              <button onClick={() => setActiveTab("ts")} className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border ${activeTab === "ts" ? "bg-white text-black border-white" : "bg-surface-2 text-text-secondary border-border-subtle hover:text-white"}`}>
                TypeScript SDK
              </button>
              <button onClick={() => setActiveTab("py")} className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border ${activeTab === "py" ? "bg-white text-black border-white" : "bg-surface-2 text-text-secondary border-border-subtle hover:text-white"}`}>
                Python SDK
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-accent-blue to-accent-purple rounded-xl opacity-30 blur-lg pointer-events-none" />
            <div className="relative code-block">
              <div className="code-block-header justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="code-block-dot bg-red-500/80" />
                  <div className="code-block-dot bg-yellow-500/80" />
                  <div className="code-block-dot bg-green-500/80" />
                  <span className="text-xs text-text-tertiary font-mono ml-2">{activeTab === "ts" ? "appraise.ts" : "appraise.py"}</span>
                </div>
                <button onClick={handleCopy} className="p-1.5 rounded-md hover:bg-surface-3 text-text-secondary hover:text-white transition-colors">
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Clipboard className="w-4 h-4" />}
                </button>
              </div>
              <pre className="overflow-x-auto select-all text-xs sm:text-sm text-text-secondary leading-relaxed">
                <code>{activeTab === "ts" ? tsCode : pyCode}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
