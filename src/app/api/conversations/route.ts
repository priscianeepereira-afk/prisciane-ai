import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function isAnalysisComplete(messages: Message[]): boolean {
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  if (!lastAssistant) return false;
  const text = lastAssistant.content.toUpperCase();
  return (
    (text.includes("BLOCOS DE PERSUAS") ||
      text.includes("BLOCO DE PERSUAS")) &&
    (text.includes("PONTOS FORTES") || text.includes("PONTO FORTE")) &&
    text.includes("VIRALIZA")
  );
}

function extractCreativeName(messages: Message[]): string | null {
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const content = lastAssistant?.content || "";
  const match = content.match(/NOME DO CRIATIVO:\s*(.+)/i);
  return match ? match[1].trim().slice(0, 200) : null;
}

function buildPreview(messages: Message[]): string {
  const firstUser = messages.find((m) => m.role === "user");
  if (!firstUser) return "Análise";
  return firstUser.content.slice(0, 80);
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("conversations")
    .select("id, creative_name, preview, messages, is_complete, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ conversations: data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const messages = body.messages as Message[];
  const conversationId = body.id as string | undefined;

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "Mensagens inválidas" },
      { status: 400 }
    );
  }

  const preview = buildPreview(messages);
  const creative_name = extractCreativeName(messages);
  const is_complete = isAnalysisComplete(messages);

  if (conversationId) {
    const { data, error } = await supabase
      .from("conversations")
      .update({ messages, preview, creative_name, is_complete })
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ conversation: data });
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      messages,
      preview,
      creative_name,
      is_complete,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ conversation: data });
}
