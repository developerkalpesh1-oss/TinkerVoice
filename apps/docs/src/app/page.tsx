import Link from "next/link";
import { ArrowRight, BookOpen, Braces, FileText, Network } from "lucide-react";

const docSections = [
  {
    title: "MCP",
    description: "Connect AI clients to TinkerVoice tools and resources over the dedicated MCP server.",
    href: "/mcp",
    icon: Network,
  },
  {
    title: "API reference",
    description: "Browse TinkerVoice REST endpoints, authentication, parameters, schemas, and responses.",
    href: "/api-reference",
    icon: Braces,
  },
  {
    title: "Guides",
    description: "Follow setup, deployment, security, and troubleshooting guides for TinkerVoice operations.",
    href: "/guides",
    icon: BookOpen,
  },
  {
    title: "Changelog",
    description: "Track documentation, MCP registry, API reference, and operational guide updates.",
    href: "/changelog",
    icon: FileText,
  },
];

export default function DocsHomePage() {
  return (
    <main className="min-h-screen qv-grid-bg">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#002FA7]">TinkerVoice Docs</p>
        <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-slate-950 md:text-7xl">
          Build, operate, and connect AI voice agents.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Technical documentation for TinkerVoice MCP, REST APIs, implementation guides, and product changes.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a className="border border-[#002FA7] bg-[#002FA7] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#001f70]" href="/mcp">
            Start with MCP
          </a>
          <a className="border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-950" href="/api-reference">
            API reference
          </a>
          <a className="border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:border-slate-950" href="/guides">
            Guides
          </a>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {docSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                className="group rounded-3xl border border-[var(--qv-border)] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[var(--qv-blue)] hover:shadow-lg hover:shadow-blue-950/5"
                href={section.href}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-2xl bg-[var(--qv-blue)]/8 text-[var(--qv-blue)] ring-1 ring-[var(--qv-blue)]/10">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <ArrowRight aria-hidden="true" className="mt-2 size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[var(--qv-blue)]" />
                </div>
                <h2 className="mt-6 text-lg font-semibold tracking-tight text-slate-950">{section.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--qv-muted)]">{section.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
