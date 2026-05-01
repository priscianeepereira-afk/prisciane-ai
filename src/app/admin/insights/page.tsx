import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import InsightsClient from "./InsightsClient";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
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
            <span className="font-medium" style={{ color: "var(--accent-light)" }}>
              Insights
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <InsightsClient />
        </div>
      </main>
    </div>
  );
}
