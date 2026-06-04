"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Brain,
  Activity,
  MessageSquare,
  BookOpen,
  Users,
  Bot,
  Workflow,
  FileCode,
  LineChart,
  Key,
  CreditCard,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  ChevronRight,
  Rocket,
  Flag,
} from "lucide-react";
import { signOut } from "@/lib/auth-actions";

const mainSidebarItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Onboarding", href: "/dashboard/onboarding", icon: Flag },
  { label: "Quickstart", href: "/dashboard/quickstart", icon: Rocket },
  { label: "Events", href: "/dashboard/events", icon: Activity },
  { label: "API Keys", href: "/dashboard/api-keys", icon: Key },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const playgroundItems = [
  { label: "Chatbots", href: "/dashboard/chatbots", icon: Bot },
  { label: "Examples", href: "/dashboard/examples", icon: BookOpen },
  { label: "Support Demo", href: "/dashboard/support-demo", icon: MessageSquare },
  { label: "Context Explorer", href: "/dashboard/memory-explorer", icon: Brain },
];

const productItems = [
  { label: "Workflows", href: "/dashboard/workflows", icon: Workflow },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Agents", href: "/dashboard/agents", icon: Workflow },
  { label: "Context Logs", href: "/dashboard/logs", icon: FileCode },
  { label: "Analytics", href: "/dashboard/analytics", icon: LineChart },
];

interface Props {
  children: React.ReactNode;
  userEmail: string;
  displayName: string;
  initials: string;
  onboardingComplete: boolean;
}

interface WorkspaceSummary {
  organization: {
    id: string;
    name: string;
  };
  project: {
    id: string;
    name: string;
  } | null;
  role: string | null;
}

export default function DashboardShell({ children, userEmail, displayName, initials, onboardingComplete }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("");
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [playgroundOpen, setPlaygroundOpen] = useState(pathname.startsWith("/dashboard/chatbots") || pathname.startsWith("/dashboard/examples") || pathname.startsWith("/dashboard/support-demo") || pathname.startsWith("/dashboard/memory-explorer"));
  const [productOpen, setProductOpen] = useState(pathname.startsWith("/dashboard/workflows") || pathname.startsWith("/dashboard/users") || pathname.startsWith("/dashboard/agents") || pathname.startsWith("/dashboard/logs") || pathname.startsWith("/dashboard/analytics"));
  const visibleMainItems = mainSidebarItems.filter((item) => {
    if (item.href === "/dashboard/onboarding") {
      return !onboardingComplete;
    }

    return onboardingComplete || item.href === "/dashboard/onboarding";
  });
  const visiblePlaygroundItems = onboardingComplete ? playgroundItems : [];
  const visibleProductItems = onboardingComplete ? productItems : [];
  const activeWorkspace = workspaces.find((workspace) => workspace.organization.id === activeWorkspaceId) ?? workspaces[0];

  useEffect(() => {
    if (!onboardingComplete) return;

    let mounted = true;
    setWorkspaceLoading(true);

    fetch("/api/appraise/v1/projects/workspaces", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body.error?.message || "Unable to load workspaces");
        }

        if (!mounted) return;
        setWorkspaces(body.workspaces || []);
        setActiveWorkspaceId(body.activeOrganizationId || body.workspaces?.[0]?.organization?.id || "");
      })
      .catch(() => {
        if (!mounted) return;
        setWorkspaces([]);
        setActiveWorkspaceId("");
      })
      .finally(() => {
        if (mounted) setWorkspaceLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [onboardingComplete]);

  function handleWorkspaceChange(nextWorkspaceId: string) {
    setActiveWorkspaceId(nextWorkspaceId);
    document.cookie = `appraise_active_workspace=${encodeURIComponent(nextWorkspaceId)}; path=/; max-age=31536000; samesite=lax`;
    window.location.reload();
  }

  return (
    <div className="min-h-screen flex bg-[#f7f8fb] text-slate-950 relative">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white h-screen sticky top-0">
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-border-subtle">
          <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center shadow-sm">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-950 tracking-tight">Appraise</span>
          <span className="ml-auto px-2 py-1 rounded-full text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">Console</span>
        </div>

        {onboardingComplete && (
          <div className="border-b border-border-subtle px-3 py-3">
            <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              Workspace
            </div>
            <select
              value={activeWorkspaceId}
              onChange={(event) => handleWorkspaceChange(event.target.value)}
              disabled={workspaceLoading || workspaces.length === 0}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-900 outline-none"
            >
              {workspaces.length === 0 ? (
                <option value="">{workspaceLoading ? "Loading workspaces..." : "No workspaces yet"}</option>
              ) : (
                workspaces.map((workspace) => (
                  <option key={workspace.organization.id} value={workspace.organization.id}>
                    {workspace.organization.name} {workspace.role ? `(${workspace.role})` : ""}
                  </option>
                ))
              )}
            </select>
            {activeWorkspace?.project?.name ? (
              <div className="mt-2 px-2 text-[11px] text-slate-500">
                Project: <span className="font-medium text-slate-700">{activeWorkspace.project.name}</span>
              </div>
            ) : null}
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
          <NavSection
            title="Workspace"
            items={visibleMainItems}
            pathname={pathname}
            onboardingComplete={onboardingComplete}
          />

          {visiblePlaygroundItems.length > 0 && (
            <div className="space-y-1">
              <button
                onClick={() => setPlaygroundOpen((value) => !value)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                {playgroundOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                Playground
              </button>
              {playgroundOpen && (
                <div className="space-y-0.5">
                  {visiblePlaygroundItems.map((item) => (
                    <NavItem key={item.href} item={item} pathname={pathname} />
                  ))}
                </div>
              )}
            </div>
          )}

          {visibleProductItems.length > 0 && (
            <div className="space-y-1">
              <button
                onClick={() => setProductOpen((value) => !value)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                {productOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                Product Data
              </button>
              {productOpen && (
                <div className="space-y-0.5">
                  {visibleProductItems.map((item) => (
                    <NavItem key={item.href} item={item} pathname={pathname} />
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-border-subtle">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-100 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {initials}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="text-xs font-semibold text-slate-900 truncate">{displayName}</div>
                <div className="text-[10px] text-slate-500 truncate">{userEmail}</div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden z-50">
                <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-all">
                  <Settings className="w-3.5 h-3.5" />
                  Account Settings
                </Link>
                <div className="border-t border-slate-200" />
                <form action={signOut}>
                  <button type="submit" className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 transition-all">
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} className="lg:hidden fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm" />
      )}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-slate-200 bg-white transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-14 flex items-center justify-between px-5 border-b border-border-subtle">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-slate-950">Appraise</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="text-slate-500 hover:text-slate-950">
            <X className="w-4.5 h-4.5" />
          </button>
        </div>
        <nav className="p-3 space-y-4">
          <NavSection
            title="Workspace"
            items={visibleMainItems}
            pathname={pathname}
            onboardingComplete={onboardingComplete}
            onNavigate={() => setMobileOpen(false)}
          />

          {visiblePlaygroundItems.length > 0 && (
            <div className="space-y-1">
              <button
                onClick={() => setPlaygroundOpen((value) => !value)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                {playgroundOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                Playground
              </button>
              {playgroundOpen && (
                <div className="space-y-0.5">
                  {visiblePlaygroundItems.map((item) => (
                    <NavItem key={item.href} item={item} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {visibleProductItems.length > 0 && (
            <div className="space-y-1">
              <button
                onClick={() => setProductOpen((value) => !value)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                {productOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                Product Data
              </button>
              {productOpen && (
                <div className="space-y-0.5">
                  {visibleProductItems.map((item) => (
                    <NavItem key={item.href} item={item} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>
        <div className="p-3 border-t border-border-subtle absolute bottom-0 w-full">
          <form action={signOut}>
            <button type="submit" className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-all">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-all">
              <Menu className="w-4.5 h-4.5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search console..."
                className="w-64 pl-8.5 pr-4 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-400 text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>
            {onboardingComplete && activeWorkspace ? (
              <div className="hidden xl:flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-800">{activeWorkspace.organization.name}</span>
                {activeWorkspace.role ? <span className="ml-2 capitalize">{activeWorkspace.role}</span> : null}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-950 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                {initials}
              </div>
              <span className="text-xs font-semibold text-slate-900 hidden md:inline">{displayName}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function NavSection({
  title,
  items,
  pathname,
  onboardingComplete,
  onNavigate,
}: {
  title: string;
  items: Array<{ label: string; href: string; icon: React.ComponentType<{ className?: string }> }>;
  pathname: string;
  onboardingComplete: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-1">
      <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</div>
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} onboardingComplete={onboardingComplete} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function NavItem({
  item,
  pathname,
  onboardingComplete,
  onNavigate,
}: {
  item: { label: string; href: string; icon: React.ComponentType<{ className?: string }> };
  pathname: string;
  onboardingComplete?: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon;
  const isActive = pathname === item.href;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
        isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
      {item.label}
      {item.href === "/dashboard/onboarding" && !onboardingComplete && (
        <span className="ml-auto rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-amber-700">
          Setup
        </span>
      )}
      {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}
    </Link>
  );
}
