"use client";

import Link from "next/link";

interface MobileNavProps {
  activePage: "chat" | "metodologia" | "sobre";
}

export default function MobileNav({ activePage }: MobileNavProps) {
  return (
    <div className="md:hidden">
      <div className="divider-gold" />
      <div className="flex items-center justify-center gap-6 px-4 py-2.5" style={{ background: "var(--surface)" }}>
        <Link
          href="/"
          className="text-[12px] heading-serif font-medium transition-colors"
          style={{ color: activePage === "chat" ? "#B2511B" : "var(--text-muted)" }}
        >
          Análise
        </Link>
        <Link
          href="/metodologia"
          className="text-[12px] heading-serif font-medium transition-colors"
          style={{ color: activePage === "metodologia" ? "#B2511B" : "var(--text-muted)" }}
        >
          Metodologia
        </Link>
        <Link
          href="/sobre"
          className="text-[12px] heading-serif font-medium transition-colors"
          style={{ color: activePage === "sobre" ? "#B2511B" : "var(--text-muted)" }}
        >
          Sobre
        </Link>
      </div>
    </div>
  );
}
