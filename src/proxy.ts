import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|apple-touch-icon.png|icon-192.png|icon-512.png|prisciane-avatar.jpg|prisciane-semfundo.png|circulo.png|circulo-semfundo.png|marcadagia.png|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg).*)",
  ],
};
