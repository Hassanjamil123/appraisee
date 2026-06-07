import { NextRequest, NextResponse } from "next/server";

const apiUrl = (process.env.APPRAISE_API_URL || "http://localhost:3001").replace(/\/$/, "");
const apiKey = process.env.APPRAISE_CONSOLE_API_KEY || process.env.APPRAISE_API_KEY || (process.env.NODE_ENV === "development" ? "appraise_sk_demo_key_for_testing_only" : "");
const workflow = "website_assistant";
const assistantType = "general";

const seedFacts = [
  {
    event: "product_positioning",
    content: "Appraise is workflow-aware memory infrastructure for AI apps, copilots, and agents. It helps teams track events, retrieve relevant context, and inject that context into LLM prompts before the model replies.",
  },
  {
    event: "developer_flow",
    content: "The core developer loop in Appraise is track events, retrieve context, inject context into an LLM call, and then respond with memory instead of relying on raw transcript stuffing.",
  },
  {
    event: "model_compatibility",
    content: "Appraise works with OpenAI, Anthropic, OpenRouter, and other model providers because it focuses on the context layer before reasoning, not on replacing the LLM itself.",
  },
  {
    event: "product_surfaces",
    content: "Appraise includes an API, a console, docs, a chatbot lab, public product pages, team workspaces, API keys, and context debugging flows for developers.",
  },
  {
    event: "business_value",
    content: "A practical Appraise demo should show that the assistant remembers prior user details, retrieves the right memories for the current question, and answers more intelligently over multiple turns.",
  },
];

async function appraiseFetch(path: string, payload: unknown) {
  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Appraise-User-Id": "public-chat-demo",
      "X-Appraise-User-Email": "public-chat@appraise.dev",
      "X-Appraise-App-Origin": process.env.APPRAISE_APP_URL || "https://appraise-web.vercel.app",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(body || `Appraise request failed for ${path}`);
  }

  return body ? JSON.parse(body) : null;
}

async function seedSession(sessionId: string, page: string) {
  await Promise.all(
    seedFacts.map((fact, index) =>
      appraiseFetch("/v1/events", {
        sessionId,
        workflow,
        event: fact.event,
        content: fact.content,
        externalId: `public-chat:${sessionId}:seed:${index}`,
        metadata: {
          source: "public_chat_widget",
          page,
          seeded: true,
        },
      })
    )
  );
}

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json({ error: { message: "APPRAISE_CONSOLE_API_KEY or APPRAISE_API_KEY is not configured" } }, { status: 500 });
    }

    const body = await request.json() as { message?: string; sessionId?: string; page?: string; bootstrap?: boolean };
    const message = body.message?.trim();
    const sessionId = body.sessionId?.trim();
    const page = body.page?.trim() || "/";

    if (!message || !sessionId) {
      return NextResponse.json({ error: { message: "message and sessionId are required" } }, { status: 400 });
    }

    if (body.bootstrap) {
      await seedSession(sessionId, page);
    }

    const response = await appraiseFetch("/v1/chatbots/respond", {
      type: assistantType,
      sessionId,
      workflow,
      message,
      metadata: {
        source: "public_chat_widget",
        page,
      },
      maxMemories: 8,
      maxEntities: 5,
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Unable to answer public chat request" } },
      { status: 500 }
    );
  }
}
