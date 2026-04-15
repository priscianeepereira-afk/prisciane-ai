"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { jsPDF } from "jspdf";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  timestamp: number;
  messages: Message[];
  preview: string;
}

const STORAGE_KEY = "prisciane-ai-history";
const MAX_HISTORY = 20;

function saveConversation(messages: Message[]) {
  if (messages.length < 2) return;
  try {
    const history: Conversation[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );
    const firstUserMsg = messages.find((m) => m.role === "user");
    const preview = firstUserMsg
      ? firstUserMsg.content.slice(0, 60) + (firstUserMsg.content.length > 60 ? "..." : "")
      : "Análise";
    const id = Date.now().toString();
    const existing = history.findIndex(
      (c) => c.messages.length > 0 && c.messages[0].content === messages[0]?.content
    );
    if (existing >= 0) {
      history[existing] = { id: history[existing].id, timestamp: Date.now(), messages, preview };
    } else {
      history.unshift({ id, timestamp: Date.now(), messages, preview });
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(history.slice(0, MAX_HISTORY))
    );
  } catch {}
}

export function getHistory(): Conversation[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function isAnalysisComplete(messages: Message[]): boolean {
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  if (!lastAssistant) return false;
  const text = lastAssistant.content.toUpperCase();
  return (
    (text.includes("BLOCOS DE PERSUAS") || text.includes("BLOCO DE PERSUAS")) &&
    (text.includes("PONTOS FORTES") || text.includes("PONTO FORTE")) &&
    text.includes("VIRALIZA")
  );
}

function getAnalysisContent(messages: Message[]): { content: string; name: string } {
  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const content = lastAssistant?.content || "";
  const nameMatch = content.match(/NOME DO CRIATIVO:\s*(.+)/i);
  const name = nameMatch ? nameMatch[1].trim() : "Análise de Criativo";
  return { content, name };
}

function generateTXT(messages: Message[]): void {
  const date = new Date().toLocaleDateString("pt-BR");
  const { content, name } = getAnalysisContent(messages);
  let text = `ANÁLISE V.I.R.A.L. — Prisciane.AI\n`;
  text += `Criativo: ${name}\n`;
  text += `Data: ${date}\n`;
  text += "=".repeat(50) + "\n\n";
  text += content;
  text += "\n\n" + "=".repeat(50);
  text += "\nPowered by Metodologia V.I.R.A.L. da Prisciane";
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const slug = name.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  a.download = `analise-${slug}-${date.replace(/\//g, "-")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

async function loadImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function addWatermark(doc: jsPDF, imgData: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  // Proporção A4 (210x297), ocupa a página toda
  const wmWidth = pageWidth;
  const wmHeight = pageHeight;
  const x = 0;
  const y = 0;

  // @ts-expect-error - jsPDF GState
  const gState = new doc.GState({ opacity: 0.09 });
  doc.saveGraphicsState();
  doc.setGState(gState);
  doc.addImage(imgData, "PNG", x, y, wmWidth, wmHeight);
  doc.restoreGraphicsState();
}

async function generatePDF(messages: Message[]): Promise<void> {
  const date = new Date().toLocaleDateString("pt-BR");
  const { content, name } = getAnalysisContent(messages);
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 25;

  // Load images
  let imgMarcaDagua = "";
  let imgCirculo = "";
  try {
    imgMarcaDagua = await loadImageAsBase64("/marcadagia.png");
    imgCirculo = await loadImageAsBase64("/circulo-semfundo.png");
  } catch {}

  // Watermark on first page
  if (imgMarcaDagua) addWatermark(doc, imgMarcaDagua);

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("ANALISE V.I.R.A.L.", margin, y);
  y += 8;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(178, 81, 27);
  doc.text(name, margin, y);
  y += 7;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text(`Prisciane.AI  |  ${date}`, margin, y);
  y += 5;
  doc.setDrawColor(178, 81, 27);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  // Content
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30);
  doc.setFontSize(10);
  const lines = doc.splitTextToSize(content, maxWidth);
  lines.forEach((line: string) => {
    if (y > 265) {
      doc.addPage();
      if (imgMarcaDagua) addWatermark(doc, imgMarcaDagua);
      y = 20;
    }
    doc.text(line, margin, y);
    y += 5;
  });

  // Signature section
  if (y > 230) {
    doc.addPage();
    if (imgMarcaDagua) addWatermark(doc, imgMarcaDagua);
    y = 20;
  }

  y += 15;
  doc.setDrawColor(178, 81, 27);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  // "mas lembre-se:"
  doc.setFontSize(11);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(178, 81, 27);
  doc.text("mas lembre-se:", pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  const reminder = "O agente entrega o DNA mastigado. A inteligencia de transposicao e sua.";
  doc.text(reminder, pageWidth / 2, y, { align: "center" });
  y += 12;

  // Seal - circular image (proporção real 1080x1350)
  if (imgCirculo) {
    const sealWidth = 28;
    const sealHeight = sealWidth * 1.25;
    const sealX = (pageWidth - sealWidth) / 2;
    y += 2;
    doc.addImage(imgCirculo, "PNG", sealX, y, sealWidth, sealHeight);
    y += sealHeight + 4;
  }

  // Prisciane name under seal
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(180);
  doc.text("PRISCIANE", pageWidth / 2, y, { align: "center" });
  y += 3;
  doc.setFontSize(6);
  doc.setFont("helvetica", "normal");
  doc.text("Metodologia V.I.R.A.L.", pageWidth / 2, y, { align: "center" });

  // Footer on last page
  doc.setFontSize(7);
  doc.setTextColor(180);
  doc.text("Powered by Prisciane.AI", pageWidth / 2, 292, { align: "center" });

  const slug = name.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
  doc.save(`analise-${slug}-${date.replace(/\//g, "-")}.pdf`);
}

const QUICK_ACTIONS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    title: "Analisar Reels",
    desc: "Identificar o DNA de um Reels viral",
    prompt: "Quero analisar um Reels que viralizou",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: "Analisar Criativo",
    desc: "Extrair o que converte no anúncio",
    prompt: "Tenho um anúncio que converteu bem",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
      </svg>
    ),
    title: "Analisar Live",
    desc: "Entender o DNA de uma live de sucesso",
    prompt: "Preciso entender o DNA de uma live",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
      </svg>
    ),
    title: "Isolar Copy",
    desc: "Separar os blocos de persuasão",
    prompt: "Quero isolar o que funcionou na minha copy",
  },
];

interface ParsedOption {
  pergunta: string;
  opcoes: string[];
}

function parseOptionsBlocks(text: string): { parts: (string | ParsedOption)[] } {
  const parts: (string | ParsedOption)[] = [];
  const regex = /\[OPCOES\]\s*\n([\s\S]*?)\[\/OPCOES\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index).trim();
      if (before) parts.push(before);
    }
    const block = match[1].trim();
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const perguntaLine = lines.find((l) => l.startsWith("pergunta:"));
    const pergunta = perguntaLine ? perguntaLine.replace("pergunta:", "").trim() : "";
    const opcoes = lines
      .filter((l) => /^\d+:/.test(l))
      .map((l) => l.replace(/^\d+:\s*/, "").trim());
    parts.push({ pergunta, opcoes });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex).trim();
    if (remaining) parts.push(remaining);
  }

  return { parts };
}

function OptionButtons({
  pergunta,
  opcoes,
  onSelect,
  disabled,
}: {
  pergunta: string;
  opcoes: string[];
  onSelect: (val: string) => void;
  disabled: boolean;
}) {
  const [otherValue, setOtherValue] = useState("");
  const [showOther, setShowOther] = useState(false);

  return (
    <div className="my-3">
      {pergunta && (
        <p className="text-[13px] font-medium mb-2.5" style={{ color: "var(--foreground)" }}>
          {pergunta}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {opcoes.map((op) => (
          <button
            key={op}
            onClick={() => !disabled && onSelect(op)}
            disabled={disabled}
            className="px-4 py-2 rounded-xl text-[12px] font-medium transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "var(--surface-light)",
              color: "var(--accent-light)",
              border: "1px solid var(--border-light)",
            }}
          >
            {op}
          </button>
        ))}
        {!disabled && (
          <button
            onClick={() => setShowOther(!showOther)}
            className="px-4 py-2 rounded-xl text-[12px] transition-all"
            style={{
              background: "transparent",
              color: "var(--text-muted)",
              border: "1px dashed var(--border-light)",
            }}
          >
            Outro
          </button>
        )}
      </div>
      {showOther && !disabled && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
            placeholder="Digite sua resposta..."
            className="flex-1 px-3 py-2 rounded-xl text-[12px] outline-none"
            style={{
              background: "var(--surface-light)",
              color: "var(--foreground)",
              border: "1px solid var(--border-light)",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && otherValue.trim()) {
                onSelect(otherValue.trim());
              }
            }}
          />
          <button
            onClick={() => otherValue.trim() && onSelect(otherValue.trim())}
            className="px-3 py-2 rounded-xl text-[12px] font-medium"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Enviar
          </button>
        </div>
      )}
    </div>
  );
}

interface ChatProps {
  initialMessages?: Message[];
  readOnly?: boolean;
  onConversationUpdate?: () => void;
}

export default function Chat({ initialMessages, readOnly, onConversationUpdate }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
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

  const saveAndNotify = useCallback((msgs: Message[]) => {
    saveConversation(msgs);
    onConversationUpdate?.();
  }, [onConversationUpdate]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading || readOnly) return;

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
        const errMsgs = [
          ...newMessages,
          {
            role: "assistant" as const,
            content: `Erro: ${data.error}. Verifique se a chave ANTHROPIC_API_KEY está configurada.`,
          },
        ];
        setMessages(errMsgs);
      } else {
        const finalMsgs = [
          ...newMessages,
          { role: "assistant" as const, content: data.message },
        ];
        setMessages(finalMsgs);
        saveAndNotify(finalMsgs);
      }
    } catch {
      const errMsgs = [
        ...newMessages,
        {
          role: "assistant" as const,
          content: "Ops, algo deu errado na conexão. Tente novamente em alguns segundos.",
        },
      ];
      setMessages(errMsgs);
    } finally {
      setIsLoading(false);
    }
  }

  function handleQuickAction(prompt: string) {
    setInput(prompt);
  }

  const analysisReady = isAnalysisComplete(messages);

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className="max-w-2xl mx-auto">
          {messages.length === 0 ? (
            <div className="animate-fade-in particles">
              {/* Hero */}
              <div className="pt-10 sm:pt-20 pb-12 text-center">
                <div className="mb-10">
                  <p
                    className="text-[11px] font-medium mb-4 tracking-[0.25em] uppercase"
                    style={{ color: "var(--accent)" }}
                  >
                    Metodologia V.I.R.A.L.
                  </p>
                  <h2
                    className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 heading-serif"
                    style={{ color: "var(--foreground)" }}
                  >
                    O que vamos{" "}
                    <span className="text-gold italic">analisar</span>{" "}
                    hoje?
                  </h2>
                  <p
                    className="text-sm leading-relaxed max-w-md mx-auto"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Envie seu conteúdo para extrairmos os pontos fortes dele e produzir Criativos Virais capazes de triplicar seu ROAS
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-left">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.title}
                      onClick={() => handleQuickAction(action.prompt)}
                      className="group p-3 sm:p-4 rounded-xl sm:rounded-2xl card-luxury"
                    >
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3.5">
                        <div
                          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-[var(--accent)] group-hover:text-white"
                          style={{
                            background: "var(--surface-light)",
                            color: "var(--text-muted)",
                          }}
                        >
                          {action.icon}
                        </div>
                        <div className="text-center sm:text-left">
                          <p
                            className="text-[12px] sm:text-[13px] font-medium mb-0.5 transition-colors group-hover:text-[var(--accent-light)]"
                            style={{ color: "var(--foreground)" }}
                          >
                            {action.title}
                          </p>
                          <p className="text-[10px] sm:text-[11px] hidden sm:block" style={{ color: "var(--text-muted)" }}>
                            {action.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Messages */
            <div className="space-y-1 pt-4">
              {messages.map((msg, i) => (
                <div key={i} className="animate-fade-in">
                  <div
                    className="flex gap-3.5 py-5 px-4 rounded-2xl transition-colors"
                    style={{
                      background: msg.role === "assistant" ? "rgba(20, 18, 16, 0.6)" : "transparent",
                    }}
                  >
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                      {msg.role === "assistant" ? (
                        <Image src="/prisciane-avatar.jpg" alt="P" width={28} height={28} className="w-full h-full object-cover" />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-[10px] font-semibold"
                          style={{ background: "var(--surface-light)", color: "var(--text-secondary)" }}
                        >
                          U
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[11px] font-medium mb-1.5 tracking-wide"
                        style={{
                          color: msg.role === "assistant" ? "var(--accent)" : "var(--text-muted)",
                        }}
                      >
                        {msg.role === "assistant" ? "Prisciane.AI" : "Você"}
                      </p>
                      <div className="text-[13px] leading-[1.7]" style={{ color: "var(--foreground)" }}>
                        {msg.role === "assistant" ? (
                          (() => {
                            const { parts } = parseOptionsBlocks(msg.content);
                            return parts.map((part, pi) =>
                              typeof part === "string" ? (
                                <span key={pi} className="whitespace-pre-wrap">{part}</span>
                              ) : (
                                <OptionButtons
                                  key={pi}
                                  pergunta={part.pergunta}
                                  opcoes={part.opcoes}
                                  onSelect={(val) => {
                                    if (!readOnly) {
                                      setInput(val);
                                      setTimeout(() => {
                                        const form = document.querySelector("form");
                                        if (form) form.requestSubmit();
                                      }, 100);
                                    }
                                  }}
                                  disabled={readOnly || i < messages.length - 1}
                                />
                              )
                            );
                          })()
                        ) : (
                          <span className="whitespace-pre-wrap">{msg.content}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Divider between messages */}
                  {i < messages.length - 1 && (
                    <div className="divider-gold my-1 mx-4" />
                  )}
                </div>
              ))}

              {/* Download buttons - only after full analysis */}
              {analysisReady && !isLoading && (
                <>
                  <div className="flex items-center gap-3 px-4 pt-3 animate-fade-in">
                    <button
                      onClick={() => generatePDF(messages)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:brightness-110"
                      style={{ background: "var(--surface-light)", color: "var(--accent-light)", border: "1px solid var(--border)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                      </svg>
                      Baixar PDF
                    </button>
                    <button
                      onClick={() => generateTXT(messages)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:brightness-110"
                      style={{ background: "var(--surface-light)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Baixar TXT
                    </button>
                  </div>
                  <div className="px-4 pt-4 pb-2">
                    <div className="divider-gold mb-4" />
                    <p className="text-center text-[11px] italic" style={{ color: "var(--text-muted)" }}>
                      Análise concluída. Baixe seu diagnóstico e inicie uma nova análise quando quiser.
                    </p>
                  </div>
                </>
              )}

              {/* Loading */}
              {isLoading && (
                <div className="animate-fade-in">
                  <div className="flex gap-3.5 py-5 px-4 rounded-2xl" style={{ background: "rgba(20, 18, 16, 0.6)" }}>
                    <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                      <Image src="/prisciane-avatar.jpg" alt="P" width={28} height={28} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[11px] font-medium mb-2 tracking-wide" style={{ color: "var(--accent)" }}>
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
      {!readOnly && !analysisReady && (
        <div className="px-4 sm:px-8 py-4" style={{ background: "rgba(10, 8, 6, 0.9)", backdropFilter: "blur(12px)" }}>
          <div className="shimmer-line mb-4 max-w-2xl mx-auto" />
          <form onSubmit={sendMessage} className="max-w-2xl mx-auto">
            <div className="flex items-end gap-2 rounded-2xl p-2 input-luxury" style={{ background: "var(--surface-raised)" }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Descreva o conteúdo que quer analisar..."
                rows={1}
                disabled={isLoading}
                className="flex-1 resize-none bg-transparent px-3 py-2 text-[13px] outline-none disabled:opacity-50"
                style={{ color: "var(--foreground)" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl transition-all duration-300 disabled:opacity-15 disabled:cursor-not-allowed hover:brightness-110 shrink-0"
                style={{
                  background: input.trim() ? "var(--accent)" : "var(--surface-light)",
                  color: "#fff",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-center text-[10px] mt-2.5 tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
              Metodologia V.I.R.A.L. da Prisciane
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
