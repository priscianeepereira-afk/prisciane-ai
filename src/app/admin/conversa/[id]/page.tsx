import Image from "next/image";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default async function AdminConversaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") redirect("/");

  const { data: convo } = await supabase
    .from("conversations")
    .select("id, user_id, creative_name, preview, messages, is_complete, created_at, updated_at")
    .eq("id", id)
    .single();

  if (!convo) notFound();

  const { data: userProfile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", convo.user_id)
    .single();

  const messages = (convo.messages || []) as Message[];

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage="admin" />

      <main className="flex-1 flex flex-col min-w-0 gradient-warm overflow-hidden">
        <header
          className="flex items-center justify-between px-6 py-3 border-b shrink-0"
          style={{ borderColor: "var(--border)", background: "rgba(10, 8, 6, 0.8)", backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-2 text-[13px]">
            <Link href="/" className="hover:underline" style={{ color: "var(--text-muted)" }}>
              Prisciane.AI
            </Link>
            <span style={{ color: "var(--border-light)" }}>/</span>
            <Link href="/admin" className="hover:underline" style={{ color: "var(--text-muted)" }}>
              Painel Admin
            </Link>
            <span style={{ color: "var(--border-light)" }}>/</span>
            <span className="font-medium truncate max-w-[200px]" style={{ color: "var(--accent-light)" }}>
              {convo.creative_name || "Conversa"}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="mb-6">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-[12px] mb-4 hover:underline"
                style={{ color: "var(--text-muted)" }}
              >
                ← Voltar
              </Link>
              <h2 className="text-2xl font-semibold heading-serif mb-2" style={{ color: "var(--foreground)" }}>
                {convo.creative_name || "Análise"}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]" style={{ color: "var(--text-muted)" }}>
                <span>
                  <strong style={{ color: "var(--text-secondary)" }}>Usuário:</strong>{" "}
                  {userProfile?.full_name || "—"}
                </span>
                <span>
                  <strong style={{ color: "var(--text-secondary)" }}>E-mail:</strong>{" "}
                  {userProfile?.email || "—"}
                </span>
                <span>
                  <strong style={{ color: "var(--text-secondary)" }}>Iniciada:</strong>{" "}
                  {formatDate(convo.created_at)}
                </span>
                <span>
                  <strong style={{ color: "var(--text-secondary)" }}>Status:</strong>{" "}
                  {convo.is_complete ? "Completa" : "Em andamento"}
                </span>
              </div>
            </div>

            <div className="divider-gold mb-6" />

            <div className="space-y-1">
              {messages.map((msg, i) => (
                <div key={i}>
                  <div
                    className="flex gap-3.5 py-5 px-4 rounded-2xl"
                    style={{
                      background: msg.role === "assistant" ? "rgba(20, 18, 16, 0.6)" : "transparent",
                    }}
                  >
                    <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
                      {msg.role === "assistant" ? (
                        <Image
                          src="/prisciane-avatar.jpg"
                          alt="P"
                          width={28}
                          height={28}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-[10px] font-semibold"
                          style={{ background: "var(--surface-light)", color: "var(--text-secondary)" }}
                        >
                          U
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[11px] font-medium mb-1.5 tracking-wide"
                        style={{
                          color: msg.role === "assistant" ? "var(--accent)" : "var(--text-muted)",
                        }}
                      >
                        {msg.role === "assistant" ? "Prisciane.AI" : userProfile?.full_name || "Usuário"}
                      </p>
                      <div
                        className="text-[13px] leading-[1.7] whitespace-pre-wrap"
                        style={{ color: "var(--foreground)" }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                  {i < messages.length - 1 && <div className="divider-gold my-1 mx-4" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
