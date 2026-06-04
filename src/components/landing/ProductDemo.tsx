"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Brain, CheckCircle2, Send, Sparkles, Terminal } from "lucide-react";

const steps = [
  {
    title: "1. Track workflow signals",
    description: "Capture real events from your product, not just chat transcripts or static memories.",
    icon: Send,
  },
  {
    title: "2. Build operational context",
    description: "Appraise connects urgency, risks, outcomes, constraints, and previous decisions into one reasoning layer.",
    icon: Brain,
  },
  {
    title: "3. Return a decision brief",
    description: "Your AI app receives context, risks, and the recommended next action for the workflow.",
    icon: Sparkles,
  },
];

export default function ProductDemo() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveStep((prev) => (prev + 1) % 3), 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 relative bg-black border-t border-border-subtle overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-indigo/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent-purple mb-3">Interactive demo</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">See contextual reasoning in action</h3>
          <p className="mt-4 text-text-secondary text-base sm:text-lg">
            A recruiting copilot asks whether to extend an offer. Appraise returns the pressure, risks, and decision context behind the answer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={step.title}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-6 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? "bg-surface-2 border-accent-blue/30 shadow-[0_0_20px_rgba(99,102,241,0.05)]"
                      : "bg-surface-1/40 border-border-subtle hover:border-border-medium hover:bg-surface-1"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isActive ? "bg-accent-blue/10 text-accent-blue" : "bg-surface-3 text-text-secondary"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className={`font-semibold text-base ${isActive ? "text-white" : "text-text-secondary"}`}>{step.title}</h4>
                  </div>
                  <p className="mt-2 text-sm text-text-secondary pl-10 leading-relaxed">{step.description}</p>
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-8 relative h-[500px] rounded-2xl border border-border-subtle bg-surface-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 bg-surface-2 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-text-tertiary" />
                <span className="text-xs text-text-secondary font-mono">Appraise recruiting workflow simulator</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
            </div>

            <div className="flex-1 p-6 font-mono text-sm flex flex-col justify-center bg-black/40">
              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.div key="step-0" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div className="text-accent-blue font-semibold">{"// Track real workflow events"}</div>
                    <pre className="text-xs sm:text-sm bg-surface-2/60 p-4 rounded-lg border border-border-subtle text-green-400 overflow-x-auto leading-relaxed">
{`await appraise.track({
  sessionId: "session_sarah_004",
  workflow: "wf_recruiting_001",
  event: "final_interview_completed",
  metadata: {
    candidate: "Sarah Chen",
    compensationRisk: "high",
    competingOffer: true,
    hiringUrgency: "critical",
    interviewerConfidence: 0.81
  }
});`}
                    </pre>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center gap-2 text-accent-purple text-xs">
                      <CheckCircle2 className="w-4 h-4 text-green-500 animate-pulse" />
                      <span>Workflow signal accepted. Decision context updated.</span>
                    </motion.div>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div key="step-1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-accent-blue/20 rounded-full blur-xl animate-pulse" />
                      <div className="relative w-16 h-16 rounded-full bg-surface-2 border border-accent-blue flex items-center justify-center">
                        <Brain className="w-8 h-8 text-accent-blue animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-white text-base font-semibold">Operational Context Engine Active</div>
                      <div className="text-xs text-text-secondary max-w-md mx-auto">
                        Connecting historical decisions, budget pressure, hiring urgency, interview confidence, and candidate risk.
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs w-full max-w-xl">
                      <span className="px-3 py-2 rounded bg-accent-blue/10 border border-accent-blue/20 text-accent-blue">Competing offer detected</span>
                      <span className="px-3 py-2 rounded bg-accent-purple/10 border border-accent-purple/20 text-accent-purple">Salary pressure rising</span>
                      <span className="px-3 py-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">VP urgency: critical</span>
                      <span className="px-3 py-2 rounded bg-red-500/10 border border-red-500/20 text-red-300">Past slow offers lost candidates</span>
                    </div>
                  </motion.div>
                )}

                {activeStep === 2 && (
                  <motion.div key="step-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div className="text-accent-purple font-semibold">{"// Ask for decision-ready context"}</div>
                    <pre className="text-xs sm:text-sm bg-surface-2/60 p-4 rounded-lg border border-border-subtle text-green-400 overflow-x-auto leading-relaxed">
{`const context = await appraise.context({
  sessionId: "session_sarah_004",
  workflow: "wf_recruiting_001",
  intent: "should_we_extend_offer"
});`}
                    </pre>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-surface-2/90 border border-border-subtle p-4 rounded-lg text-xs space-y-3">
                      <div className="text-white font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-yellow-300" />
                        <span>Decision Brief</span>
                      </div>
                      <div className="text-text-secondary pl-5 leading-relaxed font-mono whitespace-pre-wrap">
{`{
  "recommendation": "Extend offer within 48 hours",
  "confidence": 0.86,
  "risks": ["competing_offer", "salary_gap", "slow_decision_history"],
  "reasoning": "Candidate quality is high and urgency is critical. Delay increases churn risk."
}`}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
