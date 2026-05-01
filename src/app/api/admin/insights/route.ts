import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ConversationData {
  id: string;
  creative_name: string | null;
  preview: string | null;
  is_complete: boolean;
  created_at: string;
  messages: Message[];
  user_full_name: string | null;
  user_email: string | null;
}

const anthropic = new Anthropic();

const INSIGHTS_SYSTEM_PROMPT = `Você é um analista de dados especializado em comportamento de usuários de uma ferramenta de análise de criativos virais (a Prisciane.AI).

Sua tarefa é analisar conversas REAIS entre usuários e a IA da Prisciane e responder perguntas estratégicas que a Prisciane (dona da ferramenta) faz sobre esses usuários.

REGRAS:
- Use APENAS as conversas fornecidas como base. Nunca invente dados.
- Responda de forma direta e objetiva, sem enrolação.
- Use linguagem clara, com bullets quando fizer sentido.
- Cite trechos específicos das conversas quando relevante para embasar seus pontos.
- Se a pergunta exige números (ex: "quantos usuários X"), conte literalmente nas conversas.
- Se não houver dados suficientes, fale claramente que a amostra é pequena.
- Identifique padrões: dores recorrentes, perfis dominantes, nichos mais comuns, tipos de criativos mais analisados, dúvidas frequentes, objeções, frustrações.
- NUNCA invente nomes, e-mails, ou conteúdo que não está nas conversas.
- Não use markdown excessivo (asteriscos, hashtags). Texto limpo, com quebras de linha.`;

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const question = String(body.question || "").trim();
  if (!question) {
    return NextResponse.json({ error: "Pergunta vazia" }, { status: 400 });
  }

  // Carregar todas as conversas + nomes de usuários
  const [{ data: convos }, { data: profiles }] = await Promise.all([
    supabase
      .from("conversations")
      .select("id, creative_name, preview, is_complete, created_at, messages, user_id")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase.from("profiles").select("id, full_name, email"),
  ]);

  const profileMap = new Map<string, { full_name: string | null; email: string }>();
  (profiles || []).forEach((p) => profileMap.set(p.id, p));

  const conversations: ConversationData[] = (convos || []).map((c) => {
    const p = profileMap.get(c.user_id);
    return {
      id: c.id,
      creative_name: c.creative_name,
      preview: c.preview,
      is_complete: c.is_complete,
      created_at: c.created_at,
      messages: c.messages,
      user_full_name: p?.full_name || null,
      user_email: p?.email || null,
    };
  });

  // Montar contexto enxuto: anonimizar e-mail, manter nome, listar mensagens
  const contextLines: string[] = [];
  contextLines.push(`Total de conversas: ${conversations.length}`);
  contextLines.push(
    `Conversas completas (com diagnóstico final): ${conversations.filter((c) => c.is_complete).length}`
  );
  contextLines.push("");

  conversations.forEach((c, i) => {
    contextLines.push(`--- CONVERSA ${i + 1} ---`);
    contextLines.push(`Usuário: ${c.user_full_name || "—"}`);
    contextLines.push(`Data: ${new Date(c.created_at).toLocaleDateString("pt-BR")}`);
    contextLines.push(`Nome do criativo: ${c.creative_name || "—"}`);
    contextLines.push(`Status: ${c.is_complete ? "Completa" : "Incompleta"}`);
    contextLines.push("Mensagens:");
    c.messages.forEach((m) => {
      const label = m.role === "user" ? "USUARIO" : "IA";
      contextLines.push(`[${label}]: ${m.content}`);
    });
    contextLines.push("");
  });

  const context = contextLines.join("\n");

  // Limite simples: 100k caracteres pra não estourar
  const trimmedContext =
    context.length > 100000 ? context.slice(0, 100000) + "\n[...truncado]" : context;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: INSIGHTS_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Aqui estão as conversas registradas na plataforma Prisciane.AI:\n\n${trimmedContext}\n\n---\n\nPERGUNTA DA PRISCIANE: ${question}`,
        },
      ],
    });

    const content = response.content[0];
    const text = content.type === "text" ? content.text : "";

    return NextResponse.json({ answer: text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
