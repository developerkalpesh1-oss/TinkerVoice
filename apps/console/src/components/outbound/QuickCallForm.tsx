"use client";

import { FormEvent, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, PhoneOutgoing, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/src/components/common/EmptyState";
import { DynamicVariableInputs } from "@/src/components/agents/DynamicVariableInputs";
import { QuickCallContactField } from "@/src/components/outbound/QuickCallContactField";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { useOutboundPromptCampaigns } from "@/src/hooks/use-outbound-prompt-campaigns";
import { useOutboundSavedContacts } from "@/src/hooks/use-outbound-saved-contacts";
import { useAgentConfig, useAgents } from "@/src/hooks/queries/agents";
import { useNumbers } from "@/src/hooks/queries/numbers";
import { outboundApi } from "@/src/lib/api/resources/outbound";
import type { Agent, PhoneNumber } from "@/src/lib/api/types";
import {
  dynamicVariablePayload,
  normalizeAgentVariables,
  uniqueDynamicVariableNames,
} from "@/src/lib/agents/dynamic-variables";
import { tinkerismCampaignPrompt } from "@/src/lib/outbound/prompt-campaigns";
import type { OutboundSavedContact } from "@/src/lib/outbound/saved-contacts";
import { TINKERISM_FIRST_MESSAGE } from "@/src/lib/tinkerism/contacts";
import { quickCallSchema } from "@/src/models/outbound/quickCall";
import { queryKeys } from "@/src/lib/query-keys";

type DialableAgent = Agent & {
  numbers: PhoneNumber[];
};

type StartedCall = {
  phoneNumber: string;
  fromNumber: string;
};

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

type QuickCallFormProps = {
  /** When set, locks the form to this agent and hides the agent picker. */
  fixedAgentId?: string;
  /** Hide the multi-agent "Ready lines" aside (useful inside agent Call tab). */
  hideReadyLines?: boolean;
};

export function QuickCallForm({
  fixedAgentId,
  hideReadyLines = false,
}: QuickCallFormProps = {}) {
  const queryClient = useQueryClient();
  const { selectedCampaign } = useOutboundPromptCampaigns();
  const { contacts: savedContacts } = useOutboundSavedContacts();
  const { data: agents = [], isLoading: agentsLoading, refetch: refetchAgents } = useAgents();
  const { data: numbers = [], isLoading: numbersLoading, refetch: refetchNumbers } = useNumbers();
  const dialableAgents = useMemo(() => {
    const ready = asDialableAgents(agents, numbers);
    if (!fixedAgentId) return ready;
    return ready.filter((agent) => agent.agentId === fixedAgentId);
  }, [agents, numbers, fixedAgentId]);
  const [requestedAgentId, setRequestedAgentId] = useState(fixedAgentId ?? "");
  const [requestedFromNumber, setRequestedFromNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [dynamicVariableState, setDynamicVariableState] = useState({
    source: "",
    values: {} as Record<string, string>,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [startedCall, setStartedCall] = useState<StartedCall | null>(null);
  const [starting, setStarting] = useState(false);

  const agentId = fixedAgentId
    ? dialableAgents.some((agent) => agent.agentId === fixedAgentId)
      ? fixedAgentId
      : ""
    : dialableAgents.some((agent) => agent.agentId === requestedAgentId)
      ? requestedAgentId
      : dialableAgents[0]?.agentId ?? "";
  const selectedAgent = dialableAgents.find((agent) => agent.agentId === agentId);
  const fromNumber = selectedAgent?.numbers.some(
    (number) => number.number === requestedFromNumber
  )
    ? requestedFromNumber
    : selectedAgent?.numbers[0]?.number ?? "";
  const selectedNumber = selectedAgent?.numbers.find(
    (number) => number.number === fromNumber
  );
  const { data: selectedAgentConfig, isLoading: selectedAgentConfigLoading } = useAgentConfig(agentId);
  const selectedAgentVariables = useMemo(
    () => normalizeAgentVariables(selectedAgentConfig?.variables),
    [selectedAgentConfig?.variables]
  );
  const dynamicVariableNames = useMemo(
    () => uniqueDynamicVariableNames(selectedAgentVariables),
    [selectedAgentVariables]
  );
  const dynamicVariableSource = `${agentId}:${dynamicVariableNames.join("\0")}`;
  const emptyDynamicVariableValues = useMemo(
    () => Object.fromEntries(dynamicVariableNames.map((name) => [name, ""])),
    [dynamicVariableNames]
  );

  if (dynamicVariableState.source !== dynamicVariableSource) {
    setDynamicVariableState({
      source: dynamicVariableSource,
      values: emptyDynamicVariableValues,
    });
  }

  const dynamicVariableValues =
    dynamicVariableState.source === dynamicVariableSource
      ? dynamicVariableState.values
      : emptyDynamicVariableValues;
  const setDynamicVariableValues = (values: Record<string, string>) =>
    setDynamicVariableState((state) => ({ ...state, values }));

  const isLoading = agentsLoading || numbersLoading;
  const canSubmit =
    Boolean(agentId) &&
    Boolean(fromNumber) &&
    phoneNumber.trim().length >= 10 &&
    !starting;

  function refresh() {
    refetchAgents();
    refetchNumbers();
    void queryClient.invalidateQueries({ queryKey: queryKeys.outbound.all });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setStartedCall(null);
    setStarting(true);

    try {
      const toNumber = phoneNumber.trim();
      const contactName = username.trim() || "the recipient";
      const greeting = firstMessage.trim() || TINKERISM_FIRST_MESSAGE;
      const parsed = quickCallSchema.safeParse({
        agentId,
        phoneNumber: toNumber,
        fromNumber,
        username: username.trim() || undefined,
        firstMessage: greeting,
        systemPrompt: systemPrompt.trim()
          || tinkerismCampaignPrompt(selectedCampaign, contactName, toNumber),
        dynamicVariables: {
          ...dynamicVariablePayload(selectedAgentVariables, dynamicVariableValues),
          tinkerism_call: "1",
        },
      });
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Check the call details");
      }
      await outboundApi.quickCall(parsed.data);
      setStartedCall({ phoneNumber: toNumber, fromNumber });
      toast.success("Outbound call started");
      refresh();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not start outbound call");
      toast.error(error instanceof Error ? error.message : "Could not start outbound call");
    } finally {
      setStarting(false);
    }
  }

  function selectAgent(nextAgentId: string) {
    setRequestedAgentId(nextAgentId);
    setDynamicVariableValues({});
    const nextAgent = dialableAgents.find((agent) => agent.agentId === nextAgentId);
    setRequestedFromNumber(nextAgent?.numbers[0]?.number ?? "");
  }

  function selectSavedContact(contact: OutboundSavedContact) {
    setPhoneNumber(contact.phoneNumber);
    setUsername(contact.name);
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="h-[560px] animate-pulse border bg-card" />
        <div className="h-72 animate-pulse border bg-card" />
      </div>
    );
  }

  if (dialableAgents.length === 0) {
    return (
      <EmptyState
        icon={PhoneOutgoing}
        title={fixedAgentId ? "This agent is not outbound-ready" : "No outbound-ready agents"}
        description={
          fixedAgentId
            ? "Activate the agent, finish voice configuration, and assign a phone number before placing a phone call."
            : "Configure an active agent and assign a phone number before starting an outbound call."
        }
        action={
          <Button variant="outline" onClick={refresh}>
            <RefreshCw /> Refresh
          </Button>
        }
      />
    );
  }

  return (
    <div
      className={
        hideReadyLines
          ? "grid gap-4 pb-20"
          : "grid gap-4 pb-20 xl:grid-cols-[minmax(0,1fr)_340px] xl:pb-0"
      }
    >
      <form onSubmit={onSubmit} className="border bg-card">
        <div className="flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {fixedAgentId ? "Phone call" : "Quick call"}
          </h2>
          {selectedNumber ? (
            <Badge variant="outline">{formatProvider(selectedNumber.provider)}</Badge>
          ) : null}
        </div>

        <div className="grid gap-5 p-5">
          <div className={`grid gap-4 ${fixedAgentId ? "" : "md:grid-cols-2"}`}>
            {fixedAgentId ? null : (
              <div className="grid gap-2">
                <Label htmlFor="agent">Agent</Label>
                <Select value={agentId} onValueChange={selectAgent}>
                  <SelectTrigger id="agent" className="w-full">
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
            )}

            <div className="grid gap-2">
              <Label htmlFor="fromNumber">From</Label>
              <Select value={fromNumber} onValueChange={setRequestedFromNumber}>
                <SelectTrigger id="fromNumber" className="w-full">
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">To</Label>
              <QuickCallContactField
                id="phoneNumber"
                contacts={savedContacts}
                phoneNumber={phoneNumber}
                onPhoneNumberChange={setPhoneNumber}
                onSelectContact={selectSavedContact}
                disabled={starting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="username">Name</Label>
              <Input
                id="username"
                placeholder="Contact name"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="firstMessage">First message</Label>
            <Textarea
              id="firstMessage"
              rows={3}
              placeholder={TINKERISM_FIRST_MESSAGE}
              value={firstMessage}
              onChange={(event) => setFirstMessage(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="systemPrompt">System prompt override</Label>
            <Textarea
              id="systemPrompt"
              rows={4}
              placeholder="Optional. Leave blank to use the shared Tinkerism Call campaign prompt."
              value={systemPrompt}
              onChange={(event) => setSystemPrompt(event.target.value)}
            />
          </div>

          {selectedAgentConfigLoading ? (
            <div className="border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
              Loading agent variables...
            </div>
          ) : dynamicVariableNames.length > 0 ? (
            <DynamicVariableInputs
              idPrefix="quick-call-variable"
              title="Call variables"
              description="Values sent only for this outbound call."
              variableNames={dynamicVariableNames}
              values={dynamicVariableValues}
              placeholders={selectedAgentVariables.placeholders}
              disabled={starting}
              onValuesChange={setDynamicVariableValues}
            />
          ) : null}

          {formError ? (
            <p className="text-sm text-destructive">{formError}</p>
          ) : null}

          {startedCall ? (
            <div
              aria-live="polite"
              className="border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
            >
              Started call to {startedCall.phoneNumber} from {startedCall.fromNumber}.
              {" "}Track live status under Outbound calls.
            </div>
          ) : null}

          <div className="flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={refresh}>
              <RefreshCw /> Refresh
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              {starting ? <Loader2 className="animate-spin" /> : <PhoneOutgoing />}
              Start call
            </Button>
          </div>
        </div>
      </form>

      {hideReadyLines ? null : (
        <aside className="border bg-card p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <CheckCircle2 className="size-4 text-emerald-500" />
            Ready lines
          </div>
          <div className="mt-4 space-y-3">
            {dialableAgents.map((agent: DialableAgent) => (
              <div key={agent.agentId} className="border-b pb-3 last:border-0 last:pb-0">
                <p className="truncate text-sm font-medium text-foreground">{agent.name}</p>
                <div className="mt-2 space-y-2">
                  {agent.numbers.map((number) => (
                    <div
                      key={number.phId}
                      className="flex min-w-0 items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-foreground">
                          {number.friendlyName || number.number}
                        </p>
                        <p className="break-all text-muted-foreground">{number.number}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {formatProvider(number.provider)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
