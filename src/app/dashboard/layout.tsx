import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { isOnboardingComplete } from "@/lib/onboarding";
import { isAdminEmail } from "@/lib/admin";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const onboardingComplete = isOnboardingComplete(user.user_metadata);

  return (
    <DashboardShell
      userEmail={user.email ?? ""}
      displayName={displayName}
      initials={initials}
      onboardingComplete={onboardingComplete}
      isAdmin={isAdminEmail(user.email)}
    >
      {children}
    </DashboardShell>
  );
}
