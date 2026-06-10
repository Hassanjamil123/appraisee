import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

const apiUrl = (process.env.APPRAISE_API_URL || "http://localhost:3001").replace(/\/$/, "");

export async function GET() {
  const adminToken = process.env.APPRAISE_ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json({ error: { message: "APPRAISE_ADMIN_TOKEN is not configured" } }, { status: 500 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: { message: "Admin access required" } }, { status: 403 });
  }

  const response = await fetch(`${apiUrl}/v1/admin/overview`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" },
  });
}
