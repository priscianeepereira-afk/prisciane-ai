import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

interface AdminConversation {
  id: string;
  creative_name: string | null;
  preview: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_full_name: string | null;
  user_email: string | null;
}

export const dynamic = "force-dynamic";

export default async function AdminPage() {
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

  if (!profile || profile.role !== "admin") {
    redirect("/");
  }

  // Buscar estatísticas em paralelo
  const [
    { count: totalUsers },
    { count: totalConversations },
    { count: completeConversations },
    { data: rawConversations },
    { data: profiles },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("conversations").select("id", { count: "exact", head: true }),
    supabase
      .from("conversations")
      .select("id", { count: "exact", head: true })
      .eq("is_complete", true),
    supabase
      .from("conversations")
      .select(
        "id, creative_name, preview, is_complete, created_at, updated_at, user_id"
      )
      .order("updated_at", { ascending: false })
      .limit(100),
    supabase.from("profiles").select("id, full_name, email"),
  ]);

  const profileMap = new Map<string, { full_name: string | null; email: string }>();
  (profiles || []).forEach((p) => profileMap.set(p.id, p));

  const conversations: AdminConversation[] = (rawConversations || []).map((c) => {
    const p = profileMap.get(c.user_id);
    return {
      ...c,
      user_full_name: p?.full_name || null,
      user_email: p?.email || null,
    };
  });

  // Análises últimos 7 dias
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const conversationsLast7Days = conversations.filter(
    (c) => new Date(c.created_at) >= sevenDaysAgo
  ).length;
  const conversationsToday = conversations.filter(
    (c) => new Date(c.created_at) >= today
  ).length;

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
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
            <span className="font-medium" style={{ color: "var(--accent-light)" }}>
              Painel Admin
            </span>
          </div>
        </header>
        <MobileNav activePage="chat" />

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
          <div className="max-w-5xl mx-auto animate-fade-in">
            {/* Hero */}
            <div className="mb-8">
              <p className="text-[11px] font-medium mb-2 tracking-[0.25em] uppercase" style={{ color: "var(--accent)" }}>
                Acesso restrito
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2 heading-serif" style={{ color: "var(--foreground)" }}>
                Painel <span className="text-gold italic">administrativo</span>
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Estatísticas e conversas dos usuários da plataforma.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <StatCard label="Usuários" value={totalUsers ?? 0} />
              <StatCard label="Análises totais" value={totalConversations ?? 0} />
              <StatCard label="Análises completas" value={completeConversations ?? 0} />
              <StatCard label="Últimos 7 dias" value={conversationsLast7Days} sub={`${conversationsToday} hoje`} />
            </div>

            <div className="divider-gold mb-6" />

            {/* Lista de conversas */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold heading-serif mb-1" style={{ color: "var(--foreground)" }}>
                Todas as conversas
              </h3>
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                Mostrando até as 100 mais recentes
              </p>
            </div>

            <div className="space-y-2">
              {conversations.length === 0 ? (
                <p className="text-center py-12 text-[13px]" style={{ color: "var(--text-muted)" }}>
                  Nenhuma conversa registrada ainda.
                </p>
              ) : (
                conversations.map((c) => (
                  <Link
                    key={c.id}
                    href={`/admin/conversa/${c.id}`}
                    className="block p-4 rounded-xl card-luxury"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate" style={{ color: "var(--foreground)" }}>
                          {c.creative_name || c.preview || "Análise sem nome"}
                        </p>
                        <p className="text-[11px] mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                          {c.user_full_name || "—"} · {c.user_email || "—"}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className="inline-block text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            background: c.is_complete ? "rgba(34, 197, 94, 0.1)" : "var(--surface-light)",
                            color: c.is_complete ? "rgb(34, 197, 94)" : "var(--text-muted)",
                          }}
                        >
                          {c.is_complete ? "Completa" : "Em andamento"}
                        </span>
                        <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                          {formatDate(c.updated_at)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="card-luxury rounded-xl p-4">
      <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p className="text-2xl font-semibold heading-serif" style={{ color: "var(--accent-light)" }}>
        {value}
      </p>
      {sub && (
        <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}
