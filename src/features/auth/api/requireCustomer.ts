import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSafeNextPath } from "../lib/getSafeNextPath";
import { getCurrentUser, type AuthUser } from "./getCurrentUser";

/**
 * Ensures a customer session exists for protected routes.
 * Guests are sent to login with a safe `next` return path (from `x-pathname`).
 */
export async function requireCustomer(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (user) {
    return user;
  }

  const pathname = (await headers()).get("x-pathname");
  const next = getSafeNextPath(pathname, "/");
  redirect(`/login?next=${encodeURIComponent(next)}`);
}
