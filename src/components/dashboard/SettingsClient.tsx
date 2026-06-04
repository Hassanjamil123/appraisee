"use client";

import React, { useEffect, useState, useTransition } from "react";
import { User, Shield, CreditCard, Bell, Save, Trash2, Loader2, CheckCircle2, Lock, Copy, Briefcase } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SettingsTab = "profile" | "workspace" | "team" | "billing" | "notifications";

interface Props {
  userEmail: string;
  displayName: string;
  userId: string;
  provider: string;
  onboardingProjectName: string;
  onboardingCompanyName: string;
  onboardingUseCase: string;
  onboardingApiKeyName: string;
}

interface TeamMember {
  id: string;
  userEmail: string;
  role: string;
  status: string;
  userId?: string | null;
}

interface TeamState {
  organization: { id: string; name: string; slug?: string; ownerId?: string } | null;
  currentUserRole: string | null;
  members: TeamMember[];
  invites: TeamMember[];
  pendingInvites?: TeamMember[];
}

interface InviteResponse {
  member: TeamMember;
  inviteLink?: string;
  delivery?: {
    status: string;
    message: string;
  };
  error?: {
    message?: string;
  };
}

interface WorkspaceState {
  project: {
    id: string;
    name: string;
    config?: {
      companyName?: string;
      useCase?: string;
      defaultApiKeyName?: string;
    };
  } | null;
  organization: {
    id: string;
    name: string;
  } | null;
  currentUserRole: string | null;
}

export default function SettingsClient({
  userEmail,
  displayName,
  userId,
  provider,
  onboardingProjectName,
  onboardingCompanyName,
  onboardingUseCase,
  onboardingApiKeyName,
}: Props) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isPending, startTransition] = useTransition();
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newName, setNewName] = useState(displayName);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [team, setTeam] = useState<TeamState | null>(null);
  const [teamLoading, setTeamLoading] = useState(false);
  const [workspace, setWorkspace] = useState<WorkspaceState | null>(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(onboardingProjectName);
  const [companyName, setCompanyName] = useState(onboardingCompanyName);
  const [defaultApiKeyName, setDefaultApiKeyName] = useState(onboardingApiKeyName);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [lastInviteLink, setLastInviteLink] = useState<string | null>(null);
  const [inviteDeliveryMessage, setInviteDeliveryMessage] = useState<string | null>(null);
  const [copiedInviteLink, setCopiedInviteLink] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (activeTab !== "workspace") return;

    let mounted = true;
    setWorkspaceLoading(true);

    Promise.all([
      fetch("/api/appraise/v1/projects/current", { cache: "no-store" }),
      fetch("/api/appraise/v1/teams/current", { cache: "no-store" }),
    ])
      .then(async ([projectResponse, teamResponse]) => {
        const projectBody = await projectResponse.json();
        const teamBody = await teamResponse.json();

        if (!projectResponse.ok) {
          throw new Error(projectBody.error?.message || "Unable to load workspace");
        }

        if (!teamResponse.ok) {
          throw new Error(teamBody.error?.message || "Unable to load workspace access");
        }

        if (!mounted) return;

        const nextWorkspace = {
          project: projectBody.project || null,
          organization: projectBody.organization || null,
          currentUserRole: teamBody.currentUserRole || null,
        };

        setWorkspace(nextWorkspace);
        setWorkspaceName(projectBody.project?.name || onboardingProjectName || "");
        setCompanyName(projectBody.project?.config?.companyName || projectBody.organization?.name || onboardingCompanyName || "");
        setDefaultApiKeyName(projectBody.project?.config?.defaultApiKeyName || onboardingApiKeyName || "");
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        setSaveMsg({ type: "error", text: error instanceof Error ? error.message : "Unable to load workspace" });
      })
      .finally(() => {
        if (mounted) setWorkspaceLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [activeTab, onboardingApiKeyName, onboardingCompanyName, onboardingProjectName, onboardingUseCase]);

  useEffect(() => {
    if (activeTab !== "team") return;

    let mounted = true;
    const loadTeam = async (attemptBootstrap: boolean) => {
      setTeamLoading(true);

      try {
        const response = await fetch("/api/appraise/v1/teams/current", { cache: "no-store" });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error?.message || "Unable to load team");

        const shouldBootstrap =
          attemptBootstrap &&
          (
            !body.organization ||
            (
              body.organization?.slug === "appraise-demo" &&
              body.currentUserRole !== "owner"
            )
          ) &&
          (!body.pendingInvites || body.pendingInvites.length === 0);

        if (shouldBootstrap) {
          const projectName = onboardingProjectName || onboardingCompanyName || `${displayName} Workspace`;
          const bootstrapResponse = await fetch("/api/appraise/v1/projects/bootstrap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: projectName,
              companyName: onboardingCompanyName,
              useCase: onboardingUseCase || "general_chatbot",
              defaultApiKeyName: onboardingApiKeyName || `${projectName} Server Key`,
            }),
          });

          if (!bootstrapResponse.ok) {
            const bootstrapBody = await bootstrapResponse.json().catch(() => null);
            throw new Error(bootstrapBody?.error?.message || "Unable to create team workspace");
          }

          await loadTeam(false);
          return;
        }

        if (mounted) setTeam(body);
      } catch (error: unknown) {
        if (mounted) {
          setSaveMsg({ type: "error", text: error instanceof Error ? error.message : "Unable to load team" });
        }
      } finally {
        if (mounted) setTeamLoading(false);
      }
    };

    loadTeam(true);

    return () => {
      mounted = false;
    };
  }, [activeTab, displayName, onboardingApiKeyName, onboardingCompanyName, onboardingProjectName, onboardingUseCase]);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveMsg(null);
    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ data: { full_name: newName } });
      if (error) setSaveMsg({ type: "error", text: error.message });
      else setSaveMsg({ type: "success", text: "Profile updated successfully." });
    });
  }

  async function handleWorkspaceSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveMsg(null);
    setWorkspaceLoading(true);

    try {
      const response = await fetch("/api/appraise/v1/projects/current", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workspaceName.trim(),
          companyName: companyName.trim(),
          defaultApiKeyName: defaultApiKeyName.trim(),
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error?.message || "Unable to save workspace settings");
      }

      setWorkspace({
        project: body.project || null,
        organization: body.organization || null,
        currentUserRole: workspace?.currentUserRole || null,
      });
      setWorkspaceName(body.project?.name || workspaceName);
      setCompanyName(body.project?.config?.companyName || companyName);
      setDefaultApiKeyName(body.project?.config?.defaultApiKeyName || defaultApiKeyName);
      setSaveMsg({ type: "success", text: "Workspace settings updated." });
    } catch (error) {
      setSaveMsg({ type: "error", text: error instanceof Error ? error.message : "Unable to save workspace settings" });
    } finally {
      setWorkspaceLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setSaveMsg(null);
    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) setSaveMsg({ type: "error", text: error.message });
      else {
        setSaveMsg({ type: "success", text: "Password updated." });
        setCurrentPw("");
        setNewPw("");
      }
    });
  }

  async function handleInviteMember(e: React.FormEvent) {
    e.preventDefault();
    setSaveMsg(null);
    setTeamLoading(true);
    setCopiedInviteLink(false);

    try {
      const response = await fetch("/api/appraise/v1/teams/current/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const body = (await response.json()) as InviteResponse;
      if (!response.ok) throw new Error(body.error?.message || "Unable to invite member");

      const refreshed = await fetch("/api/appraise/v1/teams/current", { cache: "no-store" });
      const refreshedBody = await refreshed.json();
      if (!refreshed.ok) throw new Error(refreshedBody.error?.message || "Unable to refresh team");

      setTeam(refreshedBody);
      setInviteEmail("");
      setInviteRole("member");
      setLastInviteLink(body.inviteLink || null);
      setInviteDeliveryMessage(body.delivery?.message || null);
      setSaveMsg({
        type: "success",
        text: body.delivery?.status === "link_only"
          ? `Invitation saved for ${body.member.userEmail}. Copy the invite link below.`
          : `Invitation sent to ${body.member.userEmail}.`,
      });
    } catch (error) {
      setSaveMsg({ type: "error", text: error instanceof Error ? error.message : "Unable to invite member" });
    } finally {
      setTeamLoading(false);
    }
  }

  function copyInviteLink() {
    if (!lastInviteLink) return;
    navigator.clipboard.writeText(lastInviteLink);
    setCopiedInviteLink(true);
    window.setTimeout(() => setCopiedInviteLink(false), 1500);
  }

  async function refreshTeam() {
    const refreshed = await fetch("/api/appraise/v1/teams/current", { cache: "no-store" });
    const refreshedBody = await refreshed.json();
    if (!refreshed.ok) throw new Error(refreshedBody.error?.message || "Unable to refresh team");
    setTeam(refreshedBody);
  }

  async function handleAcceptInvite() {
    setSaveMsg(null);
    setTeamLoading(true);

    try {
      const response = await fetch("/api/appraise/v1/teams/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to accept invitation");

      await refreshTeam();
      setSaveMsg({ type: "success", text: "Team invitation accepted." });
    } catch (error) {
      setSaveMsg({ type: "error", text: error instanceof Error ? error.message : "Unable to accept invitation" });
    } finally {
      setTeamLoading(false);
    }
  }

  async function handleRoleChange(memberId: string, role: string) {
    setSaveMsg(null);
    setTeamLoading(true);

    try {
      const response = await fetch(`/api/appraise/v1/teams/current/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to update role");

      await refreshTeam();
      setSaveMsg({ type: "success", text: "Role updated." });
    } catch (error) {
      setSaveMsg({ type: "error", text: error instanceof Error ? error.message : "Unable to update role" });
    } finally {
      setTeamLoading(false);
    }
  }

  async function handleRemoveMember(memberId: string) {
    setSaveMsg(null);
    setTeamLoading(true);

    try {
      const response = await fetch(`/api/appraise/v1/teams/current/members/${memberId}`, {
        method: "DELETE",
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to remove member");

      await refreshTeam();
      setSaveMsg({ type: "success", text: "Team member removed." });
    } catch (error) {
      setSaveMsg({ type: "error", text: error instanceof Error ? error.message : "Unable to remove member" });
    } finally {
      setTeamLoading(false);
    }
  }

  const isManager = team?.currentUserRole === "owner" || team?.currentUserRole === "admin";
  const isOwner = team?.currentUserRole === "owner";

  function canEditMember(member: TeamMember) {
    const isSelf = member.userEmail === userEmail || member.userId === userId;
    if (isSelf) return false;
    if (team?.currentUserRole === "owner") return member.role !== "owner";
    if (team?.currentUserRole === "admin") return member.role === "member";
    return false;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Settings</h1>
        <p className="text-xs text-text-secondary mt-1">
          Manage your profile, team, billing, and notifications.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle gap-1">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "workspace", label: "Workspace", icon: Briefcase },
          { id: "team", label: "Team", icon: Shield },
          { id: "billing", label: "Billing", icon: CreditCard },
          { id: "notifications", label: "Alerts", icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as SettingsTab); setSaveMsg(null); }}
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-2.5 relative transition-all ${
                isActive ? "text-slate-950" : "text-text-secondary hover:text-slate-950"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 rounded-t" />}
            </button>
          );
        })}
      </div>

      {/* Save message */}
      {saveMsg && (
        <div className={`px-4 py-3 rounded-xl text-xs font-medium flex items-start gap-2 ${
          saveMsg.type === "success"
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-700"
            : "bg-red-500/10 border border-red-500/20 text-red-600"
        }`}>
          {saveMsg.type === "success" && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
          {saveMsg.text}
        </div>
      )}

      <div className="p-6 rounded-xl border border-border-subtle bg-surface-1 max-w-lg">
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Profile form */}
            <form onSubmit={handleProfileSave} className="space-y-4">
              <h3 className="text-sm font-bold text-slate-950">Profile Information</h3>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-2 border border-border-subtle">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-base font-bold text-white shrink-0">
                  {newName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-950">{newName || "—"}</div>
                  <div className="text-xs text-text-tertiary">{userEmail}</div>
                  <div className="text-[10px] text-text-tertiary mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Signed in via {provider}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-surface-2 border border-border-subtle focus:outline-none focus:border-blue-500/50 text-slate-950 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  defaultValue={userEmail}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-surface-2/50 border border-border-subtle text-text-tertiary cursor-not-allowed"
                />
                <p className="text-[10px] text-text-tertiary">Email cannot be changed from this panel.</p>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Changes
              </button>
            </form>

            {/* Password change (only for email provider) */}
            {provider === "email" && (
              <>
                <div className="border-t border-border-subtle" />
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-text-secondary" />
                    Change Password
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">New Password</label>
                    <input
                      type="password"
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      minLength={8}
                      placeholder="Min. 8 characters"
                      className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-surface-2 border border-border-subtle focus:outline-none focus:border-blue-500/50 text-slate-950 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isPending || !newPw}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-surface-2 border border-border-subtle text-slate-950 hover:bg-surface-3 transition-all disabled:opacity-50"
                  >
                    {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Update Password
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {activeTab === "workspace" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-950">Workspace Settings</h3>
                <p className="text-[10px] text-text-tertiary mt-1">
                  Update the current workspace name, company, and default server key label.
                </p>
              </div>
              {workspaceLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
            </div>

            {workspace && !(workspace.currentUserRole === "owner" || workspace.currentUserRole === "admin") ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                You have read-only access in this workspace. Only owners and admins can update workspace settings.
              </div>
            ) : null}

            <form onSubmit={handleWorkspaceSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  disabled={workspaceLoading || !(workspace?.currentUserRole === "owner" || workspace?.currentUserRole === "admin")}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-surface-2 border border-border-subtle focus:outline-none focus:border-blue-500/50 text-slate-950 transition-all disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={workspaceLoading || !(workspace?.currentUserRole === "owner" || workspace?.currentUserRole === "admin")}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-surface-2 border border-border-subtle focus:outline-none focus:border-blue-500/50 text-slate-950 transition-all disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Default API Key Name</label>
                <input
                  type="text"
                  value={defaultApiKeyName}
                  onChange={(e) => setDefaultApiKeyName(e.target.value)}
                  disabled={workspaceLoading || !(workspace?.currentUserRole === "owner" || workspace?.currentUserRole === "admin")}
                  className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-surface-2 border border-border-subtle focus:outline-none focus:border-blue-500/50 text-slate-950 transition-all disabled:opacity-60"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                <div className="font-semibold text-slate-900">{workspace?.organization?.name || companyName || "Workspace"}</div>
                <div className="mt-1">Current role: <span className="capitalize">{workspace?.currentUserRole || "member"}</span></div>
              </div>

              <button
                type="submit"
                disabled={workspaceLoading || !(workspace?.currentUserRole === "owner" || workspace?.currentUserRole === "admin") || !workspaceName.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {workspaceLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Workspace
              </button>
            </form>
          </div>
        )}

        {activeTab === "team" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-950">Team Members</h3>
                <p className="text-[10px] text-text-tertiary mt-1">
                  {team?.organization ? `${team.organization.name} workspace` : "No team workspace yet"}
                </p>
              </div>
              {teamLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
            </div>

            {team?.pendingInvites?.length ? (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-3">
                <div className="text-xs font-semibold text-blue-800">You have a pending team invitation for {userEmail}.</div>
                <button
                  onClick={handleAcceptInvite}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Accept Invitation
                </button>
              </div>
            ) : null}

            {team?.organization && !isManager ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                You are a <span className="font-semibold capitalize text-slate-900">{team.currentUserRole || "member"}</span> in this workspace. Members can view team access and use the workspace, but only owners and admins can invite teammates, change roles, manage API keys, or update workspace settings.
              </div>
            ) : null}

            {team?.organization && isManager && (
              <form onSubmit={handleInviteMember} className="rounded-xl border border-border-subtle bg-surface-2 p-4 space-y-3">
                <div className="text-xs font-semibold text-slate-950">Invite a teammate</div>
                <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-white border border-border-subtle focus:outline-none focus:border-blue-500/50 text-slate-950 transition-all"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg text-xs bg-white border border-border-subtle focus:outline-none focus:border-blue-500/50 text-slate-950 transition-all"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={teamLoading || !inviteEmail.trim()}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Invite Member
                </button>

                {lastInviteLink ? (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 space-y-2">
                    <div className="text-[11px] font-semibold text-blue-900">Invite link ready</div>
                    <p className="text-[11px] text-blue-700">
                      {inviteDeliveryMessage || "Email delivery is not configured yet, so share this link directly."}
                    </p>
                    <div className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-[11px] text-slate-700 break-all">
                      {lastInviteLink}
                    </div>
                    <button
                      type="button"
                      onClick={copyInviteLink}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-[11px] font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copiedInviteLink ? "Copied" : "Copy invite link"}
                    </button>
                  </div>
                ) : null}
              </form>
            )}

            {!teamLoading && team && !team.organization && !team.pendingInvites?.length ? (
              <div className="rounded-xl border border-dashed border-border-subtle bg-surface-2 px-4 py-6 text-xs text-text-secondary">
                We could not find a team workspace for this account yet. Refresh the page once, and if it still stays empty, we should inspect the project bootstrap record next.
              </div>
            ) : null}

            <div className="space-y-2">
              {(team?.members || []).map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-surface-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                      {member.userEmail.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-950">
                        {member.userEmail === userEmail ? `${displayName} (You)` : member.userEmail.split("@")[0]}
                      </div>
                      <div className="text-[10px] text-text-tertiary">{member.userEmail}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {canEditMember(member) ? (
                      <select
                        value={member.role}
                        onChange={(event) => void handleRoleChange(member.id, event.target.value)}
                        className="rounded-md border border-blue-200 bg-white px-2 py-1 text-[10px] font-semibold capitalize text-blue-700"
                      >
                        <option value="member">member</option>
                        {isOwner ? <option value="admin">admin</option> : null}
                      </select>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-700 font-semibold capitalize">
                        {member.role}
                      </span>
                    )}
                    {canEditMember(member) ? (
                      <button
                        type="button"
                        onClick={() => void handleRemoveMember(member.id)}
                        className="rounded-md border border-red-200 bg-white p-1 text-red-600 hover:bg-red-50"
                        title="Remove member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
              {!teamLoading && team?.organization && !team.members.length && (
                <div className="rounded-xl border border-dashed border-border-subtle bg-surface-2 px-4 py-6 text-xs text-text-secondary">
                  No active team members yet.
                </div>
              )}
            </div>

            {team?.invites?.length ? (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-950">Pending invites</div>
                {team.invites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-3 rounded-xl border border-border-subtle bg-surface-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-950">{invite.userEmail}</div>
                      <div className="text-[10px] text-text-tertiary">Waiting for acceptance</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-700 font-semibold capitalize">
                        {invite.role}
                      </span>
                      {canEditMember(invite) ? (
                        <button
                          type="button"
                          onClick={() => void handleRemoveMember(invite.id)}
                          className="rounded-md border border-red-200 bg-white p-1 text-red-600 hover:bg-red-50"
                          title="Revoke invite"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}

        {activeTab === "billing" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-950">Billing & Plan</h3>
            <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Current Plan</span>
                <h4 className="text-base font-bold text-slate-950 mt-0.5">Starter — Free</h4>
                <p className="text-[10px] text-text-secondary mt-1">10,000 API requests/month included</p>
              </div>
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90">
                Upgrade to Pro
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-text-secondary">
                <span>API Requests Used</span>
                <span>2,841 / 10,000</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-2 border border-border-subtle overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600" style={{ width: "28.4%" }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-950">Alert Preferences</h3>
            {[
              { title: "Latency Alerts", desc: "Notify when avg. latency exceeds 150ms." },
              { title: "Usage Threshold Warning", desc: "Notify at 80% of monthly quota." },
              { title: "Agent Error Triggers", desc: "Instant notification on pipeline exceptions." },
              { title: "New Member Joined", desc: "Notify when a new team member accepts invite." },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-4 py-3 border-b border-border-subtle last:border-0">
                <div>
                  <h4 className="text-xs font-semibold text-slate-950">{item.title}</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-8 h-4.5 bg-surface-3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3.5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-500 border border-border-medium" />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
