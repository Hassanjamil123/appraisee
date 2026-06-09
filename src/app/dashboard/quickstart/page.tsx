"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clipboard,
  Code,
  Key,
  MessageSquare,
  Package,
  Play,
  Rocket,
  Server,
  Sparkles,
  Terminal,
} from "lucide-react";

const installSnippet = `npm i @myappraise/sdk`;

const envSnippet = `APPRAISE_API_KEY=appraise_sk_demo_key_for_testing_only
APPRAISE_API_URL=http://localhost:3001`;

const trackSnippet = `import { Appraise } from "@myappraise/sdk";

const appraise = new Appraise({
  apiKey: process.env.APPRAISE_API_KEY,
  baseUrl: process.env.APPRAISE_API_URL
});

await appraise.track({
  sessionId: "customer_alex_001",
  workflow: "customer_support",
  event: "order_delayed",
  content: "Order ORD-8842 has been delayed twice. Customer prefers SMS updates.",
  metadata: {
    orderId: "ORD-8842",
    priority: "high",
    customerTier: "premium"
  }
});`;

const contextSnippet = `const context = await appraise.context.get({
  sessionId: "customer_alex_001",
  workflow: "customer_support",
  intent: "resolve_customer_issue"
});

console.log(context.urgencySignals);
console.log(context.suggestedActions);
console.log(context.recentMemories);`;

const chatbotSnippet = `async function answerCustomer(message: string) {
  const context = await appraise.context.get({
    sessionId: "customer_alex_001",
    workflow: "customer_support",
    intent: "resolve_customer_issue"
  });

  const prompt = \`
You are a helpful ecommerce support chatbot.

Customer message:
\${message}

Appraise context:
\${JSON.stringify(context, null, 2)}

Reply with the next best support action.
\`;

  return llm.chat(prompt);
}`;

const curlSnippet = `curl -X POST http://localhost:3001/v1/context \\
  -H "Authorization: Bearer appraise_sk_demo_key_for_testing_only" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sessionId": "customer_alex_001",
    "workflow": "customer_support",
    "intent": "resolve_customer_issue"
  }'`;

const withoutAppraiseSnippet = `const response = await llm.chat(` + "`" + `
You are a helpful ecommerce support chatbot.

Customer message:
\${message}
` + "`" + `);`;

const withAppraiseReasoningSnippet = `const context = await appraise.context.get({
  sessionId: "customer_alex_001",
  workflow: "customer_support",
  intent: "resolve_customer_issue",
  query: message
});

const response = await llm.chat(` + "`" + `
You are a helpful ecommerce support chatbot.

Customer message:
\${message}

Appraise context:
\${JSON.stringify(context, null, 2)}

Use the context to decide the next best support action.
` + "`" + `);`;

const steps = [
  {
    title: "Install the SDK",
    description: "Add Appraise to the backend service that powers your chatbot, copilot, or agent.",
    icon: Package,
  },
  {
    title: "Create an API key",
    description: "Use a server-side key only. Never expose Appraise credentials in browser bundles.",
    icon: Key,
  },
  {
    title: "Track product events",
    description: "Send operational signals like orders, escalations, preferences, and decisions.",
    icon: Server,
  },
  {
    title: "Retrieve context",
    description: "Before the AI responds, fetch workflow-aware memories and suggested actions.",
    icon: MessageSquare,
  },
];

export default function QuickstartPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("your Appraise project");
  const [useCase, setUseCase] = useState("customer support");

  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      try {
        const response = await fetch("/api/appraise/v1/projects/current", { cache: "no-store" });
        const body = await response.json();
        if (!response.ok || !body.project || !mounted) return;

        setProjectName(body.project.name || "your Appraise project");
        const rawUseCase = body.project.config?.useCase;
        if (typeof rawUseCase === "string" && rawUseCase.trim()) {
          setUseCase(rawUseCase.replaceAll("_", " "));
        }
      } catch {
        // Keep the fallback copy if the backend is not reachable.
      }
    }

    void loadProject();
    return () => {
      mounted = false;
    };
  }, []);

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="relative p-8 lg:p-10">
          <div className="absolute right-0 top-0 h-56 w-80 rounded-full bg-blue-100 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                <Rocket className="h-4 w-4" />
                Developer quickstart
              </div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">
                Integrate Appraise into {projectName}.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600">
                This flow shows how a team would use Appraise in production for {useCase}:
                track workflow events, retrieve workflow-aware context, then inject that
                context into an AI response.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/dashboard/api-keys"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                >
                  Manage API keys
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard/support-demo"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800"
                >
                  Run support demo
                </Link>
                <Link
                  href="/dashboard/examples"
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700"
                >
                  Browse examples
                </Link>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <Play className="h-4 w-4 text-blue-600" />
                Workspace snapshot
              </div>
              <div className="mt-5 space-y-3">
                {[`Project: ${projectName}`, `Use case: ${useCase}`, "LLM replies with memory", "Event is stored for next time"].map((item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white p-3 text-xs text-slate-600">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-700">
                      {index + 1}
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <Icon className="h-5 w-5 text-blue-600" />
              <h2 className="mt-4 text-sm font-bold text-slate-950">{step.title}</h2>
              <p className="mt-2 text-xs leading-6 text-slate-600">{step.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <CodeCard title="1. Install" subtitle="Add the TypeScript SDK." label="Terminal" text={installSnippet} copied={copied === "install"} onCopy={() => copy(installSnippet, "install")} />
        <CodeCard title="2. Configure" subtitle="Keep credentials server-side." label=".env" text={envSnippet} copied={copied === "env"} onCopy={() => copy(envSnippet, "env")} />
        <CodeCard title="3. Track an event" subtitle="Store useful operational memory." label="track.ts" text={trackSnippet} copied={copied === "track"} onCopy={() => copy(trackSnippet, "track")} />
        <CodeCard title="4. Retrieve context" subtitle="Ask Appraise what matters now." label="context.ts" text={contextSnippet} copied={copied === "context"} onCopy={() => copy(contextSnippet, "context")} />
      </section>

      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-950">Where the reasoning happens</h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Appraise does not replace your LLM. It improves the model input. Your backend retrieves Appraise context first, then injects that context into the prompt you send to OpenAI, Anthropic, OpenRouter, or your own model stack.
          </p>
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <CodeCard
              title="Without Appraise"
              subtitle="Only the latest user message reaches the model."
              label="baseline-llm.ts"
              text={withoutAppraiseSnippet}
              copied={copied === "without-appraise"}
              onCopy={() => copy(withoutAppraiseSnippet, "without-appraise")}
            />
            <CodeCard
              title="With Appraise"
              subtitle="Retrieve context first, then let the model reason with it."
              label="appraise-llm.ts"
              text={withAppraiseReasoningSnippet}
              copied={copied === "with-appraise"}
              onCopy={() => copy(withAppraiseReasoningSnippet, "with-appraise")}
            />
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CodeCard
          title="Chatbot integration"
          subtitle="Inject Appraise context into your LLM prompt before responding."
          label="support-chatbot.ts"
          text={chatbotSnippet}
          copied={copied === "chatbot"}
          onCopy={() => copy(chatbotSnippet, "chatbot")}
        />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-950">Test with curl</h2>
          </div>
          <p className="mt-3 text-xs leading-6 text-slate-600">
            Use this request when the backend is running on port 3001. It should
            return memories, urgency signals, suggested actions, and workflow context.
          </p>
          <CodePanel label="curl" text={curlSnippet} copied={copied === "curl"} onCopy={() => copy(curlSnippet, "curl")} />
          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
              <Code className="h-4 w-4" />
              What success looks like
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-6 text-slate-600">
              <li>Relevant memories include order delays and refund options.</li>
              <li>Urgency signals include delivery issue and support escalation.</li>
              <li>Suggested actions include refund, credit, SMS update, or escalation.</li>
            </ul>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}

function CodeCard({
  title,
  subtitle,
  label,
  text,
  copied,
  onCopy,
}: {
  title: string;
  subtitle: string;
  label: string;
  text: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-xs leading-6 text-slate-600">{subtitle}</p>
      <CodePanel label={label} text={text} copied={copied} onCopy={onCopy} />
    </article>
  );
}

function CodePanel({ label, text, copied, onCopy }: { label: string; text: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="font-mono text-xs text-slate-400">{label}</span>
        <button onClick={onCopy} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white">
          {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Clipboard className="h-4 w-4" />}
        </button>
      </div>
      <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap p-5 font-mono text-xs leading-6 text-slate-200">{text}</pre>
    </div>
  );
}
