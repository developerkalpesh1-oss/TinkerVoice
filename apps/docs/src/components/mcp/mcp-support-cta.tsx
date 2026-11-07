import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function McpSupportCta() {
  return (
    <section className="bg-white px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-[2rem] bg-[var(--qv-blue)] p-8 text-center text-white shadow-2xl shadow-blue-950/20 sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-white/12 ring-1 ring-white/20">
          <MessageCircle aria-hidden="true" className="size-6" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold tracking-[-0.025em]">Need help connecting TinkerVoice MCP?</h2>
        <p className="mt-3 text-sm leading-6 text-blue-100">Use the troubleshooting guide first, then contact support if your client cannot complete the MCP handshake.</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[var(--qv-blue)] transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/70" href="/mcp/troubleshooting">
            Troubleshooting <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <Link className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70" href="/">
            Contact support
          </Link>
        </div>
      </div>
    </section>
  );
}
