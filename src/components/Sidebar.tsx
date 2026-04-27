"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Conversation {
  id: string;
  messages: Message[];
  preview: string;
  creative_name: string | null;
  is_complete: boolean;
  updated_at: string;
}

interface SidebarProps {
  activePage: "chat" | "metodologia" | "sobre" | "admin";
  onLoadConvo?: (id: string, messages: Message[]) => void;
  onNewChat?: () => void;
  activeConvoId?: string | null;
  refreshKey?: number;
}

interface UserProfile {
  full_name: string | null;
  email: string;
  role: string;
}

export default function Sidebar({
  activePage,
  onLoadConvo,
  onNewChat,
  activeConvoId,
  refreshKey,
}: SidebarProps) {
  const [history, setHistory] = useState<Conversation[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, email, role")
        .eq("id", user.id)
        .single();
      if (prof) setProfile(prof);

      try {
        const res = await fetch("/api/conversations");
        if (res.ok) {
          const data = await res.json();
          setHistory(data.conversations || []);
        }
      } catch {}
    }

    void load();
  }, [refreshKey]);

  function formatDate(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "Agora";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  }

  const isAdmin = profile?.role === "admin";

  return (
    <aside
      className="hidden md:flex flex-col w-[240px] shrink-0 border-r gradient-sidebar"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden glow-pulse shrink-0">
            <Image
              src="/prisciane-avatar.jpg"
              alt="Prisciane.AI"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1
              className="text-sm font-semibold tracking-tight heading-serif"
              style={{ color: "var(--accent-light)" }}
            >
              Prisciane.AI
            </h1>
            <p
              className="text-[10px] tracking-widest uppercase"
              style={{ color: "var(--text-muted)" }}
            >
              Mentora De Bolso
            </p>
          </div>
        </div>
      </div>

      <div className="divider-gold mx-5" />

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {activePage === "chat" ? (
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium"
            style={{ background: "var(--accent-glow)", color: "var(--accent-light)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nova Análise
          </button>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-colors hover:bg-[var(--surface-light)]"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Análise V.I.R.A.L.
          </Link>
        )}
        <Link
          href="/metodologia"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-colors ${activePage === "metodologia" ? "font-medium" : "hover:bg-[var(--surface-light)]"}`}
          style={activePage === "metodologia" ? { background: "var(--accent-glow)", color: "var(--accent-light)" } : { color: "var(--text-muted)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
          </svg>
          Metodologia
        </Link>
        <Link
          href="/sobre"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-colors ${activePage === "sobre" ? "font-medium" : "hover:bg-[var(--surface-light)]"}`}
          style={activePage === "sobre" ? { background: "var(--accent-glow)", color: "var(--accent-light)" } : { color: "var(--text-muted)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
          </svg>
          Sobre
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-colors ${activePage === "admin" ? "font-medium" : "hover:bg-[var(--surface-light)]"}`}
            style={activePage === "admin" ? { background: "var(--accent-glow)", color: "var(--accent-light)" } : { color: "var(--text-muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="m2 17 10 5 10-5" /><path d="m2 12 10 5 10-5" />
            </svg>
            Painel Admin
          </Link>
        )}
      </nav>

      {/* History */}
      {history.length > 0 && (
        <>
          <div className="divider-gold mx-5" />
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <p className="px-4 text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-muted)" }}>
              Histórico
            </p>
            <div className="space-y-0.5">
              {history.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => {
                    if (onLoadConvo) {
                      onLoadConvo(convo.id, convo.messages);
                    } else {
                      window.location.href = "/";
                    }
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-[12px] transition-colors hover:bg-[var(--surface-light)] truncate ${
                    activeConvoId === convo.id ? "bg-[var(--surface-light)]" : ""
                  }`}
                  style={{ color: activeConvoId === convo.id ? "var(--accent-light)" : "var(--text-muted)" }}
                >
                  <span className="block truncate">{convo.creative_name || convo.preview}</span>
                  <span className="text-[10px] opacity-50">{formatDate(convo.updated_at)}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="px-5 py-4">
        <div className="divider-gold mb-3" />
        {profile && (
          <div className="mb-3">
            <p className="text-[11px] font-medium truncate" style={{ color: "var(--foreground)" }}>
              {profile.full_name || profile.email}
            </p>
            <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
              {profile.email}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Online</span>
          </div>
          <a
            href="/logout"
            className="text-[11px] hover:underline"
            style={{ color: "var(--text-muted)" }}
          >
            Sair
          </a>
        </div>
      </div>
    </aside>
  );
}
