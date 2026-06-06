import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Gauge,
  GitBranch,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import { PublicFooter, PublicHeader } from "@/components/public/SiteChrome";

const providers = [
  {
    name: "OpenAI",
    copy: "Use Appraise to retrieve context first, then pass the memory payload into OpenAI Responses or Chat Completions.",
    snippet: `const context = await appraise.context.get({\n  sessionId,\n  workflow,\n  intent: \"resolve_customer_issue\",\n  query: userMessage\n});\n\nconst response = await openai.responses.create({\n  model: \"your-openai-model\",\n  input: [\n    {\n      role: \"system\",\n      content: \"Use this Appraise context:\\n\" + JSON.stringify(context, null, 2)\n    },\n    { role: \"user\", content: userMessage }\n  ]\n});`,
  },
  {
    name: "Anthropic",
    copy: "Keep Claude focused on the current task while Appraise supplies workflow state, memory, and urgency.",
    snippet: `const context = await appraise.context.get({\n  sessionId,\n  workflow,\n  intent: \"resolve_customer_issue\",\n  query: userMessage\n});\n\nconst response = await anthropic.messages.create({\n  model: \"your-anthropic-model\",\n  max_tokens: 800,\n  system: \"Use this Appraise context:\\n\" + JSON.stringify(context, null, 2),\n  messages: [{ role: \"user\", content: userMessage }]\n});`,
  },
  {
    name: "OpenRouter",
    copy: "Use the same Appraise retrieval layer while choosing whichever upstream model is right for the workload.",
    snippet: `const context = await appraise.context.get({\n  sessionId,\n  workflow,\n  intent: \"resolve_customer_issue\",\n  query: userMessage\n});\n\nconst response = await fetch(\"https://openrouter.ai/api/v1/chat/completions\", {\n  method: \"POST\",\n  headers: {\n    Authorization: \"Bearer \" + process.env.OPENROUTER_API_KEY,\n    \"Content-Type\": \"application/json\"\n  },\n  body: JSON.stringify({\n    model: \"your-openrouter-model\",\n    messages: [\n      { role: \"system\", content: \"Use this Appraise context:\\n\" + JSON.stringify(context, null, 2) },\n      { role: \"user\", content: userMessage }\n    ]\n  })\n});`,
  },
];

const comparison = [
  {
    title: "Without Appraise",
    points: [
      "The model only sees the latest message.",
      "It asks for information your product already knows.",
      "Workflow state and decision history stay outside the prompt.",
    ],
  },
  {
    title: "With Appraise",
    points: [
      "Retrieve memory, entities, workflow state, and urgency first.",
      "Inject the context payload into the model input.",
      "Let the model reason with better information instead of a bare message.",
    ],
  },
];

const loop = [
  "Track product events into Appraise",
  "Retrieve context before the model call",
  "Inject memory into the prompt",
  "Generate a response with the provider you already use",
  "Optionally track the decision back into Appraise",
];

export default function LlmsPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <PublicHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
              <Sparkles className="h-4 w-4" />
              LLM integrations
            </div>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight">Appraise sits before the model.</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Appraise does not replace OpenAI, Anthropic, or OpenRouter. It gives those models the memory, workflow state, and decision context they need to answer more intelligently.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/docs#llm-reasoning" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
                Read the docs
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login?redirectTo=/dashboard/chatbots" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">
                Open chatbot lab
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-6 lg:grid-cols-2">
          {comparison.map((item) => (
            <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
              <h2 className="text-2xl font-semibold tracking-tight">{item.title}</h2>
              <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                {item.points.map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-4 w-4 text-blue-600" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-5 md:grid-cols-4">
            {[
              { icon: MessageSquareText, title: "Current message", copy: "What the user or workflow is asking right now." },
              { icon: Brain, title: "Appraise context", copy: "Memories, entities, urgency, stage, and prior decisions." },
              { icon: Bot, title: "Model reasoning", copy: "Your preferred LLM reasons over that richer context." },
              { icon: Gauge, title: "Better reply", copy: "The final response has more continuity and less guesswork." },
            ].map((item) => (
              <article key={item.title} className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <item.icon className="h-5 w-5 text-blue-600" />
                <h2 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 space-y-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
            <GitBranch className="h-4 w-4 text-blue-600" />
            Provider examples
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight">Use the model stack you already have.</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Appraise stays provider-agnostic. The integration pattern is the same: retrieve context first, then feed it into the model input.
          </p>
        </div>
        <div className="space-y-6">
          {providers.map((provider) => (
            <article key={provider.name} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{provider.name}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{provider.copy}</p>
              </div>
              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 text-white">
                <div className="border-b border-white/10 px-4 py-3 font-mono text-xs text-slate-400">{provider.name}</div>
                <pre className="overflow-x-auto whitespace-pre-wrap p-5 font-mono text-sm leading-7 text-slate-200">{provider.snippet}</pre>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8">
            <h2 className="text-2xl font-semibold tracking-tight">The production loop</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-5">
              {loop.map((item, index) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 text-slate-600">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">0{index + 1}</div>
                  <div className="mt-2">{item}</div>
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
