import { DocsShell } from "@/components/docs-shell";
import { ReferenceCard } from "@/components/reference-card";
import { mcpTools } from "@/generated/mcp-reference";

export default function ToolsPage() {
  return (
    <DocsShell>
      <section className="mx-auto max-w-6xl">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-[var(--qv-border)] pb-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--qv-blue)]">Reference</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-[-0.035em] text-slate-950">MCP tools</h1>
          <p className="mt-3 max-w-2xl text-[var(--qv-muted)]">Actions that can mutate TinkerVoice state or trigger external work. Cost-sensitive and destructive tools should require explicit user confirmation in the client.</p>
        </div>
        <span className="rounded-full border border-[var(--qv-border)] bg-white px-4 py-2 text-sm font-semibold text-slate-700">{mcpTools.length} tools</span>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {mcpTools.map((tool) => <ReferenceCard key={tool.name} item={tool} kind="tool" />)}
      </div>
      </section>
    </DocsShell>
  );
}
