"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Clipboard, Eye, EyeOff, Key, Loader2, Plus } from "lucide-react";

interface ProjectRecord {
  id: string;
  name: string;
  config?: {
    defaultApiKeyName?: string;
    useCase?: string;
  };
}

interface TeamSummary {
  currentUserRole: string | null;
}

interface ApiKeyRecord {
  id: string;
  name: string;
  prefix: string;
  permissions: string[];
  status: "active" | "revoked";
  lastUsedAt?: string | null;
  createdAt: string;
}

export default function APIKeysDashboard() {
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [teamSummary, setTeamSummary] = useState<TeamSummary | null>(null);
  const [keysList, setKeysList] = useState<ApiKeyRecord[]>([]);
  const [secrets, setSecrets] = useState<Record<string, string>>({});
  const [revealKey, setRevealKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestedKeyName = useMemo(() => {
    if (newKeyName.trim()) return newKeyName;
    if (project?.config?.defaultApiKeyName) return project.config.defaultApiKeyName;
    if (project?.name) return `${project.name} Server Key`;
    return "Primary Server Key";
  }, [newKeyName, project]);
  const canManageKeys = teamSummary?.currentUserRole === "owner" || teamSummary?.currentUserRole === "admin";

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [projectResponse, keysResponse, teamResponse] = await Promise.all([
          fetch("/api/appraise/v1/projects/current", { cache: "no-store" }),
          fetch("/api/appraise/v1/api-keys", { cache: "no-store" }),
          fetch("/api/appraise/v1/teams/current", { cache: "no-store" }),
        ]);

        const projectBody = await projectResponse.json();
        const keysBody = await keysResponse.json();
        const teamBody = await teamResponse.json();

        if (!mounted) return;

        if (!projectResponse.ok) {
          throw new Error(projectBody.error?.message || "Unable to load project");
        }

        if (!keysResponse.ok) {
          throw new Error(keysBody.error?.message || "Unable to load API keys");
        }

        if (!teamResponse.ok) {
          throw new Error(teamBody.error?.message || "Unable to load team access");
        }

        setProject(projectBody.project || null);
        setKeysList(keysBody.apiKeys || []);
        setTeamSummary({ currentUserRole: teamBody.currentUserRole || null });
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Unable to load API keys");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCopy = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateKey = async () => {
    if (!suggestedKeyName.trim() || !canManageKeys) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/appraise/v1/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: suggestedKeyName,
          permissions: ["read", "write", "admin"],
        }),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error?.message || "Unable to create API key");
      }

      const createdKey: ApiKeyRecord = {
        id: body.id,
        name: body.name,
        prefix: body.prefix,
        permissions: body.permissions,
        status: "active",
        lastUsedAt: null,
        createdAt: body.createdAt,
      };

      setProject((current) =>
        current
          ? {
              ...current,
              config: {
                ...current.config,
                defaultApiKeyName: body.name,
              },
            }
          : current,
      );
      setKeysList((current) => [createdKey, ...current]);
      setSecrets((current) => ({ ...current, [body.id]: body.key }));
      setRevealKey(body.id);
      setCopiedKey(null);
      setNewKeyName("");
      setShowModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create API key");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!canManageKeys) return;
    setError(null);

    try {
      const response = await fetch(`/api/appraise/v1/api-keys/${id}`, {
        method: "DELETE",
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error?.message || "Unable to revoke API key");
      }

      setKeysList((current) =>
        current.map((keyItem) => (keyItem.id === id ? { ...keyItem, status: "revoked" } : keyItem)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to revoke API key");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">API Keys</h1>
          <p className="text-xs text-text-secondary mt-1">
            Generate credentials for {project?.name || "your project"} and load them in your backend SDK or API integration.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={!canManageKeys}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-90 text-white transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Create New Key
        </button>
      </div>

      {project && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-600 shadow-sm">
          <div className="font-semibold text-slate-950">{project.name}</div>
          <div className="mt-1">
            Use case: {(project.config?.useCase || "general_chatbot").replaceAll("_", " ")}
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {error}
        </div>
      )}

      {!loading && !canManageKeys && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          You have read-only access in this workspace. Only owners and admins can create or revoke API keys.
        </div>
      )}

      <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-300 leading-relaxed flex gap-3 items-start">
        <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-amber-400" />
        <div>
          <strong className="text-slate-950">API Key Protection:</strong> Secret keys grant raw read and write context indexing privileges. Store them in server environment variables and copy them now because Appraise only returns the full secret at creation time.
        </div>
      </div>

      <div className="border border-border-subtle rounded-xl overflow-hidden bg-surface-1">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-2/50 text-text-secondary font-bold">
                <th className="p-4">Name</th>
                <th className="p-4">Secret Key</th>
                <th className="p-4">Created At</th>
                <th className="p-4">Permissions</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8">
                    <div className="flex items-center justify-center gap-2 text-slate-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading keys...
                    </div>
                  </td>
                </tr>
              ) : keysList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No API keys yet. Create your first server key for this project.
                  </td>
                </tr>
              ) : (
                keysList.map((keyItem) => {
                  const isRevealed = revealKey === keyItem.id;
                  const isCopied = copiedKey === keyItem.id;
                  const secret = secrets[keyItem.id];
                  const maskedValue = secret
                    ? `${secret.slice(0, 18)}...${secret.slice(-6)}`
                    : `${keyItem.prefix}••••••••••••••••`;

                  return (
                    <tr key={keyItem.id} className="hover:bg-surface-2/30 transition-all">
                      <td className="p-4 font-semibold text-slate-950">{keyItem.name}</td>
                      <td className="p-4 font-mono">{isRevealed && secret ? secret : maskedValue}</td>
                      <td className="p-4">{new Date(keyItem.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {keyItem.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="px-2 py-0.5 rounded bg-surface-2 border border-border-subtle text-[10px] text-text-secondary font-medium font-mono uppercase"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            keyItem.status === "active"
                              ? "bg-green-500/10 border-green-500/20 text-green-700"
                              : "bg-red-500/10 border-red-500/20 text-red-600"
                          }`}
                        >
                          {keyItem.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {secret && (
                          <button
                            onClick={() => setRevealKey(isRevealed ? null : keyItem.id)}
                            className="p-1 rounded hover:bg-surface-2 text-text-secondary hover:text-slate-950"
                            title={isRevealed ? "Hide Key" : "Reveal Key"}
                          >
                            {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                        {secret && (
                          <button
                            onClick={() => handleCopy(secret, keyItem.id)}
                            className="p-1 rounded hover:bg-surface-2 text-text-secondary hover:text-slate-950"
                            title="Copy Key"
                          >
                            {isCopied ? <Check className="w-4 h-4 text-green-700" /> : <Clipboard className="w-4 h-4" />}
                          </button>
                        )}
                        {keyItem.status === "active" && (
                          <button
                            onClick={() => void handleRevokeKey(keyItem.id)}
                            disabled={!canManageKeys}
                            className="p-1 rounded hover:bg-surface-2 text-red-600 hover:text-red-700 font-semibold disabled:opacity-50"
                            title="Revoke Key"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-border-subtle bg-surface-1 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
              <Key className="w-4 h-4 text-accent-blue" />
              Create API Key
            </h3>
            <p className="text-xs text-text-secondary">
              Name the key to identify this token in your backend integration.
            </p>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-text-secondary uppercase">Key Name</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder={project?.config?.defaultApiKeyName || "Production Core App"}
                className="w-full px-3.5 py-2 rounded-lg text-xs bg-surface-2 border border-border-subtle focus:outline-none focus:border-accent-blue text-slate-950"
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs text-slate-600">
              This key will be created for <span className="font-semibold text-slate-950">{project?.name || "your project"}</span> with read, write, and admin permissions.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-surface-2 border border-border-subtle text-slate-950 hover:bg-surface-3"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleCreateKey()}
                disabled={submitting || !canManageKeys}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:opacity-95 disabled:opacity-70"
              >
                {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Generate Token
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
