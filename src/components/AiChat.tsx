"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "What's his experience with RAG?",
  "What has he shipped recently?",
  "Is he open to new roles?",
];

async function streamChatReply(
  messages: ChatMessage[],
  onDelta: (delta: string) => void,
) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content })),
    }),
  });

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      const line = event.trim();
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice("data: ".length);
      if (payload === "[DONE]") return;

      const data = JSON.parse(payload) as { delta?: string; error?: string };
      if (data.error) throw new Error(data.error);
      if (data.delta) onDelta(data.delta);
    }
  }
}

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isLoading]);

  const ask = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const history = [
      ...messages,
      { id: crypto.randomUUID(), role: "user" as const, content: text },
    ];
    const replyId = crypto.randomUUID();

    setMessages([...history, { id: replyId, role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);

    try {
      await streamChatReply(history, (delta) => {
        setMessages((current) =>
          current.map((m) =>
            m.id === replyId ? { ...m, content: m.content + delta } : m,
          ),
        );
      });
    } catch {
      setMessages((current) =>
        current.map((m) =>
          m.id === replyId
            ? { ...m, content: "Sorry, something went wrong. Please try again." }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed right-4 z-50 flex flex-col items-end gap-3 sm:right-8 sm:bottom-8"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      {open && (
        <div className="flex h-[28rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl sm:h-[32rem]">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Ask about {profile.name.split(" ")[0]}</p>
              <p className="text-xs text-muted">Answers grounded in his résumé</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted">
                  Ask me anything about {profile.name.split(" ")[0]}&apos;s experience, skills, or projects.
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => ask(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-left text-xs text-muted transition-colors hover:border-foreground/30 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-ink text-ink-foreground"
                      : "bg-background text-foreground"
                  }`}
                >
                  {message.content || (isLoading ? "Thinking…" : "")}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:border-foreground/30"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-ink-foreground transition-opacity hover:opacity-85 disabled:opacity-40"
            >
              ↑
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Ask AI about me"}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-ink-foreground shadow-lg transition-opacity hover:opacity-85 sm:h-auto sm:w-auto sm:gap-2 sm:px-5 sm:py-3 sm:text-sm sm:font-medium"
      >
        {open ? (
          <span className="text-lg leading-none sm:hidden">✕</span>
        ) : (
          <span className="h-2 w-2 rounded-full bg-emerald-400 sm:h-1.5 sm:w-1.5" />
        )}
        <span className="hidden sm:inline">{open ? "Close" : "Ask AI about me"}</span>
      </button>
    </div>
  );
}
