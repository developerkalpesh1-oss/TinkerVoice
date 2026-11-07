import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mcpFeatures } from "@/data/mcp-features";
import { McpSectionHeading } from "./mcp-section-heading";

export function McpFeatureGrid() {
  return (
    <section id="features" className="border-y border-[var(--qv-border)] bg-[var(--qv-bg-muted)] px-4 py-20 sm:px-6 lg:px-8">
      <McpSectionHeading
        eyebrow="What is TinkerVoice MCP?"
        title="A controlled bridge between AI clients and TinkerVoice operations"
        description="The MCP server wraps existing verified TinkerVoice APIs so assistants can help operate the product without scraping the console UI."
      />
      <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mcpFeatures.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.title} className="group rounded-3xl border border-[var(--qv-border)] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[var(--qv-blue)] hover:shadow-lg hover:shadow-blue-950/5" href={feature.href}>
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-12 place-items-center rounded-2xl bg-[var(--qv-blue)]/8 text-[var(--qv-blue)] ring-1 ring-[var(--qv-blue)]/10">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <ArrowRight aria-hidden="true" className="mt-2 size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-[var(--qv-blue)]" />
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight text-slate-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--qv-muted)]">{feature.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
