"use client";

import { useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, PhoneOutgoing, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { BatchCallForm } from "@/src/components/outbound/BatchCallForm";
import { CampaignsPanel } from "@/src/components/outbound/CampaignsPanel";
import { PromptCampaignPanel } from "@/src/components/outbound/PromptCampaignPanel";
import { SavedContactsPanel } from "@/src/components/outbound/SavedContactsPanel";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useOutboundPromptCampaigns } from "@/src/hooks/use-outbound-prompt-campaigns";
import { useOutboundSavedContacts } from "@/src/hooks/use-outbound-saved-contacts";
import { useAgents } from "@/src/hooks/queries/agents";
import { useNumbers } from "@/src/hooks/queries/numbers";
import { useOutboundCalls } from "@/src/hooks/queries/outbound";
import { callsApi } from "@/src/lib/api/resources/calls";
import { outboundApi } from "@/src/lib/api/resources/outbound";
import type { Agent, PhoneNumber } from "@/src/lib/api/types";
import {
  outboundCallCanStop,
  outboundCallsToStop,
  terminateOutboundCall,
} from "@/src/lib/outbound/call-control";
import {
  campaignOpeningGreeting,
  tinkerismCampaignPrompt,
} from "@/src/lib/outbound/prompt-campaigns";
import { contactsToCall } from "@/src/lib/outbound/saved-contacts";
import { quickCallSchema } from "@/src/models/outbound/quickCall";
import { queryKeys } from "@/src/lib/query-keys";

function asDialableAgents(agents: Agent[], numbers: PhoneNumber[]) {
  return agents
    .filter((agent) => agent.isActive && agent.isConfigured)
    .map((agent) => ({
      ...agent,
      numbers: numbers.filter((number) => number.agentId === agent.agentId),
    }))
    .filter((agent) => agent.numbers.length > 0);
}

function formatProvider(provider: PhoneNumber["provider"]) {
  return provider.toLowerCase() === "telnyx" ? "Telnyx" : "Twilio";
}

export function BatchCampaignWorkspace() {
  const queryClient = useQueryClient();
  const promptCampaigns = useOutboundPromptCampaigns();
  const { contacts, setContacts } = useOutboundSavedContacts();
  const { data: agents = [], refetch: refetchAgents } = useAgents();
  const { data: numbers = [], refetch: refetchNumbers } = useNumbers();
  const dialableAgents = useMemo(() => asDialableAgents(agents, numbers), [agents, numbers]);

  const [requestedAgentId, setRequestedAgentId] = useState("");
  const [requestedFromNumber, setRequestedFromNumber] = useState("");
  const [batchCalling, setBatchCalling] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [pendingOutboundIds, setPendingOutboundIds] = useState<string[]>([]);
  const [startedSummary, setStartedSummary] = useState<string | null>(null);
  const stopBatchRef = useRef(false);

  const { data: liveOutbound } = useOutboundCalls({ limit: 100 }, { pollWhileLive: true });
  const liveCalls = useMemo(
    () => (liveOutbound?.items ?? []).filter((call) => outboundCallCanStop(call.status)),
    [liveOutbound?.items],
  );
  const activeCount = useMemo(() => {
    const ids = new Set(liveCalls.map((call) => call.outboundId));
    for (const outboundId of pendingOutboundIds) ids.add(outboundId);
    return ids.size;
  }, [liveCalls, pendingOutboundIds]);

  const agentId = dialableAgents.some((agent) => agent.agentId === requestedAgentId)
    ? requestedAgentId
    : dialableAgents[0]?.agentId ?? "";
  const selectedAgent = dialableAgents.find((agent) => agent.agentId === agentId);
  const fromNumber = selectedAgent?.numbers.some((number) => number.number === requestedFromNumber)
    ? requestedFromNumber
    : selectedAgent?.numbers[0]?.number ?? "";
  const selectedNumber = selectedAgent?.numbers.find((number) => number.number === fromNumber);
  const selectedContacts = contactsToCall(contacts);

  const contactsDisabledReason = !agentId || !fromNumber
    ? "Choose an outbound-ready agent and caller ID before calling saved contacts."
    : null;

  function refresh() {
    refetchAgents();
    refetchNumbers();
    void queryClient.invalidateQueries({ queryKey: queryKeys.outbound.all });
  }

  async function placeOneCall(input: {
    phoneNumber: string;
    username: string;
    systemPrompt: string;
    firstMessage: string;
  }) {
    const parsed = quickCallSchema.safeParse({
      agentId,
      phoneNumber: input.phoneNumber,
      fromNumber,
      username: input.username,
      firstMessage: input.firstMessage,
      systemPrompt: input.systemPrompt,
      dynamicVariables: { tinkerism_call: "1" },
    });
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message ?? "Check the call details");
    }
    const response = await outboundApi.quickCall(parsed.data);
    const outboundId = response.outbound.outboundId;
    setPendingOutboundIds((current) =>
      current.includes(outboundId) ? current : [...current, outboundId],
    );
    return outboundId;
  }

  async function callSelectedContacts() {
    if (!agentId || !fromNumber || batchCalling) return;
    const targets = selectedContacts;
    if (targets.length === 0) return;
    stopBatchRef.current = false;
    setBatchCalling(true);
    setStartedSummary(null);
    let started = 0;
    const campaign = promptCampaigns.selectedCampaign;
    await Promise.all(
      targets.map(async (contact) => {
        if (stopBatchRef.current) return;
        try {
          const outboundId = await placeOneCall({
            phoneNumber: contact.phoneNumber,
            username: contact.name,
            firstMessage: campaignOpeningGreeting(campaign),
            systemPrompt: tinkerismCampaignPrompt(
              campaign,
              contact.name,
              contact.phoneNumber,
            ),
          });
          if (stopBatchRef.current) {
            await terminateOutboundCall({
              outboundId,
              status: "SCHEDULED",
              endLive: (roomName) => callsApi.endLive(roomName),
              cancelScheduled: (id) => outboundApi.cancelOutboundCall(id),
            }).catch(() => undefined);
            setPendingOutboundIds((current) => current.filter((id) => id !== outboundId));
            return;
          }
          started += 1;
        } catch (error) {
          toast.error(
            error instanceof Error
              ? `${contact.name}: ${error.message}`
              : `Could not call ${contact.name}`,
          );
        }
      }),
    );
    setBatchCalling(false);
    refresh();
    if (started > 0) {
      setStartedSummary(
        started === 1
          ? `Started 1 call with campaign “${campaign.name}”.`
          : `Started ${started} calls with campaign “${campaign.name}”.`,
      );
      toast.success(started === 1 ? "Outbound call started" : `${started} outbound calls started`);
    }
  }

  async function stopAllCalls() {
    stopBatchRef.current = true;
    setStopping(true);
    const ids = outboundCallsToStop(
      liveCalls.map((call) => ({ outboundId: call.outboundId, status: call.status })),
      pendingOutboundIds,
    );
    const statusById = new Map(liveCalls.map((call) => [call.outboundId, call.status]));
    const results = await Promise.allSettled(
      ids.map((outboundId) =>
        terminateOutboundCall({
          outboundId,
          status: statusById.get(outboundId) ?? "SCHEDULED",
          endLive: (roomName) => callsApi.endLive(roomName),
          cancelScheduled: (id) => outboundApi.cancelOutboundCall(id),
        }),
      ),
    );
    const stoppedIds = ids.filter((_, index) => results[index]?.status === "fulfilled");
    if (stoppedIds.length > 0) {
      setPendingOutboundIds((current) => current.filter((id) => !stoppedIds.includes(id)));
    }
    setStopping(false);
    refresh();
    const stopped = stoppedIds.length;
    if (stopped > 0) toast.success(stopped === 1 ? "Stopped 1 call" : `Stopped ${stopped} calls`);
    const failed = ids.length - stopped;
    if (failed > 0) toast.error(failed === 1 ? "Could not stop 1 call" : `Could not stop ${failed} calls`);
  }

  return (
    <div className="space-y-4">
      <PromptCampaignPanel
        campaigns={promptCampaigns.campaigns}
        selectedId={promptCampaigns.selectedId}
        onSelect={promptCampaigns.selectCampaign}
        onSave={promptCampaigns.saveCampaign}
        onDelete={promptCampaigns.deleteCampaign}
      />

      <section className="border bg-card">
        <div className="flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Call selected contacts</h2>
            <p className="text-xs text-muted-foreground">
              Uses campaign “{promptCampaigns.selectedCampaign.name}” instructions and knowledge on every dial.
            </p>
          </div>
          {selectedNumber ? (
            <Badge variant="outline">{formatProvider(selectedNumber.provider)}</Badge>
          ) : null}
        </div>
        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="batch-workspace-agent">Agent</Label>
            <Select
              value={agentId}
              onValueChange={(nextAgentId) => {
                setRequestedAgentId(nextAgentId);
                const nextAgent = dialableAgents.find((agent) => agent.agentId === nextAgentId);
                setRequestedFromNumber(nextAgent?.numbers[0]?.number ?? "");
              }}
            >
              <SelectTrigger id="batch-workspace-agent" className="w-full">
                <SelectValue placeholder="Select agent" />
              </SelectTrigger>
              <SelectContent>
                {dialableAgents.map((agent) => (
                  <SelectItem key={agent.agentId} value={agent.agentId}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="batch-workspace-from">From</Label>
            <Select value={fromNumber} onValueChange={setRequestedFromNumber}>
              <SelectTrigger id="batch-workspace-from" className="w-full">
                <SelectValue placeholder="Select caller ID" />
              </SelectTrigger>
              <SelectContent>
                {(selectedAgent?.numbers ?? []).map((number) => (
                  <SelectItem key={number.phId} value={number.number}>
                    {number.number}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground md:col-span-2">
            Dialing uses the same Tinkerism Call opener and campaign prompt, including knowledge, for every selected number.
          </p>
          {startedSummary ? (
            <div
              aria-live="polite"
              className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 md:col-span-2"
            >
              {startedSummary} Track live status under Outbound calls.
            </div>
          ) : null}
          <div className="flex flex-col gap-2 border-t pt-4 md:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={refresh}>
              <RefreshCw /> Refresh
            </Button>
            <Button
              type="button"
              disabled={
                Boolean(contactsDisabledReason)
                || selectedContacts.length === 0
                || batchCalling
              }
              onClick={() => void callSelectedContacts()}
            >
              {batchCalling ? <Loader2 className="animate-spin" /> : <PhoneOutgoing />}
              Call selected ({selectedContacts.length})
            </Button>
          </div>
        </div>
      </section>

      <SavedContactsPanel
        contacts={contacts}
        onContactsChange={setContacts}
        calling={batchCalling}
        stopping={stopping}
        activeCount={activeCount}
        onCallSelected={() => void callSelectedContacts()}
        onStopAll={() => void stopAllCalls()}
        disabledReason={contactsDisabledReason}
      />

      <BatchCallForm selectedPromptCampaign={promptCampaigns.selectedCampaign} />
      <CampaignsPanel />
    </div>
  );
}
