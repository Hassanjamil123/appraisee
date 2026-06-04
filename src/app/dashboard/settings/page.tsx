import { createClient } from "@/lib/supabase/server";
import SettingsClient from "@/components/dashboard/SettingsClient";
import { getOnboardingMetadata } from "@/lib/onboarding";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const onboarding = getOnboardingMetadata(user?.user_metadata);

  return (
    <SettingsClient
      userEmail={user?.email ?? ""}
      displayName={user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "User"}
      userId={user?.id ?? ""}
      provider={user?.app_metadata?.provider ?? "email"}
      onboardingProjectName={onboarding.appraise_project_name ?? ""}
      onboardingCompanyName={onboarding.appraise_company_name ?? ""}
      onboardingUseCase={onboarding.appraise_use_case ?? "general_chatbot"}
      onboardingApiKeyName={onboarding.appraise_api_key_name ?? ""}
    />
  );
}
