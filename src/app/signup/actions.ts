"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const fullName = String(formData.get("full_name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!fullName || !email || !password) {
    redirect("/signup?error=" + encodeURIComponent("Preencha todos os campos"));
  }

  if (password.length < 6) {
    redirect("/signup?error=" + encodeURIComponent("A senha precisa ter no mínimo 6 caracteres"));
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message));
  }

  // Confirmação de e-mail desabilitada — login automático
  await supabase.auth.signInWithPassword({ email, password });

  // Primeiro acesso: quiz de boas-vindas antes de liberar a plataforma
  redirect("/qualificar");
}
