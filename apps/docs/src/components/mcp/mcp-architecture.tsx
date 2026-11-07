import Link from "next/link";
import { ArrowRight, BookOpen, Braces, ServerCog } from "lucide-react";
import { McpSectionHeading } from "./mcp-section-heading";

const boundaries = [
  {
    title: "apps/mcp-server",
    label: "Machine-facing backend",
    description: "Owns the Streamable HTTP MCP endpoint, bearer-token gate, tool/resource registry, validation, and upstream TinkerVoice API calls.",
    icon: ServerCog,
    href: "/mcp/self-hosting",
  },
  {
    title: "apps/docs",
    label: "Human-facing documentation",
    description: "Owns the MCP setup UI, client configuration guides, API reference, safety notes, troubleshooting, and product documentation.",
    icon: BookOpen,
    href: "/api-reference",
  },
  {
    title: "apps/server",
    label: "Source of truth APIs",
    description: "Existing TinkerVoice REST routes stay the operational contract. MCP remains a thin wrapper instead of duplicating business logic.",
    icon: Braces,
    href: "/api-reference",
  },
];

export function McpArchitecture() {
  return (
    <section id="architecture" className="border-b border-[var(--qv-border)] bg-white px-4 py-20 sm:px-6 lg:px-8">
      <McpSectionHeading
        eyebrow="Recommended architecture"
        title="Keep MCP separate from the docs app"
        description="TinkerVoice docs can explain and configure MCP, but the deployed MCP endpoint should stay in the dedicated Node service so machine traffic, auth, logs, and scaling remain isolated from the public documentation site."
      />

      <div className="mx-auto mt-12 grid max-w-6xl gap-4 lg:grid-cols-3">
        {boundaries.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              className="group rounded-3xl border border-[var(--qv-border)] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[var(--qv-blue)] hover:shadow-lg hover:shadow-blue-950/5"
              href={item.href}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-[var(--qv-blue)]/8 text-[var(--qv-blue)] ring-1 ring-[var(--qv-blue)]/10">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <ArrowRight aria-hidden="true" className="mt-2 size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[var(--qv-blue)]" />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-[var(--qv-blue)]">{item.label}</p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--qv-muted)]">{item.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="mx-auto mt-6 max-w-6xl rounded-3xl border border-[var(--qv-border)] bg-[var(--qv-bg-muted)] p-5 sm:p-6">
        <p className="text-sm font-semibold text-slate-950">Deployment shape</p>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-[var(--qv-code)] p-5 text-sm leading-7 text-slate-100">
          <code>{`docs.tinkervoice.co        → apps/docs        → pages, setup UI, API reference
mcp.tinkervoice.co/mcp    → apps/mcp-server  → Streamable HTTP MCP endpoint
api.tinkervoice.co/api/v1 → apps/server      → verified TinkerVoice REST APIs`}</code>
        </pre>
      </div>
    </section>
  );
}
