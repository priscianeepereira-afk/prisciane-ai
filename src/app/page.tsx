import Chat from "@/components/Chat";

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-3 border-b shrink-0"
        style={{
          borderColor: "var(--border)",
          background: "var(--surface)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg glow-pulse"
            style={{
              background: "var(--accent)",
              color: "var(--background)",
            }}
          >
            P
          </div>
          <div>
            <h1 className="text-sm font-bold" style={{ color: "var(--accent)" }}>
              Prisciane.AI
            </h1>
            <p className="text-xs text-gray-500">Sua Mentora De Bolso</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-gray-500">Online</span>
        </div>
      </header>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <Chat />
      </div>
    </main>
  );
}
