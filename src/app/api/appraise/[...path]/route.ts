import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const apiUrl = (process.env.APPRAISE_API_URL || "http://localhost:3001").replace(/\/$/, "");
const developmentKey = "appraise_sk_demo_key_for_testing_only";

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const apiKey = process.env.APPRAISE_API_KEY || (process.env.NODE_ENV === "development" ? developmentKey : "");
  const shouldBypassConsoleAuth =
    process.env.NODE_ENV === "development" &&
    process.env.APPRAISE_CONSOLE_REQUIRE_AUTH !== "true";

  if (!apiKey) {
    return NextResponse.json({ error: { message: "APPRAISE_API_KEY is not configured" } }, { status: 500 });
  }

  let appraiseUserId = "demo-user";
  let appraiseUserEmail = "demo@appraise.dev";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    appraiseUserId = user.id;
    appraiseUserEmail = user.email || "";
  } else if (!shouldBypassConsoleAuth) {
    return NextResponse.json({ error: { message: "Authentication required" } }, { status: 401 });
  }

  const target = `${apiUrl}/${path.join("/")}${request.nextUrl.search}`;
  const activeWorkspaceId = request.cookies.get("appraise_active_workspace")?.value;
  const response = await fetch(target, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Appraise-User-Id": appraiseUserId,
      "X-Appraise-User-Email": appraiseUserEmail,
      "X-Appraise-App-Origin": request.nextUrl.origin,
      ...(activeWorkspaceId ? { "X-Appraise-Organization-Id": activeWorkspaceId } : {}),
    },
    body: request.method === "GET" ? undefined : await request.text(),
    cache: "no-store",
  });

  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") || "application/json" },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
