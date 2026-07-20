"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { qualify } from "./actions";

const PERGUNTAS = [
  {
    pergunta: "Você investe em tráfego pago hoje?",
    opcoes: ["Sim", "Não"],
  },
  {
    pergunta: "Você tem um infoproduto rodando?",
    opcoes: [
      "Sim, tenho e tá vendendo",
      "Sim, tenho mas não tá vendendo como eu queria",
      "Não, mas tô planejando lançar",
      "Não, ainda não pensei nisso",
    ],
  },
];

export default function QualificarPage() {
  const [step, setStep] = useState(0);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [selecionada, setSelecionada] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, startTransition] = useTransition();

  function escolher(opcao: string) {
    if (salvando) return;
    setSelecionada(opcao);
    setErro(null);

    // Pequeno delay pra pessoa VER a seleção antes de avançar (estilo quiz)
    setTimeout(() => {
      const novasRespostas = [...respostas, opcao];
      if (step < PERGUNTAS.length - 1) {
        setRespostas(novasRespostas);
        setStep(step + 1);
        setSelecionada(null);
      } else {
        // Última pergunta — salva tudo
        startTransition(async () => {
          const result = await qualify(novasRespostas[0], opcao);
          // Se voltou (não redirecionou), deu erro
          if (result?.error) {
            setErro(result.error);
            setSelecionada(null);
          }
        });
      }
    }, 350);
  }

  const atual = PERGUNTAS[step];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 gradient-warm">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden glow-pulse">
            <Image
              src="/prisciane-avatar.jpg"
              alt="Prisciane.AI"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <h1
            className="text-2xl font-semibold heading-serif mb-1"
            style={{ color: "var(--accent-light)" }}
          >
            Antes de começar
          </h1>
          <p
            className="text-[11px] tracking-[0.25em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Pergunta {step + 1} de {PERGUNTAS.length}
          </p>
        </div>

        {/* Barra de progresso fininha */}
        <div
          className="h-[3px] rounded-full mb-8 overflow-hidden"
          style={{ background: "var(--border)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((step + 1) / PERGUNTAS.length) * 100}%`,
              background: "var(--accent)",
            }}
          />
        </div>

        <div className="card-luxury rounded-2xl p-6 sm:p-8">
          <h2
            className="text-lg font-medium mb-6 heading-serif"
            style={{ color: "var(--foreground)" }}
          >
            {atual.pergunta}
          </h2>

          <div className="space-y-3">
            {atual.opcoes.map((opcao) => {
              const ativa = selecionada === opcao;
              return (
                <button
                  key={opcao}
                  onClick={() => escolher(opcao)}
                  disabled={salvando}
                  className="w-full text-left px-5 py-4 rounded-xl text-[14px] transition-all input-luxury"
                  style={{
                    background: ativa ? "var(--accent)" : "var(--surface-raised)",
                    color: ativa ? "#fff" : "var(--foreground)",
                    border: `1px solid ${ativa ? "var(--accent)" : "var(--border)"}`,
                    opacity: salvando && !ativa ? 0.5 : 1,
                    cursor: salvando ? "wait" : "pointer",
                  }}
                >
                  {opcao}
                </button>
              );
            })}
          </div>

          {salvando && (
            <p
              className="text-center text-[12px] mt-5"
              style={{ color: "var(--text-muted)" }}
            >
              Salvando...
            </p>
          )}

          {erro && (
            <div
              className="mt-5 p-3 rounded-lg text-[12px] text-center"
              style={{
                background: "rgba(178, 81, 27, 0.1)",
                color: "var(--accent-light)",
                border: "1px solid var(--accent)",
              }}
            >
              {erro}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
