import { NextRequest, NextResponse } from "next/server";

const apiUrl = (process.env.APPRAISE_API_URL || "http://localhost:3001").replace(/\/$/, "");
const apiKey =
  process.env.APPRAISE_CONSOLE_API_KEY ||
  process.env.APPRAISE_API_KEY ||
  (process.env.NODE_ENV === "development" ? "appraise_sk_demo_key_for_testing_only" : "");

export async function POST(request: NextRequest) {
  try {
    if (!apiKey) {
      return NextResponse.json({ ok: false }, { status: 202 });
    }

    const body = await request.json() as {
      sessionId?: string;
      path?: string;
      referrer?: string;
      title?: string;
    };

    const sessionId = body.sessionId?.trim();
    const path = body.path?.trim() || "/";
    if (!sessionId) {
      return NextResponse.json({ error: { message: "sessionId is required" } }, { status: 400 });
    }

    await fetch(`${apiUrl}/v1/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Appraise-User-Id": "public-visitor-tracker",
        "X-Appraise-User-Email": "public-visitor@appraise.dev",
        "X-Appraise-App-Origin": request.nextUrl.origin,
      },
      body: JSON.stringify({
        sessionId,
        workflow: "website_analytics",
        event: "website_page_view",
        content: `Visitor viewed ${path}`,
        metadata: {
          surface: "public_website",
          path,
          referrer: body.referrer || "",
          title: body.title || "",
          userAgent: request.headers.get("user-agent") || "",
        },
        createMemory: false,
      }),
      cache: "no-store",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
