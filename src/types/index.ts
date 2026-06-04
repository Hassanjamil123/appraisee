// ========== Memory Types ==========
export interface Memory {
  id: string;
  userId: string;
  content: string;
  type: "preference" | "fact" | "interaction" | "workflow" | "context";
  category: string;
  timestamp: string;
  sessionId?: string;
  confidence: number;
  tags: string[];
  summary?: string;
}

export interface MemorySession {
  id: string;
  userId: string;
  startedAt: string;
  endedAt?: string;
  memoryCount: number;
  summary: string;
}

// ========== User Types ==========
export interface AppUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  memoriesCount: number;
  lastActive: string;
  status: "active" | "inactive";
  createdAt: string;
}

// ========== Agent Types ==========
export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "running" | "idle" | "error";
  memoriesAccessed: number;
  lastActive: string;
  model: string;
  workflowId?: string;
}

// ========== Workflow Types ==========
export interface WorkflowNode {
  id: string;
  type: "input" | "memory_retrieval" | "reasoning" | "context_injection" | "action" | "feedback_loop";
  label: string;
  x: number;
  y: number;
  description?: string;
}

export interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  status: "active" | "draft" | "archived";
  lastRun?: string;
}

// ========== API Key Types ==========
export interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  status: "active" | "revoked";
  permissions: string[];
}

// ========== Retrieval Log Types ==========
export interface RetrievalLog {
  id: string;
  query: string;
  userId: string;
  agentId?: string;
  results: number;
  latency: number;
  timestamp: string;
  status: "success" | "partial" | "error";
}

// ========== Analytics Types ==========
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface DashboardStats {
  totalMemories: number;
  retrievalRequests: number;
  activeAgents: number;
  contextAccuracy: number;
  avgLatency: number;
  memoryUsage: number;
  memoriesTrend: number;
  retrievalTrend: number;
  agentsTrend: number;
  accuracyTrend: number;
}

// ========== Pricing Types ==========
export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

// ========== Docs Types ==========
export interface DocSection {
  id: string;
  title: string;
  items: DocItem[];
}

export interface DocItem {
  id: string;
  title: string;
  slug: string;
}

// ========== Navigation Types ==========
export interface SidebarItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}
