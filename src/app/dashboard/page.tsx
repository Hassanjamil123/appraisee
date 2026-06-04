import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { isOnboardingComplete } from "@/lib/onboarding";

export default async function DashboardPage() {
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

  return <DashboardOverview />;
}
