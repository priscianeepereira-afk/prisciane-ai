import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HomeClient from "./HomeClient";

// Server component: se o usuário logado ainda não respondeu o quiz de
// boas-vindas (primeiro acesso pós-cadastro), manda pra /qualificar.
// Contas antigas já foram marcadas como qualified na migration.
export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("qualified_at")
      .eq("id", user.id)
      .single();

    if (profile && !profile.qualified_at) {
      redirect("/qualificar");
    }
  }

  return <HomeClient />;
}
