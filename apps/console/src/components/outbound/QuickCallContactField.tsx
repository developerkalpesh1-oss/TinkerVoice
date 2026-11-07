"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import type { OutboundSavedContact } from "@/src/lib/outbound/saved-contacts";
import { cn } from "@/src/lib/utils";

function contactSearchText(contact: OutboundSavedContact) {
  return `${contact.name} ${contact.phoneNumber}`.toLowerCase();
}

export function QuickCallContactField({
  id,
  contacts,
  phoneNumber,
  onPhoneNumberChange,
  onSelectContact,
  disabled = false,
}: {
  id?: string;
  contacts: OutboundSavedContact[];
  phoneNumber: string;
  onPhoneNumberChange: (phoneNumber: string) => void;
  onSelectContact: (contact: OutboundSavedContact) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return contacts;
    return contacts.filter((contact) => contactSearchText(contact).includes(needle));
  }, [contacts, query]);

  const exactPhoneMatch = useMemo(() => {
    const needle = query.trim();
    if (!needle) return null;
    return contacts.find((contact) => contact.phoneNumber === needle) ?? null;
  }, [contacts, query]);

  const selected = contacts.find((contact) => contact.phoneNumber === phoneNumber.trim()) ?? null;
  const triggerLabel = selected
    ? `${selected.name} · ${selected.phoneNumber}`
    : phoneNumber.trim() || "Select contact or type a number";

  function applyManualNumber(value: string) {
    const next = value.trim();
    onPhoneNumberChange(next);
    setOpen(false);
    setQuery("");
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="To phone number"
          disabled={disabled}
          className="h-9 w-full justify-between font-normal"
        >
          <span className={cn("truncate", !phoneNumber.trim() && "text-muted-foreground")}>
            {triggerLabel}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search contacts or type a number…"
            aria-label="Search contacts or type a number"
            value={query}
            onValueChange={(value) => {
              setQuery(value);
              onPhoneNumberChange(value);
            }}
          />
          <CommandList>
            <CommandEmpty className="px-3 py-5 text-left text-sm">
              {query.trim() ? (
                <button
                  type="button"
                  className="w-full text-left hover:underline"
                  onClick={() => applyManualNumber(query)}
                >
                  Use <span className="font-medium">{query.trim()}</span>
                </button>
              ) : (
                "No saved contacts yet. Type a phone number to dial."
              )}
            </CommandEmpty>
            {filtered.length > 0 ? (
              <CommandGroup heading="Saved contacts">
                {filtered.map((contact) => {
                  const isSelected = contact.phoneNumber === phoneNumber.trim();
                  return (
                    <CommandItem
                      key={contact.id}
                      value={`${contact.name} ${contact.phoneNumber}`}
                      data-checked={isSelected}
                      onSelect={() => {
                        onSelectContact(contact);
                        setOpen(false);
                        setQuery("");
                      }}
                    >
                      <Check
                        className={cn(
                          "size-4 shrink-0",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span className="min-w-0 flex-1 truncate">{contact.name}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {contact.phoneNumber}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            {query.trim() && !exactPhoneMatch ? (
              <CommandGroup>
                <CommandItem
                  value={`use-manual ${query.trim()}`}
                  onSelect={() => applyManualNumber(query)}
                >
                  Use {query.trim()}
                </CommandItem>
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
