import { DocsShell } from "@/components/docs-shell";
import { CodeBlock } from "@/components/code-block";

const choices = [
  {
    title: "Keep apps/mcp-server dedicated",
    body: "The MCP endpoint is machine-facing infrastructure. It should own Streamable HTTP, authentication, validation, tool/resource execution, health checks, and MCP-specific logs.",
  },
  {
    title: "Keep apps/docs human-facing",
    body: "The docs app should explain the product, show setup flows, publish API reference pages, and help users copy client configuration. It should not be the operational MCP runtime.",
  },
  {
    title: "Keep apps/server as the API source of truth",
    body: "The MCP server should call existing verified TinkerVoice APIs instead of reimplementing business logic inside MCP or Next.js route handlers.",
  },
];

export default function ArchitecturePage() {
  return (
    <DocsShell>
      <article className="prose prose-qv mx-auto max-w-4xl">
      <p className="lead">Use this boundary when deploying and maintaining TinkerVoice MCP.</p>
      <h1>MCP architecture</h1>
      <p>
        TinkerVoice uses a dedicated Node MCP service and a separate Next.js docs site. The docs site may contain the MCP landing page,
        setup guide, client configuration generator, API reference, and troubleshooting content. The actual MCP endpoint should remain in
        <code>apps/mcp-server</code>.
      </p>

      <h2>Recommended app boundary</h2>
      <CodeBlock code={`apps/docs       → Human-facing documentation, MCP setup UI, API reference
apps/mcp-server → Machine-facing Streamable HTTP MCP endpoint
apps/server     → Existing TinkerVoice REST API source of truth
apps/ai         → Voice AI worker/runtime
apps/console    → Main TinkerVoice product console`} />

      <h2>Why not put MCP backend inside Next.js?</h2>
      <div className="not-prose grid gap-4">
        {choices.map((choice) => (
          <section key={choice.title} className="rounded-2xl border border-[var(--qv-border)] bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold tracking-tight text-slate-950">{choice.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--qv-muted)]">{choice.body}</p>
          </section>
        ))}
      </div>

      <h2>Production domain layout</h2>
      <CodeBlock code={`docs.tinkervoice.co        → apps/docs
mcp.tinkervoice.co/mcp    → apps/mcp-server
api.tinkervoice.co/api/v1 → apps/server`} />

      <h2>When a combined Next.js app is acceptable</h2>
      <p>
        A combined Next.js deployment is acceptable only for a very small internal deployment where one service is easier to operate than
        clean separation. If that route is chosen, keep <code>/mcp</code> implemented as backend-only route handlers, keep public docs pages
        separate from MCP auth, and preserve the same validation and smoke tests used by <code>apps/mcp-server</code>.
      </p>

      <h2>Decision</h2>
      <p>
        For TinkerVoice production, use <code>apps/mcp-server</code> for MCP and <code>apps/docs</code> for documentation. This keeps the MCP
        runtime smaller, easier to scale, easier to secure, and easier to debug independently from public docs traffic.
      </p>
      </article>
    </DocsShell>
  );
}
