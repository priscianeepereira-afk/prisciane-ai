"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_ACTIONS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    title: "Analisar Reels",
    desc: "Identificar DNA de um Reels viral",
    prompt: "Quero analisar um Reels que viralizou",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: "Analisar Anuncio",
    desc: "Extrair o que converte no criativo",
    prompt: "Tenho um anuncio que converteu bem",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    ),
    title: "Analisar Live",
    desc: "Entender o DNA de uma live de sucesso",
    prompt: "Preciso entender o DNA de uma live",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
    title: "Isolar Copy",
    desc: "Separar os blocos de persuasao vencedores",
    prompt: "Quero isolar o que funcionou na minha copy",
  },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.error) {
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: `Erro: ${data.error}. Verifique se a chave ANTHROPIC_API_KEY esta configurada.`,
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: data.message },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Ops, algo deu errado na conexao. Tente novamente em alguns segundos.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  }

  function handleQuickAction(prompt: string) {
    setInput(prompt);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className="max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <div className="animate-fade-in">
              {/* Hero Welcome */}
              <div className="pt-8 sm:pt-16 pb-10">
                <div className="gradient-hero rounded-2xl p-6 sm:p-8 mb-8">
                  <p
                    className="text-sm font-medium mb-2 tracking-wide uppercase"
                    style={{ color: "var(--accent)" }}
                  >
                    Bem-vindo ao workspace
                  </p>
                  <h2
                    className="text-2xl sm:text-3xl font-bold tracking-tight mb-3"
                    style={{ color: "var(--foreground)" }}
                  >
                    O que vamos analisar hoje?
                  </h2>
                  <p
                    className="text-sm leading-relaxed max-w-md"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Envie um conteudo e eu isolo o DNA de sucesso usando a
                    metodologia V.I.R.A.L. da Prisciane.
                  </p>
                </div>

                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.title}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="group text-left p-4 rounded-xl border card-hover"
                      style={{
                        background: "var(--surface-raised)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors group-hover:bg-[var(--accent)]"
                          style={{
                            background: "var(--surface-light)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <span className="group-hover:text-white transition-colors">
                            {action.icon}
                          </span>
                        </div>
                        <div>
                          <p
                            className="text-sm font-semibold mb-0.5 group-hover:text-[var(--accent)] transition-colors"
                            style={{ color: "var(--foreground)" }}
                          >
                            {action.title}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {action.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Bar */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl border"
                style={{
                  background: "var(--surface-raised)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Pilares
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "var(--accent)" }}>
                      V.I.R.A.L.
                    </p>
                  </div>
                  <div className="w-px h-8" style={{ background: "var(--border)" }} />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Modelo
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      Claude Sonnet
                    </p>
                  </div>
                  <div className="hidden sm:block w-px h-8" style={{ background: "var(--border)" }} />
                  <div className="hidden sm:block">
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Status
                    </p>
                    <p className="text-sm font-semibold text-green-500">
                      Operacional
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Messages */
            <div className="space-y-1 pt-4">
              {messages.map((msg, i) => (
                <div key={i} className="animate-fade-in">
                  {/* Message Row */}
                  <div
                    className="flex gap-3 py-4 px-3 rounded-xl transition-colors"
                    style={{
                      background:
                        msg.role === "assistant"
                          ? "var(--surface-raised)"
                          : "transparent",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold"
                      style={
                        msg.role === "assistant"
                          ? { background: "var(--accent)", color: "#fff" }
                          : {
                              background: "var(--surface-light)",
                              color: "var(--text-secondary)",
                            }
                      }
                    >
                      {msg.role === "assistant" ? "P" : "U"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[11px] font-medium mb-1"
                        style={{
                          color:
                            msg.role === "assistant"
                              ? "var(--accent)"
                              : "var(--text-muted)",
                        }}
                      >
                        {msg.role === "assistant"
                          ? "Prisciane.AI"
                          : "Voce"}
                      </p>
                      <div
                        className="text-sm leading-relaxed whitespace-pre-wrap"
                        style={{ color: "var(--foreground)" }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div className="animate-fade-in">
                  <div
                    className="flex gap-3 py-4 px-3 rounded-xl"
                    style={{ background: "var(--surface-raised)" }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold"
                      style={{ background: "var(--accent)", color: "#fff" }}
                    >
                      P
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-[11px] font-medium mb-2"
                        style={{ color: "var(--accent)" }}
                      >
                        Prisciane.AI
                      </p>
                      <div className="flex gap-1.5 py-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              background: "var(--accent)",
                              animation: `pulse-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div
        className="px-4 sm:px-8 py-4 border-t"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface)",
        }}
      >
        <form
          onSubmit={sendMessage}
          className="max-w-2xl mx-auto"
        >
          <div
            className="flex items-end gap-2 rounded-xl p-2 border-glow"
            style={{ background: "var(--surface-raised)" }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Descreva o conteudo que quer analisar..."
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none disabled:opacity-50"
              style={{
                color: "var(--foreground)",
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 shrink-0"
              style={{
                background: input.trim() ? "var(--accent)" : "var(--surface-light)",
                color: "#fff",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p
            className="text-center text-[11px] mt-2"
            style={{ color: "var(--text-muted)" }}
          >
            Powered by Metodologia V.I.R.A.L. da Prisciane
          </p>
        </form>
      </div>
    </div>
  );
}
