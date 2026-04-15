import Image from "next/image";
import Link from "next/link";

export default function Sobre() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-[240px] shrink-0 border-r gradient-sidebar"
        style={{ borderColor: "var(--border)" }}
      >
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
        <nav className="flex-1 px-3 py-6 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-colors hover:bg-[var(--surface-light)]"
            style={{ color: "var(--text-muted)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Análise V.I.R.A.L.
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
            href="/sobre"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium"
            style={{ background: "var(--accent-glow)", color: "var(--accent-light)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
            </svg>
            Sobre
          </Link>
        </nav>
        <div className="px-5 py-4">
          <div className="shimmer-line mb-4" />
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>Agente operacional</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 gradient-warm watermark-bg">
        <header
          className="flex items-center justify-between px-6 py-3 border-b shrink-0"
          style={{ borderColor: "var(--border)", background: "rgba(10, 8, 6, 0.8)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-2 text-[13px]">
            <Link href="/" className="hover:underline" style={{ color: "var(--text-muted)" }}>Prisciane.AI</Link>
            <span style={{ color: "var(--border-light)" }}>/</span>
            <span className="font-medium" style={{ color: "var(--accent-light)" }}>Sobre</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
          <div className="max-w-2xl mx-auto animate-fade-in">
            {/* Hero */}
            <div className="gradient-hero rounded-3xl p-8 sm:p-10 mb-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden glow-pulse shrink-0">
                  <Image src="/prisciane-avatar.jpg" alt="Prisciane" width={80} height={80} className="w-full h-full object-cover" />
                </div>
                <div className="text-center sm:text-left">
                  <p
                    className="text-[11px] font-medium mb-2 tracking-[0.25em] uppercase"
                    style={{ color: "var(--accent)" }}
                  >
                    Conheça
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2 heading-serif" style={{ color: "var(--foreground)" }}>
                    Prisciane<span className="text-gold italic">.AI</span>
                  </h2>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Sua Mentora De Bolso
                  </p>
                </div>
              </div>
            </div>

            {/* Quem é a Prisciane */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 rounded-full" style={{ background: "var(--accent)" }} />
                <h3 className="text-lg font-semibold heading-serif" style={{ color: "var(--foreground)" }}>
                  Quem é a Prisciane
                </h3>
              </div>
              <div
                className="p-6 rounded-2xl card-luxury space-y-4"
              >
                <p className="text-[13px] leading-[1.8]" style={{ color: "var(--text-secondary)" }}>
                  Estrategista de criativos virais, Prisciane desenvolveu um processo próprio capaz de replicar resultados de alta performance de forma consistente. Sua metodologia nasceu da prática: analisando seus próprios dados, identificando padrões e isolando o DNA do que realmente funciona em criativos que vendem.
                </p>
                <p className="text-[13px] leading-[1.8]" style={{ color: "var(--text-secondary)" }}>
                  Sua abordagem é direta: sem achismo, sem copiar concorrente, sem depender de sorte. Tudo se resume a processo.
                </p>
              </div>
            </div>

            <div className="divider-gold my-8" />

            {/* O que é a Prisciane.AI */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 rounded-full" style={{ background: "var(--accent)" }} />
                <h3 className="text-lg font-semibold heading-serif" style={{ color: "var(--foreground)" }}>
                  O que é a Prisciane.AI
                </h3>
              </div>
              <div
                className="p-6 rounded-2xl card-luxury space-y-4"
              >
                <p className="text-[13px] leading-[1.8]" style={{ color: "var(--text-secondary)" }}>
                  A Prisciane.AI é o braço direito digital da Prisciane. Uma ferramenta que aplica a Metodologia V.I.R.A.L. para analisar seus conteúdos (Reels, Anúncios, Lives, Bônus) e isolar os pontos fortes que realmente fizeram a copy funcionar.
                </p>
                <p className="text-[14px] font-medium heading-serif italic" style={{ color: "var(--accent-light)" }}>
                  Ela entrega o DNA mastigado. Você decide o formato.
                </p>
              </div>
            </div>

            <div className="divider-gold my-8" />

            {/* Pra quem é */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 rounded-full" style={{ background: "var(--accent)" }} />
                <h3 className="text-lg font-semibold heading-serif" style={{ color: "var(--foreground)" }}>
                  Para quem é
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  {
                    perfil: "Estrategistas",
                    desc: "Que precisam de clareza para escalar criativos com segurança.",
                  },
                  {
                    perfil: "Copywriters",
                    desc: "Que querem isolar blocos de persuasão vencedores e replicar o que funciona.",
                  },
                  {
                    perfil: "Experts",
                    desc: "Que precisam entender o que gravar para acertar como sniper.",
                  },
                ].map((item) => (
                  <div key={item.perfil} className="p-5 rounded-2xl card-luxury">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ background: "var(--accent)" }}
                      />
                      <div>
                        <p className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--foreground)" }}>
                          {item.perfil}
                        </p>
                        <p className="text-[12px]" style={{ color: "var(--text-secondary)" }}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold transition-all hover:brightness-110"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Iniciar Análise
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
