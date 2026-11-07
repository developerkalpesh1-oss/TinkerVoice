import type { Metadata } from "next";
import { DocsShell } from "@/components/docs-shell";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { mcpReferenceStats } from "@/generated/mcp-reference";

export const metadata: Metadata = {
  title: "Changelog",
  description: "TinkerVoice documentation, API reference, and MCP server changelog.",
};

const entries = [
  {
    date: "July 2026",
    title: "MCP and API documentation launch",
    changes: [
      "Published the TinkerVoice MCP setup experience at /mcp.",
      `Documented ${mcpReferenceStats.toolCount} MCP tools and ${mcpReferenceStats.resourceCount} MCP resources from the generated MCP registry.`,
      `Listed ${mcpReferenceStats.excludedCount} excluded APIs for review before MCP exposure.`,
      "Added the REST API reference at /api-reference.",
      "Added architecture guidance recommending apps/mcp-server as the dedicated MCP runtime and apps/docs as the documentation surface.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <DocsShell>
      <section className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--qv-blue)]">TinkerVoice Changelog</p>
        <h1 className="mt-5 text-5xl font-semibold tracking-[-0.045em] text-slate-950 md:text-7xl">Product docs changes.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--qv-muted)]">
          Updates to TinkerVoice documentation, API reference pages, MCP guides, and exposed MCP capabilities.
        </p>

        <div className="mt-12 space-y-5">
          {entries.map((entry) => (
            <article key={entry.date} className="rounded-3xl border border-[var(--qv-border)] bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[var(--qv-blue)]">{entry.date}</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-slate-950">{entry.title}</h2>
              <ul className="mt-5 space-y-3">
                {entry.changes.map((change) => (
                  <li key={change} className="flex gap-3 text-sm leading-6 text-[var(--qv-muted)]">
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--qv-blue)]" />
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-[var(--qv-border)] bg-[var(--qv-bg-muted)] p-6">
          <h2 className="text-lg font-semibold tracking-tight text-slate-950">Need MCP-specific schema changes?</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--qv-muted)]">
            Update the MCP API registry first, regenerate the MCP reference, then document the change here.
          </p>
          <Link className="mt-4 inline-flex text-sm font-semibold text-[var(--qv-blue)]" href="/mcp/changelog">
            View MCP changelog →
          </Link>
        </div>
      </section>
    </DocsShell>
  );
}
