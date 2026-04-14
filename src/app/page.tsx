import Image from "next/image";
import Chat from "@/components/Chat";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-[260px] shrink-0 border-r"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: "var(--border)" }}>
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
              <h1 className="text-sm font-semibold tracking-tight" style={{ color: "#fff" }}>
                Prisciane.AI
              </h1>
              <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                Sua Mentora De Bolso
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: "var(--accent-glow)",
              color: "var(--accent)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Analise V.I.R.A.L.
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-[var(--surface-light)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20V10"/>
              <path d="M18 20V4"/>
              <path d="M6 20v-4"/>
            </svg>
            Metodologia
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-[var(--surface-light)]"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
            Sobre
          </a>
        </nav>

        {/* Footer / Status */}
        <div
          className="px-5 py-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div className="relative status-online">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold"
                style={{
                  background: "var(--surface-light)",
                  color: "var(--text-secondary)",
                }}
              >
                AI
              </div>
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
                Agente Ativo
              </p>
              <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Modelo Claude Sonnet
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header
          className="flex items-center justify-between px-6 py-3 border-b shrink-0"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile logo */}
            <div className="md:hidden w-8 h-8 rounded-lg overflow-hidden shrink-0">
              <Image
                src="/prisciane-avatar.jpg"
                alt="Prisciane.AI"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: "var(--text-muted)" }}>Workspace</span>
              <span style={{ color: "var(--text-muted)" }}>/</span>
              <span className="font-medium" style={{ color: "var(--foreground)" }}>
                Analise V.I.R.A.L.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "var(--surface-light)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Online</span>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <Chat />
        </div>
      </main>
    </div>
  );
}
