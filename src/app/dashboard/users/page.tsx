"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Search, Users } from "lucide-react";
import { formatNumber, timeAgo } from "@/lib/utils";

interface ConsoleUser {
  id: string;
  name: string;
  email: string;
  status: string;
  role?: string;
  memoriesCount: number;
  lastActive?: string | null;
  createdAt: string;
}

export default function UsersDashboard() {
  const [users, setUsers] = useState<ConsoleUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/appraise/v1/users", { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Unable to load users");
      setUsers(body.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return users.filter((user) => `${user.name} ${user.email} ${user.role || ""}`.toLowerCase().includes(needle));
  }, [users, query]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="mt-1 text-xs text-text-secondary">Workspace members and actor identities that have produced Appraise activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric label="Workspace users" value={users.length.toString()} />
        <Metric label="Active identities" value={users.filter((user) => user.status === "active").length.toString()} />
        <Metric label="Tracked signals" value={formatNumber(users.reduce((sum, user) => sum + user.memoriesCount, 0))} />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users by name, email, or role..." className="w-full rounded-xl border border-border-subtle bg-surface-1 py-3 pl-10 pr-4 text-xs outline-none focus:border-accent-blue" />
      </div>

      {error ? <ErrorState message={error} /> : null}

      <div className="overflow-hidden rounded-xl border border-border-subtle bg-surface-1">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b border-border-subtle bg-surface-2/60 text-text-secondary">
              <tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Tracked signals</th><th className="p-4">Last active</th><th className="p-4">Status</th><th className="p-4">Created</th></tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-surface-2/40">
                  <td className="p-4">
                    <div className="font-semibold text-slate-950">{user.name || user.email}</div>
                    <div className="mt-1 text-[10px] text-text-tertiary">{user.email}</div>
                  </td>
                  <td className="p-4 capitalize text-text-secondary">{user.role || "member"}</td>
                  <td className="p-4 font-mono text-slate-950">{formatNumber(user.memoriesCount)}</td>
                  <td className="p-4 text-text-secondary">{user.lastActive ? timeAgo(user.lastActive) : "never"}</td>
                  <td className="p-4">
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-[10px] text-blue-700 capitalize">
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-text-tertiary">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 ? <div className="p-10 text-center text-xs text-text-secondary">No users found for this workspace yet.</div> : null}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-border-subtle bg-surface-1 p-5"><Users className="h-4 w-4 text-accent-blue" /><p className="mt-4 text-2xl font-bold">{value}</p><p className="mt-1 text-[11px] text-text-secondary">{label}</p></div>;
}

function ErrorState({ message }: { message: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-red-700"><AlertCircle className="h-4 w-4" />{message}</div>;
}
