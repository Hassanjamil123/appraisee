"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "appraise_public_visitor_id";

function getVisitorId() {
  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const created = `website_visit_${crypto.randomUUID()}`;
  window.localStorage.setItem(STORAGE_KEY, created);
  return created;
}

export function PublicVisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const sessionId = getVisitorId();
    void fetch("/api/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        path: pathname,
        referrer: document.referrer,
        title: document.title,
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
