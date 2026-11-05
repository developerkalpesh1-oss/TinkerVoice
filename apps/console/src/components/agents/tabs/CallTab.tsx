"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic, Phone, PhoneOutgoing, Radio } from "lucide-react";

import { AgentPreviewPanel } from "@/src/components/agents/AgentPreviewPanel";
import { QuickCallForm } from "@/src/components/outbound/QuickCallForm";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { useAgent } from "@/src/hooks/queries/agents";

type CallTabProps = {
  agentId: string;
};

export function CallTab({ agentId }: CallTabProps) {
  const { data: agent } = useAgent(agentId);
  const [previewOpen, setPreviewOpen] = useState(false);
  const agentName = agent?.name ?? "Agent";

  return (
    <div className="grid gap-6">
      <section className="border bg-card">
        <div className="flex flex-col gap-4 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">Browser test call</h2>
              <Badge variant="secondary">LiveKit</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Talk to this agent from your microphone. Uses the same preview session path as the
              header Preview button — no phone number required.
            </p>
          </div>
          <Button type="button" onClick={() => setPreviewOpen(true)} className="shrink-0">
            <Mic />
            Start browser call
          </Button>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-3">
          <div className="border bg-background px-4 py-3">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <Radio className="size-4 text-muted-foreground" />
              Mic preview
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Opens the live preview sheet and connects through LiveKit.
            </p>
          </div>
          <div className="border bg-background px-4 py-3">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <Phone className="size-4 text-muted-foreground" />
              Needs worker
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Keep <code className="text-[11px]">task ai:worker</code> running with LiveKit +
              ElevenLabs configured.
            </p>
          </div>
          <div className="border bg-background px-4 py-3">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <PhoneOutgoing className="size-4 text-muted-foreground" />
              Phone dial below
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Outbound PSTN calls need an assigned number and telephony trunks.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Phone call</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Place an outbound call with this agent. Assign a number under{" "}
              <Link href="/numbers" className="underline underline-offset-2">
                Numbers
              </Link>{" "}
              if the form says the agent is not outbound-ready.
            </p>
          </div>
        </div>
        <QuickCallForm fixedAgentId={agentId} hideReadyLines />
      </section>

      <AgentPreviewPanel
        agentId={agentId}
        agentName={agentName}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
}
