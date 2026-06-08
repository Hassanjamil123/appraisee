"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Clipboard,
  Code,
  FolderKanban,
  KeyRound,
  Layers,
  LockKeyhole,
  Sparkles,
  Terminal,
  Workflow,
} from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

const sections = [
  { id: "install", label: "Install" },
  { id: "project-flow", label: "Project flow" },
  { id: "quickstart", label: "Quickstart" },
  { id: "auth", label: "Authentication" },
  { id: "track-api", label: "Track API" },
  { id: "context-api", label: "Context API" },
  { id: "ai-apps", label: "AI apps example" },
  { id: "quickai", label: "QuickAI example" },
  { id: "llm-reasoning", label: "Using with LLMs" },
  { id: "compare", label: "Chatbot compare" },
  { id: "plans", label: "Plans and limits" },
];

const quickstartTs = `import { Appraise } from "@appraise/sdk";

const appraise = new Appraise({
  apiKey: process.env.APPRAISE_API_KEY
});

await appraise.track({
  sessionId: "support_cust_8842",
  workflow: "customer_support",
  event: "refund_requested",
  metadata: {
    customerId: "cust_8842",
    orderId: "ORD-8842",
    priority: "high"
  }
});

const context = await appraise.context.get({
  sessionId: "support_cust_8842",
  workflow: "customer_support",
  intent: "should_we_refund"
});`;

const quickstartPy = `from appraise import Appraise
import os

appraise = Appraise(
    api_key=os.getenv("APPRAISE_API_KEY")
)

appraise.track(
    session_id="support_cust_8842",
    workflow="customer_support",
    event="refund_requested",
    metadata={
        "customerId": "cust_8842",
        "orderId": "ORD-8842",
        "priority": "high",
    },
)

context = appraise.context(
    session_id="support_cust_8842",
    workflow="customer_support",
    intent="should_we_refund",
)`;

const curlTrack = `curl -X POST http://localhost:3001/v1/events \\
  -H "Authorization: Bearer appraise_sk_demo_key_for_testing_only" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sessionId":"support_cust_8842",
    "workflow":"customer_support",
    "event":"refund_requested",
    "content":"Customer requested a refund after a second delivery delay.",
    "metadata":{
      "customerId":"cust_8842",
      "orderId":"ORD-8842",
      "priority":"high"
    }
  }'`;

const curlContext = `curl -X POST http://localhost:3001/v1/context \\
  -H "Authorization: Bearer appraise_sk_demo_key_for_testing_only" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sessionId":"support_cust_8842",
    "workflow":"customer_support",
    "intent":"should_we_refund",
    "query":"Where is my order? I already asked yesterday."
  }'`;

const genericAiAppSnippet = `import { Appraise } from "@appraise/sdk";

const appraise = new Appraise({
  apiKey: process.env.APPRAISE_API_KEY,
  baseUrl: process.env.APPRAISE_API_URL,
});

await appraise.track({
  sessionId: "account_acme_123",
  workflow: "account_review",
  event: "user_message_received",
  content: "Summarize the current blockers for this account.",
  metadata: {
    accountId: "acme_123",
    surface: "internal_ai_workspace"
  },
  createMemory: false
});

const context = await appraise.context.get({
  sessionId: "account_acme_123",
  workflow: "account_review",
  intent: "generate_next_best_response",
  query: "Summarize the current blockers for this account."
});`;

const quickAiRouteSnippet = `curl -X POST https://inspiring-enjoyment-production-ab0c.up.railway.app/v1/internal/quickai/reply \
  -H "Authorization: Bearer appraise_sk_demo_key_for_testing_only" \
  -H "X-Appraise-User-Id: <your-appraise-user-id>" \
  -H "X-Appraise-User-Email: <your-appraise-email>" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust_123",
    "whatsappThreadId": "thread_8842",
    "message": "Where is my order? I already asked yesterday.",
    "orderId": "ORD-8842",
    "currentHandling": "We normally look through conversations manually"
  }'`;

const compareSnippet = `POST /v1/chatbots/compare

{
  "type": "customer_support",
  "sessionId": "support_cust_8842",
  "workflow": "customer_support",
  "message": "Where is my order? I already asked yesterday."
}`;

const withoutAppraiseSnippet = `const response = await openai.responses.create({
  model: "your-openai-model",
  input: [
    {
      role: "system",
      content: "You are a helpful customer support assistant."
    },
    {
      role: "user",
      content: "Where is my order? I already asked yesterday."
    }
  ]
});`;

const withAppraiseSnippet = `const context = await appraise.context.get({
  sessionId: "support_cust_8842",
  workflow: "customer_support",
  intent: "resolve_customer_issue",
  query: "Where is my order? I already asked yesterday."
});

const response = await openai.responses.create({
  model: "your-openai-model",
  input: [
    {
      role: "system",
      content: "You are a helpful customer support assistant.

Use this Appraise context when answering:
" + JSON.stringify(context, null, 2)
    },
    {
      role: "user",
      content: "Where is my order? I already asked yesterday."
    }
  ]
});`;

const openaiSnippet = `import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const context = await appraise.context.get({
  sessionId,
  workflow,
  intent: "resolve_customer_issue",
  query: userMessage
});

const response = await openai.responses.create({
  model: "your-openai-model",
  input: [
    {
      role: "system",
      content: "Use this Appraise context:
" + JSON.stringify(context, null, 2)
    },
    { role: "user", content: userMessage }
  ]
});`;

const anthropicSnippet = `import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const context = await appraise.context.get({
  sessionId,
  workflow,
  intent: "resolve_customer_issue",
  query: userMessage
});

const response = await anthropic.messages.create({
  model: "your-anthropic-model",
  max_tokens: 800,
  system: "Use this Appraise context:
" + JSON.stringify(context, null, 2),
  messages: [{ role: "user", content: userMessage }]
});`;

const openRouterSnippet = `const context = await appraise.context.get({
  sessionId,
  workflow,
  intent: "resolve_customer_issue",
  query: userMessage
});

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + process.env.OPENROUTER_API_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "your-openrouter-model",
    messages: [
      {
        role: "system",
        content: "Use this Appraise context:
" + JSON.stringify(context, null, 2)
      },
      { role: "user", content: userMessage }
    ]
  })
});`;

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"ts" | "py">("ts");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
              <Code className="h-4 w-4" />
              Developer documentation
            </div>
            <h1 className="text-5xl font-semibold tracking-tight">Build with Appraise like it is real infrastructure.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              The developer path is straightforward: create a project, issue a key, track real events, retrieve context before the model replies, and compare a stateless chatbot against one that uses Appraise memory.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                Start free
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login?redirectTo=/dashboard/quickstart"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
              >
                Open quickstart
              </Link>
              <Link
                href="/login?redirectTo=/dashboard/chatbots"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
              >
                Open chatbot lab
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f7f8fb]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-5 md:grid-cols-4">
            {[
              { icon: FolderKanban, title: "Project scoped", copy: "Each company or product uses Appraise by project." },
              { icon: KeyRound, title: "Server-side keys", copy: "Issue project keys and keep them off the frontend." },
              { icon: Workflow, title: "Track and retrieve", copy: "Send events in. Pull context out before the LLM call." },
              { icon: Bot, title: "Compare behavior", copy: "Test stateless responses against Appraise-powered ones." },
            ].map((item) => (
              <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <item.icon className="h-5 w-5 text-blue-600" />
                <h2 className="mt-5 text-xl font-semibold tracking-tight">{item.title}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl gap-12 px-6 py-10">
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Developer path</h4>
            <div className="mt-4 flex flex-col gap-2">
              {sections.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-950">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </aside>

        <main className="max-w-4xl flex-1 space-y-12 pb-24">
          <DocSection id="install" icon={<Terminal className="h-5 w-5 text-blue-600" />} title="Install">
            <p className="text-slate-600">
              Install the SDK in your backend, worker, or workflow service. Appraise should sit near the server-side code that already knows what happened in your product.
            </p>
            <div className="mt-5 flex gap-3">
              <TabButton active={activeTab === "ts"} onClick={() => setActiveTab("ts")}>TypeScript</TabButton>
              <TabButton active={activeTab === "py"} onClick={() => setActiveTab("py")}>Python</TabButton>
            </div>
            <CodeBlock
              label="Terminal"
              text={activeTab === "ts" ? "npm install @appraise/sdk" : "pip install appraise"}
              onCopy={() => copyToClipboard(activeTab === "ts" ? "npm install @appraise/sdk" : "pip install appraise", "install")}
              copied={copied === "install"}
            />
          </DocSection>

          <DocSection id="project-flow" icon={<FolderKanban className="h-5 w-5 text-blue-600" />} title="Project flow">
            <p className="text-slate-600">
              Appraise is project-based. A company creates one project for each AI application, not one project per customer.
            </p>
            <FieldTable
              rows={[
                ["1", "Create project", "Example: shopflow-support-ai or acme-sales-copilot."],
                ["2", "Generate API key", "Use a project key from your server environment."],
                ["3", "Track events", "Send support, sales, healthcare, or recruiting signals into Appraise."],
                ["4", "Retrieve context", "Ask Appraise what matters before the chatbot or agent replies."],
              ]}
            />
          </DocSection>

          <DocSection id="quickstart" icon={<Layers className="h-5 w-5 text-blue-600" />} title="Quickstart">
            <p className="text-slate-600">
              Start with one event write and one context retrieval. That is enough to validate the core Appraise loop.
            </p>
            <CodeBlock
              label={activeTab === "ts" ? "app.ts" : "app.py"}
              text={activeTab === "ts" ? quickstartTs : quickstartPy}
              onCopy={() => copyToClipboard(activeTab === "ts" ? quickstartTs : quickstartPy, "quickstart")}
              copied={copied === "quickstart"}
            />
          </DocSection>

          <DocSection id="auth" icon={<LockKeyhole className="h-5 w-5 text-blue-600" />} title="Authentication">
            <p className="text-slate-600">
              Send your Appraise project API key as a Bearer token from server-side requests only.
            </p>
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-7 text-amber-900">
              Never expose Appraise secret keys in browser bundles. Keep them in backend environment variables or serverless secrets.
            </div>
          </DocSection>

          <DocSection id="track-api" icon={<Sparkles className="h-5 w-5 text-blue-600" />} title="Track API">
            <p className="text-slate-600">
              Capture operational signals from your product: events, decisions, preferences, delays, escalations, and stage changes.
            </p>
            <FieldTable
              rows={[
                ["sessionId", "string", "The active conversation, workflow, or customer thread."],
                ["workflow", "string", "The process name, such as customer_support or sales_pipeline."],
                ["event", "string", "The product event Appraise should remember."],
                ["content", "string", "Optional human-readable version of the event."],
                ["metadata", "object", "Structured facts used later during retrieval."],
              ]}
            />
            <CodeBlock
              label="curl"
              text={curlTrack}
              onCopy={() => copyToClipboard(curlTrack, "track")}
              copied={copied === "track"}
            />
          </DocSection>

          <DocSection id="context-api" icon={<BrainIcon />} title="Context API">
            <p className="text-slate-600">
              Ask Appraise for the smallest useful context window for the current intent. The response includes memories, urgency signals, suggested actions, and inferred goals.
            </p>
            <FieldTable
              rows={[
                ["sessionId", "string", "The thread you want context for."],
                ["workflow", "string", "Optional workflow scope."],
                ["intent", "string", "What the assistant is trying to do right now."],
                ["query", "string", "The latest user message or operational question."],
              ]}
            />
            <CodeBlock
              label="curl"
              text={curlContext}
              onCopy={() => copyToClipboard(curlContext, "context")}
              copied={copied === "context"}
            />
          </DocSection>


          <DocSection id="ai-apps" icon={<Workflow className="h-5 w-5 text-blue-600" />} title="AI apps example">
            <p className="text-slate-600">
              Appraise is broader than chat. Any AI application can track the important product event, retrieve the smallest useful context window, and inject that context before the model reasons.
            </p>
            <CodeBlock
              label="generic-ai-app.ts"
              text={genericAiAppSnippet}
              onCopy={() => copyToClipboard(genericAiAppSnippet, "generic-ai-app")}
              copied={copied === "generic-ai-app"}
            />
            <FieldTable
              rows={[
                ["sessionId", "string", "The account, case, document, or workflow thread your AI app is working inside."],
                ["workflow", "string", "The process boundary, such as account_review, onboarding, triage, or escalation."],
                ["track(...)", "call", "Record the meaningful event before reasoning so Appraise has fresh product context."],
                ["context.get(...)", "call", "Retrieve memories, urgency, and suggested actions right before the model replies."],
              ]}
            />
          </DocSection>


          <DocSection id="quickai" icon={<Bot className="h-5 w-5 text-blue-600" />} title="QuickAI example">
            <p className="text-slate-600">
              This is the canonical end-to-end Appraise flow for a real AI product: QuickAI, a WhatsApp support agent for ecommerce businesses. It tracks the incoming customer message, carries forward the active workspace, retrieves the best support context, and compares a stateless reply against one that uses Appraise memory.
            </p>
            <CodeBlock
              label="POST /v1/internal/quickai/reply"
              text={quickAiRouteSnippet}
              onCopy={() => copyToClipboard(quickAiRouteSnippet, "quickai")}
              copied={copied === "quickai"}
            />
            <FieldTable
              rows={[
                ["customerId", "string", "Your stable customer identifier inside QuickAI."],
                ["whatsappThreadId", "string", "The active WhatsApp thread or conversation id."],
                ["message", "string", "The latest customer message before your assistant replies."],
                ["currentHandling", "string", "Optional note about the current manual support process you want to replace."],
              ]}
            />
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-sm leading-7 text-slate-600">
              The response gives you both replies plus the debugging surface developers actually need: remembered context, urgency signals, prompt payloads, and next integration steps.
            </div>
          </DocSection>

          <DocSection id="llm-reasoning" icon={<Sparkles className="h-5 w-5 text-blue-600" />} title="Using Appraise with LLMs">
            <p className="text-slate-600">
              Appraise is the context layer before the model, not the model itself. Your application retrieves Appraise context first, then injects it into the prompt you send to OpenAI, Anthropic, OpenRouter, or any other provider.
            </p>
            <div className="mt-5 grid gap-6 xl:grid-cols-2">
              <div>
                <div className="text-sm font-semibold text-slate-950">Without Appraise</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  The model only sees the latest user message, so it tends to ask for information your product already knows.
                </p>
                <CodeBlock
                  label="baseline.ts"
                  text={withoutAppraiseSnippet}
                  onCopy={() => copyToClipboard(withoutAppraiseSnippet, "without-appraise")}
                  copied={copied === "without-appraise"}
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-950">With Appraise</div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Retrieve workflow-aware context first, then give the model the right memory, urgency, and suggested actions before it reasons.
                </p>
                <CodeBlock
                  label="with-appraise.ts"
                  text={withAppraiseSnippet}
                  onCopy={() => copyToClipboard(withAppraiseSnippet, "with-appraise")}
                  copied={copied === "with-appraise"}
                />
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 text-sm">
              <div className="grid grid-cols-3 bg-slate-50 p-3 font-semibold text-slate-700">
                <span>Provider</span>
                <span>What Appraise provides</span>
                <span>What your model still does</span>
              </div>
              {[
                ["OpenAI", "Context payload, memories, urgency, workflow state", "Reasoning, response generation, tool orchestration"],
                ["Anthropic", "Same Appraise retrieval layer", "Long-form reasoning and response generation"],
                ["OpenRouter", "Same Appraise retrieval layer", "Provider choice and model execution"],
              ].map(([provider, appraiseRole, modelRole]) => (
                <div key={provider} className="grid grid-cols-3 border-t border-slate-200 p-3">
                  <span className="font-mono text-blue-700">{provider}</span>
                  <span className="text-slate-600">{appraiseRole}</span>
                  <span className="text-slate-600">{modelRole}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-6">
              <CodeBlock
                label="OpenAI"
                text={openaiSnippet}
                onCopy={() => copyToClipboard(openaiSnippet, "openai")}
                copied={copied === "openai"}
              />
              <CodeBlock
                label="Anthropic"
                text={anthropicSnippet}
                onCopy={() => copyToClipboard(anthropicSnippet, "anthropic")}
                copied={copied === "anthropic"}
              />
              <CodeBlock
                label="OpenRouter"
                text={openRouterSnippet}
                onCopy={() => copyToClipboard(openRouterSnippet, "openrouter")}
                copied={copied === "openrouter"}
              />
            </div>
          </DocSection>

          <DocSection id="compare" icon={<Bot className="h-5 w-5 text-blue-600" />} title="Chatbot compare">
            <p className="text-slate-600">
              The best way to evaluate Appraise is to compare one stateless chatbot against one that retrieves Appraise context before responding.
            </p>
            <CodeBlock
              label="POST /v1/chatbots/compare"
              text={compareSnippet}
              onCopy={() => copyToClipboard(compareSnippet, "compare")}
              copied={copied === "compare"}
            />
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/login?redirectTo=/dashboard/chatbots"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Open chatbot lab
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login?redirectTo=/dashboard/quickstart"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
              >
                Open quickstart
              </Link>
            </div>
          </DocSection>

          <DocSection id="plans" icon={<Terminal className="h-5 w-5 text-blue-600" />} title="Plans and limits">
            <p className="text-slate-600">
              Limits are enforced per project. Storage and monthly request usage grow with event writes and context retrievals.
            </p>
            <FieldTable
              rows={[
                ["Starter", "250 MB / 25,000 requests", "2 API keys, 30 day retention."],
                ["Pro", "10 GB / 1,000,000 requests", "25 API keys, 365 day retention."],
                ["Scale", "100 GB+ / 10,000,000 requests", "Custom support, higher enterprise volume."],
              ]}
            />
          </DocSection>
        </main>
      </div>

      <PublicFooter />
    </div>
  );
}

function DocSection({ id, icon, title, children }: { id: string; icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
      <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
        {icon}
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:text-slate-950"
      }`}
    >
      {children}
    </button>
  );
}

function CodeBlock({ label, text, copied, onCopy }: { label: string; text: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="font-mono text-xs text-slate-400">{label}</span>
        <button onClick={onCopy} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
          {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Clipboard className="h-4 w-4" />}
        </button>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap p-5 font-mono text-sm leading-7 text-slate-200">{text}</pre>
    </div>
  );
}

function FieldTable({ rows }: { rows: string[][] }) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 text-sm">
      <div className="grid grid-cols-3 bg-slate-50 p-3 font-semibold text-slate-700">
        <span>Field</span>
        <span>Type</span>
        <span>Description</span>
      </div>
      {rows.map(([field, type, description]) => (
        <div key={field} className="grid grid-cols-3 border-t border-slate-200 p-3">
          <span className="font-mono text-blue-700">{field}</span>
          <span className="text-slate-600">{type}</span>
          <span className="text-slate-600">{description}</span>
        </div>
      ))}
    </div>
  );
}

function BrainIcon() {
  return <Sparkles className="h-5 w-5 text-blue-600" />;
}
