"use client";

import React, { useState } from "react";
import { Search, Filter, AlertCircle, RefreshCw } from "lucide-react";
import { retrievalLogs } from "@/lib/mock-data";
import { timeAgo, formatLatency } from "@/lib/utils";

export default function LogsDashboard() {
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredLogs = retrievalLogs.filter((log) => {
    const matchesQuery =
      log.query.toLowerCase().includes(filterQuery.toLowerCase()) ||
      log.userId.toLowerCase().includes(filterQuery.toLowerCase());

    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus;

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Context Logs</h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time tracking of decision context requests.
          </p>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-2 border border-border-subtle hover:bg-surface-3 transition-colors text-slate-950">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Streams
        </button>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 rounded-xl border border-border-subtle bg-surface-1">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search queries, user IDs..."
            className="w-full pl-9 pr-4 py-2 rounded-lg text-xs bg-surface-2 border border-border-subtle focus:outline-none focus:border-accent-blue text-slate-950"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-text-tertiary hidden sm:block" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-lg text-xs bg-surface-2 border border-border-subtle text-slate-950 focus:outline-none focus:border-accent-blue"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="partial">Partial</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Table grid layout */}
      <div className="border border-border-subtle rounded-xl overflow-hidden bg-surface-1">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-border-subtle bg-surface-2/50 text-text-secondary font-bold">
                <th className="p-4">Query</th>
                <th className="p-4">User ID</th>
                <th className="p-4">Recall Items</th>
                <th className="p-4">Latency</th>
                <th className="p-4">Status</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-text-secondary">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-2/30 transition-all">
                    <td className="p-4 font-mono text-slate-950 max-w-xs truncate" title={log.query}>
                      {log.query}
                    </td>
                    <td className="p-4 font-mono text-xs">{log.userId}</td>
                    <td className="p-4 font-semibold text-slate-950">{log.results} matches</td>
                    <td className="p-4 font-mono">
                      <span
                        className={`${
                          log.latency < 20
                            ? "text-green-700"
                            : log.latency < 50
                            ? "text-yellow-700"
                            : "text-red-600"
                        }`}
                      >
                        {formatLatency(log.latency)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                          log.status === "success"
                            ? "bg-green-500/10 border-green-500/20 text-green-700"
                            : log.status === "partial"
                            ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-700"
                            : "bg-red-500/10 border-red-500/20 text-red-600"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4">{timeAgo(log.timestamp)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-text-tertiary mb-3 animate-pulse" />
                      <span className="text-xs font-semibold text-slate-950">No query logs found</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
