export function isAdminEmail(email?: string | null) {
  if (!email) return false;

  const configured = (process.env.APPRAISE_ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (configured.length === 0) return false;
  return configured.includes(email.toLowerCase());
}
