import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isOnboardingComplete } from "@/lib/onboarding";
import { isAdminEmail } from "@/lib/admin";
import AdminOverviewClient from "@/components/dashboard/AdminOverviewClient";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!isOnboardingComplete(user.user_metadata)) {
    redirect("/dashboard/onboarding");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/dashboard");
  }

  return <AdminOverviewClient />;
}
