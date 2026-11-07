export type McpFaq = {
  question: string;
  answer: string;
};

export const mcpFaq: McpFaq[] = [
  {
    question: "What is TinkerVoice MCP?",
    answer: "TinkerVoice MCP is a Streamable HTTP server that lets MCP-capable AI clients call verified TinkerVoice APIs as tools and read TinkerVoice data as resources.",
  },
  {
    question: "Which AI clients can connect?",
    answer: "Any client that supports remote MCP over Streamable HTTP can connect. The setup guide includes Cursor, Windsurf, Claude Desktop, Claude Code, Codex, VS Code, Copilot, JetBrains, and generic MCP clients.",
  },
  {
    question: "Can MCP place real calls?",
    answer: "Yes, if the connected token is allowed to use call tools. Clients should require explicit approval before tools that launch calls, buy numbers, or create external cost are executed.",
  },
  {
    question: "Is the token stored on this docs page?",
    answer: "No. The setup generator keeps values in browser memory only so you can copy configuration. It does not send, persist, or log your token.",
  },
  {
    question: "Can we self-host the MCP server?",
    answer: "Yes. The MCP server is an app in this monorepo and can run as a dedicated HTTP service or beside the existing TinkerVoice server task on ECS.",
  },
  {
    question: "What should require human approval?",
    answer: "Cost actions, destructive actions, and any tool that changes production state should require confirmation in the MCP client approval policy.",
  },
];
