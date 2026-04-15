"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";

const PILARES = [
  {
    letra: "V",
    nome: "Vantagem",
    subtitulo: "O Formato",
    desc: "Identificar qual formato estratégico (Diálogo, 1x1, Lifestyle) dá a maior vantagem competitiva para aquele argumento.",
  },
  {
    letra: "I",
    nome: "Intenção",
    subtitulo: "Estrutura Validada",
    desc: 'Extrair o que funcionou (o "ouro" que o usuário achou que foi sorte) e aplicar uma estrutura de copy real e validada.',
  },
  {
    letra: "R",
    nome: "Rapidez",
    subtitulo: "O Timing",
    desc: "Identificar ondas e trends (ex: frutas falantes) que devem ser surfadas agora para não deixar dinheiro na mesa.",
  },
  {
    letra: "A",
    nome: "Ação",
    subtitulo: "Dados Próprios",
    desc: "Focar no aprendizado com a própria operação e parar de olhar para os concorrentes.",
  },
  {
    letra: "L",
    nome: "Lateralização",
    subtitulo: "O Coração",
    desc: "Isolar o CORPO (argumento/DNA) validado para que o profissional possa replicá-lo em novos formatos.",
  },
];

export default function Metodologia() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage="metodologia" />

      <main className="flex-1 flex flex-col min-w-0 gradient-warm watermark-bg">
        <header
          className="flex items-center justify-between px-6 py-3 border-b shrink-0"
          style={{ borderColor: "var(--border)", background: "rgba(10, 8, 6, 0.8)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-2 text-[13px]">
            <Link href="/" className="hover:underline" style={{ color: "var(--text-muted)" }}>Prisciane.AI</Link>
            <span style={{ color: "var(--border-light)" }}>/</span>
            <span className="font-medium" style={{ color: "var(--accent-light)" }}>Metodologia</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="mb-10">
              <p className="text-[11px] font-medium mb-3 tracking-[0.25em] uppercase" style={{ color: "var(--accent)" }}>
                Análise de DNA de Copy
              </p>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 heading-serif" style={{ color: "var(--foreground)" }}>
                Metodologia{" "}
                <span className="text-gold italic">V.I.R.A.L.</span>
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                O agente analisa todo conteúdo (Reels, Anúncio, Live, Bônus) através dos 5 pilares oficiais da Prisciane.
              </p>
            </div>

            <div className="space-y-3 mb-10">
              {PILARES.map((pilar, i) => (
                <div
                  key={pilar.letra}
                  className="p-5 rounded-2xl card-luxury animate-fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold heading-serif"
                      style={{ background: "#A0622F", color: "#fff" }}
                    >
                      {pilar.letra}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2 mb-1.5">
                        <p className="text-[14px] font-semibold" style={{ color: "var(--foreground)" }}>
                          {pilar.nome}
                        </p>
                        <p className="text-[11px]" style={{ color: "var(--accent)" }}>
                          {pilar.subtitulo}
                        </p>
                      </div>
                      <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {pilar.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider-gold mb-6" />
            <div
              className="p-6 rounded-2xl border"
              style={{
                background: "var(--surface-raised)",
                borderColor: "var(--accent)",
                boxShadow: "0 0 30px rgba(232, 98, 44, 0.05)",
              }}
            >
              <p className="text-[11px] font-medium mb-2 tracking-[0.2em] uppercase" style={{ color: "var(--accent)" }}>
                Regra de Ouro
              </p>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                O agente é um ANALISTA. Ele isola o DNA, mas NUNCA sugere o formato final. A inteligência de transposição pertence ao usuário através do Algoritmo de Espionagem Fantasma.
              </p>
            </div>

            <div className="text-center mt-10">
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
