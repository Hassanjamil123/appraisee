export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    url,
    anonKey,
    configured: Boolean(url && anonKey),
  };
}

export function requireSupabaseEnv(): { url: string; anonKey: string } {
  const { url, anonKey, configured } = getSupabaseEnv();

  if (!configured || !url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Configure these environment variables before using Appraise auth."
    );
  }

  return { url, anonKey };
}
