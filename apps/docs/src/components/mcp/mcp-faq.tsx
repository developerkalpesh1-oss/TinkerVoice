"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { mcpFaq } from "@/data/mcp-faq";
import { McpSectionHeading } from "./mcp-section-heading";

export function McpFaq() {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(mcpFaq[0]?.question ?? null);

  return (
    <section id="faq" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <McpSectionHeading
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Answers for teams connecting TinkerVoice MCP to their AI development and operations workflows."
      />
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {mcpFaq.map((item) => {
          const isOpen = activeQuestion === item.question;
          const panelId = `mcp-faq-panel-${slugify(item.question)}`;
          const buttonId = `mcp-faq-trigger-${slugify(item.question)}`;

          return (
            <article key={item.question} className="overflow-hidden rounded-2xl border border-[var(--qv-border)] bg-white shadow-sm transition data-[open=true]:border-[var(--qv-blue)]/30" data-open={isOpen}>
              <button
                id={buttonId}
                type="button"
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left font-semibold text-slate-950 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--qv-blue)]/20"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setActiveQuestion((current) => (current === item.question ? null : item.question))}
              >
                {item.question}
                <ChevronDown aria-hidden="true" className={`size-5 shrink-0 text-slate-400 transition ${isOpen ? "rotate-180 text-[var(--qv-blue)]" : ""}`} />
              </button>
              {isOpen ? (
                <p id={panelId} role="region" aria-labelledby={buttonId} className="border-t border-[var(--qv-border)] px-5 py-4 text-sm leading-7 text-[var(--qv-muted)]">
                  {item.answer}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
