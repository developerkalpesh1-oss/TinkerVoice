"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Phone, PhoneOff, Plus, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { UseTwilioNumberButton } from "@/src/components/numbers/UseTwilioNumberButton";
import { useAgents } from "@/src/hooks/queries/agents";
import { useNumbers } from "@/src/hooks/queries/numbers";
import { callsApi } from "@/src/lib/api/resources/calls";
import { numbersApi } from "@/src/lib/api/resources/numbers";
import { outboundApi, type OutboundCall } from "@/src/lib/api/resources/outbound";
import type { Agent, CallStatus } from "@/src/lib/api/types";
import { queryKeys } from "@/src/lib/query-keys";
import {
  callerIdsForAgent,
  tinkerismCallBlock,
} from "@/src/lib/tinkerism/call-readiness";
import {
  addContact,
  contactsToCall,
  DEFAULT_TINKERISM_CONTACTS,
  isSampleTinkerismNumber,
  parseStoredContacts,
  parseStoredLogs,
  removeCallLogs,
  removeContact,
  setContactSelected,
  TINKERISM_CONTACTS_STORAGE_KEY,
  TINKERISM_FIRST_MESSAGE,
  TINKERISM_LOGS_STORAGE_KEY,
  TINKERISM_STOPPED_DETAIL,
  terminateTinkerismCall,
  tinkerismAttemptStatus,
  tinkerismCallCanStop,
  tinkerismCallsToStop,
  tinkerismSystemPrompt,
  updateContact,
  type TinkerismCallLog,
  type TinkerismContact,
} from "@/src/lib/tinkerism/contacts";

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private browsing and disabled storage should not block the page.
  }
}

const ACTIVE_STATUSES = new Set<CallStatus>(["SCHEDULED", "PROCESSED", "IN_PROGRESS"]);
const FAILED_STATUSES = new Set<CallStatus>(["FAILED", "NOT_ANSWERED"]);

function statusLabel(status: CallStatus | "DIALING" | "STOPPED" | "LOCAL") {
  if (status === "DIALING") return "Dialing";
  if (status === "STOPPED") return "Stopped";
  if (status === "LOCAL") return "Not started";
  if (status === "SCHEDULED") return "Queued";
  if (status === "PROCESSED") return "Connecting";
  if (status === "IN_PROGRESS") return "In conversation";
  if (status === "COMPLETED") return "Succeeded";
  if (status === "NOT_ANSWERED") return "No answer";
  if (status === "FAILED") return "Failed";
  return status;
}

function progressValue(status: CallStatus | "DIALING" | "STOPPED" | "LOCAL") {
  if (status === "DIALING") return 35;
  if (status === "SCHEDULED") return 55;
  if (status === "PROCESSED") return 70;
  if (status === "IN_PROGRESS") return 88;
  if (status === "COMPLETED" || status === "FAILED" || status === "NOT_ANSWERED" || status === "STOPPED") {
    return 100;
  }
  return 8;
}

function statusVariant(status: CallStatus | "DIALING" | "STOPPED" | "LOCAL") {
  if (status === "FAILED" || status === "NOT_ANSWERED" || status === "STOPPED") return "destructive" as const;
  if (status === "COMPLETED") return "default" as const;
  if (status === "IN_PROGRESS" || status === "SCHEDULED" || status === "PROCESSED" || status === "DIALING") {
    return "secondary" as const;
  }
  return "outline" as const;
}

function configuredAgents(agents: Agent[]) {
  return agents.filter((agent) => agent.isActive && agent.isConfigured);
}

export function TinkerismCallPanel() {
  const queryClient = useQueryClient();
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: numbers = [], isLoading: numbersLoading } = useNumbers();
  const readyAgents = useMemo(() => configuredAgents(agents), [agents]);
  const [requestedAgentId, setRequestedAgentId] = useState("");
  const [requestedFromNumber, setRequestedFromNumber] = useState("");
  const [contacts, setContacts] = useState<TinkerismContact[]>(DEFAULT_TINKERISM_CONTACTS);
  const [logs, setLogs] = useState<TinkerismCallLog[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [editing, setEditing] = useState<TinkerismContact | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [calling, setCalling] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number } | null>(null);
  const [busyOutboundId, setBusyOutboundId] = useState<string | null>(null);
  const stopBatchRef = useRef(false);
  const pendingOutboundIdsRef = useRef(new Set<string>());
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[] | null>(null);

  useEffect(() => {
    setContacts(parseStoredContacts(readStorage(TINKERISM_CONTACTS_STORAGE_KEY)));
    setLogs(parseStoredLogs(readStorage(TINKERISM_LOGS_STORAGE_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(TINKERISM_CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(TINKERISM_LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, 40)));
  }, [hydrated, logs]);

  const agentId = readyAgents.some((agent) => agent.agentId === requestedAgentId)
    ? requestedAgentId
    : readyAgents[0]?.agentId ?? "";
  const selectedAgent = readyAgents.find((agent) => agent.agentId === agentId);
  const callerIds = useMemo(
    () => (agentId ? callerIdsForAgent(numbers, agentId) : []),
    [agentId, numbers],
  );
  const fromNumber = callerIds.some((number) => number.number === requestedFromNumber)
    ? requestedFromNumber
    : callerIds[0]?.number ?? "";
  const selectedCaller = callerIds.find((number) => number.number === fromNumber);
  const selected = contactsToCall(contacts);
  const inactiveNumberCount = numbers.filter((number) => number.billingStatus !== "ACTIVE").length;

  const callsQuery = useQuery({
    queryKey: [...queryKeys.outbound.all, "tinkerism-calls"] as const,
    queryFn: () => outboundApi.listOutboundCalls({ mode: "quick", limit: 100 }),
    refetchInterval: (query) => {
      if (calling) return 2000;
      const items = query.state.data?.items ?? [];
      const tracked = new Set(logs.flatMap((log) => (log.outboundId ? [log.outboundId] : [])));
      const active = items.some(
        (call) => tracked.has(call.outboundId) && ACTIVE_STATUSES.has(call.status),
      );
      return active ? 2000 : false;
    },
  });

  const outboundById = useMemo(() => {
    const map = new Map<string, OutboundCall>();
    for (const call of callsQuery.data?.items ?? []) map.set(call.outboundId, call);
    return map;
  }, [callsQuery.data?.items]);

  useEffect(() => {
    for (const outboundId of pendingOutboundIdsRef.current) {
      const status = outboundById.get(outboundId)?.status;
      if (status && !ACTIVE_STATUSES.has(status)) pendingOutboundIdsRef.current.delete(outboundId);
    }
  }, [outboundById]);

  const trackedCalls = logs.flatMap((log) => {
    if (!log.outboundId) return [];
    const call = outboundById.get(log.outboundId);
    return call ? [call] : [];
  });
  const activeCalls = trackedCalls.filter((call) => ACTIVE_STATUSES.has(call.status));
  const activeCount = activeCalls.length;
  const completedCount = trackedCalls.filter((call) => call.status === "COMPLETED").length;
  const failedCount = trackedCalls.filter((call) => FAILED_STATUSES.has(call.status)).length;

  function upsertLog(log: TinkerismCallLog) {
    setLogs((current) => {
      const index = current.findIndex((item) => item.id === log.id);
      if (index === -1) return [log, ...current].slice(0, 40);
      const next = current.slice();
      next[index] = log;
      return next;
    });
  }

  async function refreshCallQueries() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.outbound.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.calls.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
    ]);
  }

  function onAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = addContact(contacts, { name, phoneNumber });
    if (result.error) {
      setFormError(result.error);
      return;
    }
    setContacts(result.contacts);
    setName("");
    setPhoneNumber("");
    setFormError(null);
  }

  function openEdit(contact: TinkerismContact) {
    setEditing(contact);
    setEditName(contact.name);
    setEditPhone(contact.phoneNumber);
    setEditError(null);
  }

  function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    const result = updateContact(contacts, editing.id, {
      name: editName,
      phoneNumber: editPhone,
    });
    if (result.error) {
      setEditError(result.error);
      return;
    }
    setContacts(result.contacts);
    setEditing(null);
  }

  async function placeCalls() {
    if (!agentId || !fromNumber || selected.length === 0 || calling) return;
    const targets = selected.slice();
    stopBatchRef.current = false;
    setCalling(true);
    setBatchProgress({ done: 0, total: targets.length });
    let started = 0;
    if (selectedCaller && selectedCaller.agentId !== agentId) {
      try {
        await numbersApi.update(selectedCaller.phId, { agentId });
        await queryClient.invalidateQueries({ queryKey: queryKeys.numbers.all });
      } catch (error) {
        setCalling(false);
        setBatchProgress(null);
        toast.error(error instanceof Error ? error.message : "Could not assign the caller ID to this agent");
        return;
      }
    }
    const startedCount = { current: 0 };
    await Promise.all(
      targets.map(async (contact, index) => {
        const attemptId = `${contact.id}-${Date.now()}-${index}`;
        if (stopBatchRef.current) {
          upsertLog({
            id: attemptId,
            outboundId: null,
            contactName: contact.name,
            phoneNumber: contact.phoneNumber,
            detail: "Stopped before this number was dialed.",
            createdAt: new Date().toISOString(),
          });
          setBatchProgress((current) => ({
            done: (current?.done ?? 0) + 1,
            total: targets.length,
          }));
          return;
        }
        upsertLog({
          id: attemptId,
          outboundId: null,
          contactName: contact.name,
          phoneNumber: contact.phoneNumber,
          detail: "Dialing.",
          createdAt: new Date().toISOString(),
        });
        try {
          const response = await outboundApi.quickCall({
            agentId,
            fromNumber,
            phoneNumber: contact.phoneNumber,
            username: contact.name,
            firstMessage: TINKERISM_FIRST_MESSAGE,
            systemPrompt: tinkerismSystemPrompt(contact.name, contact.phoneNumber),
            dynamicVariables: { tinkerism_call: "1" },
          });
          const outboundId = response.outbound.outboundId;
          pendingOutboundIdsRef.current.add(outboundId);
          if (stopBatchRef.current) {
            const stoppedLog = {
              id: attemptId,
              outboundId,
              contactName: contact.name,
              phoneNumber: contact.phoneNumber,
              detail: TINKERISM_STOPPED_DETAIL,
              createdAt: new Date().toISOString(),
            };
            upsertLog(stoppedLog);
            try {
              await terminateTinkerismCall({
                outboundId,
                status: "SCHEDULED",
                endLive: (roomName) => callsApi.endLive(roomName),
                cancelScheduled: (id) => outboundApi.cancelOutboundCall(id),
              });
              pendingOutboundIdsRef.current.delete(outboundId);
            } catch (error) {
              upsertLog({
                ...stoppedLog,
                detail: error instanceof Error ? error.message : "Could not stop the call",
              });
            }
            return;
          }
          startedCount.current += 1;
          upsertLog({
            id: attemptId,
            outboundId,
            contactName: contact.name,
            phoneNumber: contact.phoneNumber,
            detail: "Connected to the agent. Waiting for the recipient to answer.",
            createdAt: new Date().toISOString(),
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Could not start the call.";
          upsertLog({
            id: attemptId,
            outboundId: null,
            contactName: contact.name,
            phoneNumber: contact.phoneNumber,
            detail: message,
            createdAt: new Date().toISOString(),
          });
        } finally {
          setBatchProgress((current) => ({
            done: (current?.done ?? 0) + 1,
            total: targets.length,
          }));
        }
      }),
    );
    started = startedCount.current;
    setCalling(false);
    await refreshCallQueries();
    if (started > 0) {
      toast.success(started === 1 ? "Tinkerism call started" : `${started} Tinkerism calls started`);
    }
  }

  function markStopped(log: TinkerismCallLog) {
    upsertLog({ ...log, detail: TINKERISM_STOPPED_DETAIL });
  }

  async function stopOutbound(log: TinkerismCallLog, status?: CallStatus) {
    if (!log.outboundId) return;
    const outboundId = log.outboundId;
    markStopped(log);
    setBusyOutboundId(outboundId);
    try {
      await terminateTinkerismCall({
        outboundId,
        status,
        endLive: (roomName) => callsApi.endLive(roomName),
        cancelScheduled: (id) => outboundApi.cancelOutboundCall(id),
      });
      toast.success(`Stopped the call to ${log.phoneNumber}`);
      await refreshCallQueries();
    } catch (error) {
      upsertLog(log);
      toast.error(error instanceof Error ? error.message : "Could not stop the call");
    } finally {
      setBusyOutboundId(null);
    }
  }

  async function stopAllCalls() {
    stopBatchRef.current = true;
    const statusByOutboundId: Record<string, string | null> = {};
    for (const [outboundId, call] of outboundById) statusByOutboundId[outboundId] = call.status;
    const ids = tinkerismCallsToStop(logs, statusByOutboundId, [...pendingOutboundIdsRef.current]);
    if (ids.length === 0) {
      toast.message("Stopping calls that are still connecting.");
      return;
    }
    const idSet = new Set(ids);
    setBusyOutboundId("all");
    setLogs((current) =>
      current.map((log) =>
        log.outboundId && idSet.has(log.outboundId) ? { ...log, detail: TINKERISM_STOPPED_DETAIL } : log,
      ),
    );
    const results = await Promise.allSettled(
      ids.map((outboundId) =>
        terminateTinkerismCall({
          outboundId,
          status: outboundById.get(outboundId)?.status ?? "SCHEDULED",
          endLive: (roomName) => callsApi.endLive(roomName),
          cancelScheduled: (id) => outboundApi.cancelOutboundCall(id),
        }),
      ),
    );
    results.forEach((result, index) => {
      if (result.status === "fulfilled") pendingOutboundIdsRef.current.delete(ids[index]!);
    });
    const stopped = results.filter((result) => result.status === "fulfilled").length;
    setBusyOutboundId(null);
    await refreshCallQueries();
    if (stopped > 0) toast.success(stopped === 1 ? "Stopped 1 call" : `Stopped ${stopped} calls`);
    const failed = ids.length - stopped;
    if (failed > 0) toast.error(failed === 1 ? "Could not stop 1 call" : `Could not stop ${failed} calls`);
  }

  function logIsActive(log: TinkerismCallLog) {
    const call = log.outboundId ? outboundById.get(log.outboundId) : undefined;
    return tinkerismCallCanStop(tinkerismAttemptStatus(log, call?.status));
  }

  async function confirmDeleteLogs() {
    const ids = pendingDeleteIds;
    if (!ids) return;
    const idSet = new Set(ids);
    const active = logs.filter((log) => idSet.has(log.id) && log.outboundId && logIsActive(log));
    setPendingDeleteIds(null);
    if (active.length > 0) {
      stopBatchRef.current = true;
      const outboundIds = active.flatMap((log) => (log.outboundId ? [log.outboundId] : []));
      setLogs((current) =>
        current.map((log) =>
          log.outboundId && outboundIds.includes(log.outboundId)
            ? { ...log, detail: TINKERISM_STOPPED_DETAIL }
            : log,
        ),
      );
      await Promise.allSettled(
        outboundIds.map((outboundId) =>
          terminateTinkerismCall({
            outboundId,
            status: outboundById.get(outboundId)?.status ?? "SCHEDULED",
            endLive: (roomName) => callsApi.endLive(roomName),
            cancelScheduled: (id) => outboundApi.cancelOutboundCall(id),
          }),
        ),
      );
      for (const outboundId of outboundIds) pendingOutboundIdsRef.current.delete(outboundId);
      await refreshCallQueries();
    }
    setLogs((current) => removeCallLogs(current, ids));
  }

  async function retryOutbound(call: OutboundCall, contactName: string) {
    setBusyOutboundId(call.outboundId);
    try {
      const result = await outboundApi.retryOutboundCall(call.outboundId) as {
        retry?: { outbound?: OutboundCall };
      };
      const outbound = result.retry?.outbound;
      upsertLog({
        id: outbound?.outboundId ?? `${call.outboundId}-retry-${Date.now()}`,
        outboundId: outbound?.outboundId ?? null,
        contactName,
        phoneNumber: call.phoneNumber,
        detail: outbound ? "Retry connected to the agent." : "Retry requested.",
        createdAt: new Date().toISOString(),
      });
      await refreshCallQueries();
      toast.success(`Retrying ${call.phoneNumber}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not retry the call");
    } finally {
      setBusyOutboundId(null);
    }
  }

  const loadingLines = agentsLoading || numbersLoading;

  const callBlock = tinkerismCallBlock({
    loading: loadingLines,
    configuredAgentCount: readyAgents.length,
    activeCallerIdCount: callerIds.length,
    inactiveNumberCount,
    selectedCount: selected.length,
  });
  const callNowDisabled = calling || callBlock !== "ready";

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 border bg-card p-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Agent</Label>
            {loadingLines ? (
              <div className="h-9 animate-pulse bg-muted" />
            ) : (
              <Select value={agentId || undefined} onValueChange={setRequestedAgentId} disabled={readyAgents.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="No active agent" />
                </SelectTrigger>
                <SelectContent>
                  {readyAgents.map((agent) => (
                    <SelectItem key={agent.agentId} value={agent.agentId}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Caller ID</Label>
            {loadingLines ? (
              <div className="h-9 animate-pulse bg-muted" />
            ) : (
              <Select value={fromNumber || undefined} onValueChange={setRequestedFromNumber} disabled={callerIds.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="No active caller ID" />
                </SelectTrigger>
                <SelectContent>
                  {callerIds.map((number) => (
                    <SelectItem key={number.phId} value={number.number}>
                      {number.agentId ? number.number : `${number.number} (unassigned)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {activeCount > 0 || calling ? (
            <Button
              type="button"
              variant="destructive"
              className="h-12 px-5"
              disabled={busyOutboundId === "all" || (activeCount === 0 && !calling)}
              onClick={() => void stopAllCalls()}
            >
              {busyOutboundId === "all" ? <Loader2 className="animate-spin" /> : <PhoneOff />}
              Stop all
            </Button>
          ) : null}
          <Button
            type="button"
            className="h-12 px-6 text-base"
            disabled={callNowDisabled}
            onClick={() => void placeCalls()}
          >
            {calling ? <Loader2 className="animate-spin" /> : <Phone />}
            Call Now
          </Button>
        </div>
      </section>
      <CallNowReason
        block={callBlock}
        agentName={selectedAgent?.name ?? readyAgents[0]?.name ?? "This agent"}
      />
      {batchProgress ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Calling selected numbers</span>
            <span className="text-muted-foreground">{batchProgress.done} of {batchProgress.total}</span>
          </div>
          <CallProgress
            value={batchProgress.total === 0 ? 0 : Math.round((batchProgress.done / batchProgress.total) * 100)}
            failed={false}
          />
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Saved numbers" value={contacts.length} />
        <Metric label="Selected" value={selected.length} />
        <Metric label="Active calls" value={activeCount} />
        <Metric label="Completed / failed" value={`${completedCount} / ${failedCount}`} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold">Saved numbers</h2>
              <p className="text-xs text-muted-foreground">
                Only checked numbers are dialed. Uncheck a number to keep it saved without calling it.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setContacts((current) => current.map((contact) => ({ ...contact, selected: true })))}
              >
                Select all
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setContacts((current) => current.map((contact) => ({ ...contact, selected: false })))}
              >
                Clear
              </Button>
            </div>
          </div>
          <ul className="divide-y">
            {contacts.map((contact) => {
              const log = logs.find((entry) => entry.phoneNumber === contact.phoneNumber);
              const call = log?.outboundId ? outboundById.get(log.outboundId) : undefined;
              return (
              <li key={contact.id} className="flex items-center gap-3 px-4 py-3">
                <Checkbox
                  checked={contact.selected}
                  onCheckedChange={(checked) =>
                    setContacts((current) => setContactSelected(current, contact.id, checked === true))
                  }
                  aria-label={`Call ${contact.name}`}
                />
                <ContactCallStatus contact={contact} log={log} call={call} />
                <Button type="button" variant="ghost" size="sm" onClick={() => openEdit(contact)}>
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${contact.name}`}
                  onClick={() => setContacts((current) => removeContact(current, contact.id))}
                >
                  <Trash2 />
                </Button>
              </li>
              );
            })}
          </ul>
          <form onSubmit={onAdd} className="grid gap-3 border-t p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="tinkerism-name">Name</Label>
              <Input
                id="tinkerism-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Reception"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tinkerism-phone">Phone number</Label>
              <Input
                id="tinkerism-phone"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="+91..."
              />
            </div>
            <Button type="submit">
              <Plus />
              Add number
            </Button>
            {formError ? <p className="text-sm text-destructive sm:col-span-3">{formError}</p> : null}
          </form>
        </section>

        <section className="flex flex-col gap-4">
          <div className="border bg-card">
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Call status and logs</h2>
              {logs.length > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPendingDeleteIds(logs.map((log) => log.id))}
                >
                  <Trash2 />
                  Delete all
                </Button>
              ) : null}
            </div>
            {logs.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground">
                Logs appear here after you call the selected numbers.
              </p>
            ) : (
              <ul className="divide-y">
                {logs.map((log) => {
                  const call = log.outboundId ? outboundById.get(log.outboundId) : undefined;
                  return (
                    <CallAttempt
                      key={log.id}
                      log={log}
                      call={call}
                      busy={busyOutboundId === log.outboundId || busyOutboundId === "all"}
                      onStop={
                        log.outboundId
                          ? () => void stopOutbound(log, call?.status)
                          : undefined
                      }
                      onRetry={call ? () => void retryOutbound(call, log.contactName) : undefined}
                      onDelete={() => setPendingDeleteIds([log.id])}
                    />
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit number</DialogTitle>
            <DialogDescription>Update the saved name or phone number. Selection stays as it is.</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveEdit} className="grid gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-tinkerism-name">Name</Label>
              <Input id="edit-tinkerism-name" value={editName} onChange={(event) => setEditName(event.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-tinkerism-phone">Phone number</Label>
              <Input id="edit-tinkerism-phone" value={editPhone} onChange={(event) => setEditPhone(event.target.value)} />
            </div>
            {editError ? <p className="text-sm text-destructive">{editError}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingDeleteIds !== null} onOpenChange={(open) => { if (!open) setPendingDeleteIds(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingDeleteIds && pendingDeleteIds.length > 1 ? "Delete all call logs?" : "Delete this call log?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteIds?.some((id) => logs.some((log) => log.id === id && logIsActive(log)))
                ? "Connected calls in this selection will be stopped, then the logs will be removed from this page."
                : "This removes the selected logs from Tinkerism Call."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => void confirmDeleteLogs()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CallNowReason({
  block,
  agentName,
}: {
  block: ReturnType<typeof tinkerismCallBlock>;
  agentName: string;
}) {
  if (block === "loading" || block === "ready") return null;
  if (block === "no-agent") {
    return (
      <p className="-mt-4 text-sm text-muted-foreground">
        Create an active agent and finish its voice setup before calling.
      </p>
    );
  }
  if (block === "none-selected") {
    return (
      <p className="-mt-4 text-sm text-muted-foreground">
        Select at least one saved number. Unchecked numbers are not dialed.
      </p>
    );
  }
  if (block === "inactive-number") {
    return (
      <p className="-mt-4 text-sm text-muted-foreground">
        {agentName} is ready, but its phone number is not active. Restore it under{" "}
        <Link href="/numbers" className="font-medium text-primary underline-offset-4 hover:underline">
          Phone numbers
        </Link>
        .
      </p>
    );
  }
  return (
    <div className="-mt-4 flex flex-col items-start gap-3">
      <p className="text-sm text-muted-foreground">
        {agentName} is ready. Use a voice number you already own in Twilio, or add one under{" "}
        <Link href="/numbers" className="font-medium text-primary underline-offset-4 hover:underline">
          Phone numbers
        </Link>
        .
      </p>
      <UseTwilioNumberButton label="Use a Twilio number" />
    </div>
  );
}

function attemptStatus(log: TinkerismCallLog, call?: OutboundCall) {
  return tinkerismAttemptStatus(log, call?.status) as CallStatus | "DIALING" | "STOPPED" | "LOCAL";
}

function ContactCallStatus({
  contact,
  log,
  call,
}: {
  contact: TinkerismContact;
  log?: TinkerismCallLog;
  call?: OutboundCall;
}) {
  const status = log ? attemptStatus(log, call) : null;
  return (
    <div className="min-w-0 flex-1 space-y-1.5">
      <p className="truncate text-sm font-medium">{contact.name}</p>
      <p className="truncate text-xs text-muted-foreground">{contact.phoneNumber}</p>
      {isSampleTinkerismNumber(contact.phoneNumber) ? (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Sample number. Replace it before a real call.
        </p>
      ) : null}
      {status ? (
        <>
          <CallProgress value={progressValue(status)} failed={status === "FAILED" || status === "NOT_ANSWERED" || status === "STOPPED"} />
          <p className="text-xs text-muted-foreground">{statusLabel(status)}</p>
        </>
      ) : null}
    </div>
  );
}

function CallAttempt({
  log,
  call,
  busy,
  onStop,
  onRetry,
  onDelete,
}: {
  log: TinkerismCallLog;
  call?: OutboundCall;
  busy: boolean;
  onStop?: () => void;
  onRetry?: () => void;
  onDelete: () => void;
}) {
  const status = attemptStatus(log, call);
  const failed = status === "FAILED" || status === "NOT_ANSWERED" || status === "STOPPED";
  const canStop = Boolean(log.outboundId) && tinkerismCallCanStop(status);
  const canRetry = Boolean(call && FAILED_STATUSES.has(call.status));
  return (
    <li className="space-y-2 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium">
          {log.contactName}
          <span className="ml-2 font-normal text-muted-foreground">{log.phoneNumber}</span>
        </p>
        <Badge variant={statusVariant(status)}>{statusLabel(status)}</Badge>
      </div>
      <CallProgress value={progressValue(status)} failed={failed} />
      <p className="text-xs text-muted-foreground">
        {new Date(log.createdAt).toLocaleString()}
        {call?.failureReason ? ` · ${call.failureReason}` : ` · ${log.detail}`}
      </p>
      <div className="flex flex-wrap gap-2">
        {canStop && onStop ? (
          <Button type="button" size="sm" variant="destructive" disabled={busy} onClick={onStop}>
            {busy ? <Loader2 className="animate-spin" /> : <PhoneOff />}
            Stop
          </Button>
        ) : null}
        {canRetry && onRetry ? (
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={onRetry}>
            {busy ? <Loader2 className="animate-spin" /> : <RotateCcw />}
            Retry
          </Button>
        ) : null}
        {call?.callLog?.callId ? (
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/calls/${call.callLog.callId}`}>Open call log</Link>
          </Button>
        ) : null}
        <Button type="button" size="sm" variant="ghost" onClick={onDelete}>
          <Trash2 />
          Delete
        </Button>
      </div>
    </li>
  );
}

function CallProgress({ value, failed }: { value: number; failed: boolean }) {
  return (
    <div className="h-1.5 w-full bg-muted" aria-hidden>
      <div
        className={failed ? "h-full bg-destructive" : "h-full bg-primary transition-[width]"}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border bg-card px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
