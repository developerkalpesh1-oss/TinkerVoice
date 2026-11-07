import { DocsShell } from "@/components/docs-shell";
import { mcpExcludedApis, mcpTools } from "@/generated/mcp-reference";

const groups = [
  ["external-cost", "Can place calls, buy numbers, or otherwise consume provider credits."],
  ["destructive", "Can end sessions, delete state, or disconnect something already configured."],
  ["write", "Can create or update TinkerVoice data without directly costing money."],
  ["read", "Only reads data or metadata."],
] as const;

export default function SafetyPage() {
  return (
    <DocsShell>
      <article className="mx-auto max-w-5xl">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--qv-blue)]">Governance</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-[-0.035em] text-slate-950">Safety model</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--qv-muted)]">MCP clients should show confirmation for actions with real-world effects. The docs generator classifies each tool from the verified API registry so reviewers can audit the exposed surface.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {groups.map(([risk, description]) => (
          <section key={risk} className="rounded-2xl border border-[var(--qv-border)] bg-white p-5 shadow-sm">
            <h2 className="font-mono text-lg font-semibold text-slate-950">{risk}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--qv-muted)]">{description}</p>
            <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--qv-blue)]">{mcpTools.filter((tool) => tool.risk === risk).length}</p>
          </section>
        ))}
      </div>
      <h2 className="mt-10 text-2xl font-semibold tracking-tight">Excluded APIs</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--qv-border)] bg-white shadow-sm">
        {mcpExcludedApis.map((api) => (
          <div key={`${api.method}-${api.path}`} className="border-b border-[var(--qv-border)] p-4 last:border-b-0">
            <p className="font-mono text-sm font-semibold text-slate-950">{api.method} {api.path}</p>
            <p className="mt-1 text-sm text-[var(--qv-muted)]">{api.excludedReason}</p>
          </div>
        ))}
      </div>
      </article>
    </DocsShell>
  );
}
