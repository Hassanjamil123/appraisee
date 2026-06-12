import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  GitBranch,
  Inbox,
  LifeBuoy,
  Mail,
  MessagesSquare,
  Package,
  PlugZap,
  Receipt,
  Users,
} from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

const integrations = [
  {
    icon: LifeBuoy,
    name: "Zendesk",
    status: "Request in console",
    copy: "Bring tickets, escalations, CSAT, and prior resolutions into the Appraise memory stream.",
  },
  {
    icon: MessagesSquare,
    name: "Slack",
    status: "Request in console",
    copy: "Track internal decisions, escalations, and handoffs that should shape future agent responses.",
  },
  {
    icon: Mail,
    name: "Gmail",
    status: "Request in console",
    copy: "Capture customer replies, approvals, and follow-ups as structured memory instead of loose mail threads.",
  },
  {
    icon: Users,
    name: "HubSpot",
    status: "Request in console",
    copy: "Keep stakeholder history, objections, buying signals, and stage changes attached to the workflow.",
  },
  {
    icon: Receipt,
    name: "Stripe",
    status: "Request in console",
    copy: "Track billing events, retries, upgrades, and high-signal payment issues for support and revenue agents.",
  },
  {
    icon: GitBranch,
    name: "GitHub",
    status: "Request in console",
    copy: "Use issues, PRs, and deploy events to give internal copilots richer engineering context.",
  },
  {
    icon: FileText,
    name: "Notion",
    status: "Request in console",
    copy: "Pull docs, SOPs, and runbooks into a retrieval layer that also understands workflows and entities.",
  },
  {
    icon: Package,
    name: "Custom events",
    status: "Available now",
    copy: "Send structured events directly from your product today using the REST API or SDKs.",
  },
];

const ingestion = [
  "Product events from your backend",
  "Support messages and ticket metadata",
  "CRM changes and sales stage updates",
  "Uploaded documents and knowledge sources",
  "Workflow decisions and escalation outcomes",
];

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <PlugZap className="h-4 w-4" />
              Integrations
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight">Bring the rest of your stack into Appraise.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Developers should not have to retype context into prompts by hand. Appraise should connect to the systems where customer history, workflow state, and operational signals already live.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/docs#track-api" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Start with events
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login?redirectTo=/dashboard/connectors" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
                Open connectors console
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {integrations.map((item) => (
            <article key={item.name} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <item.icon className="h-5 w-5 text-blue-600" />
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] ${item.status === "Available now" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {item.status}
                </span>
              </div>
              <h2 className="mt-5 text-xl font-semibold tracking-tight">{item.name}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
                <Inbox className="h-4 w-4 text-blue-600" />
                Ingestion model
              </div>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight">Start with custom events, then grow into connectors.</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Appraise already works through direct event ingestion. That makes the current developer path real today. The next product layer is now a real workspace surface: you can register connector intent in the console today, keep custom events live, and roll managed connectors in as they mature.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
              <div className="space-y-3">
                {ingestion.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white p-4 text-sm leading-7 text-slate-600">
                    <CheckCircle2 className="mt-1 h-4 w-4 text-blue-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">What developers should expect next</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              "Workspace-level connector records for support, CRM, docs, billing, and engineering tools.",
              "Document and knowledge ingestion for richer retrieval.",
              "Honest rollout states so teams can see which connectors are live versus just requested.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
