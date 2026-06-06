import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  GitBranch,
  HeartPulse,
  LifeBuoy,
  Sparkles,
  Users,
} from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

const workflowCards = [
  {
    icon: LifeBuoy,
    title: "Customer support",
    stages: ["Issue opened", "Delay confirmed", "Refund discussed", "Escalation or resolution"],
  },
  {
    icon: Users,
    title: "Sales",
    stages: ["Discovery", "Pilot", "Security review", "Pricing and close"],
  },
  {
    icon: HeartPulse,
    title: "Healthcare intake",
    stages: ["Initial report", "Follow-up", "Urgency assessment", "Escalation"],
  },
  {
    icon: ClipboardList,
    title: "Recruiting",
    stages: ["Screen", "Interview loop", "Final review", "Offer decision"],
  },
];

const reasons = [
  "The same memory means different things at different stages.",
  "Good retrieval depends on knowing what the agent is trying to do right now.",
  "Workflows let Appraise return more precise context than text similarity alone.",
];

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <GitBranch className="h-4 w-4" />
              Workflows
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight">Memory gets better when it understands the work.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Appraise is workflow-aware. It does not just retrieve similar text. It understands the current stage, the current goal, and what kind of decision the agent is trying to make.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/docs#project-flow" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                See the developer flow
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/demo" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
                Explore use cases
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {workflowCards.map((card) => (
            <article key={card.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <card.icon className="h-5 w-5 text-blue-600" />
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{card.title}</h2>
              <div className="mt-4 space-y-2 text-sm leading-7 text-slate-600">
                {card.stages.map((stage) => (
                  <div key={stage} className="rounded-xl bg-slate-50 px-3 py-2">{stage}</div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Why workflows matter
            </div>
            <div className="mt-6 space-y-3">
              {reasons.map((reason) => (
                <div key={reason} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
                  <CheckCircle2 className="mt-1 h-4 w-4 text-blue-600" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
