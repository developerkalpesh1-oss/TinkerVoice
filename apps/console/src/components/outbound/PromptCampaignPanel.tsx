"use client";

import { useEffect, useId, useState } from "react";
import { Loader2, Plus } from "lucide-react";

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
import { Button } from "@/src/components/ui/button";
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
import { Textarea } from "@/src/components/ui/textarea";
import {
  blankPromptCampaign,
  CALL_KNOWLEDGE_CHAR_LIMIT,
  knowledgeFileError,
  knowledgeForCall,
  knowledgeUrlError,
  MAX_KNOWLEDGE_SOURCES,
  normalizePromptCampaign,
  promptCampaignError,
  tinkerismCampaignPrompt,
  type OutboundKnowledgeSource,
  type OutboundPromptCampaign,
} from "@/src/lib/outbound/prompt-campaigns";

type KnowledgeResponse = {
  name?: string;
  locator?: string;
  text?: string;
  error?: string;
};

export function PromptCampaignPanel({
  campaigns,
  selectedId,
  onSelect,
  onSave,
  onDelete,
}: {
  campaigns: OutboundPromptCampaign[];
  selectedId: string;
  onSelect: (id: string) => void;
  onSave: (campaign: OutboundPromptCampaign) => void;
  onDelete: (id: string) => void;
}) {
  const fileId = useId();
  const urlId = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<OutboundPromptCampaign | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openSourceId, setOpenSourceId] = useState<string | null>(null);
  const [pendingSelectId, setPendingSelectId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const selected = campaigns.find((campaign) => campaign.id === selectedId) ?? campaigns[0] ?? null;

  useEffect(() => {
    if (!editing && selected) setDraft(selected);
  }, [editing, selected]);

  const current = draft ?? selected;
  const dirty = current != null && selected != null && campaignSnapshot(current) !== campaignSnapshot(selected);
  const knowledge = current ? knowledgeForCall(current.sources) : { text: "", truncated: false };

  function updateDraft(patch: Partial<OutboundPromptCampaign>) {
    setDraft((existing) => (existing ? { ...existing, ...patch } : existing));
    setFormError(null);
  }

  function requestSelect(id: string) {
    if (id === selectedId) return;
    if (dirty) {
      setPendingSelectId(id);
      return;
    }
    setEditing(false);
    setFormError(null);
    onSelect(id);
  }

  function startNew() {
    if (dirty) {
      setPendingSelectId("new");
      return;
    }
    setDraft(blankPromptCampaign());
    setEditing(true);
    setFormError(null);
    setOpenSourceId(null);
  }

  function saveDraft(event?: { preventDefault: () => void }) {
    event?.preventDefault();
    if (!current) return;
    const error = promptCampaignError(current);
    if (error) {
      setFormError(error);
      return;
    }
    const saved = normalizePromptCampaign(current);
    onSave(saved);
    onSelect(saved.id);
    setDraft(saved);
    setEditing(false);
    setFormError(null);
  }

  async function addFile(file: File | null) {
    if (!file || !current) return;
    const error = knowledgeFileError(file.name, file.size);
    if (error) {
      setFormError(error);
      return;
    }
    if (current.sources.length >= MAX_KNOWLEDGE_SOURCES) {
      setFormError(`A campaign can use up to ${MAX_KNOWLEDGE_SOURCES} knowledge sources.`);
      return;
    }
    setBusy(`Reading ${file.name}`);
    setFormError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      const payload = await postKnowledge(body);
      addSource({
        kind: "file",
        name: payload.name || file.name,
        locator: payload.locator || file.name,
        text: payload.text,
      });
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Could not read that file.");
    } finally {
      setBusy(null);
    }
  }

  async function addUrl(event: { preventDefault: () => void }) {
    event.preventDefault();
    if (!current) return;
    const error = knowledgeUrlError(url);
    if (error) {
      setFormError(error);
      return;
    }
    if (current.sources.length >= MAX_KNOWLEDGE_SOURCES) {
      setFormError(`A campaign can use up to ${MAX_KNOWLEDGE_SOURCES} knowledge sources.`);
      return;
    }
    setBusy("Reading website");
    setFormError(null);
    try {
      const payload = await postKnowledge(JSON.stringify({ url: url.trim() }), {
        "Content-Type": "application/json",
      });
      addSource({
        kind: "url",
        name: payload.name || url.trim(),
        locator: payload.locator || url.trim(),
        text: payload.text,
      });
      setUrl("");
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Could not read that website.");
    } finally {
      setBusy(null);
    }
  }

  function addSource(source: Omit<OutboundKnowledgeSource, "id" | "updatedAt">) {
    setDraft((existing) => {
      if (!existing) return existing;
      return {
        ...existing,
        sources: [
          ...existing.sources,
          {
            ...source,
            id: `source-${Date.now()}-${existing.sources.length}`,
            updatedAt: new Date().toISOString(),
          },
        ],
      };
    });
    setEditing(true);
  }

  function updateSource(id: string, text: string) {
    setDraft((existing) => {
      if (!existing) return existing;
      return {
        ...existing,
        sources: existing.sources.map((source) => (
          source.id === id ? { ...source, text, updatedAt: new Date().toISOString() } : source
        )),
      };
    });
  }

  function removeSource(id: string) {
    setDraft((existing) => {
      if (!existing) return existing;
      return { ...existing, sources: existing.sources.filter((source) => source.id !== id) };
    });
    if (openSourceId === id) setOpenSourceId(null);
  }

  if (!current || !selected) return null;

  return (
    <section className="border bg-card">
      <div className="flex flex-col gap-2 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Campaign prompt</h2>
          <p className="text-xs text-muted-foreground">
            Shared AI instructions and knowledge for Quick call and batch uploads. The selected campaign is applied to every conversation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
            Preview
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (editing && dirty) {
                setPendingSelectId("close");
                return;
              }
              setEditing((open) => !open);
              setFormError(null);
            }}
          >
            {editing ? "Close editor" : "Edit"}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={startNew}>
            <Plus />
            New campaign
          </Button>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-2">
          <Label htmlFor="outbound-prompt-campaign">Saved campaign</Label>
          <Select value={selected.id} onValueChange={requestSelect}>
            <SelectTrigger id="outbound-prompt-campaign" className="w-full">
              <SelectValue placeholder="Choose a campaign" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {dirty
              ? "Save the campaign before queuing calls. Unsaved edits are not used."
              : selected.sources.length === 0
                ? "No knowledge sources yet."
                : `${selected.sources.length} knowledge source${selected.sources.length === 1 ? "" : "s"} included.`}
          </p>
        </div>

        {editing ? (
          <form className="space-y-4" onSubmit={saveDraft}>
            <Field label="Campaign name" value={current.name} onChange={(name) => updateDraft({ name })} />
            <Field label="Role" value={current.role} onChange={(role) => updateDraft({ role })} multiline />
            <Field label="Calling purpose" value={current.purpose} onChange={(purpose) => updateDraft({ purpose })} multiline />
            <Field
              label="Opening greeting"
              value={current.greeting}
              onChange={(greeting) => updateDraft({ greeting })}
              multiline
            />
            <Field label="Instructions" value={current.instructions} onChange={(instructions) => updateDraft({ instructions })} multiline />
            <Field label="Conversation behaviour" value={current.behaviour} onChange={(behaviour) => updateDraft({ behaviour })} multiline />

            <div className="space-y-3 border p-4">
              <div>
                <h3 className="text-sm font-semibold">Knowledge sources</h3>
                <p className="text-xs text-muted-foreground">
                  PDF, DOCX, TXT, and public website pages. Calls include up to {CALL_KNOWLEDGE_CHAR_LIMIT.toLocaleString()} characters.
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={fileId}>Upload a file</Label>
                <Input
                  id={fileId}
                  type="file"
                  accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => {
                    const input = event.currentTarget;
                    const file = input.files?.[0] ?? null;
                    input.value = "";
                    void addFile(file);
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor={urlId}>Website URL</Label>
                  <Input
                    id={urlId}
                    type="url"
                    inputMode="url"
                    placeholder="https://example.com/services"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                  />
                </div>
                <Button type="button" variant="outline" className="sm:mt-7" disabled={busy !== null} onClick={(event) => void addUrl(event)}>
                  {busy === "Reading website" ? <Loader2 className="animate-spin" /> : null}
                  Add website
                </Button>
              </div>
              {busy && busy !== "Reading website" ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="animate-spin" />
                  {busy}
                </p>
              ) : null}
              <ul className="divide-y border">
                {current.sources.length === 0 ? (
                  <li className="px-3 py-2 text-sm text-muted-foreground">No files or websites added.</li>
                ) : current.sources.map((source) => (
                  <li key={source.id} className="space-y-2 px-3 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{source.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {source.kind === "url" ? "Website" : "File"} · {source.text.length.toLocaleString()} characters
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setOpenSourceId(source.id)}>
                          {openSourceId === source.id ? "Hide text" : "Preview text"}
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeSource(source.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                    {openSourceId === source.id ? (
                      <div className="grid gap-2">
                        <Label htmlFor={`outbound-source-${source.id}`}>Extracted text</Label>
                        <Textarea
                          id={`outbound-source-${source.id}`}
                          value={source.text}
                          onChange={(event) => updateSource(source.id, event.target.value)}
                          className="min-h-32"
                        />
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button type="submit">Save campaign</Button>
              <Button
                type="button"
                variant="outline"
                disabled={campaigns.length < 2 || current.id !== selected.id}
                onClick={() => setConfirmDelete(true)}
              >
                Delete campaign
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <Summary label="Role" value={selected.role} />
              <Summary label="Calling purpose" value={selected.purpose} />
              <Summary label="Opening greeting" value={selected.greeting} />
              <Summary label="Instructions" value={selected.instructions} />
              <Summary label="Conversation behaviour" value={selected.behaviour} />
            </div>
            <div className="border p-4">
              <h3 className="text-sm font-semibold">Knowledge sources</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {selected.sources.length === 0
                  ? "No files or websites added."
                  : `${selected.sources.length} source${selected.sources.length === 1 ? "" : "s"} · ${knowledge.text.length.toLocaleString()} characters included in calls${knowledge.truncated ? " (truncated)" : ""}.`}
              </p>
              {selected.sources.length > 0 ? (
                <ul className="mt-3 divide-y border">
                  {selected.sources.map((source) => (
                    <li key={source.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{source.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {source.kind === "url" ? "Website" : "File"} · {source.locator}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {source.text.length.toLocaleString()} chars
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dirty ? "Unsaved prompt preview" : "Prompt preview"}</DialogTitle>
            <DialogDescription>
              {dirty
                ? "This preview includes unsaved edits. Save before Start call or Call selected uses it."
                : "Quick calls and selected-contact batches send this prompt with the recipient filled in."}
              {knowledge.truncated ? " The call keeps the first portion of the knowledge." : ""}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            readOnly
            value={tinkerismCampaignPrompt(current, "the recipient", "their number")}
            className="min-h-64"
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPreviewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={pendingSelectId !== null} onOpenChange={(open) => { if (!open) setPendingSelectId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved campaign edits?</AlertDialogTitle>
            <AlertDialogDescription>
              Switching campaigns drops the edits that have not been saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!pendingSelectId) return;
                setFormError(null);
                if (pendingSelectId === "new") {
                  setDraft(blankPromptCampaign());
                  setEditing(true);
                  setOpenSourceId(null);
                } else if (pendingSelectId === "close") {
                  setDraft(selected);
                  setEditing(false);
                } else {
                  setEditing(false);
                  onSelect(pendingSelectId);
                }
                setPendingSelectId(null);
              }}
            >
              Discard edits
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              {selected.name} and its saved knowledge will be removed from this browser.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(selected.id);
                setEditing(false);
                setConfirmDelete(false);
              }}
            >
              Delete campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const id = useId();
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      {multiline ? (
        <Textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-20" />
      ) : (
        <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="line-clamp-4">{value}</p>
    </div>
  );
}

function campaignSnapshot(campaign: OutboundPromptCampaign): string {
  return JSON.stringify({
    id: campaign.id,
    name: campaign.name,
    role: campaign.role,
    purpose: campaign.purpose,
    greeting: campaign.greeting,
    instructions: campaign.instructions,
    behaviour: campaign.behaviour,
    sources: campaign.sources.map((source) => [source.id, source.kind, source.name, source.locator, source.text]),
  });
}

async function postKnowledge(
  body: BodyInit,
  headers?: HeadersInit,
): Promise<Required<Pick<KnowledgeResponse, "name" | "locator" | "text">>> {
  const response = await fetch("/api/outbound/knowledge", { method: "POST", body, headers });
  const payload = (await response.json()) as KnowledgeResponse;
  if (!response.ok || typeof payload.text !== "string") {
    throw new Error(payload.error || "Could not read that knowledge source.");
  }
  return {
    name: payload.name ?? "",
    locator: payload.locator ?? "",
    text: payload.text,
  };
}
