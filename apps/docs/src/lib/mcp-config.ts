export const defaultMcpServerUrl = "https://mcp.tinkervoice.co/mcp";

export function buildMcpConfig({
  apiKey,
  serverUrl,
}: {
  apiKey: string;
  serverUrl: string;
}) {
  return {
    mcpServers: {
      tinkervoice: {
        url: serverUrl.trim() || defaultMcpServerUrl,
        transport: "streamable-http",
        headers: {
          "x-api-key": apiKey.trim() || "YOUR_TINKERVOICE_API_KEY",
        },
      },
    },
  };
}

export function stringifyMcpConfig(input: {
  apiKey: string;
  serverUrl: string;
}) {
  return JSON.stringify(buildMcpConfig(input), null, 2);
}
