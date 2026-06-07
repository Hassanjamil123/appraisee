"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Bot, Loader2, MessageSquare, RotateCcw, Send, Sparkles, X } from "lucide-react";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  meta?: string;
};

type PublicChatResponse = {
  chatbot?: {
    response: string;
    provider?: string;
    model?: string;
    usedMemories?: number;
  };
  context?: {
    recentMemories?: Array<{ id: string; content: string; relevanceScore: number }>;
    urgencySignals?: string[];
    suggestedActions?: string[];
  };
};

const sessionStorageKey = "appraise_public_chat_session";
const messagesStorageKey = "appraise_public_chat_messages";
const seededStorageKey = "appraise_public_chat_seeded";
const defaultAssistantMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hi — I’m the Appraise demo assistant. Ask me what Appraise does, tell me about your use case, and then keep talking so you can feel the memory hold across turns.",
  meta: "This thread persists in this browser so you can test memory over time.",
};

function createSessionId() {
  return `public_demo_${crypto.randomUUID()}`;
}

export function PublicChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([defaultAssistantMessage]);
  const [memoryCount, setMemoryCount] = useState(0);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    const storedSession = window.localStorage.getItem(sessionStorageKey);
    const storedMessages = window.localStorage.getItem(messagesStorageKey);
    const nextSession = storedSession || createSessionId();
    setSessionId(nextSession);
    window.localStorage.setItem(sessionStorageKey, nextSession);

    setSeeded(window.localStorage.getItem(seededStorageKey) === "true");

    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages) as ChatMessage[];
        if (parsed.length) {
          setMessages(parsed);
        }
      } catch {
        window.localStorage.removeItem(messagesStorageKey);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length) {
      window.localStorage.setItem(messagesStorageKey, JSON.stringify(messages));
    }
  }, [messages]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading && sessionId, [input, loading, sessionId]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || !sessionId) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/public-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          page: pathname,
          bootstrap: !seeded,
        }),
      });
      const body = (await response.json()) as PublicChatResponse & { error?: { message?: string } };
      if (!response.ok) {
        throw new Error(body.error?.message || "Unable to get a response from Appraise");
      }

      if (!seeded) {
        setSeeded(true);
        window.localStorage.setItem(seededStorageKey, "true");
      }

      const memories = body.context?.recentMemories?.length || 0;
      setMemoryCount(memories);
      setMessages((current) => [
        ...current,
        {
          id: `assistant_${Date.now()}`,
          role: "assistant",
          text: body.chatbot?.response || "I couldn't generate a response just now.",
          meta: body.chatbot?.provider
            ? `${body.chatbot.provider} · ${body.chatbot.model || "model"} · ${memories} memories used`
            : `${memories} memories used`,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to get a response from Appraise");
    } finally {
      setLoading(false);
    }
  }

  function resetThread() {
    const nextSession = createSessionId();
    setSessionId(nextSession);
    setMessages([defaultAssistantMessage]);
    setMemoryCount(0);
    setError("");
    setInput("");
    setSeeded(false);
    window.localStorage.setItem(sessionStorageKey, nextSession);
    window.localStorage.setItem(messagesStorageKey, JSON.stringify([defaultAssistantMessage]));
    window.localStorage.removeItem(seededStorageKey);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(15,23,42,0.25)] transition hover:bg-slate-800"
      >
        <MessageSquare className="h-4 w-4" />
        Chat with Appraise
        {memoryCount > 0 ? <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium">{memoryCount} memories</span> : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/20 backdrop-blur-[2px]" onClick={() => setOpen(false)}>
          <div
            className="absolute bottom-5 right-5 flex h-[min(78vh,720px)] w-[min(92vw,420px)] flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                  <Bot className="h-3.5 w-3.5" />
                  Persistent demo
                </div>
                <h2 className="mt-3 text-lg font-semibold text-slate-950">Ask the Appraise assistant</h2>
                <p className="mt-1 text-xs leading-5 text-slate-600">
                  This thread sticks to one Appraise session so you can test memory, context, and follow-ups.
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                Session memory active
              </div>
              <button type="button" onClick={resetThread} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 font-medium text-slate-600 hover:border-slate-300 hover:text-slate-900">
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${message.role === "user" ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>
                    <p>{message.text}</p>
                    {message.meta ? <p className={`mt-2 text-[11px] ${message.role === "user" ? "text-slate-300" : "text-slate-500"}`}>{message.meta}</p> : null}
                  </div>
                </div>
              ))}
              {loading ? (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    Thinking with Appraise memory...
                  </div>
                </div>
              ) : null}
            </div>

            <div className="border-t border-slate-200 bg-white px-4 py-4">
              {error ? <p className="mb-3 text-xs text-red-600">{error}</p> : null}
              <div className="flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      if (canSend) void sendMessage();
                    }
                  }}
                  placeholder="Tell me about your agent, then ask a follow-up so you can test memory."
                  className="min-h-[84px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 outline-none focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={!canSend}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
