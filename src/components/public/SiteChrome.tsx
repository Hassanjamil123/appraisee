"use client";

import Link from "next/link";
import { ArrowUpRight, Brain } from "lucide-react";

const navLinks = [
  { href: "/#platform", label: "Product" },
  { href: "/llms", label: "LLMs" },
  { href: "/integrations", label: "Integrations" },
  { href: "/memory", label: "Memory" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
];

const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/#how-it-works", label: "How it works" },
      { href: "/llms", label: "LLM integrations" },
      { href: "/integrations", label: "Integrations" },
      { href: "/memory", label: "Memory" },
      { href: "/login?redirectTo=/dashboard", label: "Console" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "Documentation" },
      { href: "/llms", label: "LLM guide" },
      { href: "/workflows", label: "Workflows" },
      { href: "/retrieval", label: "Retrieval" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#platform", label: "Product" },
      { href: "/demo", label: "Use cases" },
      { href: "/login?redirectTo=/dashboard/chatbots", label: "Chatbot lab" },
      { href: "/signup", label: "Start free" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/pricing", label: "Plans" },
      { href: "/docs", label: "Developer terms" },
      { href: "/login?redirectTo=/dashboard/billing", label: "Billing" },
      { href: "/login", label: "Account access" },
    ],
  },
  {
    title: "Get started",
    links: [
      { href: "/signup", label: "Start free" },
      { href: "/login?redirectTo=/dashboard", label: "Sign in" },
      { href: "/login?redirectTo=/dashboard/quickstart", label: "Quickstart" },
      { href: "/login?redirectTo=/dashboard/chatbots", label: "Chatbots" },
    ],
  },
];

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <Brain className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Appraise</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-950">
              {link.label}
            </Link>
          ))}
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

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-5">
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
