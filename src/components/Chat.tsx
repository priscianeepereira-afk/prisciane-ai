"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

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

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">&#x1f9e0;</div>
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--accent)" }}
              >
                Prisciane.AI
              </h2>
              <p className="text-gray-400 mb-8">Sua Mentora De Bolso</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {[
                  "Quero analisar um Reels que viralizou",
                  "Tenho um anuncio que converteu bem",
                  "Preciso entender o DNA de uma live",
                  "Quero isolar o que funcionou na minha copy",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-left text-sm p-3 rounded-lg border transition-all hover:border-[var(--accent)] hover:bg-[var(--surface-light)]"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 animate-fade-in ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                  style={{
                    background: "var(--accent)",
                    color: "var(--background)",
                  }}
                >
                  P
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[var(--accent)] text-black rounded-br-sm"
                    : "bg-[var(--surface-light)] text-[var(--foreground)] rounded-bl-sm"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm"
                  style={{
                    background: "var(--surface-light)",
                    color: "var(--foreground)",
                  }}
                >
                  U
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                style={{
                  background: "var(--accent)",
                  color: "var(--background)",
                }}
              >
                P
              </div>
              <div className="bg-[var(--surface-light)] rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: "var(--accent)",
                      animationDelay: "0ms",
                    }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: "var(--accent)",
                      animationDelay: "150ms",
                    }}
                  />
                  <span
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      background: "var(--accent)",
                      animationDelay: "300ms",
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div
        className="border-t p-4"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <form
          onSubmit={sendMessage}
          className="max-w-3xl mx-auto flex gap-3 items-end"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Manda a parada pra eu analisar..."
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl px-4 py-3 text-sm outline-none placeholder-gray-500 disabled:opacity-50"
            style={{
              background: "var(--surface-light)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110"
            style={{
              background: "var(--accent)",
              color: "var(--background)",
            }}
          >
            Enviar
          </button>
        </form>
        <p className="text-center text-xs text-gray-600 mt-2 max-w-3xl mx-auto">
          Prisciane.AI e uma ferramenta de demonstracao tecnica. Nao substitui a
          mentoria profunda da Prisciane.
        </p>
      </div>
    </div>
  );
}
