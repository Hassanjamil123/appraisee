import Link from "next/link";
import { ArrowRight, Bot, GitBranch, Network, ShieldCheck, Sparkles } from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

const agentCapabilities = [
  {
    icon: Bot,
    title: "Agent registry",
    copy: "Register support bots, recruiting copilots, account reviewers, and internal assistants in one place.",
  },
  {
    icon: GitBranch,
    title: "Workflow mapping",
    copy: "Attach each agent to the workflows it should understand so retrieval stays aligned with the work.",
  },
  {
    icon: Sparkles,
    title: "Prompt-aware memory",
    copy: "Give each agent the right context window before it reasons instead of treating every turn as stateless.",
  },
  {
    icon: ShieldCheck,
    title: "Project isolation",
    copy: "Keep each agent inside the correct workspace and project memory boundary.",
  },
];

const examples = [
  "Support assistant for delayed orders, refunds, and escalation state.",
  "Recruiting copilot that remembers candidates, scores, and interview decisions.",
  "Sales assistant that tracks blockers, buying signals, and next actions.",
  "Internal workspace assistant that holds onto project history and ownership context.",
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <Bot className="h-4 w-4" />
              Agents
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight">Give every agent its own memory lane.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Appraise lets teams organize memory and retrieval by agent, not just by raw events. That means support bots, copilots, and internal assistants can all share one platform without sharing the wrong context.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login?redirectTo=/dashboard/agents" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Open agents console
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/docs" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
                Read docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {agentCapabilities.map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <item.icon className="h-5 w-5 text-blue-600" />
              <h2 className="mt-4 text-xl font-semibold tracking-tight">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight">One platform, many agents</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Agents should not all behave like the same anonymous chatbot. Appraise gives each one a cleaner memory boundary and a clearer workflow lens.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <div className="space-y-3">
                {examples.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600">
                    <Network className="mt-1 h-4 w-4 text-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
