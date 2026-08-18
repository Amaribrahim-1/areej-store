import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { USER_ROLES } from "../constants";
import { getSafeAdminNextPath } from "../lib/getSafeNextPath";
import { getCurrentUser, type AuthUser } from "./getCurrentUser";

/**
 * Ensures the request belongs to an admin session for protected admin routes.
 * Guests go to `/admin/login` with a safe `next` return path (from `x-pathname`).
 * Signed-in non-admins are sent to the storefront — they already have a
 * customer session, so the admin login page is the wrong destination.
 *
 * Login-time checks in `loginAdmin` are not a substitute: a customer can
 * still type `/admin` in the address bar.
 */
export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    const pathname = (await headers()).get("x-pathname");
    const next = getSafeAdminNextPath(pathname);
    redirect(`/admin/login?next=${encodeURIComponent(next)}`);
  }

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (profile?.role !== USER_ROLES.admin) {
    redirect("/");
  }

  return user;
}
