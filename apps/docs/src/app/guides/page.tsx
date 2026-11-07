import type { Metadata } from "next";
import { DocsShell } from "@/components/docs-shell";
import Link from "next/link";
import { ArrowRight, BookOpen, KeyRound, ServerCog, ShieldCheck, Wrench } from "lucide-react";

export const metadata: Metadata = {
  title: "Guides",
  description: "Step-by-step TinkerVoice guides for MCP setup, authentication, deployment, troubleshooting, and operations.",
};

const guides = [
  {
    title: "MCP quickstart",
    description: "Connect Cursor, Claude, Codex, Windsurf, or another MCP-capable client to TinkerVoice over Streamable HTTP.",
    href: "/mcp/quickstart",
    icon: BookOpen,
  },
  {
    title: "MCP architecture",
    description: "Understand why apps/mcp-server stays machine-facing while apps/docs owns setup UI and reference content.",
    href: "/mcp/architecture",
    icon: ServerCog,
  },
  {
    title: "API keys and authentication",
    description: "Configure MCP bearer-token access and upstream TinkerVoice API credentials safely.",
    href: "/mcp/api-keys",
    icon: KeyRound,
  },
  {
    title: "Safety model",
    description: "Review MCP tool risk levels, confirmations, destructive actions, and excluded APIs.",
    href: "/mcp/safety",
    icon: ShieldCheck,
  },
  {
    title: "Deploying on ECS",
    description: "Run the dedicated MCP service beside existing TinkerVoice services with proper environment variables and health checks.",
    href: "/mcp/self-hosting",
    icon: ServerCog,
  },
  {
    title: "Troubleshooting",
    description: "Debug common MCP connection, authentication, upstream route, and remote deployment issues.",
    href: "/mcp/troubleshooting",
    icon: Wrench,
  },
];

export default function GuidesPage() {
  return (
    <DocsShell>
      <section className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--qv-blue)]">TinkerVoice Guides</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.045em] text-slate-950 md:text-7xl">Step-by-step implementation guides.</h1>
          <p className="mt-6 text-lg leading-8 text-[var(--qv-muted)]">
            Practical setup and operations guides for TinkerVoice MCP, authentication, deployment, and troubleshooting.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const Icon = guide.icon;
            return (
              <Link
                key={guide.href}
                className="group rounded-3xl border border-[var(--qv-border)] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[var(--qv-blue)] hover:shadow-lg hover:shadow-blue-950/5"
                href={guide.href}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[var(--qv-blue)]/8 text-[var(--qv-blue)] ring-1 ring-[var(--qv-blue)]/10">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <ArrowRight aria-hidden="true" className="mt-2 size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[var(--qv-blue)]" />
                </div>
                <h2 className="mt-6 text-lg font-semibold tracking-tight text-slate-950">{guide.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--qv-muted)]">{guide.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </DocsShell>
  );
}
