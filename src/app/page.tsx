"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import Chat from "@/components/Chat";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [activeMessages, setActiveMessages] = useState<Message[] | undefined>(undefined);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [readOnly, setReadOnly] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const [sidebarKey, setSidebarKey] = useState(0);

  const refreshSidebar = useCallback(() => {
    setSidebarKey((k) => k + 1);
  }, []);

  function startNew() {
    setActiveMessages(undefined);
    setActiveConvoId(null);
    setReadOnly(false);
    setChatKey((k) => k + 1);
  }

  function loadConvo(id: string, messages: Message[]) {
    setActiveMessages(messages);
    setActiveConvoId(id);
    setReadOnly(true);
    setChatKey((k) => k + 1);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activePage="chat"
        onNewChat={startNew}
        onLoadConvo={loadConvo}
        activeConvoId={activeConvoId}
        refreshKey={sidebarKey}
      />

      <main className="flex-1 flex flex-col min-w-0 gradient-warm watermark-bg">
        <header
          className="flex items-center justify-between px-6 py-3 border-b shrink-0"
          style={{ borderColor: "var(--border)", background: "rgba(10, 8, 6, 0.8)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 rounded-lg overflow-hidden shrink-0">
              <Image
                src="/prisciane-avatar.jpg"
                alt="Prisciane.AI"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <span style={{ color: "var(--text-muted)" }}>Prisciane.AI</span>
              <span style={{ color: "var(--border-light)" }}>/</span>
              <span className="font-medium" style={{ color: "var(--accent-light)" }}>
                {readOnly ? "Histórico" : "Análise V.I.R.A.L."}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {readOnly && (
              <button
                onClick={startNew}
                className="px-3 py-1 rounded-lg text-[11px] font-medium transition-all hover:brightness-110 btn-gradient"
                style={{ color: "#fff" }}
              >
                Nova Análise
              </button>
            )}
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full"
              style={{ background: "var(--surface-light)", border: "1px solid var(--border)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Online</span>
            </div>
          </div>
        </header>
        <MobileNav activePage="chat" />

        <div className="flex-1 overflow-hidden">
          <Chat
            key={chatKey}
            initialMessages={activeMessages}
            initialConversationId={activeConvoId}
            readOnly={readOnly}
            onConversationUpdate={refreshSidebar}
          />
        </div>
      </main>
    </div>
  );
}
