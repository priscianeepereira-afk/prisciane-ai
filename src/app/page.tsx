"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import Chat, { getHistory } from "@/components/Chat";

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

export default function Home() {
  const [history, setHistory] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
  const [chatKey, setChatKey] = useState(0);

  const refreshHistory = useCallback(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  function startNew() {
    setActiveConvo(null);
    setChatKey((k) => k + 1);
  }

  function loadConvo(convo: Conversation) {
    setActiveConvo(convo);
    setChatKey((k) => k + 1);
  }

  function formatDate(ts: number) {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Agora";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] shrink-0 border-r gradient-sidebar" style={{ borderColor: "var(--border)" }}>
        {/* Logo */}
        <div className="px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden glow-pulse shrink-0">
              <Image src="/prisciane-avatar.jpg" alt="Prisciane.AI" width={40} height={40} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight heading-serif" style={{ color: "var(--accent-light)" }}>
                Prisciane.AI
              </h1>
              <p className="text-[10px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                Mentora De Bolso
              </p>
            </div>
          </div>
        </div>

        <div className="shimmer-line mx-5" />

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1">
          <button
            onClick={startNew}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium"
            style={{ background: "var(--accent-glow)", color: "var(--accent-light)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nova Análise
          </button>
          <Link
            href="/metodologia"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-colors hover:bg-[var(--surface-light)]"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/>
            </svg>
            Metodologia
          </Link>
          <Link
            href="/sobre"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-colors hover:bg-[var(--surface-light)]"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
            Sobre
          </Link>
        </nav>

        {/* History */}
        {history.length > 0 && (
          <>
            <div className="shimmer-line mx-5" />
            <div className="flex-1 overflow-y-auto px-3 py-3">
              <p className="px-4 text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-muted)" }}>
                Histórico
              </p>
              <div className="space-y-0.5">
                {history.map((convo) => (
                  <button
                    key={convo.id}
                    onClick={() => loadConvo(convo)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-[12px] transition-colors hover:bg-[var(--surface-light)] truncate ${
                      activeConvo?.id === convo.id ? "bg-[var(--surface-light)]" : ""
                    }`}
                    style={{ color: activeConvo?.id === convo.id ? "var(--accent-light)" : "var(--text-muted)" }}
                  >
                    <span className="block truncate">{convo.preview}</span>
                    <span className="text-[10px] opacity-50">{formatDate(convo.timestamp)}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="px-5 py-4">
          <div className="shimmer-line mb-4" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Agente operacional</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 gradient-warm watermark-bg">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b shrink-0" style={{ borderColor: "var(--border)", background: "rgba(10, 8, 6, 0.8)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 rounded-lg overflow-hidden shrink-0">
              <Image src="/prisciane-avatar.jpg" alt="Prisciane.AI" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <span style={{ color: "var(--text-muted)" }}>Prisciane.AI</span>
              <span style={{ color: "var(--border-light)" }}>/</span>
              <span className="font-medium" style={{ color: "var(--accent-light)" }}>
                {activeConvo ? "Histórico" : "Análise V.I.R.A.L."}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeConvo && (
              <button
                onClick={startNew}
                className="px-3 py-1 rounded-lg text-[11px] font-medium transition-all hover:brightness-110"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Nova Análise
              </button>
            )}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "var(--surface-light)", border: "1px solid var(--border)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Online</span>
            </div>
          </div>
        </header>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <Chat
            key={chatKey}
            initialMessages={activeConvo?.messages}
            readOnly={!!activeConvo}
            onConversationUpdate={refreshHistory}
          />
        </div>
      </main>
    </div>
  );
}
