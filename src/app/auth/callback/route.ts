import { NextResponse } from "next/server";

import { getSafeNextPath } from "@/features/auth/lib/getSafeNextPath";
import { createClient } from "@/lib/supabase/server";

/**
 * Completes the email-confirm / PKCE flow, then redirects to a safe `next` path.
 * Signup must set `emailRedirectTo` to this route (with `?next=...`) so guests
 * return to checkout after confirming email.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = getSafeNextPath(searchParams.get("next"), "/");

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as "signup" | "email" | "invite" | "magiclink" | "recovery" | "email_change",
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  const login = new URL("/login", origin);
  login.searchParams.set("next", next);
  login.searchParams.set("error", "auth_callback");
  return NextResponse.redirect(login);
}
