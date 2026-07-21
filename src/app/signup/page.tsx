import Image from "next/image";
import Link from "next/link";
import { signup } from "./actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 gradient-warm">
      <div className="w-full max-w-md animate-fade-in">
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
          <h1 className="text-3xl font-semibold heading-serif mb-1 text-peach">
            Prisciane.AI
          </h1>
          <p
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            Sua Mentora De Bolso
          </p>
        </div>

        <form
          action={signup}
          className="card-luxury rounded-2xl p-6 sm:p-8 space-y-4"
        >
          <h2
            className="text-xl heading-serif font-semibold mb-2"
            style={{ color: "var(--foreground)" }}
          >
            Criar conta
          </h2>

          {error && (
            <div
              className="p-3 rounded-lg text-[12px]"
              style={{
                background: "rgba(224, 141, 75, 0.1)",
                color: "var(--accent-light)",
                border: "1px solid var(--accent)",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              className="block text-[11px] tracking-wide uppercase mb-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              Nome completo
            </label>
            <input
              name="full_name"
              type="text"
              required
              autoComplete="name"
              className="w-full px-4 py-3 rounded-xl text-[13px] outline-none input-luxury"
              style={{
                background: "var(--surface-raised)",
                color: "var(--foreground)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-[11px] tracking-wide uppercase mb-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              E-mail
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl text-[13px] outline-none input-luxury"
              style={{
                background: "var(--surface-raised)",
                color: "var(--foreground)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-[11px] tracking-wide uppercase mb-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              Senha (mínimo 6 caracteres)
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full px-4 py-3 rounded-xl text-[13px] outline-none input-luxury"
              style={{
                background: "var(--surface-raised)",
                color: "var(--foreground)",
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-[13px] font-semibold transition-all hover:brightness-110 btn-gradient"
            style={{ color: "#fff" }}
          >
            Criar conta
          </button>

          <div className="divider-gold my-2" />

          <p
            className="text-center text-[12px]"
            style={{ color: "var(--text-muted)" }}
          >
            Já tem conta?{" "}
            <Link
              href="/login"
              className="font-medium hover:underline"
              style={{ color: "var(--accent-light)" }}
            >
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
