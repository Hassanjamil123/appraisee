"use client";

import React, { useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { users } from "@/lib/mock-data";
import { timeAgo, formatNumber } from "@/lib/utils";

export default function UsersDashboard() {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Users</h1>
          <p className="text-xs text-text-secondary mt-1">
            Browse and debug context signals stored per user profile.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-90 text-white transition-opacity">
          <UserPlus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {/* Control bar */}
      <div className="p-4 rounded-xl border border-border-subtle bg-surface-1">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name, email..."
            className="w-full pl-9 pr-4 py-2 rounded-lg text-xs bg-surface-2 border border-border-subtle focus:outline-none focus:border-accent-blue text-slate-950"
          />
        </div>
      </div>

      {/* Users table */}
      <div className="border border-border-subtle rounded-xl overflow-hidden bg-surface-1">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-2/50 text-text-secondary font-bold">
                <th className="p-4">User</th>
                <th className="p-4">Context Signals</th>
                <th className="p-4">Last Activity</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-2/30 transition-all">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple p-[1px]">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                        {user.name.slice(0, 2)}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-950">{user.name}</div>
                      <div className="text-[10px] text-text-tertiary">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-semibold text-slate-950">
                    {formatNumber(user.memoriesCount)}
                  </td>
                  <td className="p-4">{timeAgo(user.lastActive)}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        user.status === "active"
                          ? "bg-green-500/10 border-green-500/20 text-green-700"
                          : "bg-surface-2 border-border-subtle text-text-tertiary"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-green-400" : "bg-text-tertiary"}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
