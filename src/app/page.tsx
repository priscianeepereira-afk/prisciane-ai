import Image from "next/image";
import Link from "next/link";
import Chat from "@/components/Chat";

export default function Home() {
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
        <nav className="flex-1 px-3 py-6 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium"
            style={{ background: "var(--accent-glow)", color: "var(--accent-light)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Analise V.I.R.A.L.
          </Link>
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
            href="#"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-colors hover:bg-[var(--surface-light)]"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
            Sobre
          </Link>
        </nav>

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
      <main className="flex-1 flex flex-col min-w-0 gradient-warm">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b shrink-0" style={{ borderColor: "var(--border)", background: "rgba(10, 8, 6, 0.8)", backdropFilter: "blur(12px)" }}>
          <div className="flex items-center gap-3">
            <div className="md:hidden w-8 h-8 rounded-lg overflow-hidden shrink-0">
              <Image src="/prisciane-avatar.jpg" alt="Prisciane.AI" width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <span style={{ color: "var(--text-muted)" }}>Prisciane.AI</span>
              <span style={{ color: "var(--border-light)" }}>/</span>
              <span className="font-medium" style={{ color: "var(--accent-light)" }}>Analise V.I.R.A.L.</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: "var(--surface-light)", border: "1px solid var(--border)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Online</span>
          </div>
        </header>

        {/* Chat */}
        <div className="flex-1 overflow-hidden">
          <Chat />
        </div>
      </main>
    </div>
  );
}
