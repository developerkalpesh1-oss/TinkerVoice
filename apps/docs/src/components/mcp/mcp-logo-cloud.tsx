import { mcpIntegrations } from "@/data/mcp-integrations";
import { McpSectionHeading } from "./mcp-section-heading";

export function McpLogoCloud() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="works-with-heading">
      <McpSectionHeading
        eyebrow="Works with"
        title="Connect the clients your team already uses"
        description="TinkerVoice MCP uses Streamable HTTP, so the same server endpoint can be configured across compatible AI clients."
      />
      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {mcpIntegrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div key={integration.name} className="group rounded-2xl border border-[var(--qv-border)] bg-white p-4 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[var(--qv-blue)] hover:shadow-md">
              <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--qv-bg-muted)] text-slate-700 ring-1 ring-[var(--qv-border)] transition group-hover:bg-[var(--qv-blue)] group-hover:text-white group-hover:ring-[var(--qv-blue)]">
                <Icon aria-hidden="true" className="size-5" strokeWidth={2.2} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-950">{integration.name}</h3>
              <p className="mt-1 text-xs leading-5 text-[var(--qv-muted)]">{integration.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
