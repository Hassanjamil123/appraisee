export const onboardingUseCases = [
  {
    id: "customer_support",
    label: "Customer support",
    description: "Support chatbots that need memory for orders, refunds, and escalations.",
  },
  {
    id: "sales_assistant",
    label: "Sales assistant",
    description: "Revenue copilots that remember account history, objections, and buying stage.",
  },
  {
    id: "recruiting",
    label: "Recruiting",
    description: "Hiring workflows that track interviews, feedback, and candidate decisions.",
  },
  {
    id: "healthcare",
    label: "Healthcare",
    description: "Clinical or intake assistants that need context, urgency, and follow-up memory.",
  },
  {
    id: "general_chatbot",
    label: "General chatbot",
    description: "A flexible starting point for teams exploring memory in any AI workflow.",
  },
] as const;

export type OnboardingUseCase = (typeof onboardingUseCases)[number]["id"];

export interface OnboardingMetadata {
  appraise_onboarding_complete?: boolean;
  appraise_project_name?: string;
  appraise_company_name?: string;
  appraise_use_case?: OnboardingUseCase;
  appraise_api_key_name?: string;
}

export function getOnboardingMetadata(userMetadata: Record<string, unknown> | null | undefined): OnboardingMetadata {
  if (!userMetadata) return {};

  return {
    appraise_onboarding_complete:
      typeof userMetadata.appraise_onboarding_complete === "boolean"
        ? userMetadata.appraise_onboarding_complete
        : false,
    appraise_project_name:
      typeof userMetadata.appraise_project_name === "string"
        ? userMetadata.appraise_project_name
        : undefined,
    appraise_company_name:
      typeof userMetadata.appraise_company_name === "string"
        ? userMetadata.appraise_company_name
        : undefined,
    appraise_use_case:
      typeof userMetadata.appraise_use_case === "string"
        ? (userMetadata.appraise_use_case as OnboardingUseCase)
        : undefined,
    appraise_api_key_name:
      typeof userMetadata.appraise_api_key_name === "string"
        ? userMetadata.appraise_api_key_name
        : undefined,
  };
}

export function isOnboardingComplete(userMetadata: Record<string, unknown> | null | undefined) {
  return Boolean(getOnboardingMetadata(userMetadata).appraise_onboarding_complete);
}

export function getUseCaseLabel(id?: string) {
  return onboardingUseCases.find((item) => item.id === id)?.label ?? "General chatbot";
}
