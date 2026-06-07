"use client";

import Link from "next/link";
import { ArrowUpRight, Brain, ChevronDown } from "lucide-react";
import { PublicChatWidget } from "@/components/public/PublicChatWidget";

const navGroups = [
  {
    label: "Product",
    items: [
      { href: "/memory", label: "Memory", copy: "Structured memory for facts, entities, and decisions." },
      { href: "/workflows", label: "Workflows", copy: "Stage-aware context for agents that do real work." },
      { href: "/retrieval", label: "Retrieval", copy: "Return the smallest useful context window." },
      { href: "/integrations", label: "Integrations", copy: "Connect Appraise to the rest of your stack." },
      { href: "/llms", label: "LLMs", copy: "Inject Appraise context before model reasoning." },
    ],
  },
  {
    label: "Developers",
    items: [
      { href: "/docs", label: "Documentation", copy: "Install, authenticate, track events, and retrieve context." },
      { href: "/docs#llm-reasoning", label: "LLM guide", copy: "See how Appraise fits into OpenAI, Anthropic, and OpenRouter flows." },
      { href: "/login?redirectTo=/dashboard/quickstart", label: "Quickstart", copy: "Walk through the first working Appraise integration." },
      { href: "/login?redirectTo=/dashboard/chatbots", label: "Chatbot lab", copy: "Compare stateless bots against Appraise-powered ones." },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/demo", label: "Demo", copy: "See how Appraise behaves across real use cases." },
      { href: "/pricing", label: "Pricing", copy: "Understand plans, limits, and upgrade paths." },
      { href: "/why-appraise", label: "Why Appraise", copy: "See how Appraise compares with transcript stuffing, vector DBs, and RAG-only setups." },
      { href: "/login?redirectTo=/dashboard", label: "Console", copy: "Open the dashboard, workspaces, API keys, and team settings." },
    ],
  },
];

const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/memory", label: "Memory" },
      { href: "/workflows", label: "Workflows" },
      { href: "/retrieval", label: "Retrieval" },
      { href: "/llms", label: "LLM integrations" },
      { href: "/integrations", label: "Integrations" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/docs#track-api", label: "Track API" },
      { href: "/docs#context-api", label: "Context API" },
      { href: "/docs#llm-reasoning", label: "LLM guide" },
      { href: "/login?redirectTo=/dashboard/quickstart", label: "Quickstart" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/demo", label: "Use cases" },
      { href: "/pricing", label: "Pricing" },
      { href: "/why-appraise", label: "Why Appraise" },
      { href: "/login?redirectTo=/dashboard/chatbots", label: "Chatbot lab" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/signup", label: "Start free" },
      { href: "/login", label: "Sign in" },
      { href: "/login?redirectTo=/dashboard/billing", label: "Billing" },
      { href: "/docs", label: "Developer terms" },
    ],
  },
];

export function PublicHeader() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <Brain className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Appraise</span>
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          {navGroups.map((group) => (
            <div key={group.label} className="group relative py-2">
              <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                {group.label}
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="invisible absolute left-0 top-full z-40 w-[22rem] pt-2 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <div className="absolute inset-x-0 -top-2 h-4" />
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 transition hover:bg-slate-50">
                      <div className="text-sm font-semibold text-slate-950">{item.label}</div>
                      <div className="mt-1 text-sm leading-6 text-slate-600">{item.copy}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <Link href="/why-appraise" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
            Why Appraise
          </Link>
          <Link href="/pricing" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login?redirectTo=/dashboard"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-950 sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Start free
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </header>
      <PublicChatWidget />
    </>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1.8fr]">
          <div className="max-w-md">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                <Brain className="h-4 w-4" />
              </span>
              <span className="text-lg font-semibold tracking-tight text-slate-950">Appraise</span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              Workflow-aware memory infrastructure for AI apps, copilots, agents, and chat systems that need more than stateless prompts.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
              {["Track", "Retrieve context", "Reply with memory"].map((item) => (
                <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-slate-950">{group.title}</h3>
                <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600">
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href} className="hover:text-slate-950">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Appraise. Memory for real AI workflows.</span>
          <div className="flex gap-5">
            <Link href="/docs" className="hover:text-slate-950">
              Docs
            </Link>
            <Link href="/pricing" className="hover:text-slate-950">
              Pricing
            </Link>
            <Link href="/llms" className="hover:text-slate-950">
              LLMs
            </Link>
            <Link href="/integrations" className="hover:text-slate-950">
              Integrations
            </Link>
            <Link href="/memory" className="hover:text-slate-950">
              Memory
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
