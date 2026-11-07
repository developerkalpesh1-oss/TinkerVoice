import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { mcpReferenceStats } from "@/generated/mcp-reference";

export function McpHero() {
  const stats = [
    { label: `${mcpReferenceStats.toolCount} tools`, icon: CheckCircle2 },
    { label: `${mcpReferenceStats.resourceCount} resources`, icon: Sparkles },
    { label: "Streamable HTTP", icon: ShieldCheck },
  ];

  return (
    <section id="overview" className="relative isolate overflow-hidden border-b border-[var(--qv-border)] bg-white qv-grid-bg">
      <div className="absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[var(--qv-blue)]/10 blur-3xl" />
      <div className="mx-auto flex min-h-[680px] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mcp-reveal inline-flex items-center gap-2 rounded-full border border-[var(--qv-border)] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
          <span className="size-1.5 rounded-full bg-[var(--qv-blue)]" />
          Powered by MCP Protocol
        </div>
        <h1 className="mcp-reveal mt-7 max-w-5xl text-balance text-5xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-7xl lg:text-8xl">
          Connect TinkerVoice MCP with your AI tools.
        </h1>
        <p className="mcp-reveal mt-6 max-w-2xl text-pretty text-lg leading-8 text-[var(--qv-muted)] sm:text-xl">
          Manage agents, launch guarded call workflows, inspect logs, and review widget activity from clients like Cursor, Claude, Codex, and Windsurf.
        </p>
        <div className="mcp-reveal mt-9 flex flex-col items-center gap-3 sm:flex-row">
          <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--qv-blue)] px-6 text-sm font-semibold text-white shadow-lg shadow-blue-950/10 transition hover:-translate-y-0.5 hover:bg-[var(--qv-blue-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--qv-blue)]/30" href="#setup">
            Connect to MCP Server <ArrowRight aria-hidden="true" className="size-4" />
          </a>
          <Link className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--qv-border)] bg-white px-6 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--qv-blue)] hover:text-[var(--qv-blue)] focus:outline-none focus:ring-2 focus:ring-[var(--qv-blue)]/25" href="/api-reference">
            View API reference
          </Link>
        </div>
        <div className="mcp-reveal mt-7 flex flex-wrap justify-center gap-3 text-sm text-slate-600">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <span key={stat.label} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-[var(--qv-border)]">
                <Icon aria-hidden="true" className="size-4 text-[var(--qv-blue)]" />
                {stat.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
