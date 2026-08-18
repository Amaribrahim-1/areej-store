const FALLBACK_ADMIN_LOGIN_ERROR = "حدث خطأ، حاول مرة أخرى";

export function adminLoginErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : "";
  const normalized = raw.toLowerCase();

  if (raw === "INVALID_LOGIN_PAYLOAD") {
    return "بيانات الدخول غير صحيحة";
  }

  if (raw === "NOT_ADMIN") {
    return "هذا الحساب ليس حساب مدير";
  }

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid_credentials")
  ) {
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة";
  }

  if (normalized.includes("email not confirmed")) {
    return "يلزم تأكيد البريد الإلكتروني أولًا";
  }

  if (raw === "LOGIN_FAILED" || raw === "ADMIN_PROFILE_UNAVAILABLE") {
    return FALLBACK_ADMIN_LOGIN_ERROR;
  }

  return raw || FALLBACK_ADMIN_LOGIN_ERROR;
}
