import type {
  Memory,
  AppUser,
  Agent,
  RetrievalLog,
  DashboardStats,
  ChartDataPoint,
  Workflow,
  WorkflowNode,
  WorkflowConnection,
  APIKey,
  PricingTier,
  MemorySession,
} from "@/types";

// ========== Dashboard Stats ==========
export const dashboardStats: DashboardStats = {
  totalMemories: 2_847_392,
  retrievalRequests: 12_584_201,
  activeAgents: 847,
  contextAccuracy: 97.3,
  avgLatency: 23,
  memoryUsage: 78.5,
  memoriesTrend: 12.5,
  retrievalTrend: 8.3,
  agentsTrend: 23.1,
  accuracyTrend: 1.2,
};

// ========== Chart Data ==========
export const retrievalGrowthData: ChartDataPoint[] = [
  { date: "Jan", value: 4200 },
  { date: "Feb", value: 5800 },
  { date: "Mar", value: 7200 },
  { date: "Apr", value: 9100 },
  { date: "May", value: 11800 },
  { date: "Jun", value: 14200 },
  { date: "Jul", value: 18500 },
  { date: "Aug", value: 22100 },
  { date: "Sep", value: 28400 },
  { date: "Oct", value: 35200 },
  { date: "Nov", value: 42800 },
  { date: "Dec", value: 51200 },
];

export const userMemoryActivityData: ChartDataPoint[] = [
  { date: "Mon", value: 3200 },
  { date: "Tue", value: 4100 },
  { date: "Wed", value: 3800 },
  { date: "Thu", value: 5200 },
  { date: "Fri", value: 4600 },
  { date: "Sat", value: 2100 },
  { date: "Sun", value: 1800 },
];

export const agentInteractionsData: ChartDataPoint[] = [
  { date: "Week 1", value: 1200 },
  { date: "Week 2", value: 1800 },
  { date: "Week 3", value: 2400 },
  { date: "Week 4", value: 2100 },
  { date: "Week 5", value: 3200 },
  { date: "Week 6", value: 3800 },
  { date: "Week 7", value: 4200 },
  { date: "Week 8", value: 5100 },
];

// ========== Context Explorer Data ==========
export const memories: Memory[] = [
  {
    id: "mem_01",
    userId: "user_123",
    content: "User prefers concise, direct answers without excessive explanation.",
    type: "preference",
    category: "Communication Style",
    timestamp: "2025-05-30T14:22:00Z",
    sessionId: "sess_a1",
    confidence: 0.95,
    tags: ["preference", "communication", "style"],
    summary: "Prefers brevity in responses",
  },
  {
    id: "mem_02",
    userId: "user_123",
    content: "Working on a Next.js e-commerce platform with Stripe integration.",
    type: "context",
    category: "Project Context",
    timestamp: "2025-05-30T13:45:00Z",
    sessionId: "sess_a1",
    confidence: 0.98,
    tags: ["project", "nextjs", "ecommerce", "stripe"],
    summary: "Building Next.js + Stripe e-commerce app",
  },
  {
    id: "mem_03",
    userId: "user_123",
    content: "User is a senior full-stack developer with 8 years of experience in React and TypeScript.",
    type: "fact",
    category: "User Profile",
    timestamp: "2025-05-29T10:30:00Z",
    sessionId: "sess_b2",
    confidence: 0.92,
    tags: ["profile", "experience", "skills"],
    summary: "Senior full-stack dev, React/TS expert",
  },
  {
    id: "mem_04",
    userId: "user_456",
    content: "Requested API rate limit increase for production deployment. Current limit: 1000 req/min.",
    type: "interaction",
    category: "Account",
    timestamp: "2025-05-28T16:10:00Z",
    sessionId: "sess_c3",
    confidence: 0.88,
    tags: ["api", "rate-limit", "production"],
    summary: "Needs higher API rate limits",
  },
  {
    id: "mem_05",
    userId: "user_789",
    content: "Agent workflow: Fetch user context → Retrieve relevant context → Generate personalized response → Track interaction outcome.",
    type: "workflow",
    category: "Agent Workflow",
    timestamp: "2025-05-28T09:20:00Z",
    confidence: 0.97,
    tags: ["workflow", "agent", "personalization"],
    summary: "Personalized response generation workflow",
  },
  {
    id: "mem_06",
    userId: "user_123",
    content: "Timezone: PST (UTC-8). Typically active between 9am-6pm.",
    type: "fact",
    category: "User Profile",
    timestamp: "2025-05-27T11:00:00Z",
    confidence: 0.90,
    tags: ["timezone", "availability"],
    summary: "PST timezone, active business hours",
  },
  {
    id: "mem_07",
    userId: "user_456",
    content: "Uses dark mode in all applications. Prefers minimal UI with keyboard shortcuts.",
    type: "preference",
    category: "UI Preferences",
    timestamp: "2025-05-26T14:30:00Z",
    confidence: 0.93,
    tags: ["ui", "dark-mode", "keyboard"],
    summary: "Dark mode + keyboard-first UI preference",
  },
  {
    id: "mem_08",
    userId: "user_789",
    content: "Completed onboarding flow. Integrated Python SDK. First context signal tracked successfully.",
    type: "interaction",
    category: "Onboarding",
    timestamp: "2025-05-25T08:15:00Z",
    confidence: 0.99,
    tags: ["onboarding", "python", "sdk"],
    summary: "Completed onboarding with Python SDK",
  },
];

export const memorySessions: MemorySession[] = [
  { id: "sess_a1", userId: "user_123", startedAt: "2025-05-30T13:30:00Z", endedAt: "2025-05-30T14:30:00Z", memoryCount: 4, summary: "E-commerce project debugging session" },
  { id: "sess_b2", userId: "user_123", startedAt: "2025-05-29T10:00:00Z", endedAt: "2025-05-29T11:15:00Z", memoryCount: 3, summary: "Profile setup and preference configuration" },
  { id: "sess_c3", userId: "user_456", startedAt: "2025-05-28T15:45:00Z", endedAt: "2025-05-28T16:30:00Z", memoryCount: 2, summary: "API configuration and rate limit discussion" },
];

// ========== Users ==========
export const users: AppUser[] = [
  { id: "user_123", name: "Sarah Chen", email: "sarah@acme.ai", memoriesCount: 1247, lastActive: "2025-05-30T14:22:00Z", status: "active", createdAt: "2024-11-15T00:00:00Z" },
  { id: "user_456", name: "Marcus Johnson", email: "marcus@buildai.co", memoriesCount: 892, lastActive: "2025-05-28T16:10:00Z", status: "active", createdAt: "2024-12-01T00:00:00Z" },
  { id: "user_789", name: "Aiko Tanaka", email: "aiko@nexgen.dev", memoriesCount: 2103, lastActive: "2025-05-25T08:15:00Z", status: "active", createdAt: "2024-10-20T00:00:00Z" },
  { id: "user_101", name: "James Rivera", email: "james@cortex.ai", memoriesCount: 567, lastActive: "2025-05-20T12:00:00Z", status: "inactive", createdAt: "2025-01-05T00:00:00Z" },
  { id: "user_102", name: "Elena Petrov", email: "elena@synaptic.io", memoriesCount: 3421, lastActive: "2025-05-30T09:00:00Z", status: "active", createdAt: "2024-09-10T00:00:00Z" },
  { id: "user_103", name: "David Kim", email: "david@neural.app", memoriesCount: 1850, lastActive: "2025-05-29T17:30:00Z", status: "active", createdAt: "2024-11-28T00:00:00Z" },
];

// ========== Agents ==========
export const agents: Agent[] = [
  { id: "agent_01", name: "Customer Support Agent", description: "Handles tier-1 support queries with operational context", status: "running", memoriesAccessed: 45200, lastActive: "2025-05-30T14:30:00Z", model: "gpt-4o" },
  { id: "agent_02", name: "Onboarding Assistant", description: "Guides new users through setup with personalized steps", status: "running", memoriesAccessed: 12800, lastActive: "2025-05-30T14:25:00Z", model: "claude-3.5-sonnet" },
  { id: "agent_03", name: "Code Review Agent", description: "Reviews PRs with project-specific context and patterns", status: "idle", memoriesAccessed: 8900, lastActive: "2025-05-30T12:00:00Z", model: "gpt-4o" },
  { id: "agent_04", name: "Research Analyst", description: "Synthesizes research with historical context awareness", status: "running", memoriesAccessed: 67300, lastActive: "2025-05-30T14:28:00Z", model: "claude-3.5-sonnet" },
  { id: "agent_05", name: "Sales Copilot", description: "Assists sales reps with customer history and preferences", status: "error", memoriesAccessed: 23100, lastActive: "2025-05-30T10:15:00Z", model: "gpt-4o-mini" },
  { id: "agent_06", name: "Content Writer", description: "Generates content with brand voice context and style guides", status: "idle", memoriesAccessed: 15400, lastActive: "2025-05-29T18:00:00Z", model: "gpt-4o" },
];

// ========== Context Logs ==========
export const retrievalLogs: RetrievalLog[] = [
  { id: "log_01", query: "user preferences for response style", userId: "user_123", agentId: "agent_01", results: 4, latency: 18, timestamp: "2025-05-30T14:22:05Z", status: "success" },
  { id: "log_02", query: "previous project context and tech stack", userId: "user_123", agentId: "agent_03", results: 7, latency: 24, timestamp: "2025-05-30T14:20:12Z", status: "success" },
  { id: "log_03", query: "customer support ticket history", userId: "user_456", agentId: "agent_01", results: 12, latency: 31, timestamp: "2025-05-30T14:18:30Z", status: "success" },
  { id: "log_04", query: "onboarding progress and completion", userId: "user_789", results: 2, latency: 15, timestamp: "2025-05-30T14:15:00Z", status: "success" },
  { id: "log_05", query: "brand voice guidelines and examples", userId: "user_102", agentId: "agent_06", results: 0, latency: 45, timestamp: "2025-05-30T14:12:00Z", status: "partial" },
  { id: "log_06", query: "sales call notes from last quarter", userId: "user_101", agentId: "agent_05", results: 0, latency: 120, timestamp: "2025-05-30T14:10:00Z", status: "error" },
  { id: "log_07", query: "code patterns for authentication module", userId: "user_103", agentId: "agent_03", results: 8, latency: 22, timestamp: "2025-05-30T14:08:00Z", status: "success" },
  { id: "log_08", query: "user timezone and availability", userId: "user_123", results: 1, latency: 12, timestamp: "2025-05-30T14:05:00Z", status: "success" },
];

// ========== Workflows ==========
export const defaultWorkflowNodes: WorkflowNode[] = [
  { id: "node_1", type: "input", label: "User Input", x: 100, y: 200, description: "Receive user query or action" },
  { id: "node_2", type: "memory_retrieval", label: "Memory Retrieval", x: 350, y: 120, description: "Fetch relevant memories and context" },
  { id: "node_3", type: "reasoning", label: "Reasoning", x: 600, y: 200, description: "Process and analyze with LLM" },
  { id: "node_4", type: "context_injection", label: "Context Injection", x: 350, y: 300, description: "Enrich prompt with retrieved context" },
  { id: "node_5", type: "action", label: "Action", x: 850, y: 200, description: "Execute response or task" },
  { id: "node_6", type: "feedback_loop", label: "Feedback Loop", x: 600, y: 380, description: "Store new memories from interaction" },
];

export const defaultWorkflowConnections: WorkflowConnection[] = [
  { id: "conn_1", from: "node_1", to: "node_2" },
  { id: "conn_2", from: "node_2", to: "node_4" },
  { id: "conn_3", from: "node_4", to: "node_3" },
  { id: "conn_4", from: "node_1", to: "node_3" },
  { id: "conn_5", from: "node_3", to: "node_5" },
  { id: "conn_6", from: "node_5", to: "node_6" },
  { id: "conn_7", from: "node_6", to: "node_2" },
];

export const workflows: Workflow[] = [
  {
    id: "wf_01",
    name: "Customer Support Pipeline",
    description: "Full support workflow with context-aware responses",
    nodes: defaultWorkflowNodes,
    connections: defaultWorkflowConnections,
    status: "active",
    lastRun: "2025-05-30T14:20:00Z",
  },
  {
    id: "wf_02",
    name: "Onboarding Flow",
    description: "Personalized onboarding with user preference learning",
    nodes: defaultWorkflowNodes,
    connections: defaultWorkflowConnections,
    status: "active",
    lastRun: "2025-05-30T12:00:00Z",
  },
  {
    id: "wf_03",
    name: "Research Synthesis",
    description: "Multi-source research with operational context recall",
    nodes: defaultWorkflowNodes,
    connections: defaultWorkflowConnections,
    status: "draft",
  },
];

// ========== API Keys ==========
export const apiKeys: APIKey[] = [
  { id: "key_01", name: "Production", key: "ap_live_sk_7f8a9b2c3d4e5f6g7h8i9j0k", createdAt: "2025-01-15T00:00:00Z", lastUsed: "2025-05-30T14:30:00Z", status: "active", permissions: ["read", "write", "admin"] },
  { id: "key_02", name: "Development", key: "ap_test_sk_1a2b3c4d5e6f7g8h9i0j1k2l", createdAt: "2025-02-20T00:00:00Z", lastUsed: "2025-05-30T10:00:00Z", status: "active", permissions: ["read", "write"] },
  { id: "key_03", name: "CI/CD Pipeline", key: "ap_live_sk_9z8y7x6w5v4u3t2s1r0q9p8o", createdAt: "2025-03-10T00:00:00Z", lastUsed: "2025-05-28T08:00:00Z", status: "active", permissions: ["read"] },
  { id: "key_04", name: "Staging (Old)", key: "ap_test_sk_4m5n6o7p8q9r0s1t2u3v4w5x", createdAt: "2024-12-01T00:00:00Z", status: "revoked", permissions: ["read", "write"] },
];

// ========== Pricing ==========
export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for experimenting and prototyping AI context features.",
    features: [
      "10,000 API requests/month",
      "100MB context storage",
      "2 workflows",
      "1 agent",
      "Community support",
      "Basic analytics",
      "TypeScript & Python SDKs",
    ],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For growing teams building production AI applications.",
    features: [
      "500,000 API requests/month",
      "10GB context storage",
      "Unlimited workflows",
      "25 agents",
      "Priority email support",
      "Advanced analytics",
      "Webhooks",
      "Custom context schemas",
      "Team collaboration",
      "99.9% uptime SLA",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Scale",
    price: "Custom",
    description: "Enterprise-grade context infrastructure for mission-critical AI.",
    features: [
      "Unlimited API requests",
      "Unlimited storage",
      "Unlimited workflows",
      "Unlimited agents",
      "Dedicated support engineer",
      "Custom analytics & dashboards",
      "SSO & SAML",
      "SOC 2 compliance",
      "On-premise deployment",
      "Custom SLA",
      "Dedicated infrastructure",
    ],
    cta: "Contact Sales",
  },
];

// ========== Trusted By Logos ==========
export const trustedByCompanies = [
  "Anthropic", "OpenAI", "Vercel", "Supabase", "Pinecone",
  "LangChain", "Replicate", "Hugging Face", "Cohere", "Modal",
  "Weights & Biases", "Scale AI",
];

// ========== Feature Cards ==========
export const features = [
  {
    title: "Decision History",
    description: "Persistent storage of user interactions, preferences, and context that survives across sessions and deployments.",
    icon: "Brain",
  },
  {
    title: "Context Recall",
    description: "Workflow-aware recall that understands pressure, state, and intent, not just keywords.",
    icon: "Search",
  },
  {
    title: "User Context Graphs",
    description: "Rich knowledge graphs that map relationships between users, interactions, preferences, and behaviors.",
    icon: "GitBranch",
  },
  {
    title: "Workflow Intelligence",
    description: "Orchestrate complex AI agent workflows with context-aware decision trees and context injection.",
    icon: "Workflow",
  },
  {
    title: "Agent Context",
    description: "Give your AI agents operational context that evolves with every interaction and decision.",
    icon: "Bot",
  },
  {
    title: "Multi-session Recall",
    description: "Seamlessly recall context from any previous session, enabling continuous conversations across time.",
    icon: "History",
  },
  {
    title: "Real-time Personalization",
    description: "Dynamically adapt AI responses based on accumulated user knowledge and evolving preferences.",
    icon: "Sparkles",
  },
  {
    title: "Context Compression",
    description: "Intelligent summarization and compression of context signals to optimize reasoning speed.",
    icon: "Layers",
  },
];
