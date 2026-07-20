"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const TRAFEGO_OPCOES = ["Sim", "Não"] as const;
const INFOPRODUTO_OPCOES = [
  "Sim, tenho e tá vendendo",
  "Sim, tenho mas não tá vendendo como eu queria",
  "Não, mas tô planejando lançar",
  "Não, ainda não pensei nisso",
] as const;

export async function qualify(investTrafego: string, temInfoproduto: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Valida contra as opções permitidas (whitelist)
  if (!(TRAFEGO_OPCOES as readonly string[]).includes(investTrafego)) {
    return { error: "Resposta de tráfego inválida." };
  }
  if (!(INFOPRODUTO_OPCOES as readonly string[]).includes(temInfoproduto)) {
    return { error: "Resposta de infoproduto inválida." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      invest_trafego: investTrafego,
      tem_infoproduto: temInfoproduto,
      qualified_at: new Date().toISOString(),
    })
    .eq("id", user!.id);

  if (error) {
    console.error("[qualificar] update error:", error.code, error.message);
    return { error: "Não deu pra salvar. Tenta de novo." };
  }

  redirect("/");
}
