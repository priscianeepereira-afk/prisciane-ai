"use client";

import { useState, useRef, useEffect } from "react";

interface QA {
  question: string;
  answer: string;
  timestamp: number;
}

const SUGGESTIONS = [
  "Qual a maior dor recorrente nas análises dos usuários?",
  "Qual perfil de usuário mais usa a ferramenta?",
  "Quais nichos são mais analisados?",
  "Que tipo de criativo as pessoas mais querem analisar?",
  "Quais são as dúvidas ou objeções mais comuns?",
  "Quem são os usuários que mais usam a plataforma?",
];

export default function InsightsClient() {
  const [history, setHistory] = useState<QA[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (data.error) {
        setHistory((h) => [
          ...h,
          { question, answer: `Erro: ${data.error}`, timestamp: Date.now() },
        ]);
      } else {
        setHistory((h) => [
          ...h,
          { question, answer: data.answer || "", timestamp: Date.now() },
        ]);
      }
    } catch {
      setHistory((h) => [
        ...h,
        {
          question,
          answer: "Erro de conexão. Tente novamente.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function pickSuggestion(s: string) {
    setInput(s);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {history.length === 0 && !isLoading ? (
            <div className="animate-fade-in">
              <div className="mb-8">
                <p
                  className="text-[11px] font-medium mb-2 tracking-[0.25em] uppercase"
                  style={{ color: "var(--accent)" }}
                >
                  Análise de uso
                </p>
                <h2
                  className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2 heading-serif"
                  style={{ color: "var(--foreground)" }}
                >
                  Insights da{" "}
                  <span className="text-peach italic">plataforma</span>
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Faça perguntas sobre o comportamento dos usuários. A IA analisa todas as conversas e responde com base nos dados reais.
                </p>
              </div>

              <p className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: "var(--text-muted)" }}>
                Sugestões
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => pickSuggestion(s)}
                    className="text-left p-3 rounded-xl card-luxury text-[12px]"
                    style={{ color: "var(--foreground)" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {history.map((qa, i) => (
                <div key={i} className="animate-fade-in">
                  <div className="mb-2">
                    <p
                      className="text-[10px] tracking-[0.2em] uppercase mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Você perguntou
                    </p>
                    <p className="text-[14px] font-medium" style={{ color: "var(--foreground)" }}>
                      {qa.question}
                    </p>
                  </div>
                  <div
                    className="p-5 rounded-2xl"
                    style={{ background: "rgba(21, 7, 16, 0.6)" }}
                  >
                    <p
                      className="text-[10px] tracking-[0.2em] uppercase mb-2"
                      style={{ color: "var(--accent)" }}
                    >
                      Análise
                    </p>
                    <div
                      className="text-[13px] leading-[1.7] whitespace-pre-wrap"
                      style={{ color: "var(--foreground)" }}
                    >
                      {qa.answer}
                    </div>
                  </div>
                  {i < history.length - 1 && <div className="divider-gold mt-4" />}
                </div>
              ))}
              {isLoading && (
                <div className="animate-fade-in p-5 rounded-2xl" style={{ background: "rgba(21, 7, 16, 0.6)" }}>
                  <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--accent)" }}>
                    Análise
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
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>
      </div>

      <div
        className="px-4 sm:px-8 py-4"
        style={{
          background: "rgba(13, 3, 11, 0.9)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="shimmer-line mb-4 max-w-2xl mx-auto" />
        <form onSubmit={ask} className="max-w-2xl mx-auto">
          <div
            className="flex items-end gap-2 rounded-2xl p-2 input-luxury"
            style={{ background: "var(--surface-raised)" }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Faça uma pergunta sobre os usuários e suas conversas..."
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none bg-transparent px-3 py-2 text-[13px] outline-none disabled:opacity-50"
              style={{ color: "var(--foreground)" }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl transition-all duration-300 disabled:opacity-15 disabled:cursor-not-allowed hover:brightness-110 shrink-0 btn-gradient"
              style={{ color: "#fff" }}
            >
              <svg
                width="14"
                height="14"
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
            className="text-center text-[10px] mt-2.5 tracking-widest uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Insights baseados em conversas reais
          </p>
        </form>
      </div>
    </div>
  );
}
