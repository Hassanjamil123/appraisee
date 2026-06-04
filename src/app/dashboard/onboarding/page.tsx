import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingFlow from "@/components/dashboard/OnboardingFlow";
import { getOnboardingMetadata, isOnboardingComplete } from "@/lib/onboarding";

export default async function DashboardOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (isOnboardingComplete(user.user_metadata)) {
    redirect("/dashboard");
  }

  const metadata = getOnboardingMetadata(user.user_metadata);
  const displayName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <OnboardingFlow
      displayName={displayName}
      initialProjectName={metadata.appraise_project_name}
      initialCompanyName={metadata.appraise_company_name}
      initialUseCase={metadata.appraise_use_case}
      initialApiKeyName={metadata.appraise_api_key_name}
    />
  );
}
