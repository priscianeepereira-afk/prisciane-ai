import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Guard server-side: só quem tá logado E ainda não respondeu vê o quiz.
// Quem já respondeu volta pra home (não responde duas vezes).
export default async function QualificarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("qualified_at")
    .eq("id", user.id)
    .single();

  if (profile?.qualified_at) redirect("/");

  return <>{children}</>;
}
