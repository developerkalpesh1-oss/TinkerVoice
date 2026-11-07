import { AsyncLocalStorage } from "node:async_hooks";

export type McpAuthContext = {
  upstreamApiKey: string;
};

export const authContext = new AsyncLocalStorage<McpAuthContext>();

export function currentAuthContext() {
  const context = authContext.getStore();
  if (!context?.upstreamApiKey) {
    throw new Error("MCP request is missing TinkerVoice API authentication context");
  }
  return context;
}
