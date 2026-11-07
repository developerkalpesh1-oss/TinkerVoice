import { resourceDefinitions, toolDefinitions } from "../src/api-registry.js";

const endpoint = process.env.MCP_URL ?? "http://localhost:8787/mcp";
const apiKey = process.env.TINKERVOICE_API_KEY;

if (!apiKey) {
  throw new Error("TINKERVOICE_API_KEY is required for MCP smoke tests");
}

let id = 1;
let sessionId: string | null = null;

function parseMcpResponse(text: string) {
  if (!text) return null;
  if (text.startsWith("event:")) {
    const dataLine = text.split("\n").find((line) => line.startsWith("data: "));
    return dataLine ? JSON.parse(dataLine.slice(6)) : null;
  }
  return JSON.parse(text);
}

function requestHeaders() {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json, text/event-stream");
  headers.set("x-api-key", apiKey as string);
  if (sessionId) headers.set("Mcp-Session-Id", sessionId);
  return headers;
}

async function rpc(method: string, params?: unknown) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: requestHeaders(),
    body: JSON.stringify({ jsonrpc: "2.0", id: id++, method, params }),
  });
  const nextSession = response.headers.get("mcp-session-id");
  if (nextSession) sessionId = nextSession;
  const text = await response.text();
  const body = parseMcpResponse(text);
  if (!response.ok || body?.error) {
    throw new Error(`${method} failed: HTTP ${response.status} ${text}`);
  }
  return body?.result;
}

async function notify(method: string, params?: unknown) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: requestHeaders(),
    body: JSON.stringify({ jsonrpc: "2.0", method, params }),
  });
  if (!response.ok) {
    throw new Error(`${method} notification failed: HTTP ${response.status} ${await response.text()}`);
  }
}

function exampleUri(template: string) {
  return template
    .replace("{agentId}", process.env.MCP_TEST_AGENT_ID ?? "00000000-0000-0000-0000-000000000000")
    .replace("{callId}", process.env.MCP_TEST_CALL_ID ?? "test-call")
    .replace("{outboundId}", process.env.MCP_TEST_OUTBOUND_ID ?? "test-outbound")
    .replace("{campaignId}", process.env.MCP_TEST_CAMPAIGN_ID ?? "test-campaign")
    .replace("{toolId}", process.env.MCP_TEST_TOOL_ID ?? "test-tool")
    .replace("{widgetId}", process.env.MCP_TEST_WIDGET_ID ?? "test-widget")
    .replace("{mcpConnectionId}", process.env.MCP_TEST_MCP_CONNECTION_ID ?? "test-mcp")
    .replace("{secretId}", process.env.MCP_TEST_SECRET_ID ?? "test-secret")
    .replace("{kbId}", process.env.MCP_TEST_KB_ID ?? "test-kb")
    .replace("{phId}", process.env.MCP_TEST_PHONE_ID ?? "test-phone");
}

await rpc("initialize", {
  protocolVersion: "2025-06-18",
  capabilities: {},
  clientInfo: { name: "tinkervoice-mcp-smoke", version: "0.1.0" },
});
await notify("notifications/initialized");

const tools = await rpc("tools/list");
const resources = await rpc("resources/list");
console.log(`tools/list returned ${tools.tools?.length ?? 0} tools; expected ${toolDefinitions.length}`);
console.log(`resources/list returned ${resources.resources?.length ?? 0} static resources/templates may be listed by client support; expected catalog plus ${resourceDefinitions.length} resource templates`);

// Safe read checks only. Mutation tools are verified by schema/listing here; run them manually with real IDs.
for (const resource of resourceDefinitions.filter((definition) => definition.params?.length === 0).slice(0, 8)) {
  try {
    const result = await rpc("resources/read", { uri: `tinkervoice://${resource.name}` });
    console.log(`PASS resource ${resource.name}: ${JSON.stringify(result).slice(0, 160)}`);
  } catch (error) {
    console.log(`FAIL resource ${resource.name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (const resource of resourceDefinitions.filter((definition) => definition.params?.length).slice(0, 8)) {
  const uri = exampleUri(`tinkervoice://${resource.name}/${resource.params?.map((param) => `{${param}}`).join("/")}`);
  try {
    const result = await rpc("resources/read", { uri });
    console.log(`PASS resource ${resource.name}: ${JSON.stringify(result).slice(0, 160)}`);
  } catch (error) {
    console.log(`EXPECTED/FAIL resource ${resource.name} (${uri}): ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log("Mutation tools are exposed through tools/list. Execute with real IDs/bodies only in targeted tests to avoid destructive side effects.");
