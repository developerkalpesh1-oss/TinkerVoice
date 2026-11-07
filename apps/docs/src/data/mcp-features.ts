import type { LucideIcon } from "lucide-react";
import { Bot, Braces, Globe2, KeyRound, PhoneCall, ScrollText } from "lucide-react";

export type McpFeature = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const mcpFeatures: McpFeature[] = [
  {
    title: "Manage agents",
    description: "Create, inspect, and update TinkerVoice AI voice agents from an MCP-capable assistant.",
    href: "/mcp/tools#create_agent",
    icon: Bot,
  },
  {
    title: "Launch calls",
    description: "Start preview sessions and outbound calls through guarded MCP tools.",
    href: "/mcp/tools#create_quick_outbound_call",
    icon: PhoneCall,
  },
  {
    title: "Review call logs",
    description: "Read call status, recordings, transcripts, duration, and routing context.",
    href: "/mcp/resources#list_call_logs",
    icon: ScrollText,
  },
  {
    title: "Website widget",
    description: "Inspect widget configuration and sessions without switching away from your AI tool.",
    href: "/mcp/resources#list_agent_widgets",
    icon: Globe2,
  },
  {
    title: "Secure access",
    description: "Use bearer-token authentication at the MCP edge before requests touch TinkerVoice APIs.",
    href: "/mcp/api-keys",
    icon: KeyRound,
  },
  {
    title: "Tool registry",
    description: "Expose only verified APIs and keep excluded routes visible for product review.",
    href: "/mcp/resources#list_mcp_catalog",
    icon: Braces,
  },
];
