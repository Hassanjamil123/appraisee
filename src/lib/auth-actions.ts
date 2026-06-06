"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { onboardingUseCases, type OnboardingUseCase } from "@/lib/onboarding";

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  redirect(redirectTo.startsWith("/") ? redirectTo : "/dashboard");
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") ?? "";
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("full_name") as string,
      },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
        redirectTo.startsWith("/") ? redirectTo : "/dashboard"
      )}`,
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  return { success: "Check your email to confirm your account." };
}

export async function signInWithOAuth(provider: "google" | "github", redirectTo: string = "/dashboard") {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") ?? "";

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get("origin") ?? "";

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get("email") as string,
    { redirectTo: `${origin}/auth/callback?next=/dashboard/settings` }
  );

  if (error) {
    return { error: error.message };
  }

  return { success: "Password reset link sent — check your inbox." };
}

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const projectName = (formData.get("projectName") as string | null)?.trim();
  const companyName = (formData.get("companyName") as string | null)?.trim();
  const useCase = formData.get("useCase") as OnboardingUseCase | null;
  const apiKeyName = (formData.get("apiKeyName") as string | null)?.trim();

  if (!projectName) {
    return { error: "Project name is required." };
  }

  if (!useCase || !onboardingUseCases.some((item) => item.id === useCase)) {
    return { error: "Choose a starter use case." };
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      ...user.user_metadata,
      appraise_onboarding_complete: true,
      appraise_project_name: projectName,
      appraise_company_name: companyName || "",
      appraise_use_case: useCase,
      appraise_api_key_name: apiKeyName || `${projectName} Server Key`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  await bootstrapBackendProject({
    userId: user.id,
    userEmail: user.email || '',
    name: projectName,
    companyName: companyName || '',
    useCase,
    defaultApiKeyName: apiKeyName || `${projectName} Server Key`,
  });

  redirect("/dashboard/quickstart");
}

async function bootstrapBackendProject(input: {
  userId: string;
  userEmail: string;
  name: string;
  companyName: string;
  useCase: OnboardingUseCase;
  defaultApiKeyName: string;
}) {
  const apiUrl = (process.env.APPRAISE_API_URL || "http://localhost:3001").replace(/\/$/, "");
  const apiKey = process.env.APPRAISE_CONSOLE_API_KEY || process.env.APPRAISE_API_KEY || "appraise_sk_demo_key_for_testing_only";

  try {
    await fetch(`${apiUrl}/v1/projects/bootstrap`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Appraise-User-Id": input.userId,
        "X-Appraise-User-Email": input.userEmail,
      },
      body: JSON.stringify({
        name: input.name,
        companyName: input.companyName,
        useCase: input.useCase,
        defaultApiKeyName: input.defaultApiKeyName,
      }),
      cache: "no-store",
    });
  } catch {
    // We still let onboarding continue even if the local backend is offline.
  }
}
