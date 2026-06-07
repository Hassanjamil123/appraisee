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

type AppraiseChatResponse = {
  chatbot?: {
    response?: string;
    provider?: string;
    model?: string;
    usedMemories?: number;
  };
  context?: {
    recentMemories?: Array<{ id: string; content: string; relevanceScore: number }>;
    urgencySignals?: string[];
    suggestedActions?: string[];
    inferredGoals?: string[];
  };
  stored?: unknown;
  request?: unknown;
  debug?: unknown;
};

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

function normalizeMemory(content: string) {
  return content.replace(/^User message:\s*/i, "").trim();
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function matchesHelpIntent(message: string) {
  return /how\s+(could|can|will)\s+appraise\s+help/i.test(message)
    || /how\s+would\s+appraise\s+help/i.test(message)
    || /what\s+would\s+appraise\s+do/i.test(message);
}

function matchesIntegrationIntent(message: string) {
  return /integrate\s+first/i.test(message)
    || /what\s+should\s+we\s+integrate\s+first/i.test(message)
    || /where\s+should\s+we\s+start/i.test(message)
    || /what\s+should\s+we\s+build\s+first/i.test(message);
}

function getOperationalMemory(memories: string[]) {
  return memories.find((memory) => /manual|manually|repeat conversations|look through conversations|conversation history|support inbox/i.test(memory)) || null;
}

function getUserMemories(response: AppraiseChatResponse, currentMessage: string) {
  const lowerCurrent = currentMessage.trim().toLowerCase();
  return unique(
    (response.context?.recentMemories || [])
      .filter((memory) => memory.content.toLowerCase().startsWith("user message:"))
      .map((memory) => normalizeMemory(memory.content))
      .filter((memory) => memory.toLowerCase() !== lowerCurrent)
      .filter((memory) => !memory.trim().endsWith("?"))
  );
}

function inferUseCase(memories: string[]) {
  const joined = memories.join(" ").toLowerCase();
  const isSupport = joined.includes("customer support") || joined.includes("ecommerce") || joined.includes("whatsapp");
  return {
    isSupport,
    mentionsWhatsapp: joined.includes("whatsapp"),
    mentionsEcommerce: joined.includes("ecommerce"),
    productName: memories.find((memory) => /known as\s+([A-Za-z0-9_-]+)/i.test(memory))?.match(/known as\s+([A-Za-z0-9_-]+)/i)?.[1] || null,
  };
}

function buildPublicAssistantReply(message: string, response: AppraiseChatResponse) {
  const lowerMessage = message.toLowerCase();
  const userMemories = getUserMemories(response, message);
  const useCase = inferUseCase(userMemories);
  const firstMemory = userMemories[0];
  const operationalMemory = getOperationalMemory(userMemories);
  const productName = useCase.productName || "your assistant";

  if (/manual|manually|repeat conversations|look through conversations|conversation history/i.test(message)) {
    if (useCase.isSupport) {
      return `That is exactly the kind of pain Appraise helps with. If ${productName} currently relies on manually reading old WhatsApp threads, Appraise can track the important events from those conversations and retrieve the right customer context before each reply, so the agent does not need to reconstruct history by hand.`;
    }
    return "That manual review step is a strong sign you need a memory layer. Appraise can track the important events from prior conversations and retrieve the right context before each reply so your team is not rebuilding history by hand.";
  }

  if (lowerMessage.includes("remember")) {
    if (firstMemory) {
      return `Here is what I remember about your use case: ${firstMemory}. I’m keeping that separate from the general Appraise product facts so I can answer from your context first.`;
    }
    return "I do not have a clear user-specific memory yet beyond this thread starting point. Tell me a bit more about your product and I’ll hold onto it across turns.";
  }

  if (matchesHelpIntent(message)) {
    if (useCase.isSupport) {
      const operationsLine = operationalMemory
        ? ` Right now you mentioned ${operationalMemory.toLowerCase()}, and Appraise would replace that manual lookup with retrieved customer context before each reply.`
        : "";
      return `For ${productName}, Appraise could remember repeat-customer context across WhatsApp conversations: order issues, refund history, escalation state, customer tone, and channel preferences. The key win is that before your agent replies, it can retrieve the right context for that customer instead of treating every message like a fresh thread.${operationsLine}`;
    }
    return `Appraise would help by tracking what happened in your product, retrieving the most relevant context before each reply, and then giving the model a much better memory surface than raw transcript stuffing.`;
  }

  if (matchesIntegrationIntent(message)) {
    if (useCase.isSupport) {
      const operationsLine = operationalMemory
        ? ` Since ${productName} currently depends on manual conversation review, the first win is to track those support events automatically and retrieve them before each WhatsApp reply.`
        : "";
      return `I would start with the customer-support loop for ${productName}: first track events like order delayed, refund offered, escalation requested, and preferred contact channel. Then before each WhatsApp reply, call Appraise context retrieval with the customer session so the agent sees the right memories and next actions.${operationsLine}`;
    }
    return "I would start by tracking the highest-signal product events first, then retrieve Appraise context right before your assistant replies. That gives you the shortest path to a real memory win.";
  }

  if (firstMemory) {
    return `That sounds like a strong Appraise use case. I’m holding onto this context: ${firstMemory}. Tell me how ${productName} currently handles repeat conversations, and I can suggest the best first integration path.`;
  }

  return response.chatbot?.response || "I can help you explore how Appraise would fit into your product. Tell me about your use case and I’ll keep the thread context across turns.";
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

    const response = (await appraiseFetch("/v1/chatbots/respond", {
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
    })) as AppraiseChatResponse;

    const rewrittenResponse = buildPublicAssistantReply(message, response);

    return NextResponse.json({
      ...response,
      chatbot: {
        ...(response.chatbot || {}),
        response: rewrittenResponse,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Unable to answer public chat request" } },
      { status: 500 }
    );
  }
}
