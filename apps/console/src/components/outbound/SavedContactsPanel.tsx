"use client";

import { FormEvent, useState } from "react";
import { Loader2, Phone, PhoneOff, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  addContact,
  contactsToCall,
  removeContact,
  setContactSelected,
  updateContact,
  type OutboundSavedContact,
} from "@/src/lib/outbound/saved-contacts";

export function SavedContactsPanel({
  contacts,
  onContactsChange,
  calling,
  stopping,
  activeCount,
  onCallSelected,
  onStopAll,
  disabledReason,
}: {
  contacts: OutboundSavedContact[];
  onContactsChange: (contacts: OutboundSavedContact[]) => void;
  calling: boolean;
  stopping: boolean;
  activeCount: number;
  onCallSelected: () => void;
  onStopAll: () => void;
  disabledReason: string | null;
}) {
  const selected = contactsToCall(contacts);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [editing, setEditing] = useState<OutboundSavedContact | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  function onAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = addContact(contacts, { name, phoneNumber });
    if (result.error) {
      setFormError(result.error);
      return;
    }
    onContactsChange(result.contacts);
    setName("");
    setPhoneNumber("");
    setFormError(null);
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
    onContactsChange(result.contacts);
    setEditing(null);
  }

  return (
    <section className="border bg-card">
      <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Saved contacts</h2>
          <p className="text-xs text-muted-foreground">
            Add, edit, or delete numbers. Only checked contacts are dialed with the selected campaign prompt.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onContactsChange(contacts.map((contact) => ({ ...contact, selected: true })))}
            disabled={contacts.length === 0}
          >
            Select all
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onContactsChange(contacts.map((contact) => ({ ...contact, selected: false })))}
            disabled={contacts.length === 0}
          >
            Clear
          </Button>
          {activeCount > 0 || calling ? (
            <Button type="button" variant="destructive" size="sm" disabled={stopping} onClick={onStopAll}>
              {stopping ? <Loader2 className="animate-spin" /> : <PhoneOff />}
              Stop all
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            disabled={calling || selected.length === 0 || disabledReason != null}
            onClick={onCallSelected}
          >
            {calling ? <Loader2 className="animate-spin" /> : <Phone />}
            Call selected ({selected.length})
          </Button>
        </div>
      </div>

      {disabledReason ? (
        <p className="border-b px-5 py-3 text-sm text-muted-foreground">{disabledReason}</p>
      ) : null}

      <ul className="divide-y">
        {contacts.length === 0 ? (
          <li className="px-5 py-4 text-sm text-muted-foreground">
            No saved contacts yet. Add numbers below to call them in a batch.
          </li>
        ) : (
          contacts.map((contact) => (
            <li key={contact.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
              <div className="flex min-w-0 items-start gap-3">
                <Checkbox
                  checked={contact.selected}
                  onCheckedChange={(checked) =>
                    onContactsChange(setContactSelected(contacts, contact.id, checked === true))
                  }
                  aria-label={`Call ${contact.name}`}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{contact.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{contact.phoneNumber}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(contact);
                    setEditName(contact.name);
                    setEditPhone(contact.phoneNumber);
                    setEditError(null);
                  }}
                >
                  Edit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label={`Remove ${contact.name}`}
                  onClick={() => onContactsChange(removeContact(contacts, contact.id))}
                >
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>

      <form onSubmit={onAdd} className="grid gap-3 border-t p-5 md:grid-cols-[1fr_1fr_auto]">
        <div className="grid gap-2">
          <Label htmlFor="outbound-contact-name">Name</Label>
          <Input
            id="outbound-contact-name"
            placeholder="Reception"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="outbound-contact-phone">Phone number</Label>
          <Input
            id="outbound-contact-phone"
            type="tel"
            inputMode="tel"
            placeholder="+91..."
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" variant="outline">
            <Plus />
            Add number
          </Button>
        </div>
        {formError ? <p className="text-sm text-destructive md:col-span-3">{formError}</p> : null}
      </form>

      <div className="flex flex-wrap gap-2 border-t px-5 py-3 text-xs text-muted-foreground">
        <Badge variant="outline">{contacts.length} saved</Badge>
        <Badge variant="secondary">{selected.length} selected</Badge>
        {activeCount > 0 ? <Badge variant="secondary">{activeCount} active</Badge> : null}
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit contact</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={saveEdit}>
            <div className="grid gap-2">
              <Label htmlFor="outbound-edit-name">Name</Label>
              <Input id="outbound-edit-name" value={editName} onChange={(event) => setEditName(event.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="outbound-edit-phone">Phone number</Label>
              <Input id="outbound-edit-phone" value={editPhone} onChange={(event) => setEditPhone(event.target.value)} />
            </div>
            {editError ? <p className="text-sm text-destructive">{editError}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
