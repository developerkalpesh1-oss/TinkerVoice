import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP",
  description: "TinkerVoice MCP server documentation, reference, and operations guide.",
};

export default function McpLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
